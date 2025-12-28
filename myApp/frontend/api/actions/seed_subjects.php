<?php
// api/actions/seed_subjects.php
require __DIR__ . '/../config/db.php';

// 1. Define Subjects
$subjects = [
    ['name' => 'Français', 'code' => 'FR'],
    ['name' => 'Philosophie', 'code' => 'PHI'],
    ['name' => 'Mathématiques', 'code' => 'MATH'],
    ['name' => 'Sciences Physiques', 'code' => 'PCT'],
    ['name' => 'Sciences de la Vie et de la Terre', 'code' => 'SVT'],
    ['name' => 'Anglais', 'code' => 'ANG'],
    ['name' => 'Histoire-Géographie', 'code' => 'HG'],
    ['name' => 'Allemand', 'code' => 'ALL'],
    ['name' => 'Espagnol', 'code' => 'ESP'],
    ['name' => 'Economie', 'code' => 'ECO']
];

try {
    $stm = $pdo->prepare("INSERT IGNORE INTO subjects (name, code) VALUES (?, ?)");
    foreach ($subjects as $sub) {
        $stm->execute([$sub['name'], $sub['code']]);
    }
    echo "Subjects seeded.\n";
} catch (Exception $e) { echo "Error seeding subjects: " . $e->getMessage() . "\n"; }

// 2. Clear existing coeffs to avoid dupes/mess
//$pdo->exec("TRUNCATE TABLE program_coefficients"); // Risky if live, but OK here.

// 3. Define Coefficients (Approximate for Benin BAC)
// Structure: Series Code => [Subject Code => Coeff]
$structure = [
    'A1' => ['FR' => 4, 'PHI' => 4, 'HG' => 4, 'ANG' => 3, 'MATH' => 1, 'ALL' => 3], // Lettres Classiques
    'A2' => ['FR' => 3, 'PHI' => 2, 'HG' => 4, 'ANG' => 3, 'MATH' => 1, 'ESP' => 3], // Lettres Modernes
    'B'  => ['ECO' => 5, 'MATH' => 3, 'HG' => 4, 'FR' => 2, 'PHI' => 2, 'ANG' => 2], // SES
    'C'  => ['MATH' => 6, 'PCT' => 5, 'FR' => 2, 'PHI' => 2, 'HG' => 2, 'ANG' => 2], // Maths
    'D'  => ['SVT' => 5, 'PCT' => 4, 'MATH' => 4, 'FR' => 2, 'PHI' => 2, 'HG' => 2, 'ANG' => 2], // Bio
    'E'  => ['MATH' => 5, 'PCT' => 5, 'FR' => 2, 'PHI' => 2], // Maths/Technique (Simplified)
];

// Helper to get ID
function getId($pdo, $table, $code) {
    if (!$code) return null;
    $stmt = $pdo->prepare("SELECT id FROM $table WHERE code = ?");
    $stmt->execute([$code]);
    return $stmt->fetchColumn();
}

foreach ($structure as $seriesCode => $coeffs) {
    $seriesId = getId($pdo, 'series', $seriesCode);
    if (!$seriesId) { echo "Series $seriesCode not found.\n"; continue; }
    
    foreach ($coeffs as $subjectCode => $coeff) {
        $subjectId = getId($pdo, 'subjects', $subjectCode);
        if (!$subjectId) { echo "Subject $subjectCode not found.\n"; continue; }
        
        // Insert or Update
        $sql = "INSERT INTO program_coefficients (series_id, subject_id, coefficient) VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE coefficient = VALUES(coefficient)";
        $pdo->prepare($sql)->execute([$seriesId, $subjectId, $coeff]);
    }
    echo "Coefficients for $seriesCode updated.\n";
}
?>
