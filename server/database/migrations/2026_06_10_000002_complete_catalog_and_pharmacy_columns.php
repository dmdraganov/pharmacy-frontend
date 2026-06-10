<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('brands', function (Blueprint $table) {
            if (! Schema::hasColumn('brands', 'name')) {
                $table->string('name')->nullable()->unique()->after('id');
            }
        });

        Schema::table('categories', function (Blueprint $table) {
            if (! Schema::hasColumn('categories', 'section_id')) {
                $table->foreignId('section_id')->nullable()->after('description')->constrained('sections')->onDelete('set null');
            }
        });

        Schema::table('pharmacies', function (Blueprint $table) {
            if (! Schema::hasColumn('pharmacies', 'working_hours')) {
                $table->string('working_hours')->nullable()->after('address');
            }
        });
    }

    public function down(): void
    {
        Schema::table('pharmacies', function (Blueprint $table) {
            if (Schema::hasColumn('pharmacies', 'working_hours')) {
                $table->dropColumn('working_hours');
            }
        });

        Schema::table('categories', function (Blueprint $table) {
            if (Schema::hasColumn('categories', 'section_id')) {
                $table->dropForeign(['section_id']);
                $table->dropColumn('section_id');
            }
        });

        Schema::table('brands', function (Blueprint $table) {
            if (Schema::hasColumn('brands', 'name')) {
                $table->dropColumn('name');
            }
        });
    }
};
