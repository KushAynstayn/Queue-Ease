<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SmsSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            'enabled' => false,
            'queue_confirmation_enabled' => false,
            'queue_update_enabled' => false,
            'now_serving_enabled' => false,
            'service_delay_enabled' => false,
            'alert_threshold_minutes' => 10,
            'sender_name' => null,
            'updated_by' => null,
            'updated_at' => now(),
        ];

        DB::transaction(function () use ($settings) {
            $existingSettings = DB::table('sms_settings')
                ->orderBy('id')
                ->first();

            if ($existingSettings) {
                DB::table('sms_settings')
                    ->where('id', $existingSettings->id)
                    ->update($settings);
            } else {
                $settings['created_at'] = now();

                DB::table('sms_settings')->insert($settings);
            }
        });
    }
}