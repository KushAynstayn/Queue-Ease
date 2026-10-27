<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\QueueTransaction;
use App\Models\ForecastResult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ReportController extends Controller
{
    /**
     * Validate shared report date filters.
     */
    private function validateDateFilters(Request $request): array
    {
        return $request->validate([
            'date' => ['nullable', 'date_format:Y-m-d'],
            'from' => ['nullable', 'date_format:Y-m-d'],
            'to' => [
                'nullable',
                'date_format:Y-m-d',
                'after_or_equal:from',
            ],
        ]);
    }

    /**
     * Apply date filters to a query.
     */
    private function applyDateFilters($query, array $filters, string $column)
    {
        if (!empty($filters['date'])) {
            $query->whereDate($column, $filters['date']);
        } else {
            if (!empty($filters['from'])) {
                $query->whereDate($column, '>=', $filters['from']);
            }

            if (!empty($filters['to'])) {
                $query->whereDate($column, '<=', $filters['to']);
            }
        }

        return $query;
    }

    /**
     * Queue performance report.
     */
    public function queue(Request $request)
    {
        $filters = $this->validateDateFilters($request);

        $query = $this->applyDateFilters(
            QueueTransaction::query(),
            $filters,
            'queue_date'
        );

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

        $averageServiceDuration = (clone $query)
            ->whereNotNull('service_duration_minutes')
            ->avg('service_duration_minutes');

        return ApiResponse::success(
            'Queue report generated successfully.',
            [
                'total_queues' => $total,
                'completed' => $completed,
                'waiting' => $waiting,
                'serving' => $serving,
                'skipped' => $skipped,
                'average_wait_minutes' => round(
                    (float) $averageWaitTime,
                    2
                ),
                'average_service_duration_minutes' => round(
                    (float) $averageServiceDuration,
                    2
                ),
            ]
        );
    }

    /**
     * SMS report.
     */
    public function sms(Request $request)
    {
        $filters = $this->validateDateFilters($request);

        $query = $this->applyDateFilters(
            DB::table('sms_notifications'),
            $filters,
            'created_at'
        );

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
        $filters = $this->validateDateFilters($request);

        $query = $this->applyDateFilters(
            ForecastResult::query(),
            $filters,
            'forecast_date'
        );

        $forecasts = $query
            ->orderByDesc('forecast_date')
            ->paginate(20);

        return ApiResponse::success(
            'Forecast report generated successfully.',
            $forecasts
        );
    }
}