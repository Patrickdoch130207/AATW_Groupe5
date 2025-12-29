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
        Schema::table('students', function (Blueprint $table) {
            if (!Schema::hasColumn('students', 'user_id')) {
                $table->foreignId('user_id')->nullable()->after('id');
            }
            if (!Schema::hasColumn('students', 'school_id')) {
                $table->foreignId('school_id')->nullable()->after('user_id');
            }
            if (!Schema::hasColumn('students', 'matricule')) {
                $table->string('matricule')->nullable()->after('last_name');
            }
            if (!Schema::hasColumn('students', 'class_level')) {
                $table->string('class_level')->nullable()->after('birth_date');
            }
            if (!Schema::hasColumn('students', 'pob')) {
                $table->string('pob')->nullable()->after('birth_date');
            }
            if (!Schema::hasColumn('students', 'gender')) {
                $table->enum('gender', ['M', 'F'])->nullable()->after('pob');
            }
            if (!Schema::hasColumn('students', 'series')) {
                $table->string('series')->nullable()->after('class_level');
            }
            if (!Schema::hasColumn('students', 'photo')) {
                $table->string('photo')->nullable()->after('series');
            }

            // Supprimer les colonnes obsolètes si présentes
            foreach (['email', 'student_number', 'class', 'phone', 'address'] as $legacyColumn) {
                if (Schema::hasColumn('students', $legacyColumn)) {
                    $table->dropColumn($legacyColumn);
                }
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            foreach (['user_id','school_id','matricule','class_level','pob','gender','series','photo'] as $column) {
                if (Schema::hasColumn('students', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
