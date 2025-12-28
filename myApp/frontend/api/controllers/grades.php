<?php
// api/controllers/grades.php
global $pdo;
$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"));

// Helper to get ID from simple path /grades/ID or just query params
// We will primarily use query params or POST body
// GET /grades?candidate_id=X
// POST /grades (save list of grades for a candidate)

if ($method === 'GET') {
    if (isset($_GET['candidate_id'])) {
        getGrades($pdo, $_GET['candidate_id']);
    } else {
        http_response_code(400); echo json_encode(["message" => "Candidate ID required"]);
    }
} elseif ($method === 'POST') {
    saveGrades($pdo, $data);
}

function getGrades($pdo, $candidateId) {
    // 1. Get Candidate Series
    $stmt = $pdo->prepare("SELECT series_id FROM candidates WHERE id = ?");
    $stmt->execute([$candidateId]);
    $seriesId = $stmt->fetchColumn();

    if (!$seriesId) {
        http_response_code(404); echo json_encode(["message" => "Candidate not found"]); return;
    }

    // 2. Get Subjects for this Series with Coefficients
    $sql = "SELECT s.id as subject_id, s.name, s.code, pc.coefficient 
            FROM program_coefficients pc 
            JOIN subjects s ON pc.subject_id = s.id 
            WHERE pc.series_id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$seriesId]);
    $subjects = $stmt->fetchAll();

    // 3. Get Existing Grades
    $gradeStmt = $pdo->prepare("SELECT subject_id, score FROM grades WHERE candidate_id = ?");
    $gradeStmt->execute([$candidateId]);
    $existingGrades = $gradeStmt->fetchAll(PDO::FETCH_KEY_PAIR); // [subject_id => score]

    // 4. Merge
    $result = [];
    foreach ($subjects as $sub) {
        $result[] = [
            'subject_id' => $sub['subject_id'],
            'name' => $sub['name'],
            'code' => $sub['code'],
            'coefficient' => $sub['coefficient'],
            'score' => isset($existingGrades[$sub['subject_id']]) ? $existingGrades[$sub['subject_id']] : null
        ];
    }

    echo json_encode($result);
}

function saveGrades($pdo, $data) {
    // Expected: { candidate_id: INT, grades: [ { subject_id: INT, score: FLOAT }, ... ] }
    if (!isset($data->candidate_id) || !isset($data->grades)) {
        http_response_code(400); echo json_encode(["message" => "Invalid data"]); return;
    }

    try {
        $pdo->beginTransaction();
        
        $stmt = $pdo->prepare("INSERT INTO grades (candidate_id, subject_id, score) VALUES (?, ?, ?) 
                               ON DUPLICATE KEY UPDATE score = VALUES(score)");
                               
        foreach ($data->grades as $grade) {
            if ($grade->score !== null && $grade->score !== '') {
                 $stmt->execute([$data->candidate_id, $grade->subject_id, $grade->score]);
            }
        }
        
        $pdo->commit();
        echo json_encode(["success" => true, "message" => "Grades saved"]);
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500); echo json_encode(["message" => $e->getMessage()]);
    }
}
?>
