<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (! Schema::hasColumn('orders', 'total_amount')) {
                $table->decimal('total_amount', 10, 2)->default(0)->after('payment_method_id');
            }
        });

        if (! Schema::hasTable('order_items')) {
            Schema::create('order_items', function (Blueprint $table) {
                $table->id();
                $table->foreignUuid('order_id')->constrained()->onDelete('cascade');
                $table->foreignUuid('product_id')->constrained()->onDelete('restrict');
                $table->integer('quantity');
                $table->decimal('price_at_order', 10, 2);

                $table->index('product_id');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');

        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'total_amount')) {
                $table->dropColumn('total_amount');
            }
        });
    }
};
