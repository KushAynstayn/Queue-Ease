<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'service_id' => ['nullable', 'integer', 'exists:services,id'],
        ]);

        $startDate = $validated['start_date']
            ?? now()->subDays(29)->toDateString();

        $endDate = $validated['end_date']
            ?? now()->toDateString();

        // Base query: all queue transactions within the date range.
        $query = DB::table('queue_transactions')
            ->whereBetween('queue_date', [$startDate, $endDate]);

        // Optional service filter.
        if (!empty($validated['service_id'])) {
            $query->where(
                'service_id',
                $validated['service_id']
            );
        }

        // Summary metrics.
        $totalQueues = (clone $query)->count();

        $completedQueues = (clone $query)
            ->where('status', 'completed')
            ->count();

        $averageWait = (clone $query)
            ->where('status', 'completed')
            ->whereNotNull('actual_wait_minutes')
            ->avg('actual_wait_minutes');

        $completionRate = $totalQueues > 0
            ? ($completedQueues / $totalQueues) * 100
            : 0;

        // Completed queues grouped by date.
        $queueTrend = (clone $query)
            ->where('status', 'completed')
            ->select(
                'queue_date',
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('queue_date')
            ->orderBy('queue_date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->queue_date,
                    'total' => (int) $item->total,
                ];
            });

        // Completed queue distribution by service.
        $serviceDistribution = (clone $query)
            ->join(
                'services',
                'queue_transactions.service_id',
                '=',
                'services.id'
            )
            ->where('queue_transactions.status', 'completed')
            ->select(
                'services.id as service_id',
                'services.name as service_name',
                DB::raw('COUNT(queue_transactions.id) as total')
            )
            ->groupBy(
                'services.id',
                'services.name'
            )
            ->orderByDesc('total')
            ->get();

        $distributionTotal = $serviceDistribution->sum('total');

        $serviceDistribution = $serviceDistribution
            ->map(function ($item) use ($distributionTotal) {
                return [
                    'service_id' => (int) $item->service_id,
                    'service_name' => $item->service_name,
                    'total' => (int) $item->total,
                    'percentage' => $distributionTotal > 0
                        ? round(
                            ($item->total / $distributionTotal) * 100,
                            2
                        )
                        : 0,
                ];
            });

        // Performance metrics grouped by service.
        $servicePerformance = (clone $query)
            ->join(
                'services',
                'queue_transactions.service_id',
                '=',
                'services.id'
            )
            ->select(
                'services.id as service_id',
                'services.name as service_name',
                DB::raw('COUNT(queue_transactions.id) as total_queues'),
                DB::raw("
                    SUM(
                        CASE
                            WHEN queue_transactions.status = 'completed'
                            THEN 1
                            ELSE 0
                        END
                    ) as completed_queues
                "),
                DB::raw("
                    AVG(
                        CASE
                            WHEN queue_transactions.status = 'completed'
                            THEN queue_transactions.actual_wait_minutes
                            ELSE NULL
                        END
                    ) as average_wait_minutes
                ")
            )
            ->groupBy(
                'services.id',
                'services.name'
            )
            ->orderBy('services.name')
            ->get()
            ->map(function ($item) {
                $total = (int) $item->total_queues;
                $completed = (int) $item->completed_queues;

                return [
                    'service_id' => (int) $item->service_id,
                    'service_name' => $item->service_name,
                    'total_queues' => $total,
                    'completed_queues' => $completed,
                    'average_wait_minutes' => $item->average_wait_minutes !== null
                        ? round((float) $item->average_wait_minutes, 2)
                        : null,
                    'completion_rate' => $total > 0
                        ? round(($completed / $total) * 100, 2)
                        : 0,
                ];
            });

        return ApiResponse::success(
            'Analytics retrieved successfully.',
            [
                'summary' => [
                    'clients_served' => $completedQueues,
                    'average_wait_minutes' => $averageWait !== null
                        ? round((float) $averageWait, 2)
                        : null,
                    'completion_rate' => round($completionRate, 2),
                    'total_queues' => $totalQueues,
                ],

                'queue_trend' => $queueTrend,

                'service_distribution' => $serviceDistribution,

                'service_performance' => $servicePerformance,

                'filters' => [
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'service_id' => $validated['service_id'] ?? null,
                ],
            ]
        );
    }
}