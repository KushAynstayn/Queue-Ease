<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $role = DB::table('roles')
            ->where('name', 'admin')
            ->first();

        if (! $role) {
            throw new RuntimeException(
                'Administrator role not found. Seed the roles table first.'
            );
        }

        $email = env('INITIAL_ADMIN_EMAIL');
        $username = env('INITIAL_ADMIN_USERNAME');
        $password = env('INITIAL_ADMIN_PASSWORD');

        if (! $email || ! $username || ! $password) {
            throw new RuntimeException(
                'Set INITIAL_ADMIN_EMAIL, INITIAL_ADMIN_USERNAME, and INITIAL_ADMIN_PASSWORD in your .env file.'
            );
        }

        User::firstOrCreate(
            ['email' => $email],
            [
                'role_id' => $role->id,
                'first_name' => env('INITIAL_ADMIN_FIRST_NAME', 'System'),
                'middle_name' => null,
                'last_name' => env('INITIAL_ADMIN_LAST_NAME', 'Administrator'),
                'username' => $username,
                'phone' => null,
                'password' => $password,
                'status' => 'active',
            ]
        );

        $this->command?->info(
            'Initial administrator account created or already exists.'
        );
    }
}