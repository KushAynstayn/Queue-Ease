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

        $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'module' => ['nullable', 'string', 'max:100'],
            'action' => ['nullable', 'string', 'max:100'],
            'user_id' => ['nullable', 'integer', 'min:1'],
            'from' => ['nullable', 'date_format:Y-m-d'],
            'to' => [
                'nullable',
                'date_format:Y-m-d',
                'after_or_equal:from',
            ],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

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


        if ($request->filled('from')) {
            $query->whereDate('created_at', '>=', $request->input('from'));
        }

        if ($request->filled('to')) {
            $query->whereDate('created_at', '<=', $request->input('to'));
        }

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