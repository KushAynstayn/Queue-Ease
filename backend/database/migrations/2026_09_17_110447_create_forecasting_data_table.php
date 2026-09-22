<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('forecasting_data', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('service_id');

            $table->date('forecast_date');
            $table->string('day_of_week', 20);

            $table->unsignedInteger('total_transactions')
                ->default(0);

            $table->unsignedInteger('completed_transactions')
                ->default(0);

            $table->decimal('average_wait_minutes', 10, 2)
                ->nullable();

            $table->decimal('average_service_minutes', 10, 2)
                ->nullable();

            $table->unsignedTinyInteger('peak_hour')
                ->nullable();

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
                'service_id',
                'idx_forecasting_service'
            );

            $table->index(
                'forecast_date',
                'idx_forecasting_date'
            );

            /*
             * Foreign key
             */
            $table->foreign(
                'service_id',
                'fk_forecasting_data_service'
            )
                ->references('id')
                ->on('services')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('forecasting_data');
    }
};