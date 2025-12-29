<?php

namespace Database\Seeders;

use App\Models\Subject;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SubjectsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Matières pour BEPC et BAC au Bénin (officielles)
        $subjects = [
            // ========== MATIÈRES COMMUNES BEPC ET BAC ==========
            [
                'name' => 'Français',
                'code' => 'FR',
                'description' => 'Français - Langue et Littérature (écrit)',
                'default_coefficient' => 3.0
            ],
            [
                'name' => 'Français (oral)',
                'code' => 'FR_ORAL',
                'description' => 'Français - Épreuve orale',
                'default_coefficient' => 2.0
            ],
            [
                'name' => 'Mathématiques',
                'code' => 'MATH',
                'description' => 'Mathématiques',
                'default_coefficient' => 4.0
            ],
            [
                'name' => 'Histoire-Géographie',
                'code' => 'HG',
                'description' => 'Histoire et Géographie',
                'default_coefficient' => 2.0
            ],
            [
                'name' => 'Physique-Chimie-Technologie',
                'code' => 'PCT',
                'description' => 'Physique-Chimie-Technologie',
                'default_coefficient' => 2.0
            ],
            [
                'name' => 'Sciences de la Vie et de la Terre',
                'code' => 'SVT',
                'description' => 'Sciences de la Vie et de la Terre',
                'default_coefficient' => 2.0
            ],
            [
                'name' => 'Anglais',
                'code' => 'ANG',
                'description' => 'Anglais (écrit)',
                'default_coefficient' => 2.0
            ],
            [
                'name' => 'Anglais (oral)',
                'code' => 'ANG_ORAL',
                'description' => 'Anglais - Épreuve orale',
                'default_coefficient' => 2.0
            ],
            [
                'name' => 'Espagnol',
                'code' => 'ESP',
                'description' => 'Espagnol (Langue vivante 2)',
                'default_coefficient' => 2.0
            ],
            [
                'name' => 'Allemand',
                'code' => 'ALL',
                'description' => 'Allemand (Langue vivante 2)',
                'default_coefficient' => 2.0
            ],
            [
                'name' => 'Éducation Physique et Sportive',
                'code' => 'EPS',
                'description' => 'Éducation Physique et Sportive',
                'default_coefficient' => 1.0
            ],
            // ========== MATIÈRES SPÉCIFIQUES BAC ==========
            [
                'name' => 'Philosophie',
                'code' => 'PHI',
                'description' => 'Philosophie',
                'default_coefficient' => 3.0
            ],
            [
                'name' => 'Économie',
                'code' => 'ECO',
                'description' => 'Sciences Économiques et Sociales',
                'default_coefficient' => 4.0
            ],
            // ========== SÉRIE E - MATHÉMATIQUES ET TECHNIQUES ==========
            [
                'name' => 'Construction Mécanique',
                'code' => 'CM',
                'description' => 'Construction Mécanique',
                'default_coefficient' => 3.0
            ],
            [
                'name' => 'Manipulation (pratique)',
                'code' => 'MANIP',
                'description' => 'Manipulation - Travaux Pratiques',
                'default_coefficient' => 3.0
            ],
            [
                'name' => 'Étude de Fabrication ou Technologie',
                'code' => 'EF_TECH',
                'description' => 'Étude de Fabrication ou Technologie (écrit)',
                'default_coefficient' => 2.0
            ],
            [
                'name' => 'Étude de Fabrication ou Technologie (oral)',
                'code' => 'EF_TECH_ORAL',
                'description' => 'Étude de Fabrication ou Technologie - Épreuve orale',
                'default_coefficient' => 2.0
            ],
            // ========== SÉRIES G - TECHNIQUES ADMINISTRATIVES ==========
            [
                'name' => 'Étude de Cas',
                'code' => 'EC',
                'description' => 'Étude de Cas',
                'default_coefficient' => 5.0
            ],
            [
                'name' => 'Compte-rendu / Rapport',
                'code' => 'CR_RAPPORT',
                'description' => 'Compte-rendu / Rapport',
                'default_coefficient' => 3.0
            ],
            [
                'name' => 'Droit Administratif et du Travail',
                'code' => 'DAT',
                'description' => 'Droit Administratif et du Travail',
                'default_coefficient' => 2.0
            ],
            [
                'name' => 'Techniques de base de secrétariat (pratique)',
                'code' => 'TBS',
                'description' => 'Techniques de base de secrétariat - Travaux Pratiques',
                'default_coefficient' => 3.0
            ],
            [
                'name' => 'Mathématiques appliquées',
                'code' => 'MATH_APP',
                'description' => 'Mathématiques appliquées',
                'default_coefficient' => 3.0
            ],
            [
                'name' => 'Droit (TBAD-Finances Publiques)',
                'code' => 'DROIT_TBAD',
                'description' => 'Droit - TBAD et Finances Publiques',
                'default_coefficient' => 2.0
            ],
            [
                'name' => 'Géographie Économique',
                'code' => 'GEO_ECO',
                'description' => 'Géographie Économique',
                'default_coefficient' => 1.0
            ],
            // ========== SÉRIES F - TECHNIQUES INDUSTRIE & CONSTRUCTION ==========
            [
                'name' => 'Matières professionnelles F1 (Construction Mécanique)',
                'code' => 'PROF_F1',
                'description' => 'Matières professionnelles - Construction Mécanique',
                'default_coefficient' => 22.0
            ],
            [
                'name' => 'Oral professionnel F1',
                'code' => 'ORAL_F1',
                'description' => 'Oral professionnel - Construction Mécanique',
                'default_coefficient' => 5.0
            ],
            [
                'name' => 'Matières professionnelles F2 (Électronique)',
                'code' => 'PROF_F2',
                'description' => 'Matières professionnelles - Électronique',
                'default_coefficient' => 22.0
            ],
            [
                'name' => 'Oral professionnel F2',
                'code' => 'ORAL_F2',
                'description' => 'Oral professionnel - Électronique',
                'default_coefficient' => 5.0
            ],
            [
                'name' => 'Matières professionnelles F3 (Électrotechnique)',
                'code' => 'PROF_F3',
                'description' => 'Matières professionnelles - Électrotechnique',
                'default_coefficient' => 22.0
            ],
            [
                'name' => 'Oral professionnel F3',
                'code' => 'ORAL_F3',
                'description' => 'Oral professionnel - Électrotechnique',
                'default_coefficient' => 5.0
            ],
        ];

        foreach ($subjects as $subject) {
            Subject::firstOrCreate(
                ['code' => $subject['code']],
                $subject
            );
        }
    }
}
