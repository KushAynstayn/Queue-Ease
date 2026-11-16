<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class ServiceCounterSeeder extends Seeder
{
    public function run(): void
    {
        $counters = [
            [
                'service_code' => 'ENR',
                'counter_number' => 'C1',
                'name' => 'Enrollment Counter 1',
                'status' => 'open',
            ],
            [
                'service_code' => 'ENR',
                'counter_number' => 'C2',
                'name' => 'Enrollment Counter 2',
                'status' => 'open',
            ],
            [
                'service_code' => 'DOC',
                'counter_number' => 'C3',
                'name' => 'Document Verification Counter',
                'status' => 'closed',
            ],
            [
                'service_code' => 'ASM',
                'counter_number' => 'C4',
                'name' => 'Assessment Counter',
                'status' => 'closed',
            ],
        ];

        DB::transaction(function () use ($counters) {
            $serviceIds = DB::table('services')
                ->pluck('id', 'code');

            $records = [];

            foreach ($counters as $counter) {
                if (! $serviceIds->has($counter['service_code'])) {
                    throw new RuntimeException(
                        "Service '{$counter['service_code']}' was not found."
                    );
                }

                $records[] = [
                    'service_id' => $serviceIds[$counter['service_code']],
                    'counter_number' => $counter['counter_number'],
                    'name' => $counter['name'],
                    'status' => $counter['status'],
                    'assigned_staff_id' => null,
                    'updated_at' => now(),
                ];
            }

            foreach ($records as $record) {
                DB::table('service_counters')->updateOrInsert(
                    ['counter_number' => $record['counter_number']],
                    $record
                );
            }
        });
    }
}