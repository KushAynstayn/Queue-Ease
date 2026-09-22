<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('user_id')->nullable();

            $table->string('action', 100);
            $table->text('description')->nullable();
            $table->string('module', 100)->nullable();
            $table->string('target_type', 100)->nullable();
            $table->unsignedBigInteger('target_id')->nullable();
            $table->string('ip_address', 45)->nullable();

            $table->timestamp('created_at')
                ->nullable()
                ->useCurrent();

            $table->index('user_id', 'idx_activity_logs_user');
            $table->index('action', 'idx_activity_logs_action');
            $table->index('module', 'idx_activity_logs_module');
            $table->index('created_at', 'idx_activity_logs_created_at');

            $table->foreign('user_id', 'fk_activity_logs_user')
                ->references('id')
                ->on('users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};