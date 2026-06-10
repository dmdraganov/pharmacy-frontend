<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cart_items', function (Blueprint $table) {
            if (! Schema::hasColumn('cart_items', 'user_id')) {
                $table->foreignUuid('user_id')->nullable()->after('id')->constrained('users')->onDelete('cascade');
            }
            if (! Schema::hasColumn('cart_items', 'product_id')) {
                $table->foreignUuid('product_id')->after('user_id')->constrained('products')->onDelete('cascade');
            }
            if (! Schema::hasColumn('cart_items', 'quantity')) {
                $table->integer('quantity')->default(1)->after('product_id');
            }
        });

        Schema::table('user_favorites', function (Blueprint $table) {
            if (! Schema::hasColumn('user_favorites', 'user_id')) {
                $table->foreignUuid('user_id')->after('id')->constrained('users')->onDelete('cascade');
            }
            if (! Schema::hasColumn('user_favorites', 'product_id')) {
                $table->foreignUuid('product_id')->after('user_id')->constrained('products')->onDelete('cascade');
            }
        });

        Schema::table('user_favorites', function (Blueprint $table) {
            $table->unique(['user_id', 'product_id'], 'user_favorites_user_product_unique');
        });
    }

    public function down(): void
    {
        Schema::table('user_favorites', function (Blueprint $table) {
            $table->dropUnique('user_favorites_user_product_unique');
        });

        Schema::table('user_favorites', function (Blueprint $table) {
            if (Schema::hasColumn('user_favorites', 'product_id')) {
                $table->dropForeign(['product_id']);
                $table->dropColumn('product_id');
            }
            if (Schema::hasColumn('user_favorites', 'user_id')) {
                $table->dropForeign(['user_id']);
                $table->dropColumn('user_id');
            }
        });

        Schema::table('cart_items', function (Blueprint $table) {
            if (Schema::hasColumn('cart_items', 'product_id')) {
                $table->dropForeign(['product_id']);
                $table->dropColumn('product_id');
            }
            if (Schema::hasColumn('cart_items', 'user_id')) {
                $table->dropForeign(['user_id']);
                $table->dropColumn('user_id');
            }
            if (Schema::hasColumn('cart_items', 'quantity')) {
                $table->dropColumn('quantity');
            }
        });
    }
};
