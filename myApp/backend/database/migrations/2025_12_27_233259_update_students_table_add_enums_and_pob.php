<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            // 1. S'assurer que student_number est bien un string
            $table->string('student_number', 50)->change();

            // 2. Passage de class en ENUM
            $table->enum('class', ['6e', '5e', '4e', '3e', '2nde', '1re', 'Tle'])->change();

            // 3. Ajout des nouveaux champs manquants
            if (!Schema::hasColumn('students', 'pob')) {
                $table->string('pob')->nullable()->after('birth_date'); 
            }
            
            // Le champ gender existe déjà, on le met à jour si nécessaire
            if (Schema::hasColumn('students', 'gender')) {
                $table->enum('gender', ['M', 'F'])->default('M')->change();
            } else {
                $table->enum('gender', ['M', 'F'])->default('M')->after('pob');
            }
            
            if (!Schema::hasColumn('students', 'series')) {
                $table->enum('series', ['A1', 'A2', 'A3', 'B', 'C', 'D', 'E', 'F1', 'F2', 'F3', 'F4', 'G1', 'G2', 'G3'])
                      ->nullable()
                      ->after('class');
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