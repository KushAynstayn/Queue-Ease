<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\RoleController;
use App\Http\Controllers\Api\Admin\PermissionController;
use App\Http\Controllers\Api\QueueController;
use App\Http\Controllers\Api\Admin\ForecastController;
use App\Http\Controllers\Api\Admin\ReportController;
use App\Http\Controllers\Api\Admin\AnalyticsController;
use App\Http\Controllers\Api\Admin\SmsController;
use App\Http\Controllers\Api\Admin\ActivityLogController;
use App\Http\Controllers\Api\Admin\SettingController;
use App\Http\Controllers\Api\Staff\StaffDashboardController;
use App\Http\Controllers\Api\Client\ClientDashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Queue Ease API routes.
| All routes in this file are automatically prefixed with /api.
|
*/

Route::prefix('v1')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Authentication
    |--------------------------------------------------------------------------
    */

    Route::prefix('auth')->group(function () {

    // Public authentication route
    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:5,1');

    // Protected authentication routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });

});


    /*
|--------------------------------------------------------------------------
| Admin Dashboard
|--------------------------------------------------------------------------
*/

Route::prefix('admin')
    ->middleware([
        'auth:sanctum',
        'role:admin',
        'permission:dashboard.view',
    ])
    ->group(function () {

        Route::get('/dashboard', [
            AdminDashboardController::class,
            'index'
        ]);
    });


    /*
    |--------------------------------------------------------------------------
    | Users & Roles
    |--------------------------------------------------------------------------
    */

    Route::prefix('users')
    ->middleware(['auth:sanctum', 'role:admin'])
    ->group(function () {

        Route::get('/stats', [UserController::class, 'stats'])
            ->middleware('permission:users.view');

        Route::get('/', [UserController::class, 'index'])
            ->middleware('permission:users.view');

        Route::post('/', [UserController::class, 'store'])
            ->middleware('permission:users.manage');

        Route::get('/{id}', [UserController::class, 'show'])
            ->middleware('permission:users.view');

        Route::put('/{id}', [UserController::class, 'update'])
            ->middleware('permission:users.manage');

        Route::patch('/{id}/status', [UserController::class, 'updateStatus'])
            ->middleware('permission:users.manage');

        Route::patch('/{id}/password', [UserController::class, 'resetPassword'])
            ->middleware('permission:users.manage');

        Route::delete('/{id}', [UserController::class, 'destroy'])
            ->middleware('permission:users.manage');
    });

    Route::get('/roles', [RoleController::class, 'index'])
        ->middleware([
            'auth:sanctum',
            'role:admin',
            'permission:roles.manage',
        ]);

    Route::post('/roles/{role}/permissions', [RoleController::class, 'assignPermissions'])
        ->middleware([
            'auth:sanctum',
            'role:admin',
            'permission:roles.manage',
        ]);

    Route::get('/permissions', [PermissionController::class, 'index'])
        ->middleware([
            'auth:sanctum',
            'role:admin',
            'permission:roles.manage',
        ]);

    Route::put('/roles/{role}/permissions', [RoleController::class, 'updatePermissions'])
        ->middleware([
            'auth:sanctum',
            'role:admin',
            'permission:roles.manage',
        ]);

    /*
    |--------------------------------------------------------------------------
    | Services
    |--------------------------------------------------------------------------
    */

    Route::prefix('services')
        ->middleware(['auth:sanctum', 'role:admin,staff'])
        ->group(function () {

            Route::get('/', function () {
                return response()->json([
                    'message' => 'Services endpoint is ready.',
                ]);
            })->middleware('permission:services.view');

            Route::get('/{id}', function ($id) {
                return response()->json([
                    'message' => 'Service endpoint is ready.',
                    'id' => $id,
                ]);
            })->middleware('permission:services.view');
        });


    /*
    |--------------------------------------------------------------------------
    | Service Counters
    |--------------------------------------------------------------------------
    */

    Route::prefix('counters')
        ->middleware(['auth:sanctum', 'role:admin,staff'])
        ->group(function () {

            Route::get('/', function () {
                return response()->json([
                    'message' => 'Counters endpoint is ready.',
                ]);
            })->middleware('permission:counters.view');

            Route::get('/{id}', function ($id) {
                return response()->json([
                    'message' => 'Counter endpoint is ready.',
                    'id' => $id,
                ]);
            })->middleware('permission:counters.view');
        });


    /*
    |--------------------------------------------------------------------------
    | Queue Management
    |--------------------------------------------------------------------------
    */

    Route::prefix('queues')
        ->middleware('auth:sanctum')
        ->group(function () {

            // Admin, staff, and client can view queue information
            Route::get('/', [QueueController::class, 'index'])
                ->middleware([
                    'role:admin,staff,client',
                    'permission:queue.view',
                ]);

            // Admin, staff, and client can create a queue transaction
            Route::post('/', [QueueController::class, 'store'])
                ->middleware([
                    'role:admin,staff,client',
                    'permission:queue.manage',
                ]);


            // Only staff can serve the next queue
            Route::post('/serve-next', [
                QueueController::class,
                'serveNext',
            ])->middleware([
                'role:staff',
                'permission:queue.update_status',
            ]);


            
            Route::post('/{id}/recall', [
                QueueController::class,
                'recall',
            ])->middleware([
                'role:staff',
                'permission:queue.update_status',
            ]);


            // Admin, staff, and client can view a specific queue
            Route::get('/{id}', [QueueController::class, 'show'])
                ->middleware([
                    'role:admin,staff,client',
                    'permission:queue.view',
                ]);

            // Only admin and staff can update queue status
            Route::put('/{id}/status', [QueueController::class, 'updateStatus'])
                ->middleware([
                    'role:admin,staff',
                    'permission:queue.update_status',
                ]);
        });


    /*
    |--------------------------------------------------------------------------
    | Queue Status History
    |--------------------------------------------------------------------------
    */

    Route::get('/queues/{id}/history', [QueueController::class, 'history'])
        ->middleware([
            'auth:sanctum',
            'role:admin,staff,client',
            'permission:queue.view',
        ]);

    /*
    |--------------------------------------------------------------------------
    | Forecasting
    |--------------------------------------------------------------------------
    */

    Route::prefix('forecasts')
        ->middleware(['auth:sanctum', 'role:admin,staff'])
        ->group(function () {

            // Admin and Staff can view forecasts
            Route::get('/', [ForecastController::class, 'index'])
                ->middleware('permission:forecast.view');

            // Admin only can generate/manage forecasts
            Route::post('/', [ForecastController::class, 'store'])
                ->middleware([
                    'role:admin',
                    'permission:forecast.manage',
                ]);

            // Admin and Staff can view a specific forecast
            Route::get('/{id}', [ForecastController::class, 'show'])
                ->middleware('permission:forecast.view');
        });


    /*
    |--------------------------------------------------------------------------
    | Forecasting Data
    |--------------------------------------------------------------------------
    */

    Route::get('/forecasting-data', [ForecastController::class, 'data'])
        ->middleware([
            'auth:sanctum',
            'role:admin,staff',
            'permission:forecast.view',
        ]);


    /*
    |--------------------------------------------------------------------------
    | SMS Notifications
    |--------------------------------------------------------------------------
    */

    Route::prefix('sms')
        ->middleware(['auth:sanctum', 'role:admin'])
        ->group(function () {

            Route::get('/notifications', [
                SmsController::class,
                'index',
            ])->middleware('permission:sms.view');

            Route::post('/send', [
                SmsController::class,
                'send',
            ])->middleware([
                'permission:sms.send',
            ]);

            Route::get('/settings', [
                SmsController::class,
                'settings',
            ])->middleware('permission:sms.view');

            Route::put('/settings', [
                SmsController::class,
                'updateSettings',
            ])->middleware('permission:sms.manage');
        });


    /*
    |--------------------------------------------------------------------------
    | Activity Logs
    |--------------------------------------------------------------------------
    */

    Route::prefix('activity-logs')
        ->middleware([
            'auth:sanctum',
            'role:admin',
            'permission:activity_logs.view',
        ])
        ->group(function () {

            Route::get('/', [
                ActivityLogController::class,
                'index',
            ]);

            Route::get('/{activityLog}', [
                ActivityLogController::class,
                'show',
            ]);
        });


    /*
    |--------------------------------------------------------------------------
    | Reports & Analytics
    |--------------------------------------------------------------------------
    */

    Route::prefix('reports')
        ->middleware(['auth:sanctum', 'role:admin,staff'])
        ->group(function () {

            Route::get('/queue', [ReportController::class, 'queue'])
                ->middleware('permission:reports.view');

            Route::get('/sms', [ReportController::class, 'sms'])
                ->middleware('permission:reports.view');

            Route::get('/forecast', [ReportController::class, 'forecast'])
                ->middleware('permission:reports.view');
        });

    Route::get('/analytics', [AnalyticsController::class, 'index'])
    ->middleware([
        'auth:sanctum',
        'role:admin,staff',
    ]);


    /*
    |--------------------------------------------------------------------------
    | Client
    |--------------------------------------------------------------------------
    */

    Route::prefix('client')
        ->middleware(['auth:sanctum', 'role:client'])
        ->group(function () {


            Route::get('/dashboard', [
                ClientDashboardController::class,
                'index',
            ]);

            Route::get('/active-queue', [
                ClientDashboardController::class,
                'activeQueue',
            ]);

            Route::get('/profile', function () {
                return response()->json([
                    'message' => 'Client profile endpoint is ready.',
                ]);
            });

            Route::get('/queue-history', [
                ClientDashboardController::class,
                'history',
            ]);

            Route::get('/notifications', [
                ClientDashboardController::class,
                'notifications',
            ]);

            Route::put('/notification-preference', [
                ClientDashboardController::class,
                'updateNotificationPreference',
            ]);
        });


    
    /*
    |--------------------------------------------------------------------------
    | Settings
    |--------------------------------------------------------------------------
    */

    Route::prefix('settings')
        ->middleware([
            'auth:sanctum',
            'role:admin',
        ])
        ->group(function () {
            Route::get('/', [
                SettingController::class,
                'show',
            ])->middleware('permission:settings.view');

            Route::put('/', [
                SettingController::class,
                'update',
            ])->middleware('permission:settings.manage');
        });




    /*
    |--------------------------------------------------------------------------
    | Staff Dashboard
    |--------------------------------------------------------------------------
    */

    Route::get('/staff/dashboard', [
        StaffDashboardController::class,
        'index',
    ])->middleware([
        'auth:sanctum',
        'role:staff',
        'permission:dashboard.view',
    ]);


});