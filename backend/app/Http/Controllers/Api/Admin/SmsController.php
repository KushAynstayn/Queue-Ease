<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class SmsController extends Controller
{
    /**
     * Get SMS notification history.
     */
    public function index(Request $request)
    {
        $query = DB::table('sms_notifications')
            ->orderByDesc('created_at');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('message_type')) {
            $query->where('message_type', $request->message_type);
        }

        $notifications = $query->paginate(
            $request->integer('per_page', 15)
        );

        return ApiResponse::success(
            'SMS notifications retrieved successfully.',
            $notifications
        );
    }

    /**
     * Send/create an SMS notification.
     */
    public function send(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'queue_transaction_id' => [
                'nullable',
                'integer',
                'exists:queue_transactions,id',
            ],
            'recipient_number' => [
                'required',
                'string',
                'max:20',
            ],
            'message_type' => [
                'required',
                'in:queue_confirmation,queue_update,now_serving,estimated_wait,service_delay,service_available,manual',
            ],
            'message' => [
                'required',
                'string',
            ],
        ]);

        $id = DB::table('sms_notifications')->insertGetId([
            'user_id' => $validated['user_id'] ?? null,
            'queue_transaction_id' => $validated['queue_transaction_id'] ?? null,
            'recipient_number' => $validated['recipient_number'],
            'message_type' => $validated['message_type'],
            'message' => $validated['message'],
            'status' => 'pending',
            'provider' => 'semaphore',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $notification = DB::table('sms_notifications')
            ->where('id', $id)
            ->first();

        return ApiResponse::success(
            'SMS notification queued successfully.',
            $notification
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
            'enabled' => ['required', 'boolean'],
            'queue_confirmation_enabled' => ['required', 'boolean'],
            'queue_update_enabled' => ['required', 'boolean'],
            'now_serving_enabled' => ['required', 'boolean'],
            'service_delay_enabled' => ['required', 'boolean'],
            'alert_threshold_minutes' => ['required', 'integer', 'min:0'],
            'sender_name' => ['required', 'string', 'max:50'],
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
            DB::table('sms_settings')
                ->where('id', $settings->id)
                ->update([
                    ...$validated,
                    'updated_by' => Auth::id(),
                    'updated_at' => now(),
                ]);

            $id = $settings->id;
        }

        $updatedSettings = DB::table('sms_settings')
            ->where('id', $id)
            ->first();

        return ApiResponse::success(
            'SMS settings updated successfully.',
            $updatedSettings
        );
    }
}