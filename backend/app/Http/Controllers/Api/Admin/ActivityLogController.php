<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    /**
     * Display activity logs.
     */
    public function index(Request $request)
    {
        $query = ActivityLog::query()
            ->with([
                'user:id,first_name,middle_name,last_name,username',
            ])
            ->select([
                'id',
                'user_id',
                'action',
                'description',
                'module',
                'target_type',
                'target_id',
                'ip_address',
                'created_at',
            ])
            ->latest('created_at');

        // Search
        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($q) use ($search) {
                $q->where('action', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('module', 'like', "%{$search}%")
                    ->orWhere('target_type', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery
                            ->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%")
                            ->orWhere('username', 'like', "%{$search}%");
                    });
            });
        }

        // Filter by module
        if ($request->filled('module')) {
            $query->where('module', $request->input('module'));
        }

        // Filter by action
        if ($request->filled('action')) {
            $query->where('action', $request->input('action'));
        }

        // Filter by user
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }

        $perPage = min(
            max((int) $request->input('per_page', 15), 1),
            100
        );

        $logs = $query->paginate($perPage);

        return ApiResponse::success(
            'Activity logs retrieved successfully.',
            $logs
        );
    }

    /**
     * Display a specific activity log.
     */
    public function show(ActivityLog $activityLog)
    {
        $activityLog->load([
            'user:id,first_name,middle_name,last_name,username',
        ]);

        return ApiResponse::success(
            'Activity log retrieved successfully.',
            $activityLog
        );
    }
}