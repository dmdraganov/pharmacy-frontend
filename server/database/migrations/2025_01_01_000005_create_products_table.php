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
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('brand_id')->nullable();
            $table->foreignId('manufacturer_id')->nullable()->constrained()->onDelete('set null');

            $table->string('slug')->unique();
            $table->string('name');

            $table->decimal('price', 10, 2)->default(0);
            $table->decimal('old_price', 10, 2)->nullable();

            $table->text('description')->nullable();

            $table->boolean('is_popular')->default(false);
            $table->boolean('is_prescription')->default(false);

            $table->jsonb('info')->nullable();

            $table->timestamps();

            $table->foreignUuid('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
