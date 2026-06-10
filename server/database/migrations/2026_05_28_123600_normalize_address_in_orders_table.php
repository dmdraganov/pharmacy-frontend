<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'delivery_address')) {
                $table->dropColumn('delivery_address');
            }

            $table->string('delivery_country')->nullable();
            $table->string('delivery_city')->nullable();
            $table->string('delivery_street')->nullable();
            $table->string('delivery_house', 50)->nullable();
            $table->string('delivery_apartment', 50)->nullable();
            $table->string('delivery_postal_code', 50)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('delivery_address')->nullable();
            $table->dropColumn([
                'delivery_country',
                'delivery_city',
                'delivery_street',
                'delivery_house',
                'delivery_apartment',
                'delivery_postal_code',
            ]);
        });
    }
};
