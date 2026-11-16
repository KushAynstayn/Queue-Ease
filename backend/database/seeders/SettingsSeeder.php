<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            'system_name' => 'Queue Ease',
            'organization_name' => 'Cebu Technological University',
            'queue_prefix' => 'ENR',
            'academic_year' => '2026-2027',
            'estimated_service_minutes' => 15,
            'daily_queue_reset' => true,
            'maximum_queue_capacity' => 500,
            'updated_by' => null,
            'updated_at' => now(),
        ];

        DB::transaction(function () use ($settings) {
            $existingSettings = DB::table('settings')
                ->orderBy('id')
                ->first();

            if ($existingSettings) {
                DB::table('settings')
                    ->where('id', $existingSettings->id)
                    ->update($settings);
            } else {
                $settings['created_at'] = now();

                DB::table('settings')->insert($settings);
            }
        });
    }
}