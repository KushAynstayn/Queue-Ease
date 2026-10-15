<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a paginated list of users.
     */
    public function index(Request $request)
    {
        $perPage = min(
            max((int) $request->input('per_page', 10), 1),
            100
        );

        $search = trim((string) $request->input('search', ''));
        $role = $request->input('role');
        $status = $request->input('status');

        $query = User::query()
            ->with('role')
            ->select([
                'id',
                'role_id',
                'first_name',
                'middle_name',
                'last_name',
                'username',
                'email',
                'phone',
                'status',
                'last_login_at',
                'created_at',
                'updated_at',
            ]);

        /*
        |--------------------------------------------------------------------------
        | Search
        |--------------------------------------------------------------------------
        */

        if ($search !== '') {
            $query->where(function ($query) use ($search) {
                $query
                    ->where('first_name', 'like', "%{$search}%")
                    ->orWhere('middle_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Role Filter
        |--------------------------------------------------------------------------
        */

        if ($role !== null && $role !== '' && $role !== 'all') {
            $query->whereHas('role', function ($query) use ($role) {
                $query->where('name', $role);
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Status Filter
        |--------------------------------------------------------------------------
        */

        if ($status !== null && $status !== '' && $status !== 'all') {
            $query->where('status', $status);
        }

        /*
        |--------------------------------------------------------------------------
        | Pagination
        |--------------------------------------------------------------------------
        */

        $users = $query
            ->orderByDesc('created_at')
            ->paginate($perPage)
            ->withQueryString();

        return ApiResponse::success(
            'Users retrieved successfully.',
            $users
        );
    }

    /**
     * Return user statistics.
     */
    public function stats()
    {
        $total = User::count();

        $administrators = User::whereHas('role', function ($query) {
            $query->where('name', 'admin');
        })->count();

        $staff = User::whereHas('role', function ($query) {
            $query->where('name', 'staff');
        })->count();

        $clients = User::whereHas('role', function ($query) {
            $query->where('name', 'client');
        })->count();

        return ApiResponse::success(
            'User statistics retrieved successfully.',
            [
                'total' => $total,
                'administrators' => $administrators,
                'staff' => $staff,
                'clients' => $clients,
            ]
        );
    }

    /**
     * Display a specific user.
     */
    public function show(int $id)
    {
        $user = User::query()
            ->with('role')
            ->select([
                'id',
                'role_id',
                'first_name',
                'middle_name',
                'last_name',
                'username',
                'email',
                'phone',
                'status',
                'last_login_at',
                'created_at',
                'updated_at',
            ])
            ->find($id);

        if (!$user) {
            return ApiResponse::notFound(
                'User not found.'
            );
        }

        return ApiResponse::success(
            'User retrieved successfully.',
            $user
        );
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'role_id' => [
                'required',
                'integer',
                Rule::exists('roles', 'id'),
            ],

            'first_name' => [
                'required',
                'string',
                'max:100',
            ],

            'middle_name' => [
                'nullable',
                'string',
                'max:100',
            ],

            'last_name' => [
                'required',
                'string',
                'max:100',
            ],

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

            'phone' => [
                'required',
                'string',
                'max:20',
            ],

            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
            ],

            'status' => [
                'nullable',
                'string',
                Rule::in([
                    'active',
                    'inactive',
                    'suspended',
                ]),
            ],
        ]);

        $validated['status'] = $validated['status'] ?? 'active';

        /*
        |--------------------------------------------------------------------------
        | Create User
        |--------------------------------------------------------------------------
        |
        | User.php already uses the "hashed" cast for password.
        | Therefore we intentionally do NOT call Hash::make() here.
        |
        */

        $user = User::create($validated);

        $user->load('role');

        return ApiResponse::success(
            'User created successfully.',
            $user,
            201
        );
    }

    /**
     * Update an existing user.
     */
    public function update(Request $request, int $id)
    {
        $user = User::find($id);

        if (!$user) {
            return ApiResponse::notFound(
                'User not found.'
            );
        }

        $validated = $request->validate([
            'role_id' => [
                'sometimes',
                'required',
                'integer',
                Rule::exists('roles', 'id'),
            ],

            'first_name' => [
                'sometimes',
                'required',
                'string',
                'max:100',
            ],

            'middle_name' => [
                'nullable',
                'string',
                'max:100',
            ],

            'last_name' => [
                'sometimes',
                'required',
                'string',
                'max:100',
            ],

            'username' => [
                'sometimes',
                'required',
                'string',
                'max:100',
                Rule::unique('users', 'username')->ignore($user->id),
            ],

            'email' => [
                'sometimes',
                'required',
                'email',
                'max:150',
                Rule::unique('users', 'email')->ignore($user->id),
            ],

            'phone' => [
                'sometimes',
                'required',
                'string',
                'max:20',
            ],

            'password' => [
                'sometimes',
                'nullable',
                'string',
                'min:8',
                'confirmed',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Do not replace an existing password with null/empty input.
        |--------------------------------------------------------------------------
        */

        if (
            !array_key_exists('password', $validated) ||
            blank($validated['password'])
        ) {
            unset($validated['password']);
        }

        $user->update($validated);

        $user->load('role');

        return ApiResponse::success(
            'User updated successfully.',
            $user
        );
    }

    /**
     * Update a user's status.
     */
    public function updateStatus(Request $request, int $id)
    {
        $user = User::find($id);

        if (!$user) {
            return ApiResponse::notFound(
                'User not found.'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Prevent administrator from disabling their own account.
        |--------------------------------------------------------------------------
        */

        if ($request->user()->id === $user->id) {
            return ApiResponse::forbidden(
                'You cannot change the status of your own account.'
            );
        }

        $validated = $request->validate([
            'status' => [
                'required',
                'string',
                Rule::in([
                    'active',
                    'inactive',
                    'suspended',
                ]),
            ],
        ]);

        $user->update([
            'status' => $validated['status'],
        ]);

        $user->load('role');

        return ApiResponse::success(
            'User status updated successfully.',
            $user
        );
    }

    /**
     * Reset a user's password.
     */
    public function resetPassword(Request $request, int $id)
    {
        $user = User::find($id);

        if (!$user) {
            return ApiResponse::notFound(
                'User not found.'
            );
        }

        $validated = $request->validate([
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | User.php uses the hashed cast.
        |--------------------------------------------------------------------------
        */

        $user->update([
            'password' => $validated['password'],
        ]);

        return ApiResponse::success(
            'User password reset successfully.'
        );
    }

    /**
     * Delete a user.
     */
    public function destroy(int $id)
    {
        $user = User::find($id);

        if (!$user) {
            return ApiResponse::notFound(
                'User not found.'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Prevent administrator from deleting their own account.
        |--------------------------------------------------------------------------
        */

        if (request()->user()->id === $user->id) {
            return ApiResponse::forbidden(
                'You cannot delete your own account.'
            );
        }

        $user->delete();

        return ApiResponse::success(
            'User deleted successfully.'
        );
    }
}