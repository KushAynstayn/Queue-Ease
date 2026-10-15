<?php

namespace App\Http\Controllers\Api\Staff;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\ServiceCounter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StaffDashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $staff = $request->user();
        $today = now()->toDateString();

        // Get counters assigned to the authenticated staff member.
        $counters = ServiceCounter::with('service')
            ->where('assigned_staff_id', $staff->id)
            ->orderBy('counter_number')
            ->get();

        $counterIds = $counters->pluck('id');
        $serviceIds = $counters->pluck('service_id')
            ->unique()
            ->values();

        // Include today's queues belonging to the staff member's
        // assigned services or explicitly assigned counters.
        $queueQuery = DB::table('queue_transactions')
            ->whereDate('queue_transactions.queue_date', $today)
            ->where(function ($query) use ($counterIds, $serviceIds) {
                $query->whereIn(
                    'queue_transactions.counter_id',
                    $counterIds
                )->orWhereIn(
                    'queue_transactions.service_id',
                    $serviceIds
                );
            });

        $statuses = [
            'waiting',
            'called',
            'serving',
            'completed',
            'skipped',
        ];

        $statistics = [];

        foreach ($statuses as $status) {
            $statistics[$status] = (clone $queueQuery)
                ->where('queue_transactions.status', $status)
                ->count();
        }

        $activeQueues = (clone $queueQuery)
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
            ->whereIn('queue_transactions.status', [
                'waiting',
                'called',
                'serving',
            ])
            ->select([
                'queue_transactions.id',
                'queue_transactions.queue_number',
                'queue_transactions.queue_date',
                'queue_transactions.status',
                'queue_transactions.priority',
                'queue_transactions.position_number',
                'queue_transactions.estimated_wait_minutes',
                'queue_transactions.counter_id',
                'clients.student_number',
                'services.name as service_name',
                'service_counters.name as counter_name',
                'service_counters.counter_number',
            ])
            ->orderBy('queue_transactions.position_number')
            ->limit(10)
            ->get();

        return ApiResponse::success(
            'Staff dashboard data retrieved successfully.',
            [
                'date' => $today,
                'counters' => $counters,
                'counter_count' => $counters->count(),
                'queue_statistics' => $statistics,
                'active_queues' => $activeQueues,
            ]
        );
    }
}