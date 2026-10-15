<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();

            // System Settings
            $table->string('system_name', 150)
                ->default('Queue Ease');

            $table->string('organization_name', 150);

            $table->string('queue_prefix', 20)
                ->default('ENR');

            $table->string('academic_year', 20);

            // Queue Settings
            $table->unsignedInteger('estimated_service_minutes')
                ->default(15);

            $table->boolean('daily_queue_reset')
                ->default(true);

            $table->unsignedInteger('maximum_queue_capacity')
                ->default(500);

            // Audit
            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};