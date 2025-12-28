<?php
// api/controllers/admin.php
global $pdo;
$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"));
$uri_parts = explode('/', trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'));
$endpoint = end($uri_parts);

// Admin sub-routes
if ($method === 'POST') {
    if ($endpoint === 'session') {
        createExamSession($pdo, $data);
    } elseif ($endpoint === 'subject') {
        createSubject($pdo, $data);
    } elseif ($endpoint === 'series') {
        createSeries($pdo, $data);
    } elseif ($endpoint === 'coefficient') {
        setCoefficient($pdo, $data);
    }
} elseif ($method === 'PUT') {
    if ($endpoint === 'session') {
        updateExamSession($pdo, $data);
    }
} elseif ($method === 'GET') {
    if ($endpoint === 'sessions') {
        getExamSessions($pdo);
    } elseif ($endpoint === 'subjects') {
        getSubjects($pdo);
    } elseif ($endpoint === 'series') {
        getSeries($pdo);
    } elseif ($endpoint === 'dashboard_stats') {
        getDashboardStats($pdo);
    } elseif ($endpoint === 'coefficients') {
        getCoefficients($pdo);
    }
}

function createExamSession($pdo, $data) {
    if (!isset($data->name) || !isset($data->start_date) || !isset($data->end_date)) {
        http_response_code(400); echo json_encode(["message" => "Missing data"]); return;
    }
    $stmt = $pdo->prepare("INSERT INTO exam_sessions (name, start_date, end_date, status) VALUES (?, ?, ?, 'open')");
    if ($stmt->execute([$data->name, $data->start_date, $data->end_date])) {
        echo json_encode(["message" => "Exam session created", "id" => $pdo->lastInsertId()]);
    } else {
        http_response_code(500); echo json_encode(["message" => "Error"]);
    }
}

function updateExamSession($pdo, $data) {
    if (!isset($data->id)) {
        http_response_code(400); echo json_encode(["message" => "ID required"]); return;
    }
    
    $fields = [];
    $params = [];
    
    if (isset($data->name)) { $fields[] = "name = ?"; $params[] = $data->name; }
    if (isset($data->start_date)) { $fields[] = "start_date = ?"; $params[] = $data->start_date; }
    if (isset($data->end_date)) { $fields[] = "end_date = ?"; $params[] = $data->end_date; }
    if (isset($data->status)) { $fields[] = "status = ?"; $params[] = $data->status; }
    
    if (empty($fields)) {
        http_response_code(400); echo json_encode(["message" => "Nothing to update"]); return;
    }
    
    $params[] = $data->id;
    $sql = "UPDATE exam_sessions SET " . implode(", ", $fields) . " WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    
    if ($stmt->execute($params)) {
        echo json_encode(["message" => "Exam session updated"]);
    } else {
        http_response_code(500); echo json_encode(["message" => "Error"]);
    }
}

function getExamSessions($pdo) {
    $stmt = $pdo->query("SELECT s.*, (SELECT COUNT(*) FROM candidates WHERE exam_session_id = s.id) as candidates_count FROM exam_sessions s ORDER BY start_date DESC");
    echo json_encode($stmt->fetchAll());
}

function createSubject($pdo, $data) {
    $stmt = $pdo->prepare("INSERT INTO subjects (name, code) VALUES (?, ?)");
    if ($stmt->execute([$data->name, $data->code])) {
        echo json_encode(["message" => "Subject created"]);
    }
}

function getSubjects($pdo) {
    $stmt = $pdo->query("SELECT * FROM subjects");
    echo json_encode($stmt->fetchAll());
}

function createSeries($pdo, $data) {
    $stmt = $pdo->prepare("INSERT INTO series (name, code) VALUES (?, ?)");
    if ($stmt->execute([$data->name, $data->code])) {
        echo json_encode(["message" => "Series created"]);
    }
}

function getSeries($pdo) {
    $stmt = $pdo->query("SELECT * FROM series");
    echo json_encode($stmt->fetchAll());
}

function setCoefficient($pdo, $data) {
    // Upsert coefficient
    // Check if exists
    $stmt = $pdo->prepare("SELECT id FROM program_coefficients WHERE series_id = ? AND subject_id = ?");
    $stmt->execute([$data->series_id, $data->subject_id]);
    if ($stmt->fetch()) {
        $stmt = $pdo->prepare("UPDATE program_coefficients SET coefficient = ? WHERE series_id = ? AND subject_id = ?");
        $stmt->execute([$data->coefficient, $data->series_id, $data->subject_id]);
    } else {
        $stmt = $pdo->prepare("INSERT INTO program_coefficients (series_id, subject_id, coefficient) VALUES (?, ?, ?)");
        $stmt->execute([$data->series_id, $data->subject_id, $data->coefficient]);
    }
    echo json_encode(["message" => "Coefficient updated"]);
}

function getDashboardStats($pdo) {
    $stats = [];
    $stats['schools_count'] = $pdo->query("SELECT COUNT(*) FROM users WHERE role='school' AND status='active'")->fetchColumn();
    $stats['candidates_count'] = $pdo->query("SELECT COUNT(*) FROM candidates")->fetchColumn();
    $stats['active_session_count'] = $pdo->query("SELECT COUNT(*) FROM exam_sessions WHERE status='open'")->fetchColumn();
    $stats['active_session_name'] = $pdo->query("SELECT name FROM exam_sessions WHERE status='open' LIMIT 1")->fetchColumn();
    echo json_encode($stats);
}

function getCoefficients($pdo) {
    // Return all coefficients with series and subject info
    $stmt = $pdo->query("
        SELECT pc.id, pc.series_id, pc.subject_id, pc.coefficient,
               s.name as series_name, sub.name as subject_name
        FROM program_coefficients pc
        JOIN series s ON pc.series_id = s.id
        JOIN subjects sub ON pc.subject_id = sub.id
    ");
    echo json_encode($stmt->fetchAll());
}
?>
