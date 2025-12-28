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
        Schema::create('grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('deliberation_id')->constrained()->onDelete('cascade');
            $table->foreignId('subject_id')->nullable(); // Matière
            $table->string('subject_name', 100); // Nom de la matière
            $table->decimal('grade', 5, 2); // Note (0-20)
            $table->decimal('coefficient', 3, 1)->default(1.0); // Coefficient
            $table->decimal('weighted_grade', 5, 2); // Note pondérée
            $table->timestamps();
            
            $table->index('deliberation_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grades');
    }
};
