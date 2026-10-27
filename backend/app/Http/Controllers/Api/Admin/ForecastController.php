<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\ForecastResult;
use App\Models\ForecastingData;
use App\Services\AiForecastingService;
use App\Services\QueueHistoryAggregationService;
use Illuminate\Http\Request;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use RuntimeException;
use Throwable;
use App\Services\ActivityLogService;

class ForecastController extends Controller
{
    public function index(Request $request)
    {
        $results = ForecastResult::query()
            ->orderByDesc('created_at')
            ->paginate(20);

        return ApiResponse::success(
            'Forecast results retrieved successfully.',
            $results
        );
    }

    public function show(ForecastResult $forecast)
    {
        return ApiResponse::success(
            'Forecast result retrieved successfully.',
            $forecast
        );
    }

    public function data(Request $request)
    {
        $data = ForecastingData::query()
            ->orderByDesc('created_at')
            ->paginate(20);

        return ApiResponse::success(
            'Forecasting data retrieved successfully.',
            $data
        );
    }

    /**
     * Generate and save an experimental forecast.
     *
     * Supported targets:
     * - total_transactions
     * - average_wait_minutes
     *
     * Peak-hour forecasting is not supported by the current AI model.
     */
    public function store(
        Request $request,
        QueueHistoryAggregationService $historyService,
        AiForecastingService $aiService,
        ActivityLogService $activityLogService
    ){
        $validated = $request->validate([
            'service_id' => [
                'required',
                'integer',
                'min:1',
                'exists:services,id',
            ],
            'forecast_date' => [
                'required',
                'date_format:Y-m-d',
                'after:today',
            ],
            'target' => [
                'required',
                Rule::in([
                    'total_transactions',
                    'average_wait_minutes',
                ]),
            ],
        ]);

        $serviceId = (int) $validated['service_id'];
        $forecastDate = $validated['forecast_date'];
        $target = $validated['target'];

        try {
            // Only use dates before the forecast date to prevent
            // future-data leakage into the experiment.
            $historyEndDate = now()
                ->parse($forecastDate)
                ->subDay()
                ->toDateString();

            $records = $historyService
                ->aggregateDailyHistory(
                    endDate: $historyEndDate,
                    serviceId: $serviceId,
                )
                ->map(fn ($record) => is_array($record)
                    ? $record
                    : $record->toArray())
                ->values()
                ->all();

            if (count($records) < 10) {
                return response()->json([
                    'status' => 'error',
                    'message' =>
                        'At least 10 historical daily observations are required.',
                    'observation_count' => count($records),
                    'minimum_observations' => 10,
                ], 422);
            }

            // Validate the records through the Flask service.
            $validation = $aiService
                ->validateHistoricalRecords($records);

            $preparedRecords = $validation['records'] ?? null;

            if (! is_array($preparedRecords)) {
                return response()->json([
                    'status' => 'error',
                    'message' =>
                        'The AI service returned an invalid validation response.',
                ], 502);
            }

            // The model accepts one service at a time.
            $prediction = $aiService->predict(
                $preparedRecords,
                $forecastDate,
                $target,
                10,
            );

            if (
                ($prediction['status'] ?? null) !== 'success'
                || ! is_numeric($prediction['predicted_value'] ?? null)
                || ! is_finite((float) $prediction['predicted_value'])
                || (float) $prediction['predicted_value'] < 0
                || (int) ($prediction['service_id'] ?? 0) !== $serviceId
                || ($prediction['target'] ?? null) !== $target
                || ($prediction['forecast_date'] ?? null) !== $forecastDate
            ) {
                return response()->json([
                    'status' => 'error',
                    'message' =>
                        'The AI service returned an invalid prediction.',
                ], 502);
            }

            $value = (float) $prediction['predicted_value'];

            // The schema has separate columns for each prediction type.
            // Never put transaction counts into the waiting-time column.
            $result = ForecastResult::create([
                'service_id' => $serviceId,
                'forecast_date' => $forecastDate,
                'predicted_transactions' => $target === 'total_transactions'
                    ? (int) round($value)
                    : null,
                'predicted_wait_minutes' => $target === 'average_wait_minutes'
                    ? round($value, 2)
                    : null,
                'predicted_peak_hour' => null,
                'model_name' => $prediction['model_name']
                    ?? 'LinearRegression',
                'model_version' => 'experimental-v1',
                'confidence_score' => null,
            ]);


            $activityLogService->record(
                $request,
                'forecast.generated',
                'Forecast',
                "Generated experimental forecast for service {$serviceId}, date {$forecastDate}, target {$target}.",
                $result
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Experimental forecast saved successfully.',
                'data' => $result,
                'target' => $target,
                'production_ready' => false,
                'warning' => $prediction['warning']
                    ?? 'Experimental forecast; operational accuracy has not been established.',
            ], 201);

        } catch (ConnectionException $exception) {
            Log::warning('AI forecasting service is unavailable.', [
                'service_id' => $serviceId,
                'error' => $exception->getMessage(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' =>
                    'The AI forecasting service is unavailable. Please try again.',
            ], 503);

        } catch (RequestException $exception) {
            Log::warning('AI forecasting request failed.', [
                'service_id' => $serviceId,
                'error' => $exception->getMessage(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' =>
                    'The AI service rejected or could not process the forecasting request.',
            ], 422);

        } catch (RuntimeException $exception) {
            Log::error('AI forecasting configuration error.', [
                'error' => $exception->getMessage(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' =>
                    'The AI forecasting service is not configured correctly.',
            ], 500);

        } catch (Throwable $exception) {
            Log::error('Unexpected forecast generation failure.', [
                'service_id' => $serviceId,
                'error' => $exception->getMessage(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' =>
                    'The forecast could not be generated.',
            ], 500);
        }
    }
}