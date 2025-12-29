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
                $table->string('temp_password')->nullable()->after('class');
            }

            // Ajout du lieu de naissance (pob) utilisé dans le front
            // Vérifier s'il n'existe pas déjà (au cas où il aurait été ajouté par une autre migration)
            if (!Schema::hasColumn('students', 'pob')) {
                $table->string('pob')->nullable()->after('birth_date');
            }

            // Ajout du genre s'il n'existe pas déjà
            if (!Schema::hasColumn('students', 'gender')) {
                $table->enum('gender', ['M', 'F'])->default('M')->after('pob');
            }

            // Ajout de la série (nullable pour le collège)
            // Vérifier s'il n'existe pas déjà (au cas où il aurait été ajouté par une autre migration)
            if (!Schema::hasColumn('students', 'series')) {
                $table->string('series')->nullable()->after('class');
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