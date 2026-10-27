<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Services\ActivityLogService;

class SettingController extends Controller
{
    public function show()
    {
        $settings = Setting::with([
            'updatedBy:id,first_name,middle_name,last_name,username',
        ])->first();

        if (!$settings) {
            $settings = Setting::create([
                'system_name' => 'Queue Ease',
                'organization_name' => 'Cebu Technological University',
                'queue_prefix' => 'ENR',
                'academic_year' => '2026-2027',
                'estimated_service_minutes' => 15,
                'daily_queue_reset' => true,
                'maximum_queue_capacity' => 500,
            ]);

            $settings->load([
                'updatedBy:id,first_name,middle_name,last_name,username',
            ]);
        }

        return ApiResponse::success(
            'Settings retrieved successfully.',
            $settings
        );
    }

    public function update(
        Request $request,
        ActivityLogService $activityLogService
    )
    {
        $validator = Validator::make(
            $request->all(),
            [
                'system_name' => [
                    'required',
                    'string',
                    'max:150',
                ],
                'organization_name' => [
                    'required',
                    'string',
                    'max:150',
                ],
                'queue_prefix' => [
                    'required',
                    'string',
                    'max:20',
                ],
                'academic_year' => [
                    'required',
                    'string',
                    'max:20',
                ],
                'estimated_service_minutes' => [
                    'required',
                    'integer',
                    'min:1',
                ],
                'daily_queue_reset' => [
                    'required',
                    'boolean',
                ],
                'maximum_queue_capacity' => [
                    'required',
                    'integer',
                    'min:1',
                ],
            ]
        );

        if ($validator->fails()) {
            return ApiResponse::validation(
                $validator->errors()
            );
        }

        $settings = Setting::first();

        if (!$settings) {
            $settings = new Setting();
        }

        $settings->fill([
            'system_name' => $request->system_name,
            'organization_name' => $request->organization_name,
            'queue_prefix' => strtoupper(
                $request->queue_prefix
            ),
            'academic_year' => $request->academic_year,
            'estimated_service_minutes' =>
            $request->estimated_service_minutes,
            'daily_queue_reset' =>
            $request->boolean('daily_queue_reset'),
            'maximum_queue_capacity' =>
            $request->maximum_queue_capacity,
            'updated_by' => $request->user()->id,
        ]);

        $settings->save();

        $activityLogService->record(
            $request,
            'settings.updated',
            'Settings',
            'Updated system settings.',
            $settings
        );

        $settings->load([
            'updatedBy:id,first_name,middle_name,last_name,username',
        ]);

        return ApiResponse::success(
            'Settings updated successfully.',
            $settings
        );
    }
}
