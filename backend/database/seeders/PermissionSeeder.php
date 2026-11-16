<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            ['name' => 'dashboard.view', 'description' => 'View dashboard'],

            ['name' => 'queue.view', 'description' => 'View queue'],
            ['name' => 'queue.manage', 'description' => 'Manage queue'],
            ['name' => 'queue.call_next', 'description' => 'Call next client'],
            ['name' => 'queue.skip', 'description' => 'Skip queue'],
            ['name' => 'queue.recall', 'description' => 'Recall queue'],
            ['name' => 'queue.update_status', 'description' => 'Update queue status'],

            ['name' => 'clients.view', 'description' => 'View client information'],

            ['name' => 'services.view', 'description' => 'View services'],
            ['name' => 'services.manage', 'description' => 'Manage services'],

            ['name' => 'counters.view', 'description' => 'View service counters'],
            ['name' => 'counters.manage', 'description' => 'Manage service counters'],

            ['name' => 'forecast.view', 'description' => 'View forecasts'],
            ['name' => 'forecast.manage', 'description' => 'Manage forecasting'],

            ['name' => 'sms.view', 'description' => 'View SMS notifications'],
            ['name' => 'sms.send', 'description' => 'Send SMS notifications'],
            ['name' => 'sms.manage', 'description' => 'Manage SMS settings'],

            ['name' => 'reports.view', 'description' => 'View reports'],
            ['name' => 'reports.generate', 'description' => 'Generate reports'],

            ['name' => 'users.view', 'description' => 'View users'],
            ['name' => 'users.manage', 'description' => 'Manage users'],

            ['name' => 'roles.manage', 'description' => 'Manage roles and permissions'],

            ['name' => 'activity_logs.view', 'description' => 'View activity logs'],

            ['name' => 'settings.view', 'description' => 'View settings'],
            ['name' => 'settings.manage', 'description' => 'Manage system settings'],
        ];

        foreach ($permissions as $permission) {
            DB::table('permissions')->updateOrInsert(
                ['name' => $permission['name']],
                [
                    'description' => $permission['description'],
                    'updated_at' => now(),
                ]
            );
        }
    }
}