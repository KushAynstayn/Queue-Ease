<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sms_notifications', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('queue_transaction_id')->nullable();

            $table->string('recipient_number', 20);

            $table->enum('message_type', [
                'queue_confirmation',
                'queue_update',
                'now_serving',
                'estimated_wait',
                'service_delay',
                'service_available',
                'manual',
            ]);

            $table->text('message');

            $table->enum('status', [
                'pending',
                'sent',
                'delivered',
                'failed',
            ])->default('pending');

            $table->string('provider', 50)->nullable();
            $table->string('provider_message_id', 100)->nullable();

            $table->dateTime('sent_at')->nullable();
            $table->dateTime('delivered_at')->nullable();

            $table->text('error_message')->nullable();

            $table->timestamp('created_at')
                ->nullable()
                ->useCurrent();

            $table->timestamp('updated_at')
                ->nullable()
                ->useCurrent()
                ->useCurrentOnUpdate();

            $table->index('status', 'idx_sms_status');
            $table->index('queue_transaction_id', 'idx_sms_queue');
            $table->index('user_id', 'idx_sms_user');

            $table->foreign('queue_transaction_id', 'fk_sms_queue')
                ->references('id')
                ->on('queue_transactions')
                ->nullOnDelete();

            $table->foreign('user_id', 'fk_sms_user')
                ->references('id')
                ->on('users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sms_notifications');
    }
};