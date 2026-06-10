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
        Schema::create('order_statuses', function (Blueprint $table) {
            $table->smallIncrements('id');
            $table->string('code', 50)->unique();
            $table->string('name');
        });

        DB::table('order_statuses')->insert([
            ['code' => 'new', 'name' => 'Новый'],
            ['code' => 'processing', 'name' => 'В обработке'],
            ['code' => 'shipping', 'name' => 'Доставляется'],
            ['code' => 'delivered', 'name' => 'Доставлен'],
            ['code' => 'completed', 'name' => 'Завершен'],
            ['code' => 'cancelled', 'name' => 'Отменен'],
        ]);

        Schema::create('delivery_methods', function (Blueprint $table) {
            $table->smallIncrements('id');
            $table->string('code', 50)->unique();
            $table->string('name');
        });

        DB::table('delivery_methods')->insert([
            ['code' => 'pickup', 'name' => 'Самовывоз'],
            ['code' => 'delivery', 'name' => 'Доставка'],
        ]);

        Schema::create('payment_methods', function (Blueprint $table) {
            $table->smallIncrements('id');
            $table->string('code', 50)->unique();
            $table->string('name');
        });

        DB::table('payment_methods')->insert([
            ['code' => 'online', 'name' => 'Онлайн'],
            ['code' => 'on_receipt', 'name' => 'При получении'],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_methods');
        Schema::dropIfExists('delivery_methods');
        Schema::dropIfExists('order_statuses');
    }
};
