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
    $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Lien vers Users
    
    $table->string('name');
    $table->string('establishment_code')->unique();
    $table->string('address');
    $table->string('phone');
    $table->string('contact_email');
    $table->string('justification_path')->nullable();
    $table->enum('status', ['pending', 'active', 'rejected'])->default('pending');
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
