<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('queue_status_history', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('queue_transaction_id');

            $table->string('previous_status', 30)->nullable();
            $table->string('new_status', 30);

            $table->unsignedBigInteger('changed_by')->nullable();

            $table->text('notes')->nullable();

            $table->timestamp('created_at')
                ->nullable()
                ->useCurrent();

            /*
             * Indexes
             */
            $table->index(
                'changed_by',
                'fk_queue_history_user'
            );

            $table->index(
                'queue_transaction_id',
                'idx_queue_history_transaction'
            );

            /*
             * Foreign keys
             */
            $table->foreign(
                'queue_transaction_id',
                'fk_queue_history_transaction'
            )
                ->references('id')
                ->on('queue_transactions')
                ->cascadeOnDelete();

            $table->foreign(
                'changed_by',
                'fk_queue_history_user'
            )
                ->references('id')
                ->on('users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('queue_status_history');
    }
};