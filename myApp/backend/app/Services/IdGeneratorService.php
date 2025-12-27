<?php

namespace App\Services;

use App\Models\User;

class IdGeneratorService
{
    /**
     * Génère un identifiant unique pour une école
     */
    public static function generateForEcole()
    {
        $prefix = "ECL-";
        $year = date('Y');
        $count = User::where('role', 'ecole')->count() + 1;
        
        // Résultat : ECL-2025-001
        return $prefix . $year . '-' . str_pad($count, 3, '0', STR_PAD_LEFT);
    }

    /**
     * Génère un identifiant unique pour un candidat
     */
    public static function generateForCandidat($serie)
    {
        $prefix = strtoupper(substr($serie, 0, 2)); // Prend les 2 1eres lettres de la série
        $random = rand(1000, 9999);
        
        // Résultat : SE-8492 (par exemple pour Série Scientifique)
        return $prefix . '-' . $random;
    }
}