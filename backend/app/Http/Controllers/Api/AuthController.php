<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Client;
use App\Models\Role;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{


    public function register(Request $request)
    {
        $validated = $request->validate([
            // Users table
            'first_name' => ['required', 'string', 'max:100'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],

            'username' => [
                'required',
                'string',
                'max:100',
                'unique:users,username',
            ],

            'email' => [
                'required',
                'email',
                'max:150',
                'unique:users,email',
            ],

            'phone' => ['required', 'string', 'max:20'],

            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
            ],

            // Clients table
            'student_number' => [
                'required',
                'string',
                'max:50',
                'unique:clients,student_number',
            ],

            'notification_preference' => [
                'sometimes',
                'required',
                'string',
                Rule::in(['sms', 'system', 'both']),
            ],
        ]);

        // Resolve the client role from the database.
        $clientRole = Role::where('name', 'client')->first();

        if (!$clientRole) {
            return ApiResponse::error(
                'Client role is not configured in the system.',
                null,
                500
            );
        }

        // Create both records as one atomic database operation.
        $user = DB::transaction(function () use (
            $validated,
            $clientRole
        ) {
            $user = User::create([
                'role_id' => $clientRole->id,
                'first_name' => $validated['first_name'],
                'middle_name' => $validated['middle_name'] ?? null,
                'last_name' => $validated['last_name'],
                'username' => $validated['username'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'password' => $validated['password'],
                'status' => 'active',
            ]);

            $user->client()->create([
                'student_number' => $validated['student_number'],
                'notification_preference' =>
                    $validated['notification_preference'] ?? 'both',
            ]);

            return $user;
        });

        $user->load(['role', 'client']);

        return ApiResponse::success(
            'Student account registered successfully.',
            $user,
            201
        );
    }


    public function login(Request $request)
    {
        $credentials = $request->validate([
            'login' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string', 'max:255'],
        ]);

        $user = User::with('role.permissions')
            ->where(function ($query) use ($credentials) {
                $query->where('email', $credentials['login'])
                    ->orWhere('username', $credentials['login']);
            })
            ->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return ApiResponse::unauthorized(
                'Invalid login credentials.'
            );
        }

        if ($user->status !== 'active') {
            return ApiResponse::forbidden(
                'This account is not active.'
            );
        }

        $user->update([
            'last_login_at' => now(),
        ]);

        $token = $user->createToken('queue-ease-api')->plainTextToken;

        return ApiResponse::success(
            'Login successful.',
            [
                'token' => $token,
                'token_type' => 'Bearer',
                'user' => $user,
            ]
        );
    }

    public function me(Request $request)
    {
        $user = $request->user()->load('role.permissions');

        return ApiResponse::success(
            'Authenticated user retrieved successfully.',
            [
                'user' => $user,
            ]
        );
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return ApiResponse::success(
            'Logout successful.'
        );
    }
}