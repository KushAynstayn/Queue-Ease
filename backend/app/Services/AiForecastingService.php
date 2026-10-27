<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class AiForecastingService
{
    /**
     * Return the configured AI service base URL.
     */
    private function baseUrl(): string
    {
        $url = config('services.ai_service.url');

        if (! is_string($url) || trim($url) === '') {
            throw new RuntimeException(
                'The AI service URL is not configured.'
            );
        }

        return rtrim($url, '/');
    }

    /**
     * Check whether the Python AI service is available.
     *
     * @throws ConnectionException
     * @throws RequestException
     */
    public function health(): array
    {
        $response = Http::acceptJson()
            ->connectTimeout(3)
            ->timeout(5)
            ->get($this->baseUrl() . '/health');

        $response->throw();

        return $response->json();
    }

    /**
     * Validate daily historical records using Flask.
     *
     * @throws ConnectionException
     * @throws RequestException
     */
    public function validateHistoricalRecords(array $records): array
    {
        $response = Http::acceptJson()
            ->asJson()
            ->connectTimeout(3)
            ->timeout(10)
            ->post(
                $this->baseUrl() . '/forecasting/validate',
                ['records' => $records]
            );

        $response->throw();

        return $response->json();
    }

    /**
     * Assess whether each service has enough observations
     * to attempt an initial model experiment.
     *
     * @throws ConnectionException
     * @throws RequestException
     */
    public function assessTrainingReadiness(
        array $records,
        int $minimumObservations = 30
    ): array {
        $response = Http::acceptJson()
            ->asJson()
            ->connectTimeout(3)
            ->timeout(10)
            ->post(
                $this->baseUrl() . '/forecasting/readiness',
                [
                    'records' => $records,
                    'minimum_observations' => $minimumObservations,
                ]
            );

        $response->throw();

        return $response->json();
    }



    
    /**
     * Evaluate a forecasting model using historical daily records.
     *
     * @throws ConnectionException
     * @throws RequestException
     */
    public function evaluate(
        array $records,
        string $target = 'total_transactions',
        int $minimumObservations = 10
    ): array {
        $response = Http::acceptJson()
            ->asJson()
            ->connectTimeout(3)
            ->timeout(30)
            ->post(
                $this->baseUrl() . '/forecasting/evaluate',
                [
                    'records' => $records,
                    'target' => $target,
                    'minimum_observations' => $minimumObservations,
                ]
            );

        $response->throw();

        return $response->json();
    }

    /**
     * Generate an experimental prediction from historical daily records.
     *
     * @throws ConnectionException
     * @throws RequestException
     */
    public function predict(
        array $records,
        string $forecastDate,
        string $target = 'total_transactions',
        int $minimumObservations = 10
    ): array {
        $response = Http::acceptJson()
            ->asJson()
            ->connectTimeout(3)
            ->timeout(30)
            ->post(
                $this->baseUrl() . '/forecasting/predict',
                [
                    'records' => $records,
                    'target' => $target,
                    'forecast_date' => $forecastDate,
                    'minimum_observations' => $minimumObservations,
                ]
            );

        $response->throw();

        return $response->json();
    }

}