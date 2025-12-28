<?php
// api/controllers/exam.php
global $pdo;
$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"));
$uri_parts = explode('/', trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'));
$action = end($uri_parts);

if ($method === 'POST') {
    if ($action === 'grade') {
        saveGrade($pdo, $data);
    } elseif ($action === 'generate_tables') {
        generateTableNumbers($pdo, $data);
    } elseif ($action === 'deliberate') {
        deliberateResults($pdo, $data);
    }
} elseif ($method === 'GET') {
    if ($action === 'results') {
        getResults($pdo);
    } elseif ($action === 'convocation') {
        // GET /api/exam/convocation?candidate_id=X
        getConvocation($pdo, $_GET['candidate_id']);
    } elseif ($action === 'transcript') {
        // GET /api/exam/transcript?candidate_id=X
        getTranscript($pdo, $_GET['candidate_id']);
    }
}

function getTranscript($pdo, $candidateId) {
    if (!$candidateId) { http_response_code(400); return; }

    // 1. Candidate Info (Join school and center)
    $stmt = $pdo->prepare("
        SELECT c.*, s.name as session_name, se.name as series_name, 
               u.school_name, center.school_name as center_name
        FROM candidates c
        JOIN exam_sessions s ON c.exam_session_id = s.id
        JOIN series se ON c.series_id = se.id
        JOIN users u ON c.school_user_id = u.id
        LEFT JOIN users center ON c.center_id = center.id
        WHERE c.id = ?
    ");
    $stmt->execute([$candidateId]);
    $candidate = $stmt->fetch();

    if (!$candidate) { http_response_code(404); echo json_encode(["message" => "Candidate not found"]); return; }

    // 2. Grades
    $stmt = $pdo->prepare("
        SELECT s.name as subject_name, s.code, g.score, pc.coefficient
        FROM grades g
        JOIN subjects s ON g.subject_id = s.id
        JOIN program_coefficients pc ON pc.subject_id = s.id AND pc.series_id = ?
        WHERE g.candidate_id = ?
    ");
    $stmt->execute([$candidate['series_id'], $candidateId]);
    $grades = $stmt->fetchAll();

    // 3. Calculate Average & Mentions
    $totalPoints = 0;
    $totalCoef = 0;
    $hasZero = false;

    foreach ($grades as $g) {
        $score = (float)$g['score'];
        if ($score <= 0) $hasZero = true;
        $totalPoints += ($score * $g['coefficient']);
        $totalCoef += $g['coefficient'];
    }
    
    $average = $totalCoef > 0 ? $totalPoints / $totalCoef : 0;

    $mention = "---";
    $status = "---";
    
    if ($hasZero) {
        $status = "REFUSÉ"; // Zero is eliminatory
    } else {
        if ($average >= 10) {
            $status = "ADMIS";
            if ($average >= 19) $mention = "EXCELLENT";
            elseif ($average >= 16) $mention = "TRÈS BIEN";
            elseif ($average >= 14) $mention = "BIEN";
            elseif ($average >= 12) $mention = "ASSEZ BIEN";
            else $mention = "PASSABLE";
        } elseif ($average >= 5) {
            $status = "REFUSÉ";
        } else {
            $status = "AJOURNÉ";
        }
    }

    echo json_encode([
        "candidate" => $candidate,
        "grades" => $grades,
        "average" => number_format($average, 2),
        "status" => $status,
        "mention" => $mention,
        "has_zero" => $hasZero
    ]);
}

function saveGrade($pdo, $data) {
    // data: { candidate_id, subject_id, score }
    $sql = "INSERT INTO grades (candidate_id, subject_id, score) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE score = VALUES(score)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$data->candidate_id, $data->subject_id, $data->score]);
    echo json_encode(["message" => "Grade saved"]);
}

function generateTableNumbers($pdo, $data) {
    // "Génération des numéros de tables"
    // Assign incremental numbers randomly or alphabetically per center?
    // Simplified: Just update active session candidates with a unique number
    $sessionId = $data->session_id;
    
    // Fetch all candidates without table number
    $stmt = $pdo->prepare("SELECT id FROM candidates WHERE exam_session_id = ? ORDER BY last_name, first_name");
    $stmt->execute([$sessionId]);
    $candidates = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    $startNum = 1000;
    $updateStmt = $pdo->prepare("UPDATE candidates SET table_number = ? WHERE id = ?");
    
    $count = 0;
    foreach ($candidates as $cid) {
        $updateStmt->execute([$startNum + $count, $cid]);
        $count++;
    }
    echo json_encode(["message" => "Generated $count table numbers"]);
}

function calculateAverage($pdo, $candidate_id) {
    // Calculate weighted average
    // Get all grades and coefs
    $sql = "
        SELECT g.score, pc.coefficient 
        FROM grades g
        JOIN candidates c ON g.candidate_id = c.id
        JOIN program_coefficients pc ON pc.subject_id = g.subject_id AND pc.series_id = c.series_id
        WHERE c.id = ?
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$candidate_id]);
    $grades = $stmt->fetchAll();
    
    $totalPoints = 0;
    $totalCoef = 0;
    
    foreach ($grades as $g) {
        $totalPoints += ($g['score'] * $g['coefficient']);
        $totalCoef += $g['coefficient'];
    }
    
    return $totalCoef > 0 ? $totalPoints / $totalCoef : 0;
}

function getResults($pdo) {
    // Return list of candidates with their calculated averages
    // "Deliberation des résultats"
    $stmt = $pdo->query("SELECT id, first_name, last_name, series_id FROM candidates");
    $candidates = $stmt->fetchAll();
    
    $results = [];
    foreach ($candidates as $c) {
        $avg = calculateAverage($pdo, $c['id']);
        $results[] = [
            'candidate' => $c,
            'average' => number_format($avg, 2),
            'status' => $avg >= 10 ? 'ADMIS' : 'REFUSE'
        ];
    }
    echo json_encode($results);
}

function getConvocation($pdo, $candidateId) {
    // "Génération des convocations"
    $stmt = $pdo->prepare("
        SELECT c.*, s.name as session_name, s.start_date, se.name as series_name, u.school_name
        FROM candidates c
        JOIN exam_sessions s ON c.exam_session_id = s.id
        JOIN series se ON c.series_id = se.id
        JOIN users u ON c.school_user_id = u.id
        WHERE c.id = ?
    ");
    $stmt->execute([$candidateId]);
    $data = $stmt->fetch();
    
    // In a real app, this would generate a PDF. 
    // Here we return JSON data for the frontend to render a "Print View".
    echo json_encode($data);
}
?>
