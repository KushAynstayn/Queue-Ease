<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class SemaphoreSmsService
{
    /**
     * Submit one SMS message to Semaphore.
     *
     * A successful return means Semaphore accepted the
     * submission, not that the recipient received the SMS.
     *
     * @return array{
     *     accepted: bool,
     *     message_id: string|null,
     *     provider_status: string|null,
     *     response: array
     * }
     */
    public function send(
        string $number,
        string $message,
        ?string $senderName = null
    ): array {
        $apiKey = config('services.semaphore.api_key');
        $baseUrl = rtrim(
            (string) config('services.semaphore.base_url'),
            '/'
        );

        if (!is_string($apiKey) || trim($apiKey) === '') {
            throw new RuntimeException(
                'Semaphore API key is not configured.'
            );
        }

        if ($baseUrl === '') {
            throw new RuntimeException(
                'Semaphore API base URL is not configured.'
            );
        }

        $payload = [
            'apikey' => $apiKey,
            'number' => $number,
            'message' => $message,
        ];

        $senderName = $senderName
            ?: config('services.semaphore.sender_name');

        if (is_string($senderName) && trim($senderName) !== '') {
            $payload['sendername'] = $senderName;
        }

        try {
            $response = Http::asForm()
                ->acceptJson()
                ->timeout(
                    max(1, (int) config(
                        'services.semaphore.timeout',
                        10
                    ))
                )
                ->post($baseUrl . '/messages', $payload);
        } catch (ConnectionException $exception) {
            throw new RuntimeException(
                'Could not connect to the Semaphore SMS service.',
                previous: $exception
            );
        }

        $body = $response->json();

        if (!$response->successful() || !is_array($body)) {
            throw new RuntimeException(
                'Semaphore rejected the SMS request or returned an invalid response.'
            );
        }

        // The regular messages endpoint returns an array of
        // message records, even when sending to one number.
        $record = array_is_list($body) ? ($body[0] ?? null) : $body;

        if (!is_array($record)) {
            throw new RuntimeException(
                'Semaphore returned no message record.'
            );
        }

        $providerStatus = strtolower(
            (string) ($record['status'] ?? '')
        );

        if (
            !isset($record['message_id'])
            || $providerStatus === ''
            || in_array($providerStatus, ['failed', 'refunded'], true)
        ) {
            throw new RuntimeException(
                'Semaphore did not accept the SMS message.'
            );
        }

        return [
            'accepted' => true,
            'message_id' => (string) $record['message_id'],
            'provider_status' => $providerStatus,
            'response' => $record,
        ];
    }
}