<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('series')) {
            Schema::create('series', function (Blueprint $table) {
                $table->id();
                $table->string('nom');
                $table->string('code')->unique();
                $table->timestamps();
            });

            // Insérer des données par défaut
            $series = [
                ['nom' => 'A1', 'code' => 'A1'],
                ['nom' => 'A2', 'code' => 'A2'],
                ['nom' => 'B', 'code' => 'B'],
                ['nom' => 'C', 'code' => 'C'],
                ['nom' => 'D', 'code' => 'D'],
                ['nom' => 'G1', 'code' => 'G1'],
                ['nom' => 'G2', 'code' => 'G2'],
                ['nom' => 'G3', 'code' => 'G3'],
                ['nom' => 'E', 'code' => 'E'],
                ['nom' => 'F1', 'code' => 'F1'],
                ['nom' => 'F2', 'code' => 'F2'],
                ['nom' => 'F3', 'code' => 'F3'],
                ['nom' => 'F4', 'code' => 'F4'],
            ];

            foreach ($series as $s) {
                DB::table('series')->insert(array_merge($s, [
                    'created_at' => now(),
                    'updated_at' => now()
                ]));
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('series');
    }
};
