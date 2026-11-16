<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClientProfileController extends Controller
{
    /**
     * Retrieve the authenticated client's profile.
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        $client = Client::where('user_id', $user->id)->first();

        if (!$client) {
            return ApiResponse::notFound(
                'Client profile not found.'
            );
        }

        return ApiResponse::success(
            'Client profile retrieved successfully.',
            [
                'id' => $user->id,
                'client_id' => $client->id,
                'first_name' => $user->first_name,
                'middle_name' => $user->middle_name,
                'last_name' => $user->last_name,
                'full_name' => trim(implode(' ', array_filter([
                    $user->first_name,
                    $user->middle_name,
                    $user->last_name,
                ]))),
                'student_number' => $client->student_number,
                'email' => $user->email,
                'phone' => $user->phone,
                'program' => null,
                'year_level' => null,
            ]
        );
    }

    /**
     * Update the authenticated client's editable profile information.
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'phone' => [
                'required',
                'string',
                'max:20',
            ],
        ]);

        $user = $request->user();

        $client = Client::where('user_id', $user->id)->first();

        if (!$client) {
            return ApiResponse::notFound(
                'Client profile not found.'
            );
        }

        $user->phone = $validated['phone'];
        $user->save();

        return ApiResponse::success(
            'Profile updated successfully.',
            [
                'phone' => $user->phone,
            ]
        );
    }
}