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
        Schema::create('attributes', function (Blueprint $table) {
            $table->smallIncrements('id');
            $table->string('name')->unique();
        });

        Schema::create('product_attributes', function (Blueprint $table) {
            $table->foreignUuid('product_id')->constrained()->onDelete('cascade');
            $table->unsignedSmallInteger('attribute_id');
            $table->foreign('attribute_id')->references('id')->on('attributes')->onDelete('cascade');
            $table->string('value');
            $table->primary(['product_id', 'attribute_id']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->foreign('brand_id')->references('id')->on('brands')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['brand_id']);
        });
        Schema::dropIfExists('product_attributes');
        Schema::dropIfExists('attributes');
    }
};
