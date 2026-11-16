<?php

namespace App\Http\Controllers\Api\Staff;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StaffProfileController extends Controller
{
    /**
     * Retrieve the authenticated staff member's profile.
     */
    public function show(Request $request): JsonResponse
    {
        $staff = $request->user();

        $staff->load('role');

        $assignedCounters = $staff->assignedCounters()
            ->with('service:id,name')
            ->orderBy('counter_number')
            ->get()
            ->map(function ($counter) {
                return [
                    'id' => $counter->id,
                    'name' => $counter->name,
                    'counter_number' => $counter->counter_number,
                    'status' => $counter->status,
                    'service' => $counter->service?->name,
                ];
            })
            ->values();

        return ApiResponse::success(
            'Staff profile retrieved successfully.',
            [
                'id' => $staff->id,
                'first_name' => $staff->first_name,
                'middle_name' => $staff->middle_name,
                'last_name' => $staff->last_name,
                'display_name' => trim(implode(' ', array_filter([
                    $staff->first_name,
                    $staff->middle_name,
                    $staff->last_name,
                ]))),
                'username' => $staff->username,
                'email' => $staff->email,
                'phone' => $staff->phone,
                'role' => $staff->role?->name ?? 'Service Staff',
                'status' => $staff->status,
                'assigned_counters' => $assignedCounters,
            ]
        );
    }
}