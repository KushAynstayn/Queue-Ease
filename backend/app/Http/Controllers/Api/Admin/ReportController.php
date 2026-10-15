<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\QueueTransaction;
use App\Models\ForecastResult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /**
     * Queue performance report.
     */
    public function queue(Request $request)
    {
        $query = QueueTransaction::query();

        if ($request->filled('date')) {
            $query->whereDate('queue_date', $request->date);
        }

        $total = (clone $query)->count();

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

        $averageWaitTime = (clone $query)
            ->whereNotNull('actual_wait_minutes')
            ->avg('actual_wait_minutes');

        return ApiResponse::success(
            'Queue report generated successfully.',
            [
                'total_queues' => $total,
                'completed' => $completed,
                'waiting' => $waiting,
                'serving' => $serving,
                'skipped' => $skipped,
                'average_wait_minutes' => round($averageWaitTime ?? 0, 2),
            ]
        );
    }

    /**
     * SMS report.
     */
    public function sms(Request $request)
    {
        $query = DB::table('sms_notifications');

        if ($request->filled('date')) {
            $query->whereDate('created_at', $request->date);
        }

        $total = (clone $query)->count();

        $sent = (clone $query)
            ->where('status', 'sent')
            ->count();

        $failed = (clone $query)
            ->where('status', 'failed')
            ->count();

        $pending = (clone $query)
            ->where('status', 'pending')
            ->count();

        return ApiResponse::success(
            'SMS report generated successfully.',
            [
                'total_sms' => $total,
                'sent' => $sent,
                'failed' => $failed,
                'pending' => $pending,
            ]
        );
    }

    /**
     * Forecast report.
     */
    public function forecast(Request $request)
    {
        $query = ForecastResult::query();

        if ($request->filled('date')) {
            $query->whereDate('forecast_date', $request->date);
        }

        $forecasts = $query
            ->orderByDesc('forecast_date')
            ->get();

        return ApiResponse::success(
            'Forecast report generated successfully.',
            $forecasts
        );
    }
}