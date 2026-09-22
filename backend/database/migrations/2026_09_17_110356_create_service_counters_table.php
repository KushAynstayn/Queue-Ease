<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_counters', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('service_id')->nullable();

            $table->string('counter_number', 20);
            $table->string('name', 100);

            $table->enum('status', [
                'open',
                'closed',
                'maintenance',
            ])->default('closed');

            $table->unsignedBigInteger('assigned_staff_id')->nullable();

            $table->timestamp('created_at')
                ->nullable()
                ->useCurrent();

            $table->timestamp('updated_at')
                ->nullable()
                ->useCurrent()
                ->useCurrentOnUpdate();

            $table->unique('counter_number');

            $table->index(
                'service_id',
                'fk_service_counters_service'
            );

            $table->index(
                'assigned_staff_id',
                'fk_service_counters_staff'
            );

            $table->foreign(
                'service_id',
                'fk_service_counters_service'
            )
                ->references('id')
                ->on('services')
                ->nullOnDelete();

            $table->foreign(
                'assigned_staff_id',
                'fk_service_counters_staff'
            )
                ->references('id')
                ->on('users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_counters');
    }
};