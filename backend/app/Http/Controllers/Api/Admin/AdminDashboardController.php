<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\ActivityLog;
use App\Models\ForecastResult;
use App\Models\QueueTransaction;
use App\Models\Service;
use App\Models\SmsNotification;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    /**
     * Display administrator dashboard statistics.
     */
    public function index(): JsonResponse
    {
        $today = now()->toDateString();

        /*
        |--------------------------------------------------------------------------
        | User Statistics
        |--------------------------------------------------------------------------
        */

        $totalUsers = User::count();

        $activeUsers = User::where('status', 'active')->count();

        $inactiveUsers = User::where('status', 'inactive')->count();

        $suspendedUsers = User::where('status', 'suspended')->count();


        /*
        |--------------------------------------------------------------------------
        | Queue Statistics
        |--------------------------------------------------------------------------
        */

        $queueToday = QueueTransaction::whereDate(
            'queue_date',
            $today
        );

        $queueWaiting = (clone $queueToday)
            ->where('status', 'waiting')
            ->count();

        $queueCalled = (clone $queueToday)
            ->where('status', 'called')
            ->count();

        $queueServing = (clone $queueToday)
            ->where('status', 'serving')
            ->count();

        $queueCompleted = (clone $queueToday)
            ->where('status', 'completed')
            ->count();

        $queueCancelled = (clone $queueToday)
            ->where('status', 'cancelled')
            ->count();


        /*
        |--------------------------------------------------------------------------
        | Service Statistics
        |--------------------------------------------------------------------------
        */

        $activeServices = Service::where(
            'status',
            'active'
        )->count();

        $inactiveServices = Service::where(
            'status',
            'inactive'
        )->count();


        /*
        |--------------------------------------------------------------------------
        | SMS Statistics
        |--------------------------------------------------------------------------
        */

        $smsToday = SmsNotification::whereDate(
            'created_at',
            $today
        );

        $smsPending = (clone $smsToday)
            ->where('status', 'pending')
            ->count();

        $smsSent = (clone $smsToday)
            ->where('status', 'sent')
            ->count();

        $smsDelivered = (clone $smsToday)
            ->where('status', 'delivered')
            ->count();

        $smsFailed = (clone $smsToday)
            ->where('status', 'failed')
            ->count();


        /*
        |--------------------------------------------------------------------------
        | Latest Forecast
        |--------------------------------------------------------------------------
        */

        $latestForecast = ForecastResult::with('service')
            ->latest('created_at')
            ->first();


        /*
        |--------------------------------------------------------------------------
        | Recent Activity Logs
        |--------------------------------------------------------------------------
        */

        $recentActivities = ActivityLog::with('user')
            ->latest('created_at')
            ->limit(5)
            ->get();


        /*
        |--------------------------------------------------------------------------
        | Dashboard Response
        |--------------------------------------------------------------------------
        */

        return ApiResponse::success(
            'Admin dashboard data retrieved successfully.',
            [
                'date' => $today,

                'users' => [
                    'total' => $totalUsers,
                    'active' => $activeUsers,
                    'inactive' => $inactiveUsers,
                    'suspended' => $suspendedUsers,
                ],

                'queue' => [
                    'waiting' => $queueWaiting,
                    'called' => $queueCalled,
                    'serving' => $queueServing,
                    'completed' => $queueCompleted,
                    'cancelled' => $queueCancelled,
                ],

                'services' => [
                    'active' => $activeServices,
                    'inactive' => $inactiveServices,
                ],

                'sms' => [
                    'pending' => $smsPending,
                    'sent' => $smsSent,
                    'delivered' => $smsDelivered,
                    'failed' => $smsFailed,
                ],

                'latest_forecast' => $latestForecast,

                'recent_activities' => $recentActivities,
            ]
        );
    }
}