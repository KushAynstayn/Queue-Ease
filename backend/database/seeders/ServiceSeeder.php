<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'name' => 'Enrollment',
                'code' => 'ENR',
                'description' => 'General enrollment processing for students',
                'estimated_service_minutes' => 10,
                'status' => 'active',
            ],
            [
                'name' => 'Document Verification',
                'code' => 'DOC',
                'description' => 'Verification of enrollment requirements and submitted documents',
                'estimated_service_minutes' => 8,
                'status' => 'active',
            ],
            [
                'name' => 'Assessment',
                'code' => 'ASM',
                'description' => 'Assessment of student enrollment requirements and records',
                'estimated_service_minutes' => 10,
                'status' => 'active',
            ],
        ];

        foreach ($services as $service) {
            DB::table('services')->updateOrInsert(
                ['code' => $service['code']],
                [
                    'name' => $service['name'],
                    'description' => $service['description'],
                    'estimated_service_minutes' => $service['estimated_service_minutes'],
                    'status' => $service['status'],
                    'updated_at' => now(),
                ]
            );
        }
    }
}