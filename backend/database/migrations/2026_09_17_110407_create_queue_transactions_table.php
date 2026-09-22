<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('queue_transactions', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('client_id');
            $table->unsignedBigInteger('service_id');
            $table->unsignedBigInteger('counter_id')->nullable();

            $table->string('queue_number', 30);
            $table->date('queue_date');

            $table->enum('status', [
                'waiting',
                'called',
                'serving',
                'completed',
                'skipped',
                'cancelled',
                'no_show',
            ])->default('waiting');

            $table->enum('priority', [
                'normal',
                'priority',
            ])->default('normal');

            $table->unsignedInteger('position_number')->nullable();
            $table->unsignedInteger('estimated_wait_minutes')->nullable();
            $table->unsignedInteger('actual_wait_minutes')->nullable();
            $table->unsignedInteger('service_duration_minutes')->nullable();

            $table->dateTime('requested_at')
                ->useCurrent();

            $table->dateTime('called_at')->nullable();
            $table->dateTime('serving_at')->nullable();
            $table->dateTime('completed_at')->nullable();

            $table->unsignedBigInteger('served_by')->nullable();

            $table->timestamp('created_at')
                ->nullable()
                ->useCurrent();

            $table->timestamp('updated_at')
                ->nullable()
                ->useCurrent()
                ->useCurrentOnUpdate();

            /*
             * Indexes
             */
            $table->index(
                'counter_id',
                'fk_queue_counter'
            );

            $table->index(
                'served_by',
                'fk_queue_staff'
            );

            $table->index(
                'queue_date',
                'idx_queue_date'
            );

            $table->index(
                'status',
                'idx_queue_status'
            );

            $table->index(
                'service_id',
                'idx_queue_service'
            );

            $table->index(
                'client_id',
                'idx_queue_client'
            );

            /*
             * Foreign keys
             */
            $table->foreign(
                'client_id',
                'fk_queue_client'
            )
                ->references('id')
                ->on('clients')
                ->restrictOnDelete();

            $table->foreign(
                'counter_id',
                'fk_queue_counter'
            )
                ->references('id')
                ->on('service_counters')
                ->nullOnDelete();

            $table->foreign(
                'service_id',
                'fk_queue_service'
            )
                ->references('id')
                ->on('services')
                ->restrictOnDelete();

            $table->foreign(
                'served_by',
                'fk_queue_staff'
            )
                ->references('id')
                ->on('users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('queue_transactions');
    }
};