<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
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