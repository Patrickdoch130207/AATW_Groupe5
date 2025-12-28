<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            // Ajout du mot de passe temporaire pour l'affichage école
            if (!Schema::hasColumn('students', 'temp_password')) {
                $table->string('temp_password')->nullable()->after('class_level');
            }

            // Ajout du lieu de naissance (pob) utilisé dans le front
            if (!Schema::hasColumn('students', 'pob')) {
                $table->string('pob')->nullable()->after('birth_date');
            }

            // Ajout du genre
            if (!Schema::hasColumn('students', 'gender')) {
                $table->enum('gender', ['M', 'F'])->default('M')->after('pob');
            }

            // Ajout de la série (nullable pour le collège)
            if (!Schema::hasColumn('students', 'series')) {
                $table->string('series')->nullable()->after('class_level');
            }
        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn(['temp_password', 'pob', 'gender', 'series']);
        });
    }
};