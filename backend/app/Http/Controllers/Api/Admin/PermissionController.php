<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\Permission;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    /**
     * Display a list of permissions.
     */
    public function index(Request $request)
    {
        $permissions = Permission::query()
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
            'Permissions retrieved successfully.',
            $permissions
        );
    }
}