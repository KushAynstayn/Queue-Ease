<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('forecast_results', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('service_id');

            $table->date('forecast_date');

            $table->unsignedInteger('predicted_transactions')
                ->nullable();

            $table->decimal('predicted_wait_minutes', 10, 2)
                ->nullable();

            $table->unsignedTinyInteger('predicted_peak_hour')
                ->nullable();

            $table->string('model_name', 100)
                ->nullable();

            $table->string('model_version', 50)
                ->nullable();

            $table->decimal('confidence_score', 5, 2)
                ->nullable();

            $table->timestamp('created_at')
                ->nullable()
                ->useCurrent();

            /*
             * Indexes
             */
            $table->index(
                'service_id',
                'idx_forecast_results_service'
            );

            $table->index(
                'forecast_date',
                'idx_forecast_results_date'
            );

            /*
             * Foreign key
             */
            $table->foreign(
                'service_id',
                'fk_forecast_results_service'
            )
                ->references('id')
                ->on('services')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('forecast_results');
    }
};