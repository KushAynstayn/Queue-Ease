<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sms_settings', function (Blueprint $table) {
            $table->id();

            $table->boolean('enabled')->default(true);
            $table->boolean('queue_confirmation_enabled')->default(true);
            $table->boolean('queue_update_enabled')->default(true);
            $table->boolean('now_serving_enabled')->default(true);
            $table->boolean('service_delay_enabled')->default(true);

            $table->unsignedInteger('alert_threshold_minutes')
                ->default(10);

            $table->string('sender_name', 50)->nullable();

            $table->unsignedBigInteger('updated_by')->nullable();

            $table->timestamp('created_at')
                ->nullable()
                ->useCurrent();

            $table->timestamp('updated_at')
                ->nullable()
                ->useCurrent()
                ->useCurrentOnUpdate();

            $table->index('updated_by', 'fk_sms_settings_user');

            $table->foreign('updated_by', 'fk_sms_settings_user')
                ->references('id')
                ->on('users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sms_settings');
    }
};