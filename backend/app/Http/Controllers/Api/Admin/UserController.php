<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Services\ActivityLogService;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

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
    public function store(
        Request $request,
        ActivityLogService $activityLogService
    ) {
        $validated = $request->validate([
            'account_type' => [
                'required',
                'string',
                Rule::in(['admin', 'staff']),
                Rule::exists('roles', 'name'),
            ],

            'counter_id' => [
                'nullable',
                'integer',
                'required_if:account_type,staff',
                'prohibited_if:account_type,admin',
                'exists:service_counters,id',
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

        $user = DB::transaction(function () use (
            $validated,
            $request,
            $activityLogService
        ) {
            $role = Role::where(
                'name',
                $validated['account_type']
            )->firstOrFail();

            $user = User::create([
                'role_id' => $role->id,
                'first_name' => $validated['first_name'],
                'middle_name' => $validated['middle_name'] ?? null,
                'last_name' => $validated['last_name'],
                'username' => $validated['username'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'password' => $validated['password'],
                'status' => $validated['status'],
            ]);

            if ($validated['account_type'] === 'staff') {
                $counter = \App\Models\ServiceCounter::query()
                    ->where('id', $validated['counter_id'])
                    ->where('status', 'open')
                    ->whereNull('assigned_staff_id')
                    ->lockForUpdate()
                    ->first();

                if (!$counter) {
                    throw ValidationException::withMessages([
                        'counter_id' => [
                            'The selected counter is no longer available. Please select another counter.',
                        ],
                    ]);
                }

                $counter->update([
                    'assigned_staff_id' => $user->id,
                ]);
            }

            $activityLogService->record(
                $request,
                'user.created',
                'users',
                "Created {$validated['account_type']} account for {$user->username}.",
                $user
            );

            return $user;
        });

        $user->load('role', 'assignedCounters.service');

        return ApiResponse::success(
            'User created successfully.',
            $user,
            201
        );
    }

    /**
     * Update an existing user.
     */
    public function update(
        Request $request,
        int $id,
        ActivityLogService $activityLogService
    )
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

        $activityLogService->record(
            $request,
            'user.updated',
            'users',
            "Updated user account for {$user->username}.",
            $user
        );

        $user->load('role');

        return ApiResponse::success(
            'User updated successfully.',
            $user
        );
    }

    /**
     * Update a user's status.
     */
    public function updateStatus(
        Request $request,
        int $id,
        ActivityLogService $activityLogService
    )
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

        $activityLogService->record(
            $request,
            'user.status_updated',
            'users',
            "Changed status of user {$user->username} to {$validated['status']}.",
            $user
        );

        $user->load('role');

        return ApiResponse::success(
            'User status updated successfully.',
            $user
        );
    }

    /**
     * Reset a user's password.
     */
    public function resetPassword(
        Request $request,
        int $id,
        ActivityLogService $activityLogService
    )
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


        $activityLogService->record(
            $request,
            'user.password_reset',
            'users',
            "Reset password for user {$user->username}.",
            $user
        );

        return ApiResponse::success(
            'User password reset successfully.'
        );
    }

    /**
     * Delete a user.
     */
    public function destroy(
        int $id,
        ActivityLogService $activityLogService
    )
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

        $activityLogService->record(
            request(),
            'user.deleted',
            'users',
            "Deleted user account for {$user->username}.",
            $user
        );

        $user->delete();

        return ApiResponse::success(
            'User deleted successfully.'
        );
    }
}