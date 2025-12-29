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
        Schema::create('schools', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->string('school_name');             // school_name
    $table->string('director_name');    // director_name
    $table->string('decree_number')->unique(); // arrete_ministeriel
    $table->string('department');       // departement
    $table->string('city');             // ville
    $table->text('address');            // adresse_precise
    $table->string('status')->default('pending'); 
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations. 
     */
    public function down(): void
    {
        Schema::dropIfExists('schools');
    }
};
