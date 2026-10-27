<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use App\Services\ActivityLogService;

class QueueController extends Controller
{
    /**
     * Display queue transactions.
     */
    
    public function index(Request $request)
    {
        $validated = $request->validate([
            'status' => [
                'nullable',
                Rule::in([
                    'waiting',
                    'called',
                    'serving',
                    'completed',
                    'skipped',
                    'cancelled',
                    'no_show',
                ]),
            ],
            'service_id' => ['nullable', 'integer', 'exists:services,id'],
            'queue_date' => ['nullable', 'date'],
            'search' => ['nullable', 'string', 'max:100'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $user = $request->user();
        $perPage = $validated['per_page'] ?? 15;

        $query = DB::table('queue_transactions')
            ->leftJoin(
                'clients',
                'queue_transactions.client_id',
                '=',
                'clients.id'
            )
            ->leftJoin(
                'services',
                'queue_transactions.service_id',
                '=',
                'services.id'
            )
            ->leftJoin(
                'service_counters',
                'queue_transactions.counter_id',
                '=',
                'service_counters.id'
            )
            ->leftJoin(
                'users as served_users',
                'queue_transactions.served_by',
                '=',
                'served_users.id'
            )
            ->select([
                'queue_transactions.id',
                'queue_transactions.client_id',
                'queue_transactions.service_id',
                'queue_transactions.counter_id',
                'queue_transactions.queue_number',
                'queue_transactions.queue_date',
                'queue_transactions.status',
                'queue_transactions.priority',
                'queue_transactions.position_number',
                'queue_transactions.estimated_wait_minutes',
                'queue_transactions.actual_wait_minutes',
                'queue_transactions.service_duration_minutes',
                'queue_transactions.requested_at',
                'queue_transactions.called_at',
                'queue_transactions.serving_at',
                'queue_transactions.completed_at',
                'queue_transactions.served_by',
                'queue_transactions.created_at',
                'queue_transactions.updated_at',
                'clients.student_number',
                'services.name as service_name',
                'services.code as service_code',
                'service_counters.counter_number',
                'service_counters.name as counter_name',
                DB::raw(
                    "CONCAT(served_users.first_name, ' ', served_users.last_name) as served_by_name"
                ),
            ]);

        /*
        * Restrict staff to queues for their assigned counters
        * or services. Admin access remains unchanged.
        */
        $roleName = DB::table('roles')
            ->where('id', $user->role_id)
            ->value('name');

        if ($roleName === 'staff') {
            $assignedCounters = DB::table('service_counters')
                ->where('assigned_staff_id', $user->id);

            $counterIds = (clone $assignedCounters)->pluck('id');
            $serviceIds = (clone $assignedCounters)
                ->pluck('service_id')
                ->unique()
                ->values();

            if ($counterIds->isEmpty() && $serviceIds->isEmpty()) {
                $query->whereRaw('1 = 0');
            } else {
                $query->where(function ($q) use ($counterIds, $serviceIds) {
                    if ($counterIds->isNotEmpty()) {
                        $q->whereIn(
                            'queue_transactions.counter_id',
                            $counterIds
                        );
                    }

                    if ($serviceIds->isNotEmpty()) {
                        $method = $counterIds->isNotEmpty()
                            ? 'orWhereIn'
                            : 'whereIn';

                        $q->{$method}(
                            'queue_transactions.service_id',
                            $serviceIds
                        );
                    }
                });
            }
        }


        if ($roleName === 'client') {
            $clientId = DB::table('clients')
                ->where('user_id', $user->id)
                ->value('id');

            if (!$clientId) {
                $query->whereRaw('1 = 0');
            } else {
                $query->where(
                    'queue_transactions.client_id',
                    $clientId
                );
            }
        }

        if (!empty($validated['status'])) {
            $query->where(
                'queue_transactions.status',
                $validated['status']
            );
        }

        if (!empty($validated['service_id'])) {
            $query->where(
                'queue_transactions.service_id',
                $validated['service_id']
            );
        }

        if (!empty($validated['queue_date'])) {
            $query->where(
                'queue_transactions.queue_date',
                $validated['queue_date']
            );
        }

        if (!empty($validated['search'])) {
            $search = $validated['search'];

            $query->where(function ($q) use ($search) {
                $q->where(
                    'queue_transactions.queue_number',
                    'like',
                    "%{$search}%"
                )
                ->orWhere(
                    'clients.student_number',
                    'like',
                    "%{$search}%"
                )
                ->orWhere(
                    'services.name',
                    'like',
                    "%{$search}%"
                );
            });
        }

        $queues = $query
            ->orderBy('queue_transactions.queue_date', 'desc')
            ->orderBy('queue_transactions.position_number')
            ->paginate($perPage);

        return ApiResponse::success(
            'Queues retrieved successfully.',
            $queues
        );
    }


    /**
     * Create a queue transaction.
     */
    
    public function store(
        Request $request,
        ActivityLogService $activityLogService
    )
    {
        $validated = $request->validate([
            'service_id' => [
                'required',
                'integer',
                'exists:services,id',
            ],
            'priority' => [
                'sometimes',
                'nullable',
                Rule::in(['normal', 'priority']),
            ],
        ]);

        $user = $request->user();

        $client = DB::table('clients')
            ->where('user_id', $user->id)
            ->first();

        if (!$client) {
            return ApiResponse::notFound(
                'Client profile not found.'
            );
        }

        $queueId = DB::transaction(function () use (
            $validated,
            $client
        ) {
            $queueDate = now()->toDateString();

            $service = DB::table('services')
                ->where('id', $validated['service_id'])
                ->where('status', 'active')
                ->first();

            if (!$service) {
                abort(422, 'The selected service is inactive.');
            }

            $existingQueue = DB::table('queue_transactions')
                ->where('client_id', $client->id)
                ->where('queue_date', $queueDate)
                ->whereIn('status', [
                    'waiting',
                    'called',
                    'serving',
                ])
                ->lockForUpdate()
                ->first();

            if ($existingQueue) {
                abort(
                    422,
                    'You already have an active queue today.'
                );
            }

            $lastPosition = DB::table('queue_transactions')
                ->where('service_id', $service->id)
                ->where('queue_date', $queueDate)
                ->max('position_number');

            $positionNumber = ((int) $lastPosition) + 1;

            $sequence = DB::table('queue_transactions')
                ->where('service_id', $service->id)
                ->where('queue_date', $queueDate)
                ->count() + 1;

            $queueNumber = strtoupper($service->code)
                . '-'
                . str_pad(
                    (string) $sequence,
                    3,
                    '0',
                    STR_PAD_LEFT
                );

            $estimatedWaitMinutes = $positionNumber
                * ((int) $service->estimated_service_minutes);

            $now = now();

            $queueId = DB::table('queue_transactions')
                ->insertGetId([
                    'client_id' => $client->id,
                    'service_id' => $service->id,
                    'counter_id' => null,
                    'queue_number' => $queueNumber,
                    'queue_date' => $queueDate,
                    'status' => 'waiting',
                    'priority' => $validated['priority'] ?? 'normal',
                    'position_number' => $positionNumber,
                    'estimated_wait_minutes' => $estimatedWaitMinutes,
                    'actual_wait_minutes' => null,
                    'service_duration_minutes' => null,
                    'requested_at' => $now,
                    'called_at' => null,
                    'serving_at' => null,
                    'completed_at' => null,
                    'served_by' => null,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);

            DB::table('queue_status_history')->insert([
                'queue_transaction_id' => $queueId,
                'previous_status' => null,
                'new_status' => 'waiting',
                'changed_by' => $client->user_id,
                'notes' => 'Queue transaction created.',
                'created_at' => $now,
            ]);

            return $queueId;
        });

        $queue = $this->getQueue($queueId);

        $activityLogService->record(
            $request,
            'queue.created',
            'Queue',
            "Client created queue {$queue->queue_number}.",
            \App\Models\QueueTransaction::find($queueId)
        );

        return ApiResponse::success(
            'Queue transaction created successfully.',
            $queue,
            201
        );
    }


    /**
     * Display a specific queue transaction.
     */
    public function show(Request $request, int $id)
    {
        $user = $request->user();

        $roleName = DB::table('roles')
            ->where('id', $user->role_id)
            ->value('name');

        $queueQuery = DB::table('queue_transactions')
            ->where('id', $id);

        if ($roleName === 'client') {
            $clientId = DB::table('clients')
                ->where('user_id', $user->id)
                ->value('id');

            if (!$clientId) {
                return ApiResponse::notFound(
                    'Queue transaction not found.'
                );
            }

            $queueQuery->where('client_id', $clientId);
        }

        if (!$queueQuery->exists()) {
            return ApiResponse::notFound(
                'Queue transaction not found.'
            );
        }

        return ApiResponse::success(
            'Queue transaction retrieved successfully.',
            $this->getQueue($id)
        );
    }

    /**
     * Display queue status history.
     */
    public function history(Request $request, int $id)
    {
        $user = $request->user();

        $roleName = DB::table('roles')
            ->where('id', $user->role_id)
            ->value('name');

        $queueQuery = DB::table('queue_transactions')
            ->where('id', $id);

        if ($roleName === 'client') {
            $clientId = DB::table('clients')
                ->where('user_id', $user->id)
                ->value('id');

            if (!$clientId) {
                return ApiResponse::notFound(
                    'Queue transaction not found.'
                );
            }

            $queueQuery->where('client_id', $clientId);
        }

        if (!$queueQuery->exists()) {
            return ApiResponse::notFound(
                'Queue transaction not found.'
            );
        }

        $history = DB::table('queue_status_history')
            ->leftJoin(
                'users',
                'queue_status_history.changed_by',
                '=',
                'users.id'
            )
            ->where(
                'queue_status_history.queue_transaction_id',
                $id
            )
            ->select([
                'queue_status_history.id',
                'queue_status_history.queue_transaction_id',
                'queue_status_history.previous_status',
                'queue_status_history.new_status',
                'queue_status_history.changed_by',
                'queue_status_history.notes',
                'queue_status_history.created_at',
                DB::raw(
                    "CONCAT(users.first_name, ' ', users.last_name) as changed_by_name"
                ),
            ])
            ->orderBy(
                'queue_status_history.created_at',
                'asc'
            )
            ->get();

        return ApiResponse::success(
            'Queue status history retrieved successfully.',
            $history
        );
    }

    /**
     * Update queue status.
     */
    public function updateStatus(
        Request $request,
        int $id,
        ActivityLogService $activityLogService
    )
    {
        $validated = $request->validate([
            'status' => [
                'required',
                Rule::in([
                    'waiting',
                    'called',
                    'serving',
                    'completed',
                    'skipped',
                    'cancelled',
                    'no_show',
                ]),
            ],
            'notes' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ]);

        $queue = DB::transaction(function () use (
            $id,
            $validated
        ) {
            $queue = DB::table('queue_transactions')
                ->where('id', $id)
                ->lockForUpdate()
                ->first();

            if (!$queue) {
                abort(404, 'Queue transaction not found.');
            }

            $oldStatus = $queue->status;
            $newStatus = $validated['status'];

            if ($oldStatus === $newStatus) {
                abort(
                    422,
                    'The queue is already in the requested status.'
                );
            }

            $updates = [
                'status' => $newStatus,
                'updated_at' => now(),
            ];

            /*
             * Status timestamps.
             */
            if ($newStatus === 'called' && !$queue->called_at) {
                $updates['called_at'] = now();
            }

            if ($newStatus === 'serving' && !$queue->serving_at) {
                $updates['serving_at'] = now();

                if (!$queue->served_by) {
                    $updates['served_by'] = Auth::id();
                }

                if ($queue->requested_at) {
                    $updates['actual_wait_minutes'] =
                        max(
                            0,
                            now()->diffInMinutes(
                                $queue->requested_at
                            )
                        );
                }
            }

            if ($newStatus === 'completed') {
                $updates['completed_at'] = now();

                if (!$queue->served_by) {
                    $updates['served_by'] = Auth::id();
                }

                if ($queue->serving_at) {
                    $updates['service_duration_minutes'] =
                        max(
                            0,
                            now()->diffInMinutes(
                                $queue->serving_at
                            )
                        );
                }
            }

            if (
                in_array(
                    $newStatus,
                    ['skipped', 'cancelled', 'no_show'],
                    true
                )
                && !$queue->served_by
            ) {
                $updates['served_by'] = Auth::id();
            }

            DB::table('queue_transactions')
                ->where('id', $id)
                ->update($updates);

            DB::table('queue_status_history')->insert([
                'queue_transaction_id' => $id,
                'previous_status' => $oldStatus,
                'new_status' => $newStatus,
                'changed_by' => Auth::id(),
                'notes' => $validated['notes'] ?? null,
                'created_at' => now(),
            ]);

            return $this->getQueue($id);
        });


        $activityLogService->record(
            $request,
            'queue.status_updated',
            'Queue',
            "Queue {$queue->queue_number} status changed to {$queue->status}.",
            \App\Models\QueueTransaction::find($queue->id)
        );

        return ApiResponse::success(
            'Queue status updated successfully.',
            $queue
        );
    }

    /**
     * Retrieve a queue with related information.
     */
    private function getQueue(int $id)
    {
        return DB::table('queue_transactions')
            ->leftJoin(
                'clients',
                'queue_transactions.client_id',
                '=',
                'clients.id'
            )
            ->leftJoin(
                'services',
                'queue_transactions.service_id',
                '=',
                'services.id'
            )
            ->leftJoin(
                'service_counters',
                'queue_transactions.counter_id',
                '=',
                'service_counters.id'
            )
            ->leftJoin(
                'users as served_users',
                'queue_transactions.served_by',
                '=',
                'served_users.id'
            )
            ->where('queue_transactions.id', $id)
            ->select([
                'queue_transactions.id',
                'queue_transactions.client_id',
                'queue_transactions.service_id',
                'queue_transactions.counter_id',
                'queue_transactions.queue_number',
                'queue_transactions.queue_date',
                'queue_transactions.status',
                'queue_transactions.priority',
                'queue_transactions.position_number',
                'queue_transactions.estimated_wait_minutes',
                'queue_transactions.actual_wait_minutes',
                'queue_transactions.service_duration_minutes',
                'queue_transactions.requested_at',
                'queue_transactions.called_at',
                'queue_transactions.serving_at',
                'queue_transactions.completed_at',
                'queue_transactions.served_by',
                'queue_transactions.created_at',
                'queue_transactions.updated_at',

                'clients.student_number',

                'services.name as service_name',
                'services.code as service_code',

                'service_counters.counter_number',
                'service_counters.name as counter_name',

                DB::raw(
                    "CONCAT(served_users.first_name, ' ', served_users.last_name) as served_by_name"
                ),
            ])
            ->first();
    }



    public function serveNext(
        Request $request,
        ActivityLogService $activityLogService
    )
    {
        $validated = $request->validate([
            'counter_id' => [
                'required',
                'integer',
                'exists:service_counters,id',
            ],
        ]);

        $staff = $request->user();

        $queue = DB::transaction(function () use (
            $validated,
            $staff
        ) {
            // Verify that this counter is assigned to the staff member
            // and is currently open.
            $counter = DB::table('service_counters')
                ->where('id', $validated['counter_id'])
                ->where('assigned_staff_id', $staff->id)
                ->where('status', 'open')
                ->first();

            if (!$counter) {
                abort(
                    403,
                    'The counter is not open or is not assigned to you.'
                );
            }

            // Lock the next eligible waiting queue.
            $nextQueue = DB::table('queue_transactions')
                ->where('service_id', $counter->service_id)
                ->whereDate('queue_date', now()->toDateString())
                ->where('status', 'waiting')
                ->where(function ($query) use ($counter) {
                    $query->whereNull('counter_id')
                        ->orWhere('counter_id', $counter->id);
                })
                ->orderByRaw(
                    "CASE WHEN priority = 'priority' THEN 0 ELSE 1 END"
                )
                ->orderBy('position_number')
                ->orderBy('id')
                ->lockForUpdate()
                ->first();


            if (!$nextQueue) {
                abort(404, 'No waiting students are available for this counter.');
            }

            $now = now();

            DB::table('queue_transactions')
                ->where('id', $nextQueue->id)
                ->update([
                    'counter_id' => $counter->id,
                    'status' => 'called',
                    'called_at' => $now,
                    'updated_at' => $now,
                ]);

            DB::table('queue_status_history')->insert([
                'queue_transaction_id' => $nextQueue->id,
                'previous_status' => 'waiting',
                'new_status' => 'called',
                'changed_by' => $staff->id,
                'notes' => 'Student called by staff.',
                'created_at' => $now,
            ]);

            return $nextQueue->id;
        });

        $servedQueue = $this->getQueue($queue);

        $activityLogService->record(
            $request,
            'queue.served_next',
            'Queue',
            "Staff called queue {$servedQueue->queue_number}.",
            \App\Models\QueueTransaction::find($servedQueue->id)
        );

        return ApiResponse::success(
            'Next student called successfully.',
            $servedQueue
        );
    }



    
    public function recall(
        Request $request,
        int $id,
        ActivityLogService $activityLogService
    )
    {
        $validated = $request->validate([
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $staff = $request->user();

        $queueId = DB::transaction(function () use (
            $id,
            $validated,
            $staff
        ) {
            $queue = DB::table('queue_transactions')
                ->where('id', $id)
                ->lockForUpdate()
                ->first();

            if (!$queue) {
                abort(404, 'Queue transaction not found.');
            }

            if ($queue->status !== 'skipped') {
                abort(
                    422,
                    'Only skipped queues can be recalled.'
                );
            }

            // Confirm that the staff member owns the counter
            // associated with this skipped queue.
            if ($queue->counter_id !== null) {
                $counter = DB::table('service_counters')
                    ->where('id', $queue->counter_id)
                    ->where('assigned_staff_id', $staff->id)
                    ->first();

                if (!$counter) {
                    abort(
                        403,
                        'You are not assigned to this queue counter.'
                    );
                }
            } else {
                abort(
                    422,
                    'This skipped queue has no assigned counter.'
                );
            }

            $now = now();

            // Put the recalled queue at the end of the waiting
            // line for the same service and queue date.
            $lastPosition = DB::table('queue_transactions')
                ->where('service_id', $queue->service_id)
                ->where('queue_date', $queue->queue_date)
                ->where('status', 'waiting')
                ->max('position_number');

            $position = ((int) $lastPosition) + 1;

            $service = DB::table('services')
                ->where('id', $queue->service_id)
                ->first();

            $serviceMinutes = (int) (
                $service->estimated_service_minutes ?? 0
            );

            DB::table('queue_transactions')
                ->where('id', $id)
                ->update([
                    'status' => 'waiting',
                    'counter_id' => null,
                    'position_number' => $position,
                    'estimated_wait_minutes' =>
                        $position * $serviceMinutes,
                    'updated_at' => $now,
                ]);

            DB::table('queue_status_history')->insert([
                'queue_transaction_id' => $id,
                'previous_status' => 'skipped',
                'new_status' => 'waiting',
                'changed_by' => $staff->id,
                'notes' => $validated['notes']
                    ?? 'Queue recalled by staff.',
                'created_at' => $now,
            ]);

            return $id;
        });

        $recalledQueue = $this->getQueue($queueId);

        $activityLogService->record(
            $request,
            'queue.recalled',
            'Queue',
            "Staff recalled queue {$recalledQueue->queue_number} to waiting status.",
            \App\Models\QueueTransaction::find($queueId)
        );

        return ApiResponse::success(
            'Queue recalled successfully.',
            $recalledQueue
        );
    }

}