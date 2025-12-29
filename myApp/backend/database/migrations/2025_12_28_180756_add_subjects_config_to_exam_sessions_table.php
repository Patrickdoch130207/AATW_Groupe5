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
        Schema::table('exam_sessions', function (Blueprint $table) {
            $table->json('subjects_config')->nullable()->after('status');
            // Structure: {"exam_type": "BEPC"|"BAC", "subjects": [{"subject_id": 1, "coefficients": {"A1": 4, "A2": 3, "B": 2, ...}}]}
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('exam_sessions', function (Blueprint $table) {
            $table->dropColumn('subjects_config');
        });
    }
};
