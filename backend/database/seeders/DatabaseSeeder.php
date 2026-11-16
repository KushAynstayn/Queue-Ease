<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            // Roles and Permissions
            RoleSeeder::class,
            PermissionSeeder::class,
            RolePermissionSeeder::class,

            // Administrator Account
            AdminSeeder::class,

            // Services and Counters
            ServiceSeeder::class,
            ServiceCounterSeeder::class,

            // System Settings
            SettingsSeeder::class,
            SmsSettingsSeeder::class,
        ]);
    }
}