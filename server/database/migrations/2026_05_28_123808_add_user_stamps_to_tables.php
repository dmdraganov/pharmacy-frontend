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
        $tables = ['categories', 'sections', 'manufacturers', 'pharmacies'];

        if (Schema::hasTable('brands')) {
            $tables[] = 'brands';
        }

        foreach ($tables as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->foreignUuid('created_by')->nullable()->constrained('users')->onDelete('set null');
                $table->foreignUuid('updated_by')->nullable()->constrained('users')->onDelete('set null');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tables = ['categories', 'sections', 'manufacturers', 'pharmacies'];

        if (Schema::hasTable('brands')) {
            $tables[] = 'brands';
        }

        foreach ($tables as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->dropForeign(['created_by']);
                $table->dropForeign(['updated_by']);
                $table->dropColumn(['created_by', 'updated_by']);
            });
        }
    }
};
