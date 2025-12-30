<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            // 1. S'assurer que matricule (anc. student_number) est bien un string
            if (Schema::hasColumn('students', 'student_number')) {
                $table->string('student_number', 50)->change();
            }

            // 2. Passage de class_level en ENUM
            if (Schema::hasColumn('students', 'class_level')) {
                $table->enum('class_level', ['6e', '5e', '4e', '3e', '2nde', '1re', 'Tle'])->change();
            } else {
                $table->enum('class_level', ['6e', '5e', '4e', '3e', '2nde', '1re', 'Tle'])->nullable()->after('birth_date');
            }

            // 3. Ajout des nouveaux champs manquants
            if (!Schema::hasColumn('students', 'pob')) {
                $table->string('pob')->nullable()->after('birth_date'); 
            }
            
            if (Schema::hasColumn('students', 'gender')) {
                $table->enum('gender', ['M', 'F'])->default('M')->change();
            } else {
                $table->enum('gender', ['M', 'F'])->default('M')->after('pob');
            }
            
            if (!Schema::hasColumn('students', 'series')) {
                $table->string('series')->nullable()->after('gender'); 
            }
            if (!Schema::hasColumn('students', 'photo')) {
                $table->string('photo')->nullable()->after('series');
            }
            if (!Schema::hasColumn('students', 'temp_password')) {
                $table->string('temp_password')->nullable()->after('photo');
            }
        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->string('class_level')->change();
            $table->dropColumn(['pob', 'gender', 'series', 'photo', 'temp_password']);
        });
    }
};