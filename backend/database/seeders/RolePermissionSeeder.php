<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $assignments = [
            'admin' => [
                'dashboard.view',
                'queue.view',
                'queue.manage',
                'queue.call_next',
                'queue.skip',
                'queue.recall',
                'queue.update_status',
                'clients.view',
                'services.view',
                'services.manage',
                'counters.view',
                'counters.manage',
                'forecast.view',
                'forecast.manage',
                'sms.view',
                'sms.send',
                'sms.manage',
                'reports.view',
                'reports.generate',
                'users.view',
                'users.manage',
                'roles.manage',
                'activity_logs.view',
                'settings.view',
                'settings.manage',
            ],

            'staff' => [
                'dashboard.view',
                'queue.view',
                'queue.skip',
                'queue.update_status',
                'services.view',
                'forecast.view',
                'sms.view',
                'sms.send',
                'reports.view',
            ],

            'client' => [
                'dashboard.view',
                'queue.view',
                'queue.manage',
                'services.view',
            ],
        ];

        DB::transaction(function () use ($assignments) {

            $roles = DB::table('roles')
                ->pluck('id', 'name');

            $permissions = DB::table('permissions')
                ->pluck('id', 'name');

            // Validate all required roles and permissions.
            foreach ($assignments as $roleName => $permissionNames) {
                if (! $roles->has($roleName)) {
                    throw new RuntimeException(
                        "Required role '{$roleName}' was not found."
                    );
                }

                foreach ($permissionNames as $permissionName) {
                    if (! $permissions->has($permissionName)) {
                        throw new RuntimeException(
                            "Required permission '{$permissionName}' was not found."
                        );
                    }
                }
            }

            // Rebuild assignments for the configured roles.
            foreach (array_keys($assignments) as $roleName) {
                DB::table('role_permissions')
                    ->where('role_id', $roles[$roleName])
                    ->delete();
            }

            $now = now();
            $records = [];

            foreach ($assignments as $roleName => $permissionNames) {
                foreach ($permissionNames as $permissionName) {
                    $records[] = [
                        'role_id' => $roles[$roleName],
                        'permission_id' => $permissions[$permissionName],
                        'created_at' => $now,
                    ];
                }
            }

            DB::table('role_permissions')->insert($records);
        });
    }
}