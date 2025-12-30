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
        Schema::table('schools', function (Blueprint $table) {
            if (Schema::hasColumn('schools', 'phone')) {
                $table->string('phone')->nullable()->change();
            }
            if (Schema::hasColumn('schools', 'contact_email')) {
                $table->string('contact_email')->nullable()->change();
            }
            if (Schema::hasColumn('schools', 'justification_path')) {
                $table->string('justification_path')->nullable()->change();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('schools', function (Blueprint $table) {
            // Pas de retour en arrière strict nécessaire ici
        });
    }
};
