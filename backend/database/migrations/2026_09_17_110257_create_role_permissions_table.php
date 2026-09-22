<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('role_permissions', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('role_id');
            $table->unsignedBigInteger('permission_id');

            $table->timestamp('created_at')
                ->nullable()
                ->useCurrent();

            $table->unique(
                ['role_id', 'permission_id'],
                'unique_role_permission'
            );

            $table->index(
                'permission_id',
                'fk_role_permissions_permission'
            );

            $table->foreign(
                'permission_id',
                'fk_role_permissions_permission'
            )
                ->references('id')
                ->on('permissions')
                ->cascadeOnDelete();

            $table->foreign(
                'role_id',
                'fk_role_permissions_role'
            )
                ->references('id')
                ->on('roles')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('role_permissions');
    }
};