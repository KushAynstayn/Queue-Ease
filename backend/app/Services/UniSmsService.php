<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class UniSmsService
{
    /**
     * Create an authenticated UniSMS HTTP client.
     */
    private function client()
    {
        $secretKey = config('services.unisms.secret_key');

        if (!is_string($secretKey) || trim($secretKey) === '') {
            throw new RuntimeException(
                'UniSMS API secret key is not configured.'
            );
        }

        return Http::withBasicAuth($secretKey, '')
            ->acceptJson()
            ->timeout(
                max(1, (int) config('services.unisms.timeout', 10))
            );
    }

    /**
     * Send an SMS through UniSMS.
     */
    public function send(
        string $number,
        string $message,
        ?string $senderId = null
    ): array {
        $baseUrl = rtrim(
            (string) config('services.unisms.base_url'),
            '/'
        );

        if ($baseUrl === '') {
            throw new RuntimeException(
                'UniSMS API base URL is not configured.'
            );
        }

        $payload = [
            'recipient' => $number,
            'content' => $message,
            'sender_id' => $senderId
                ?: config('services.unisms.sender_id'),
        ];

        try {
            $response = $this->client()
                ->asJson()
                ->post($baseUrl . '/sms', $payload);
        } catch (ConnectionException $exception) {
            throw new RuntimeException(
                'Could not connect to UniSMS.',
                previous: $exception
            );
        }

        $body = $response->json();
        $messageData = is_array($body)
            ? ($body['message'] ?? null)
            : null;

        if (
            !$response->successful()
            || !is_array($messageData)
        ) {
            throw new RuntimeException(
                'UniSMS rejected the SMS request or returned an invalid response.'
            );
        }

        $referenceId = $messageData['reference_id'] ?? null;
        $status = strtolower(
            (string) ($messageData['status'] ?? '')
        );

        if (
            !$referenceId
            || !in_array(
                $status,
                ['pending', 'retrying', 'sent'],
                true
            )
        ) {
            throw new RuntimeException(
                'UniSMS did not accept the SMS submission.'
            );
        }

        return [
            'accepted' => true,
            'message_id' => (string) $referenceId,
            'provider_status' => $status,
            'response' => $messageData,
        ];
    }

    /**
     * Retrieve the current status of an SMS.
     */
    public function getStatus(string $referenceId): array
    {
        $baseUrl = rtrim(
            (string) config('services.unisms.base_url'),
            '/'
        );

        if ($baseUrl === '') {
            throw new RuntimeException(
                'UniSMS API base URL is not configured.'
            );
        }

        try {
            $response = $this->client()->get(
                $baseUrl . '/sms/' . rawurlencode($referenceId)
            );
        } catch (ConnectionException $exception) {
            throw new RuntimeException(
                'Could not connect to UniSMS to retrieve message status.',
                previous: $exception
            );
        }

        $body = $response->json();
        $messageData = is_array($body)
            ? ($body['message'] ?? null)
            : null;

        if (
            !$response->successful()
            || !is_array($messageData)
        ) {
            throw new RuntimeException(
                'Could not retrieve SMS status from UniSMS.'
            );
        }

        $status = strtolower(
            (string) ($messageData['status'] ?? '')
        );

        if (!in_array(
            $status,
            ['pending', 'retrying', 'sent', 'failed'],
            true
        )) {
            throw new RuntimeException(
                'UniSMS returned an unknown message status.'
            );
        }

        return [
            'message_id' => (string) (
                $messageData['reference_id'] ?? $referenceId
            ),
            'provider_status' => $status,
            'fail_reason' => $messageData['fail_reason'] ?? null,
            'response' => $messageData,
        ];
    }
}