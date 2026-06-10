<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::unprepared('
            ALTER TABLE inventory
            ADD CONSTRAINT inventory_non_negative
            CHECK (
                stock_quantity >= 0
                AND reserved_quantity >= 0
            );
        ');

        DB::unprepared('
            ALTER TABLE inventory
            ADD CONSTRAINT inventory_reserved_less_than_stock
            CHECK (
                reserved_quantity <= stock_quantity
            );
        ');

        $delivery_id = DB::table('delivery_methods')->where('code', 'delivery')->value('id');
        $pickup_id = DB::table('delivery_methods')->where('code', 'pickup')->value('id');

        if ($delivery_id && $pickup_id) {
            DB::unprepared("
                ALTER TABLE orders
                ADD CONSTRAINT orders_delivery_check
                CHECK (
                    (
                        delivery_method_id = $delivery_id
                        AND delivery_city IS NOT NULL
                        AND delivery_street IS NOT NULL
                        AND pharmacy_id IS NULL
                    )
                    OR
                    (
                        delivery_method_id = $pickup_id
                        AND pharmacy_id IS NOT NULL
                    )
                );
            ");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('inventory')) {
            DB::unprepared('ALTER TABLE inventory DROP CONSTRAINT IF EXISTS inventory_non_negative;');
            DB::unprepared('ALTER TABLE inventory DROP CONSTRAINT IF EXISTS inventory_reserved_less_than_stock;');
        }
        if (Schema::hasTable('orders')) {
            DB::unprepared('ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_delivery_check;');
        }
    }
};
