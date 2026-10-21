<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\Client;
use App\Models\QueueTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClientDashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $client = Client::where('user_id', $user->id)->first();

        if (!$client) {
            return ApiResponse::notFound(
                'Client profile not found.'
            );
        }

        $today = now()->toDateString();

        $clientQueues = QueueTransaction::query()
            ->where('client_id', $client->id);

        $activeQueue = (clone $clientQueues)
            ->with('service:id,name,code')
            ->whereDate('queue_date', $today)
            ->whereIn('status', [
                'waiting',
                'called',
                'serving',
            ])
            ->orderBy('requested_at')
            ->first();

        $recentActivity = (clone $clientQueues)
            ->with('service:id,name,code')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get([
                'id',
                'client_id',
                'service_id',
                'queue_number',
                'queue_date',
                'status',
                'estimated_wait_minutes',
                'requested_at',
                'completed_at',
                'created_at',
            ]);

        $queueStatistics = [
            'total_today' => (clone $clientQueues)
                ->whereDate('queue_date', $today)
                ->count(),

            'waiting' => (clone $clientQueues)
                ->whereDate('queue_date', $today)
                ->where('status', 'waiting')
                ->count(),

            'completed_today' => (clone $clientQueues)
                ->whereDate('queue_date', $today)
                ->where('status', 'completed')
                ->count(),
        ];

        $latestSms = $user->smsNotifications()
            ->latest('created_at')
            ->first([
                'id',
                'queue_transaction_id',
                'message_type',
                'message',
                'status',
                'sent_at',
                'delivered_at',
                'created_at',
            ]);

        return ApiResponse::success(
            'Client dashboard data retrieved successfully.',
            [
                'client' => [
                    'id' => $client->id,
                    'student_number' => $client->student_number,
                    'notification_preference' =>
                        $client->notification_preference,
                ],
                'active_queue' => $activeQueue,
                'queue_statistics' => $queueStatistics,
                'latest_sms' => $latestSms,
                'recent_activity' => $recentActivity,
            ]
        );
    }


    
    public function activeQueue(Request $request): JsonResponse
    {
        $user = $request->user();

        $client = Client::where('user_id', $user->id)->first();

        if (!$client) {
            return ApiResponse::notFound(
                'Client profile not found.'
            );
        }

        $activeQueue = QueueTransaction::query()
            ->with([
                'service:id,name,code',
                'counter:id,name,counter_number,status',
            ])
            ->where('client_id', $client->id)
            ->whereDate('queue_date', now()->toDateString())
            ->whereIn('status', [
                'waiting',
                'called',
                'serving',
            ])
            ->orderBy('requested_at')
            ->first();

        return ApiResponse::success(
            'Active queue retrieved successfully.',
            [
                'has_active_queue' => $activeQueue !== null,
                'queue' => $activeQueue ? [
                    'id' => $activeQueue->id,
                    'queue_number' => $activeQueue->queue_number,
                    'queue_date' => $activeQueue->queue_date,
                    'status' => $activeQueue->status,
                    'priority' => $activeQueue->priority,
                    'position_number' => $activeQueue->position_number,
                    'estimated_wait_minutes' =>
                        $activeQueue->estimated_wait_minutes,
                    'requested_at' => $activeQueue->requested_at,
                    'called_at' => $activeQueue->called_at,
                    'serving_at' => $activeQueue->serving_at,
                    'service' => $activeQueue->service,
                    'counter' => $activeQueue->counter,
                ] : null,
            ]
        );
    }



    public function history(Request $request): JsonResponse
    {
        $user = $request->user();

        $client = Client::where('user_id', $user->id)->first();

        if (!$client) {
            return ApiResponse::notFound(
                'Client profile not found.'
            );
        }

        $history = QueueTransaction::query()
            ->with('service:id,name,code')
            ->where('client_id', $client->id)
            ->whereNotIn('status', [
                'waiting',
                'called',
                'serving',
            ])
            ->orderByDesc('queue_date')
            ->orderByDesc('created_at')
            ->paginate(10);

        return ApiResponse::success(
            'Client queue history retrieved successfully.',
            $history
        );
    }



    
    public function notifications(Request $request): JsonResponse
    {
        $user = $request->user();

        $client = Client::where('user_id', $user->id)->first();

        if (!$client) {
            return ApiResponse::notFound(
                'Client profile not found.'
            );
        }

        $notifications = $user->smsNotifications()
            ->select([
                'id',
                'queue_transaction_id',
                'message_type',
                'message',
                'status',
                'sent_at',
                'delivered_at',
                'error_message',
                'created_at',
            ])
            ->latest('created_at')
            ->paginate(10);

        return ApiResponse::success(
            'Client notifications retrieved successfully.',
            $notifications
        );
    }

    public function updateNotificationPreference(
        Request $request
    ): JsonResponse {
        $validated = $request->validate([
            'notification_preference' => [
                'required',
                'in:sms,system,both',
            ],
        ]);

        $client = Client::where(
            'user_id',
            $request->user()->id
        )->first();

        if (!$client) {
            return ApiResponse::notFound(
                'Client profile not found.'
            );
        }

        $client->notification_preference =
            $validated['notification_preference'];

        $client->save();

        return ApiResponse::success(
            'Notification preference updated successfully.',
            [
                'notification_preference' =>
                    $client->notification_preference,
            ]
        );
    }



}