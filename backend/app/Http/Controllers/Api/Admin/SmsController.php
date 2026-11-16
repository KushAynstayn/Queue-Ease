<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\UniSmsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Throwable;

class SmsController extends Controller
{
    /**
     * Get SMS summary for today.
     */
    public function summary()
    {
        $today = now()->toDateString();

        $query = DB::table('sms_notifications')
            ->whereDate('created_at', $today);

        return ApiResponse::success(
            'SMS summary retrieved successfully.',
            [
                'total' => (clone $query)->count(),
                'pending' => (clone $query)
                    ->where('status', 'pending')
                    ->count(),
                'sent' => (clone $query)
                    ->where('status', 'sent')
                    ->count(),
                'delivered' => (clone $query)
                    ->where('status', 'delivered')
                    ->count(),
                'failed' => (clone $query)
                    ->where('status', 'failed')
                    ->count(),
            ]
        );
    }

    /**
     * Get SMS notification history.
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'status' => [
                'nullable',
                'in:pending,sent,delivered,failed',
            ],
            'message_type' => [
                'nullable',
                'in:queue_confirmation,queue_update,now_serving,estimated_wait,service_delay,service_available,manual',
            ],
            'per_page' => [
                'nullable',
                'integer',
                'min:1',
                'max:100',
            ],
        ]);

        $query = DB::table('sms_notifications')
            ->select([
                'id',
                'user_id',
                'queue_transaction_id',
                'recipient_number',
                'message_type',
                'message',
                'status',
                'provider',
                'provider_message_id',
                'sent_at',
                'delivered_at',
                'error_message',
                'created_at',
            ])
            ->orderByDesc('created_at');

        if (!empty($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        if (!empty($validated['message_type'])) {
            $query->where(
                'message_type',
                $validated['message_type']
            );
        }

        $notifications = $query->paginate(
            $validated['per_page'] ?? 15
        );

        return ApiResponse::success(
            'SMS notifications retrieved successfully.',
            $notifications
        );
    }

    /**
     * Send an SMS through UniSMS and record the result.
     */
    public function send(
        Request $request,
        UniSmsService $uniSms
    ) {
        $validated = $request->validate([
            'user_id' => [
                'nullable',
                'integer',
                'exists:users,id',
            ],
            'queue_transaction_id' => [
                'nullable',
                'integer',
                'exists:queue_transactions,id',
            ],
            'recipient_number' => [
                'required',
                'string',
                'regex:/^(09\d{9}|\+639\d{9}|639\d{9})$/',
            ],
            'message_type' => [
                'required',
                'in:queue_confirmation,queue_update,now_serving,estimated_wait,service_delay,service_available,manual',
            ],
            'message' => [
                'required',
                'string',
                'max:670',
            ],
        ]);

        // Normalize Philippine mobile numbers.
        $number = $validated['recipient_number'];

        if (str_starts_with($number, '09')) {
            $number = '+63' . substr($number, 1);
        } elseif (str_starts_with($number, '639')) {
            $number = '+' . $number;
        }

        // Create the notification record first.
        $notificationId = DB::table('sms_notifications')
            ->insertGetId([
                'user_id' => $validated['user_id'] ?? null,
                'queue_transaction_id' =>
                    $validated['queue_transaction_id'] ?? null,
                'recipient_number' => $number,
                'message_type' => $validated['message_type'],
                'message' => $validated['message'],
                'status' => 'pending',
                'provider' => 'unisms',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

        try {
            $result = $uniSms->send(
                $number,
                $validated['message']
            );

            $providerStatus = $result['provider_status'];

            $databaseStatus = match ($providerStatus) {
                'sent' => 'sent',
                'failed' => 'failed',
                default => 'pending',
            };

            DB::table('sms_notifications')
                ->where('id', $notificationId)
                ->update([
                    'provider_message_id' =>
                        $result['message_id'],
                    'status' => $databaseStatus,
                    'sent_at' => $databaseStatus === 'sent'
                        ? now()
                        : null,
                    'updated_at' => now(),
                ]);

        } catch (Throwable $exception) {
            Log::error('UniSMS submission failed.', [
                'notification_id' => $notificationId,
                'error' => $exception->getMessage(),
            ]);

            DB::table('sms_notifications')
                ->where('id', $notificationId)
                ->update([
                    'status' => 'failed',
                    'error_message' =>
                        'SMS submission failed. Check the application log.',
                    'updated_at' => now(),
                ]);
        }

        $notification = DB::table('sms_notifications')
            ->where('id', $notificationId)
            ->first();

        return ApiResponse::success(
            'SMS notification attempt recorded.',
            $notification,
            201
        );
    }

    /**
     * Get SMS settings.
     */
    public function settings()
    {
        $settings = DB::table('sms_settings')
            ->orderByDesc('id')
            ->first();

        return ApiResponse::success(
            'SMS settings retrieved successfully.',
            $settings
        );
    }

    /**
     * Update SMS settings.
     */
    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'enabled' => [
                'required',
                'boolean',
            ],
            'queue_confirmation_enabled' => [
                'required',
                'boolean',
            ],
            'queue_update_enabled' => [
                'required',
                'boolean',
            ],
            'now_serving_enabled' => [
                'required',
                'boolean',
            ],
            'service_delay_enabled' => [
                'required',
                'boolean',
            ],
            'alert_threshold_minutes' => [
                'required',
                'integer',
                'min:0',
            ],
            'sender_name' => [
                'nullable',
                'string',
                'max:50',
            ],
        ]);

        $settings = DB::table('sms_settings')
            ->orderByDesc('id')
            ->first();

        if (!$settings) {
            $id = DB::table('sms_settings')->insertGetId([
                ...$validated,
                'updated_by' => Auth::id(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $id = $settings->id;

            DB::table('sms_settings')
                ->where('id', $id)
                ->update([
                    ...$validated,
                    'updated_by' => Auth::id(),
                    'updated_at' => now(),
                ]);
        }

        $updatedSettings = DB::table('sms_settings')
            ->where('id', $id)
            ->first();

        return ApiResponse::success(
            'SMS settings updated successfully.',
            $updatedSettings
        );
    }




    /**
     * Refresh an SMS notification status from UniSMS.
     */
    public function refreshStatus(
        int $id,
        UniSmsService $uniSms
    ) {
        $notification = DB::table('sms_notifications')
            ->where('id', $id)
            ->first();

        if (!$notification) {
            return ApiResponse::notFound(
                'SMS notification not found.'
            );
        }

        if (
            $notification->provider !== 'unisms'
            || empty($notification->provider_message_id)
        ) {
            return ApiResponse::success(
                'This notification has no UniSMS reference ID.',
                $notification
            );
        }

        $result = $uniSms->getStatus(
            $notification->provider_message_id
        );

        $providerStatus = $result['provider_status'];

        $databaseStatus = match ($providerStatus) {
            'sent' => 'sent',
            'failed' => 'failed',
            'pending', 'retrying' => 'pending',
        };

        $updates = [
            'status' => $databaseStatus,
            'error_message' => $databaseStatus === 'failed'
                ? ($result['fail_reason'] ?? 'SMS delivery failed.')
                : null,
            'updated_at' => now(),
        ];

        if ($databaseStatus === 'sent') {
            $updates['sent_at'] =
                $notification->sent_at ?? now();
        }

        // UniSMS "sent" is not proof of handset delivery.
        // Keep delivered_at unchanged.

        DB::table('sms_notifications')
            ->where('id', $id)
            ->update($updates);

        $updatedNotification = DB::table('sms_notifications')
            ->where('id', $id)
            ->first();

        return ApiResponse::success(
            'SMS status refreshed successfully.',
            [
                'notification' => $updatedNotification,
                'provider_status' => $providerStatus,
            ]
        );
    }

}