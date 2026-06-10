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
            if (Schema::hasColumn('orders', 'status')) {
                $table->dropColumn('status');
            }
            if (Schema::hasColumn('orders', 'delivery_method')) {
                $table->dropColumn('delivery_method');
            }
            if (Schema::hasColumn('orders', 'payment_method')) {
                $table->dropColumn('payment_method');
            }

            $table->foreignId('status_id')->constrained('order_statuses');
            $table->foreignId('delivery_method_id')->constrained('delivery_methods');
            $table->foreignId('payment_method_id')->constrained('payment_methods');

            $table->index('status_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('status')->nullable();
            $table->string('delivery_method')->nullable();
            $table->string('payment_method')->nullable();

            $table->dropForeign(['status_id']);
            $table->dropForeign(['delivery_method_id']);
            $table->dropForeign(['payment_method_id']);

            $table->dropColumn('status_id');
            $table->dropColumn('delivery_method_id');
            $table->dropColumn('payment_method_id');
        });
    }
};
