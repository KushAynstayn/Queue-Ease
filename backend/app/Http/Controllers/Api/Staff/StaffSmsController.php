<?php

namespace App\Http\Controllers\Api\Staff;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Query\Builder;

class StaffSmsController extends Controller
{
    /**
     * Get SMS summary for today.
     */
    public function summary(Request $request)
    {
        $query = $this->staffNotificationsQuery($request)
            ->whereDate(
                'sms_notifications.created_at',
                now()->toDateString()
            );

        return ApiResponse::success(
            'Staff SMS summary retrieved successfully.',
            [
                'sent_today' => (clone $query)
                    ->whereIn('sms_notifications.status', [
                        'sent',
                        'delivered',
                    ])
                    ->count(),

                'pending' => (clone $query)
                    ->where('sms_notifications.status', 'pending')
                    ->count(),

                'failed' => (clone $query)
                    ->where('sms_notifications.status', 'failed')
                    ->count(),
            ]
        );
    }

    /**
     * Get eligible SMS recipients.
     */
    public function recipients(Request $request)
    {
        $validated = $request->validate([
            'group' => [
                'nullable',
                'in:waiting-clients,all-today',
            ],
        ]);

        $group = $validated['group'] ?? 'waiting-clients';

        $query = $this->eligibleRecipientsQuery(
            $request,
            $group
        );

        $total = (clone $query)->count();

        $recipients = $query
            ->orderBy('queue_transactions.position_number')
            ->limit(100)
            ->get();

        return ApiResponse::success(
            'Eligible SMS recipients retrieved successfully.',
            [
                'total' => $total,
                'recipients' => $recipients,
            ]
        );
    }

    /**
     * Get SMS notification history for assigned services.
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'status' => [
                'nullable',
                'in:pending,sent,delivered,failed',
            ],
            'message_type' => [
                'nullable',
                'in:queue_confirmation,queue_update,now_serving,estimated_wait,service_delay,service_available,manual',
            ],
            'per_page' => [
                'nullable',
                'integer',
                'min:1',
                'max:100',
            ],
        ]);

        $query = $this->staffNotificationsQuery($request)
            ->select([
                'sms_notifications.id',
                'sms_notifications.queue_transaction_id',
                'sms_notifications.recipient_number',
                'sms_notifications.message_type',
                'sms_notifications.message',
                'sms_notifications.status',
                'sms_notifications.sent_at',
                'sms_notifications.delivered_at',
                'sms_notifications.error_message',
                'sms_notifications.created_at',
                'queue_transactions.queue_number',
                'services.name as service_name',
                'client_users.first_name',
                'client_users.middle_name',
                'client_users.last_name',
            ])
            ->orderByDesc('sms_notifications.created_at');

        if (!empty($validated['status'])) {
            $query->where(
                'sms_notifications.status',
                $validated['status']
            );
        }

        if (!empty($validated['message_type'])) {
            $query->where(
                'sms_notifications.message_type',
                $validated['message_type']
            );
        }

        $notifications = $query->paginate(
            $validated['per_page'] ?? 15
        );

        return ApiResponse::success(
            'Staff SMS notifications retrieved successfully.',
            $notifications
        );
    }

    /**
     * Prepare SMS notification records.
     *
     * This does not send actual SMS messages.
     * All records remain pending until provider integration.
     */
    public function prepare(Request $request)
    {
        $validated = $request->validate([
            'recipient_group' => [
                'required',
                'in:waiting-clients,all-today',
            ],
            'message_type' => [
                'required',
                'in:queue_confirmation,queue_update,now_serving,estimated_wait,service_delay,service_available,manual',
            ],
            'message' => [
                'required',
                'string',
                'max:1600',
            ],
        ]);

        $recipients = $this->eligibleRecipientsQuery(
            $request,
            $validated['recipient_group']
        )->get();

        if ($recipients->isEmpty()) {
            return ApiResponse::success(
                'No eligible recipients were found. No notification records were created.',
                [
                    'prepared_count' => 0,
                    'status' => 'pending',
                    'sent' => false,
                ]
            );
        }

        $now = now();

        $records = $recipients->map(function ($recipient) use (
            $validated,
            $now
        ) {
            return [
                'user_id' => $recipient->user_id,
                'queue_transaction_id' => $recipient->queue_transaction_id,
                'recipient_number' => $recipient->phone,
                'message_type' => $validated['message_type'],
                'message' => $validated['message'],
                'status' => 'pending',
                'provider' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        })->all();

        DB::transaction(function () use ($records) {
            DB::table('sms_notifications')->insert($records);
        });

        return ApiResponse::success(
            'SMS notification records prepared successfully. No SMS messages were sent.',
            [
                'prepared_count' => count($records),
                'status' => 'pending',
                'sent' => false,
            ],
            201
        );
    }

    /**
     * Get eligible queue recipients.
     */
    private function eligibleRecipientsQuery(
        Request $request,
        string $group
    ): Builder {
        $staffId = $request->user()->id;

        $counterIds = DB::table('service_counters')
            ->where('assigned_staff_id', $staffId)
            ->pluck('id');

        $serviceIds = DB::table('service_counters')
            ->where('assigned_staff_id', $staffId)
            ->whereNotNull('service_id')
            ->pluck('service_id')
            ->unique()
            ->values();

        $query = DB::table('queue_transactions')
            ->join(
                'clients',
                'queue_transactions.client_id',
                '=',
                'clients.id'
            )
            ->join(
                'users as client_users',
                'clients.user_id',
                '=',
                'client_users.id'
            )
            ->leftJoin(
                'services',
                'queue_transactions.service_id',
                '=',
                'services.id'
            )
            ->whereDate(
                'queue_transactions.queue_date',
                now()->toDateString()
            )
            ->whereIn('queue_transactions.status', [
                'waiting',
                'called',
                'serving',
            ])
            ->whereNotNull('client_users.phone')
            ->where('client_users.phone', '!=', '')
            ->whereIn('clients.notification_preference', [
                'sms',
                'both',
            ]);

        // Restrict recipients to assigned counters and services.
        if ($counterIds->isEmpty() && $serviceIds->isEmpty()) {
            $query->whereRaw('1 = 0');
        } else {
            $query->where(function ($scope) use (
                $counterIds,
                $serviceIds
            ) {
                if ($counterIds->isNotEmpty()) {
                    $scope->whereIn(
                        'queue_transactions.counter_id',
                        $counterIds
                    );
                }

                if ($serviceIds->isNotEmpty()) {
                    if ($counterIds->isNotEmpty()) {
                        $scope->orWhereIn(
                            'queue_transactions.service_id',
                            $serviceIds
                        );
                    } else {
                        $scope->whereIn(
                            'queue_transactions.service_id',
                            $serviceIds
                        );
                    }
                }
            });
        }

        if ($group === 'waiting-clients') {
            $query->where(
                'queue_transactions.status',
                'waiting'
            );
        }

        return $query->select([
            'queue_transactions.id as queue_transaction_id',
            'queue_transactions.queue_number',
            'queue_transactions.status',
            'queue_transactions.position_number',
            'clients.user_id',
            'client_users.phone',
            'client_users.first_name',
            'client_users.middle_name',
            'client_users.last_name',
            'services.name as service_name',
        ]);
    }

    /**
     * Get SMS history restricted to assigned counters/services.
     */
    private function staffNotificationsQuery(
        Request $request
    ): Builder {
        $staffId = $request->user()->id;

        $counterIds = DB::table('service_counters')
            ->where('assigned_staff_id', $staffId)
            ->pluck('id');

        $serviceIds = DB::table('service_counters')
            ->where('assigned_staff_id', $staffId)
            ->whereNotNull('service_id')
            ->pluck('service_id')
            ->unique()
            ->values();

        $query = DB::table('sms_notifications')
            ->join(
                'queue_transactions',
                'sms_notifications.queue_transaction_id',
                '=',
                'queue_transactions.id'
            )
            ->leftJoin(
                'clients',
                'queue_transactions.client_id',
                '=',
                'clients.id'
            )
            ->leftJoin(
                'users as client_users',
                'clients.user_id',
                '=',
                'client_users.id'
            )
            ->leftJoin(
                'services',
                'queue_transactions.service_id',
                '=',
                'services.id'
            );

        // Fail closed if the staff member has no assignments.
        if ($counterIds->isEmpty() && $serviceIds->isEmpty()) {
            $query->whereRaw('1 = 0');
        } else {
            $query->where(function ($scope) use (
                $counterIds,
                $serviceIds
            ) {
                if ($counterIds->isNotEmpty()) {
                    $scope->whereIn(
                        'queue_transactions.counter_id',
                        $counterIds
                    );
                }

                if ($serviceIds->isNotEmpty()) {
                    if ($counterIds->isNotEmpty()) {
                        $scope->orWhereIn(
                            'queue_transactions.service_id',
                            $serviceIds
                        );
                    } else {
                        $scope->whereIn(
                            'queue_transactions.service_id',
                            $serviceIds
                        );
                    }
                }
            });
        }

        // IMPORTANT: Return the query builder.
        return $query;
    }
}