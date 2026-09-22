<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();

            $table->string('name', 150);
            $table->string('code', 20)->unique();
            $table->text('description')->nullable();

            $table->unsignedInteger('estimated_service_minutes')
                ->default(10);

            $table->enum('status', [
                'active',
                'inactive',
            ])->default('active');

            $table->timestamp('created_at')
                ->nullable()
                ->useCurrent();

            $table->timestamp('updated_at')
                ->nullable()
                ->useCurrent()
                ->useCurrentOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};