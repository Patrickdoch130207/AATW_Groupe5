<?php

/**
 * Configuration des matières et coefficients pour BEPC et BAC au Bénin
 * Basé sur les données officielles de l'Office du Baccalauréat du Bénin
 * 
 * Structure: [
 *   'exam_type' => 'BEPC' | 'BAC',
 *   'subjects' => [
 *     'subject_code' => [
 *       'name' => 'Nom de la matière',
 *       'coefficients' => [
 *         'filiere_code' => coefficient,
 *         ...
 *       ]
 *     ],
 *     ...
 *   ]
 * ]
 */

return [
    'BEPC' => [
        'subjects' => [
            'MATH' => [
                'name' => 'Mathématiques',
                'coefficients' => [
                    'ALL' => 4, // Toutes filières BEPC
                ]
            ],
            'FR' => [
                'name' => 'Français',
                'coefficients' => [
                    'ALL' => 3,
                ]
            ],
            'ANG' => [
                'name' => 'Anglais',
                'coefficients' => [
                    'ALL' => 3,
                ]
            ],
            'PCT' => [
                'name' => 'Physique-Chimie-Technologie',
                'coefficients' => [
                    'ALL' => 2,
                ]
            ],
            'SVT' => [
                'name' => 'Sciences de la Vie et de la Terre',
                'coefficients' => [
                    'ALL' => 2,
                ]
            ],
            'HG' => [
                'name' => 'Histoire-Géographie',
                'coefficients' => [
                    'ALL' => 2,
                ]
            ],
            'EPS' => [
                'name' => 'Éducation Physique et Sportive',
                'coefficients' => [
                    'ALL' => 1,
                ]
            ],
        ]
    ],
    
    'BAC' => [
        'subjects' => [
            // ========== MATIÈRES COMMUNES ==========
            'FR' => [
                'name' => 'Français (écrit)',
                'coefficients' => [
                    'A1' => 5,
                    'A2' => 4,
                    'B' => 4,
                    'C' => 2,
                    'D' => 2,
                    'E' => 2,
                    'G1' => 3,
                    'G2' => 3,
                    'G3' => 3,
                    'F1' => 0,
                    'F2' => 0,
                    'F3' => 0,
                ]
            ],
            'FR_ORAL' => [
                'name' => 'Français (oral)',
                'coefficients' => [
                    'A1' => 2,
                    'A2' => 2,
                    'B' => 2,
                    'C' => 2,
                    'D' => 2,
                    'E' => 0,
                    'G1' => 1,
                    'G2' => 2,
                    'G3' => 2,
                    'F1' => 0,
                    'F2' => 0,
                    'F3' => 0,
                ]
            ],
            'PHI' => [
                'name' => 'Philosophie',
                'coefficients' => [
                    'A1' => 4,
                    'A2' => 3,
                    'B' => 3,
                    'C' => 2,
                    'D' => 2,
                    'E' => 1,
                    'G1' => 1,
                    'G2' => 1,
                    'G3' => 1,
                    'F1' => 0,
                    'F2' => 0,
                    'F3' => 0,
                ]
            ],
            'MATH' => [
                'name' => 'Mathématiques',
                'coefficients' => [
                    'A1' => 2,
                    'A2' => 2,
                    'B' => 2,
                    'C' => 6,
                    'D' => 4,
                    'E' => 5,
                    'G1' => 0,
                    'G2' => 0,
                    'G3' => 0,
                    'F1' => 0,
                    'F2' => 0,
                    'F3' => 0,
                ]
            ],
            'HG' => [
                'name' => 'Histoire-Géographie',
                'coefficients' => [
                    'A1' => 3,
                    'A2' => 5,
                    'B' => 4,
                    'C' => 2,
                    'D' => 2,
                    'E' => 0,
                    'G1' => 0,
                    'G2' => 0,
                    'G3' => 0,
                    'F1' => 0,
                    'F2' => 0,
                    'F3' => 0,
                ]
            ],
            'PCT' => [
                'name' => 'Sciences Physiques',
                'coefficients' => [
                    'A1' => 0,
                    'A2' => 0,
                    'B' => 0,
                    'C' => 5,
                    'D' => 4,
                    'E' => 4,
                    'G1' => 0,
                    'G2' => 0,
                    'G3' => 0,
                    'F1' => 0,
                    'F2' => 0,
                    'F3' => 0,
                ]
            ],
            'SVT' => [
                'name' => 'Sciences de la Vie et de la Terre',
                'coefficients' => [
                    'A1' => 2,
                    'A2' => 2,
                    'B' => 2,
                    'C' => 2,
                    'D' => 5,
                    'E' => 0,
                    'G1' => 0,
                    'G2' => 0,
                    'G3' => 0,
                    'F1' => 0,
                    'F2' => 0,
                    'F3' => 0,
                ]
            ],
            'ANG' => [
                'name' => 'Anglais (écrit)',
                'coefficients' => [
                    'A1' => 3,
                    'A2' => 3,
                    'B' => 2,
                    'C' => 2,
                    'D' => 2,
                    'E' => 0,
                    'G1' => 2,
                    'G2' => 2,
                    'G3' => 2,
                    'F1' => 0,
                    'F2' => 0,
                    'F3' => 0,
                ]
            ],
            'ANG_ORAL' => [
                'name' => 'Anglais (oral)',
                'coefficients' => [
                    'A1' => 2,
                    'A2' => 2,
                    'B' => 2,
                    'C' => 2,
                    'D' => 2,
                    'E' => 1,
                    'G1' => 1,
                    'G2' => 1,
                    'G3' => 1,
                    'F1' => 0,
                    'F2' => 0,
                    'F3' => 0,
                ]
            ],
            'ESP' => [
                'name' => 'Espagnol (Langue vivante 2)',
                'coefficients' => [
                    'A1' => 0,
                    'A2' => 2,
                    'B' => 0,
                    'C' => 0,
                    'D' => 0,
                    'E' => 0,
                    'G1' => 0,
                    'G2' => 0,
                    'G3' => 0,
                    'F1' => 0,
                    'F2' => 0,
                    'F3' => 0,
                ]
            ],
            'ALL' => [
                'name' => 'Allemand (Langue vivante 2)',
                'coefficients' => [
                    'A1' => 2,
                    'A2' => 0,
                    'B' => 0,
                    'C' => 0,
                    'D' => 0,
                    'E' => 0,
                    'G1' => 0,
                    'G2' => 0,
                    'G3' => 0,
                    'F1' => 0,
                    'F2' => 0,
                    'F3' => 0,
                ]
            ],
            'ECO' => [
                'name' => 'Économie',
                'coefficients' => [
                    'A1' => 0,
                    'A2' => 0,
                    'B' => 4,
                    'C' => 0,
                    'D' => 0,
                    'E' => 0,
                    'G1' => 3,
                    'G2' => 3,
                    'G3' => 3,
                    'F1' => 0,
                    'F2' => 0,
                    'F3' => 0,
                ]
            ],
            'EPS' => [
                'name' => 'Éducation Physique et Sportive',
                'coefficients' => [
                    'A1' => 1,
                    'A2' => 1,
                    'B' => 1,
                    'C' => 1,
                    'D' => 1,
                    'E' => 1,
                    'G1' => 1,
                    'G2' => 1,
                    'G3' => 1,
                    'F1' => 1,
                    'F2' => 1,
                    'F3' => 1,
                ]
            ],
            // ========== SÉRIE E - MATHÉMATIQUES ET TECHNIQUES ==========
            'CM' => [
                'name' => 'Construction Mécanique',
                'coefficients' => [
                    'A1' => 0,
                    'A2' => 0,
                    'B' => 0,
                    'C' => 0,
                    'D' => 0,
                    'E' => 3,
                    'G1' => 0,
                    'G2' => 0,
                    'G3' => 0,
                    'F1' => 0,
                    'F2' => 0,
                    'F3' => 0,
                ]
            ],
            'MANIP' => [
                'name' => 'Manipulation (pratique)',
                'coefficients' => [
                    'A1' => 0,
                    'A2' => 0,
                    'B' => 0,
                    'C' => 0,
                    'D' => 0,
                    'E' => 3,
                    'G1' => 0,
                    'G2' => 0,
                    'G3' => 0,
                    'F1' => 0,
                    'F2' => 0,
                    'F3' => 0,
                ]
            ],
            'EF_TECH' => [
                'name' => 'Étude de Fabrication ou Technologie',
                'coefficients' => [
                    'A1' => 0,
                    'A2' => 0,
                    'B' => 0,
                    'C' => 0,
                    'D' => 0,
                    'E' => 2, // 2 écrit + 2 oral = 4 total
                    'G1' => 0,
                    'G2' => 0,
                    'G3' => 0,
                    'F1' => 0,
                    'F2' => 0,
                    'F3' => 0,
                ]
            ],
            'EF_TECH_ORAL' => [
                'name' => 'Étude de Fabrication ou Technologie (oral)',
                'coefficients' => [
                    'A1' => 0,
                    'A2' => 0,
                    'B' => 0,
                    'C' => 0,
                    'D' => 0,
                    'E' => 2,
                    'G1' => 0,
                    'G2' => 0,
                    'G3' => 0,
                    'F1' => 0,
                    'F2' => 0,
                    'F3' => 0,
                ]
            ],
            // ========== SÉRIES G - TECHNIQUES ADMINISTRATIVES ==========
            'EC' => [
                'name' => 'Étude de Cas',
                'coefficients' => [
                    'A1' => 0,
                    'A2' => 0,
                    'B' => 0,
                    'C' => 0,
                    'D' => 0,
                    'E' => 0,
                    'G1' => 4,
                    'G2' => 6,
                    'G3' => 6,
                    'F1' => 0,
                    'F2' => 0,
                    'F3' => 0,
                ]
            ],
            'CR_RAPPORT' => [
                'name' => 'Compte-rendu / Rapport',
                'coefficients' => [
                    'A1' => 0,
                    'A2' => 0,
                    'B' => 0,
                    'C' => 0,
                    'D' => 0,
                    'E' => 0,
                    'G1' => 3,
                    'G2' => 0,
                    'G3' => 0,
                    'F1' => 0,
                    'F2' => 0,
                    'F3' => 0,
                ]
            ],
            'DAT' => [
                'name' => 'Droit Administratif et du Travail',
                'coefficients' => [
                    'A1' => 0,
                    'A2' => 0,
                    'B' => 0,
                    'C' => 0,
                    'D' => 0,
                    'E' => 0,
                    'G1' => 2,
                    'G2' => 0,
                    'G3' => 0,
                    'F1' => 0,
                    'F2' => 0,
                    'F3' => 0,
                ]
            ],
            'TBS' => [
                'name' => 'Techniques de base de secrétariat (pratique)',
                'coefficients' => [
                    'A1' => 0,
                    'A2' => 0,
                    'B' => 0,
                    'C' => 0,
                    'D' => 0,
                    'E' => 0,
                    'G1' => 3,
                    'G2' => 0,
                    'G3' => 0,
                    'F1' => 0,
                    'F2' => 0,
                    'F3' => 0,
                ]
            ],
            'MATH_APP' => [
                'name' => 'Mathématiques appliquées',
                'coefficients' => [
                    'A1' => 0,
                    'A2' => 0,
                    'B' => 0,
                    'C' => 0,
                    'D' => 0,
                    'E' => 0,
                    'G1' => 0,
                    'G2' => 3,
                    'G3' => 3,
                    'F1' => 0,
                    'F2' => 0,
                    'F3' => 0,
                ]
            ],
            'DROIT_TBAD' => [
                'name' => 'Droit (TBAD-Finances Publiques)',
                'coefficients' => [
                    'A1' => 0,
                    'A2' => 0,
                    'B' => 0,
                    'C' => 0,
                    'D' => 0,
                    'E' => 0,
                    'G1' => 0,
                    'G2' => 2,
                    'G3' => 2,
                    'F1' => 0,
                    'F2' => 0,
                    'F3' => 0,
                ]
            ],
            'GEO_ECO' => [
                'name' => 'Géographie Économique',
                'coefficients' => [
                    'A1' => 0,
                    'A2' => 0,
                    'B' => 0,
                    'C' => 0,
                    'D' => 0,
                    'E' => 0,
                    'G1' => 1,
                    'G2' => 0,
                    'G3' => 0,
                    'F1' => 0,
                    'F2' => 0,
                    'F3' => 0,
                ]
            ],
            // ========== SÉRIES F - TECHNIQUES INDUSTRIE & CONSTRUCTION ==========
            // Note: Les séries F1, F2, F3 ont des coefficients variables selon les épreuves pratiques
            // On utilise des coefficients génériques pour les matières professionnelles
            'PROF_F1' => [
                'name' => 'Matières professionnelles F1 (Construction Mécanique)',
                'coefficients' => [
                    'A1' => 0,
                    'A2' => 0,
                    'B' => 0,
                    'C' => 0,
                    'D' => 0,
                    'E' => 0,
                    'G1' => 0,
                    'G2' => 0,
                    'G3' => 0,
                    'F1' => 22, // Total des épreuves écrites/pratiques
                    'F2' => 0,
                    'F3' => 0,
                ]
            ],
            'ORAL_F1' => [
                'name' => 'Oral professionnel F1',
                'coefficients' => [
                    'A1' => 0,
                    'A2' => 0,
                    'B' => 0,
                    'C' => 0,
                    'D' => 0,
                    'E' => 0,
                    'G1' => 0,
                    'G2' => 0,
                    'G3' => 0,
                    'F1' => 5,
                    'F2' => 0,
                    'F3' => 0,
                ]
            ],
            'PROF_F2' => [
                'name' => 'Matières professionnelles F2 (Électronique)',
                'coefficients' => [
                    'A1' => 0,
                    'A2' => 0,
                    'B' => 0,
                    'C' => 0,
                    'D' => 0,
                    'E' => 0,
                    'G1' => 0,
                    'G2' => 0,
                    'G3' => 0,
                    'F1' => 0,
                    'F2' => 22,
                    'F3' => 0,
                ]
            ],
            'ORAL_F2' => [
                'name' => 'Oral professionnel F2',
                'coefficients' => [
                    'A1' => 0,
                    'A2' => 0,
                    'B' => 0,
                    'C' => 0,
                    'D' => 0,
                    'E' => 0,
                    'G1' => 0,
                    'G2' => 0,
                    'G3' => 0,
                    'F1' => 0,
                    'F2' => 5,
                    'F3' => 0,
                ]
            ],
            'PROF_F3' => [
                'name' => 'Matières professionnelles F3 (Électrotechnique)',
                'coefficients' => [
                    'A1' => 0,
                    'A2' => 0,
                    'B' => 0,
                    'C' => 0,
                    'D' => 0,
                    'E' => 0,
                    'G1' => 0,
                    'G2' => 0,
                    'G3' => 0,
                    'F1' => 0,
                    'F2' => 0,
                    'F3' => 22,
                ]
            ],
            'ORAL_F3' => [
                'name' => 'Oral professionnel F3',
                'coefficients' => [
                    'A1' => 0,
                    'A2' => 0,
                    'B' => 0,
                    'C' => 0,
                    'D' => 0,
                    'E' => 0,
                    'G1' => 0,
                    'G2' => 0,
                    'G3' => 0,
                    'F1' => 0,
                    'F2' => 0,
                    'F3' => 5,
                ]
            ],
        ],
        'filières' => [
            'A1' => 'Lettres-Langues (Lettres Classiques)',
            'A2' => 'Lettres-Sciences Humaines',
            'B' => 'Lettres-Sciences Sociales',
            'C' => 'Sciences et Techniques',
            'D' => 'Biologie-Géologie',
            'E' => 'Mathématiques et Techniques',
            'G1' => 'Techniques Administratives',
            'G2' => 'Techniques Quantitatives de Gestion',
            'G3' => 'Techniques Commerciales',
            'F1' => 'Construction Mécanique',
            'F2' => 'Électronique',
            'F3' => 'Électrotechnique',
        ]
    ],
];
