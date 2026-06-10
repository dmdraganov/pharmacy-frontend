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
        Schema::create('prescriptions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->onDelete('cascade');
            $table->text('uploaded_file_url');
            $table->string('doctor_name')->nullable();
            $table->date('issued_at')->nullable();
            $table->date('expires_at')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->foreignUuid('verified_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();

            $table->index('user_id');
        });

        Schema::create('order_prescriptions', function (Blueprint $table) {
            $table->foreignUuid('order_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('prescription_id')->constrained()->onDelete('cascade');
            $table->primary(['order_id', 'prescription_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_prescriptions');
        Schema::dropIfExists('prescriptions');
    }
};
