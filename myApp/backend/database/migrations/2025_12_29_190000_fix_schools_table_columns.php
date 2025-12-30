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
            // Renommer les colonnes si elles existent sous l'ancien nom
            if (Schema::hasColumn('schools', 'name') && !Schema::hasColumn('schools', 'school_name')) {
                $table->renameColumn('name', 'school_name');
            }
            if (Schema::hasColumn('schools', 'establishment_code') && !Schema::hasColumn('schools', 'decree_number')) {
                $table->renameColumn('establishment_code', 'decree_number');
            }

            // Ajouter les colonnes manquantes
            if (!Schema::hasColumn('schools', 'director_name')) {
                $table->string('director_name')->nullable();
            }
            if (!Schema::hasColumn('schools', 'department')) {
                $table->string('department')->nullable();
            }
            if (!Schema::hasColumn('schools', 'city')) {
                $table->string('city')->nullable();
            }
            
            // S'assurer que 'address' est présent (déjà là normalement)
            if (!Schema::hasColumn('schools', 'address')) {
                $table->text('address')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('schools', function (Blueprint $table) {
            // On ne fait rien de spécial pour le rollback ici pour éviter de perdre des données
        });
    }
};
