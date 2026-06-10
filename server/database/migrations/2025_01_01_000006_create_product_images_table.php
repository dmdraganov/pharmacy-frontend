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
        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'image_url')) {
                $table->dropColumn('image_url');
            }
        });

        Schema::create('product_images', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('product_id')->constrained()->onDelete('cascade');
            $table->text('image_url');
            $table->string('alt_text')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_main')->default(false);
            $table->timestamps();

            $table->index('product_id');
            $table->unique(['product_id', 'is_main'])->where('is_main', true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_images');

        Schema::table('products', function (Blueprint $table) {
            $table->string('image_url')->nullable();
        });
    }
};
