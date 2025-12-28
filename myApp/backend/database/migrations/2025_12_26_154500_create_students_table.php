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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->string('email')->unique();
            $table->string('student_number', 50)->unique(); // Matricule
            $table->date('birth_date');
            $table->string('class', 50); // Classe
            $table->enum('gender', ['M', 'F'])->nullable();
            $table->string('phone', 20)->nullable();
            $table->text('address')->nullable();
            $table->timestamps();
            
            $table->index('student_number');
            $table->index(['last_name', 'first_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
