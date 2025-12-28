<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            // 1. Passage du matricule en String (pour garder les 000001)
            $table->string('matricule')->change();

            // 2. Passage de class_level en ENUM
            $table->enum('class_level', ['6e', '5e', '4e', '3e', '2nde', '1re', 'Tle'])->change();

            // 3. Ajout des nouveaux champs manquants
            if (!Schema::hasColumn('students', 'pob')) {
                $table->string('pob')->after('birth_date'); 
            }
            if (!Schema::hasColumn('students', 'gender')) {
                $table->enum('gender', ['M', 'F'])->default('M')->after('pob');
            }
            if (!Schema::hasColumn('students', 'series')) {
                $table->enum('series', ['A1', 'A2', 'A3', 'B', 'C', 'D', 'E', 'F1', 'F2', 'F3', 'F4', 'G1', 'G2', 'G3'])
                      ->nullable()
                      ->after('class_level');
            }
            if (!Schema::hasColumn('students', 'photo')) {
                $table->string('photo')->nullable()->after('series');
            }
        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            // Revenir en arrière si besoin
            $table->string('class_level')->change();
            $table->dropColumn(['pob', 'gender', 'series', 'photo']);
        });
    }
};