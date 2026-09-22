<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('role_id');

            $table->string('first_name', 100);
            $table->string('middle_name', 100)->nullable();
            $table->string('last_name', 100);

            $table->string('username', 100)->unique();
            $table->string('email', 150)->unique();
            $table->string('phone', 20)->nullable();

            $table->string('password', 255);

            $table->enum('status', [
                'active',
                'inactive',
                'suspended',
            ])->default('active');

            $table->timestamp('last_login_at')->nullable();

            $table->timestamp('created_at')
                ->nullable()
                ->useCurrent();

            $table->timestamp('updated_at')
                ->nullable()
                ->useCurrent()
                ->useCurrentOnUpdate();

            $table->index('role_id', 'fk_users_role');

            $table->foreign('role_id', 'fk_users_role')
                ->references('id')
                ->on('roles')
                ->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};