<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\Service;
use Illuminate\Http\Request;
use App\Models\ServiceCounter;

class ServiceController extends Controller
{
    /**
     * Display active services for authorized users.
     */
    public function index(Request $request)
    {
        $services = Service::query()
            ->select([
                'id',
                'name',
                'code',
                'description',
                'estimated_service_minutes',
                'status',
            ])
            ->where('status', 'active')
            ->orderBy('name')
            ->get();

        return ApiResponse::success(
            'Services retrieved successfully.',
            $services
        );
    }

    /**
     * Display a specific service.
     */
    public function show(int $id)
    {
        $service = Service::query()
            ->select([
                'id',
                'name',
                'code',
                'description',
                'estimated_service_minutes',
                'status',
            ])
            ->where('status', 'active')
            ->find($id);

        if (! $service) {
            return ApiResponse::notFound(
                'Active service not found.'
            );
        }

        return ApiResponse::success(
            'Service retrieved successfully.',
            $service
        );
    }



    public function counters()
    {
        $counters = ServiceCounter::query()
            ->with([
                'service:id,name',
            ])
            ->select([
                'id',
                'service_id',
                'counter_number',
                'name',
                'status',
                'assigned_staff_id',
            ])
            ->where('status', 'open')
            ->whereNull('assigned_staff_id')
            ->whereHas('service', function ($query) {
                $query->where('status', 'active');
            })
            ->orderBy('counter_number')
            ->get();

        return ApiResponse::success(
            'Available service counters retrieved successfully.',
            $counters
        );
    }
}