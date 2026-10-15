<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    /**
     * Get queue analytics.
     */
    public function index(Request $request)
    {
        $query = DB::table('queue_transactions');

        if ($request->filled('start_date')) {
            $query->whereDate('queue_date', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->whereDate('queue_date', '<=', $request->end_date);
        }

        $totalQueues = (clone $query)->count();

        $completed = (clone $query)
            ->where('status', 'completed')
            ->count();

        $waiting = (clone $query)
            ->where('status', 'waiting')
            ->count();

        $serving = (clone $query)
            ->where('status', 'serving')
            ->count();

        $skipped = (clone $query)
            ->where('status', 'skipped')
            ->count();

        $averageWaitMinutes = (clone $query)
            ->whereNotNull('actual_wait_minutes')
            ->avg('actual_wait_minutes');

        $averageServiceDuration = (clone $query)
            ->whereNotNull('service_duration_minutes')
            ->avg('service_duration_minutes');

        $peakHour = (clone $query)
            ->select(
                DB::raw('HOUR(requested_at) as hour'),
                DB::raw('COUNT(*) as total')
            )
            ->whereNotNull('requested_at')
            ->groupBy(DB::raw('HOUR(requested_at)'))
            ->orderByDesc('total')
            ->first();

        $queuesByStatus = (clone $query)
            ->select(
                'status',
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('status')
            ->orderBy('status')
            ->get();

        return ApiResponse::success(
            'Analytics retrieved successfully.',
            [
                'total_queues' => $totalQueues,
                'completed' => $completed,
                'waiting' => $waiting,
                'serving' => $serving,
                'skipped' => $skipped,
                'average_wait_minutes' => round((float) $averageWaitMinutes, 2),
                'average_service_duration_minutes' => round((float) $averageServiceDuration, 2),
                'peak_hour' => $peakHour ? [
                    'hour' => (int) $peakHour->hour,
                    'total' => (int) $peakHour->total,
                ] : null,
                'queues_by_status' => $queuesByStatus,
            ]
        );
    }
}