<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->smallIncrements('id');
            $table->string('name', 50)->unique();
        });

        DB::table('roles')->insert([
            ['name' => 'USER'],
            ['name' => 'MANAGER'],
            ['name' => 'ADMIN'],
        ]);

        Schema::create('user_roles', function (Blueprint $table) {
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->unsignedSmallInteger('role_id');
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
            $table->primary(['user_id', 'role_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_roles');
        Schema::dropIfExists('roles');
    }
};
