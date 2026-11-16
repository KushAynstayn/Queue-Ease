<?php

namespace App\Http\Controllers\Api\Staff;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\ServiceCounter;
use App\Models\ForecastResult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

class StaffReportController extends Controller
{
    /**
     * Get the authenticated staff member's assigned counters and services.
     */
    private function getStaffAssignments(Request $request): array
    {
        $staff = $request->user();

        $counters = ServiceCounter::query()
            ->where('assigned_staff_id', $staff->id)
            ->get(['id', 'service_id']);

        return [
            'counter_ids' => $counters->pluck('id')->all(),
            'service_ids' => $counters->pluck('service_id')
                ->filter()
                ->unique()
                ->values()
                ->all(),
        ];
    }

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
    private function applyDateFilters(
        $query,
        array $filters,
        string $column
    ) {
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
     * Base queue query restricted to the staff member's assignments.
     */
    private function staffQueueQuery(Request $request)
    {
        $assignments = $this->getStaffAssignments($request);

        return DB::table('queue_transactions')
            ->where(function ($query) use ($assignments) {
                $query->whereIn(
                    'queue_transactions.counter_id',
                    $assignments['counter_ids']
                )->orWhereIn(
                    'queue_transactions.service_id',
                    $assignments['service_ids']
                );
            });
    }

    /**
     * Base SMS query restricted to assigned queues.
     */
    private function staffSmsQuery(Request $request)
    {
        $assignments = $this->getStaffAssignments($request);

        return DB::table('sms_notifications')
            ->join(
                'queue_transactions',
                'sms_notifications.queue_transaction_id',
                '=',
                'queue_transactions.id'
            )
            ->where(function ($query) use ($assignments) {
                $query->whereIn(
                    'queue_transactions.counter_id',
                    $assignments['counter_ids']
                )->orWhereIn(
                    'queue_transactions.service_id',
                    $assignments['service_ids']
                );
            });
    }

    /**
     * Base forecast query restricted to assigned services.
     */
    private function staffForecastQuery(Request $request)
    {
        $assignments = $this->getStaffAssignments($request);

        return ForecastResult::with('service:id,name')
            ->whereIn('service_id', $assignments['service_ids']);
    }

    /**
     * Get staff report summary and hourly queue volume.
     */
    public function summary(Request $request)
    {
        $filters = $this->validateDateFilters($request);

        $query = $this->applyDateFilters(
            $this->staffQueueQuery($request),
            $filters,
            'queue_transactions.queue_date'
        );

        $completed = (clone $query)
            ->where('queue_transactions.status', 'completed');

        $totalServed = (clone $completed)->count();

        $averageWaitTime = (clone $completed)
            ->whereNotNull('queue_transactions.actual_wait_minutes')
            ->avg('queue_transactions.actual_wait_minutes');

        $smsQuery = $this->applyDateFilters(
            $this->staffSmsQuery($request),
            $filters,
            'sms_notifications.created_at'
        );

        $smsSent = (clone $smsQuery)
            ->whereIn('sms_notifications.status', ['sent', 'delivered'])
            ->count();

        $hourlyVolume = (clone $completed)
            ->whereNotNull('queue_transactions.completed_at')
            ->selectRaw('HOUR(queue_transactions.completed_at) as hour')
            ->selectRaw('COUNT(*) as clients')
            ->groupByRaw('HOUR(queue_transactions.completed_at)')
            ->orderBy('hour')
            ->get()
            ->map(function ($item) {
                return [
                    'hour' => (int) $item->hour,
                    'time' => date('g A', strtotime(
                        sprintf('%02d:00:00', $item->hour)
                    )),
                    'clients' => (int) $item->clients,
                ];
            });

        $peakHour = $hourlyVolume->sortByDesc('clients')->first();

        return ApiResponse::success(
            'Staff report summary retrieved successfully.',
            [
                'total_clients_served' => $totalServed,
                'average_wait_minutes' => round(
                    (float) $averageWaitTime,
                    2
                ),
                'peak_hour' => $peakHour['time'] ?? null,
                'sms_sent' => $smsSent,
                'hourly_volume' => $hourlyVolume->values(),
            ]
        );
    }

    /**
     * Get queue performance statistics for assigned services.
     */
    public function queue(Request $request)
    {
        $filters = $this->validateDateFilters($request);

        $query = $this->applyDateFilters(
            $this->staffQueueQuery($request),
            $filters,
            'queue_transactions.queue_date'
        );

        $completed = (clone $query)
            ->where('queue_transactions.status', 'completed');

        return ApiResponse::success(
            'Staff queue report retrieved successfully.',
            [
                'total_queues' => (clone $query)->count(),
                'completed' => (clone $completed)->count(),
                'waiting' => (clone $query)
                    ->where('queue_transactions.status', 'waiting')
                    ->count(),
                'called' => (clone $query)
                    ->where('queue_transactions.status', 'called')
                    ->count(),
                'serving' => (clone $query)
                    ->where('queue_transactions.status', 'serving')
                    ->count(),
                'skipped' => (clone $query)
                    ->where('queue_transactions.status', 'skipped')
                    ->count(),
                'cancelled' => (clone $query)
                    ->where('queue_transactions.status', 'cancelled')
                    ->count(),
                'average_wait_minutes' => round(
                    (float) (clone $completed)
                        ->whereNotNull('queue_transactions.actual_wait_minutes')
                        ->avg('queue_transactions.actual_wait_minutes'),
                    2
                ),
                'average_service_duration_minutes' => round(
                    (float) (clone $completed)
                        ->whereNotNull('queue_transactions.service_duration_minutes')
                        ->avg('queue_transactions.service_duration_minutes'),
                    2
                ),
            ]
        );
    }

    /**
     * Get SMS statistics for assigned queues.
     */
    public function sms(Request $request)
    {
        $filters = $this->validateDateFilters($request);

        $query = $this->applyDateFilters(
            $this->staffSmsQuery($request),
            $filters,
            'sms_notifications.created_at'
        );

        return ApiResponse::success(
            'Staff SMS report retrieved successfully.',
            [
                'total_sms' => (clone $query)->count(),
                'sent' => (clone $query)
                    ->where('sms_notifications.status', 'sent')
                    ->count(),
                'delivered' => (clone $query)
                    ->where('sms_notifications.status', 'delivered')
                    ->count(),
                'failed' => (clone $query)
                    ->where('sms_notifications.status', 'failed')
                    ->count(),
                'pending' => (clone $query)
                    ->where('sms_notifications.status', 'pending')
                    ->count(),
            ]
        );
    }

    /**
     * Get forecast records for assigned services.
     */
    public function forecast(Request $request)
    {
        $filters = $this->validateDateFilters($request);

        $query = $this->applyDateFilters(
            $this->staffForecastQuery($request),
            $filters,
            'forecast_date'
        );

        $forecasts = $query
            ->orderByDesc('forecast_date')
            ->paginate(20);

        return ApiResponse::success(
            'Staff forecast report retrieved successfully.',
            $forecasts
        );
    }

    /**
     * Export a staff report as PDF.
     */
    public function exportPdf(Request $request)
    {
        $validated = $request->validate([
            'type' => ['required', 'in:queue,sms,forecast'],
        ]);

        $filters = $this->validateDateFilters($request);
        $type = $validated['type'];

        $title = match ($type) {
            'queue' => 'Staff Queue Performance Report',
            'sms' => 'Staff SMS Notification Report',
            'forecast' => 'Staff Forecast Report',
        };

        $rows = [];

        if ($type === 'queue') {
            $query = $this->applyDateFilters(
                $this->staffQueueQuery($request),
                $filters,
                'queue_transactions.queue_date'
            );

            $completed = (clone $query)
                ->where('queue_transactions.status', 'completed');

            $rows = [
                ['Metric', 'Value'],
                ['Total Queues', (clone $query)->count()],
                ['Completed', (clone $completed)->count()],
                ['Waiting', (clone $query)->where('status', 'waiting')->count()],
                ['Called', (clone $query)->where('status', 'called')->count()],
                ['Serving', (clone $query)->where('status', 'serving')->count()],
                ['Skipped', (clone $query)->where('status', 'skipped')->count()],
                ['Cancelled', (clone $query)->where('status', 'cancelled')->count()],
                [
                    'Average Waiting Time (minutes)',
                    round((float) (clone $completed)
                        ->whereNotNull('actual_wait_minutes')
                        ->avg('actual_wait_minutes'), 2),
                ],
                [
                    'Average Service Duration (minutes)',
                    round((float) (clone $completed)
                        ->whereNotNull('service_duration_minutes')
                        ->avg('service_duration_minutes'), 2),
                ],
            ];
        }

        if ($type === 'sms') {
            $query = $this->applyDateFilters(
                $this->staffSmsQuery($request),
                $filters,
                'sms_notifications.created_at'
            );

            $rows = [
                ['Metric', 'Value'],
                ['Total SMS', (clone $query)->count()],
                ['Sent', (clone $query)->where('sms_notifications.status', 'sent')->count()],
                ['Delivered', (clone $query)->where('sms_notifications.status', 'delivered')->count()],
                ['Failed', (clone $query)->where('sms_notifications.status', 'failed')->count()],
                ['Pending', (clone $query)->where('sms_notifications.status', 'pending')->count()],
            ];
        }

        if ($type === 'forecast') {
            $query = $this->applyDateFilters(
                $this->staffForecastQuery($request),
                $filters,
                'forecast_date'
            );

            $forecasts = $query
                ->orderByDesc('forecast_date')
                ->get();

            $rows = [
                [
                    'Forecast Date',
                    'Service',
                    'Predicted Transactions',
                    'Predicted Wait (minutes)',
                    'Peak Hour',
                    'Model',
                    'Confidence Score',
                ],
            ];

            foreach ($forecasts as $forecast) {
                $rows[] = [
                    $forecast->forecast_date?->format('Y-m-d'),
                    $forecast->service?->name ?? 'N/A',
                    $forecast->predicted_transactions,
                    $forecast->predicted_wait_minutes,
                    $forecast->predicted_peak_hour,
                    $forecast->model_name,
                    $forecast->confidence_score,
                ];
            }
        }

        $pdf = Pdf::loadView('reports.pdf', [
            'title' => $title,
            'type' => $type,
            'filters' => $filters,
            'rows' => $rows,
            'generatedAt' => now(),
        ])->setPaper('a4', 'portrait');

        return $pdf->download(
            'staff-' . $type . '-report-' . now()->format('Y-m-d') . '.pdf'
        );
    }
}