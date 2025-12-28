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
        Schema::create('deliberations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_session_id')->constrained()->onDelete('cascade');
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->decimal('average', 5, 2); // Moyenne générale
            $table->string('decision', 50); // Admis, Ajourné, Exclus
            $table->text('remarks')->nullable(); // Observations
            $table->boolean('is_validated')->default(false); // Validation du jury
            $table->timestamps();
            
            $table->index(['exam_session_id', 'student_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deliberations');
    }
};
