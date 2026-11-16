<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

class QueueSmsNotificationService
{
    public function __construct(
        private UniSmsService $uniSms
    ) {}

    /**
     * Send an automated queue SMS notification.
     */
    public function sendForQueue(
        int $queueId,
        string $messageType
    ): void {
        $settingColumn = match ($messageType) {
            'queue_confirmation' => 'queue_confirmation_enabled',
            'now_serving' => 'now_serving_enabled',
            default => null,
        };

        if (!$settingColumn) {
            return;
        }

        $settings = DB::table('sms_settings')
            ->orderByDesc('id')
            ->first();

        if (
            !$settings
            || !$settings->enabled
            || !$settings->{$settingColumn}
        ) {
            return;
        }

        $queue = DB::table('queue_transactions')
            ->join(
                'clients',
                'queue_transactions.client_id',
                '=',
                'clients.id'
            )
            ->join(
                'users',
                'clients.user_id',
                '=',
                'users.id'
            )
            ->join(
                'services',
                'queue_transactions.service_id',
                '=',
                'services.id'
            )
            ->where('queue_transactions.id', $queueId)
            ->select([
                'queue_transactions.id',
                'queue_transactions.queue_number',
                'queue_transactions.position_number',
                'queue_transactions.estimated_wait_minutes',
                'clients.user_id',
                'clients.notification_preference',
                'users.phone',
                'services.name as service_name',
            ])
            ->first();

        if (!$queue) {
            return;
        }

        if (!in_array(
            $queue->notification_preference,
            ['sms', 'both'],
            true
        )) {
            return;
        }

        $number = preg_replace(
            '/[\s\-\(\)]/',
            '',
            (string) $queue->phone
        );

        if (
            !preg_match('/^(09\d{9}|\+639\d{9})$/', $number)
        ) {
            Log::warning('Queue SMS skipped: invalid phone number.', [
                'queue_id' => $queueId,
            ]);

            return;
        }

        $message = match ($messageType) {
            'queue_confirmation' => sprintf(
                'Queue Ease: Your queue number is %s for %s. Position: %d. Estimated wait: %d minutes.',
                $queue->queue_number,
                $queue->service_name,
                $queue->position_number,
                $queue->estimated_wait_minutes
            ),

            'now_serving' => sprintf(
                'Queue Ease: Your number %s is now being called for %s. Please proceed to the service counter.',
                $queue->queue_number,
                $queue->service_name
            ),
        };

        $notificationId = DB::table('sms_notifications')
            ->insertGetId([
                'user_id' => $queue->user_id,
                'queue_transaction_id' => $queueId,
                'recipient_number' => $number,
                'message_type' => $messageType,
                'message' => $message,
                'status' => 'pending',
                'provider' => 'unisms',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

        try {
            $result = $this->uniSms->send(
                $number,
                $message
            );

            $providerStatus = $result['provider_status'];

            DB::table('sms_notifications')
                ->where('id', $notificationId)
                ->update([
                    'provider_message_id' =>
                        $result['message_id'],
                    'status' => $providerStatus === 'sent'
                        ? 'sent'
                        : 'pending',
                    'sent_at' => $providerStatus === 'sent'
                        ? now()
                        : null,
                    'updated_at' => now(),
                ]);
        } catch (Throwable $exception) {
            DB::table('sms_notifications')
                ->where('id', $notificationId)
                ->update([
                    'status' => 'failed',
                    'error_message' => Str::limit(
                        $exception->getMessage(),
                        1000
                    ),
                    'updated_at' => now(),
                ]);

            Log::error('Queue Ease UniSMS submission failed.', [
                'notification_id' => $notificationId,
                'queue_id' => $queueId,
                'message' => $exception->getMessage(),
            ]);
        }
    }
}