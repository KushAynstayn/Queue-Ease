<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\ForecastResult;
use App\Models\ForecastingData;
use Illuminate\Http\Request;

class ForecastController extends Controller
{
    /**
     * Display forecasting results.
     */
    public function index(Request $request)
    {
        $results = ForecastResult::query()
            ->orderByDesc('created_at')
            ->paginate(20);

        return ApiResponse::success(
            'Forecast results retrieved successfully.',
            $results
        );
    }

    /**
     * Display a specific forecasting result.
     */
    public function show(ForecastResult $forecast)
    {
        return ApiResponse::success(
            'Forecast result retrieved successfully.',
            $forecast
        );
    }

    /**
     * Display historical forecasting data.
     */
    public function data(Request $request)
    {
        $data = ForecastingData::query()
            ->orderByDesc('created_at')
            ->paginate(20);

        return ApiResponse::success(
            'Forecasting data retrieved successfully.',
            $data
        );
    }
}