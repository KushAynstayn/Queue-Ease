<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    /**
     * Display a list of roles.
     */
    public function index(Request $request)
    {
        $roles = Role::query()
            ->select([
                'id',
                'name',
                'description',
                'created_at',
                'updated_at',
            ])
            ->orderBy('name')
            ->get();

        return ApiResponse::success(
            'Roles retrieved successfully.',
            $roles
        );
    }



    public function assignPermissions(Request $request, Role $role)
    {
        $validated = $request->validate([
            'permission_ids' => ['required', 'array', 'min:1'],
            'permission_ids.*' => ['integer', 'exists:permissions,id'],
        ]);

        $permissionIds = $validated['permission_ids'];

        $existingPermissionIds = $role->permissions()
            ->whereIn('permissions.id', $permissionIds)
            ->pluck('permissions.id')
            ->toArray();

        $newPermissionIds = array_values(
            array_diff($permissionIds, $existingPermissionIds)
        );

        if (!empty($newPermissionIds)) {
            $role->permissions()->attach($newPermissionIds);
        }

        $role->load('permissions');

        return ApiResponse::success(
            'Permissions assigned to role successfully.',
            $role
        );
    }



    public function updatePermissions(Request $request, Role $role)
    {
        $validated = $request->validate([
            'permission_ids' => ['required', 'array'],
            'permission_ids.*' => ['integer', 'exists:permissions,id'],
        ]);

        $role->permissions()->sync($validated['permission_ids']);

        $role->load('permissions');

        return ApiResponse::success(
            'Role permissions updated successfully.',
            $role
        );
    }
}