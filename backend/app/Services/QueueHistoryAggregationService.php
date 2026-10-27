<?php

namespace App\Services;

use App\Models\QueueTransaction;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class QueueHistoryAggregationService
{
    /**
     * Retrieve daily queue history aggregated by service.
     *
     * Only transactions explicitly marked as genuine operational
     * records should eventually be used for production forecasting.
     *
     * IMPORTANT:
     * The current database does not distinguish manually inserted
     * test records from genuine application-generated transactions.
     * Therefore, this method must not yet be used as production
     * forecasting input.
     */
    public function aggregateDailyHistory(
        ?string $startDate = null,
        ?string $endDate = null,
        ?int $serviceId = null
    ): Collection {
        $query = QueueTransaction::query()
            ->select([
                'id',
                'service_id',
                'queue_date',
                'status',
                'requested_at',
                'called_at',
                'serving_at',
                'completed_at',
                'actual_wait_minutes',
                'service_duration_minutes',
            ]);

        if ($serviceId !== null) {
            $query->where('service_id', $serviceId);
        }

        if ($startDate !== null) {
            $query->whereDate('queue_date', '>=', $startDate);
        }

        if ($endDate !== null) {
            $query->whereDate('queue_date', '<=', $endDate);
        }

        $transactions = $query
            ->orderBy('service_id')
            ->orderBy('queue_date')
            ->orderBy('requested_at')
            ->get();

        return $transactions
            ->groupBy(function ($transaction) {
                return $transaction->service_id
                    . '|'
                    . Carbon::parse(
                        $transaction->queue_date
                    )->toDateString();
            })
            ->map(function (Collection $dailyTransactions) {
                $first = $dailyTransactions->first();

                $completed = $dailyTransactions
                    ->where('status', 'completed');

                $validWaits = $completed
                    ->filter(function ($transaction) {
                        return $transaction->actual_wait_minutes !== null
                            && $transaction->actual_wait_minutes >= 0;
                    });

                $validDurations = $completed
                    ->filter(function ($transaction) {
                        return $transaction->service_duration_minutes !== null
                            && $transaction->service_duration_minutes > 0;
                    });

                $hourCounts = $dailyTransactions
                    ->filter(function ($transaction) {
                        return $transaction->requested_at !== null;
                    })
                    ->groupBy(function ($transaction) {
                        return Carbon::parse(
                            $transaction->requested_at
                        )->hour;
                    })
                    ->map(fn (Collection $hourly) => $hourly->count());

                $peakHour = null;

                if ($hourCounts->isNotEmpty()) {
                    $peakCount = $hourCounts->max();

                    // If tied, choose the earliest hour.
                    $peakHour = (int) $hourCounts
                        ->filter(fn ($count) => $count === $peakCount)
                        ->keys()
                        ->sort()
                        ->first();
                }

                return [
                    'service_id' => (int) $first->service_id,
                    'forecast_date' => Carbon::parse(
                        $first->queue_date
                    )->toDateString(),
                    'day_of_week' => Carbon::parse(
                        $first->queue_date
                    )->format('l'),
                    'total_transactions' => $dailyTransactions->count(),
                    'completed_transactions' => $completed->count(),
                    'average_wait_minutes' => $validWaits->isNotEmpty()
                        ? round(
                            (float) $validWaits->avg('actual_wait_minutes'),
                            2
                        )
                        : null,
                    'average_service_minutes' => $validDurations->isNotEmpty()
                        ? round(
                            (float) $validDurations->avg(
                                'service_duration_minutes'
                            ),
                            2
                        )
                        : null,
                    'peak_hour' => $peakHour,
                    'source_record_count' => $dailyTransactions->count(),
                ];
            })
            ->values();
    }
}