<?php
// api/controllers/candidats.php
// api/controllers/candidats.php
global $pdo;
$method = $_SERVER['REQUEST_METHOD'];

// Handle both JSON and Multipart/Form-Data
$input_data = json_decode(file_get_contents("php://input"));
if (!$input_data && !empty($_POST)) {
    // If not JSON, try to use $_POST (for FormData/uploads)
    $input_data = (object)$_POST;
}

// Helper to get ID from simple path /candidats/ID
$uri_parts = explode('/', trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'));
$last_part = end($uri_parts);
$id = is_numeric($last_part) ? $last_part : null;

if ($method === 'POST') {
    registerCandidate($pdo, $input_data);
} elseif ($method === 'GET') {
    if ($id) {
        getCandidate($pdo, $id);
    } elseif (isset($_GET['school_id'])) {
        getSchoolCandidates($pdo, $_GET['school_id']);
    } else {
        getAllCandidates($pdo); // Mostly for admin
    }
} elseif ($method === 'DELETE' && $id) {
    deleteCandidate($pdo, $id);
}

function registerCandidate($pdo, $data) {
    // Ensure uploads directory exists
    $upload_dir = __DIR__ . '/../uploads/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    // Validate required fields
    if (!isset($data->school_user_id) || !isset($data->series_id) || !isset($data->first_name)) {
        http_response_code(400); echo json_encode(["message" => "Missing required fields"]); return;
    }

    // Handle File Upload
    $photo_url = isset($data->photo_url) ? $data->photo_url : null;
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
        $file_tmp = $_FILES['photo']['tmp_name'];
        $file_name = time() . '_' . basename($_FILES['photo']['name']);
        $target_file = $upload_dir . $file_name;
        
        if (move_uploaded_file($file_tmp, $target_file)) {
            $photo_url = 'api/uploads/' . $file_name;
        }
    }

    // Get active exam session
    $sessionStmt = $pdo->query("SELECT id FROM exam_sessions WHERE status = 'open' LIMIT 1");
    $session = $sessionStmt->fetch();
    if (!$session) {
        http_response_code(400); echo json_encode(["message" => "No active exam session"]); return;
    }
    $session_id = $session['id'];

    // 0. Get School Info (City/Dept) to assign center
    $schoolStmt = $pdo->prepare("SELECT city, department FROM users WHERE id = ?");
    $schoolStmt->execute([$data->school_user_id]);
    $schoolInfo = $schoolStmt->fetch();

    // 1. Assign Center
    $centerId = null;
    if ($schoolInfo) {
        $centerStmt = $pdo->prepare("SELECT id FROM users WHERE role = 'school' AND is_center = 1 AND city = ? LIMIT 1");
        $centerStmt->execute([$schoolInfo['city']]);
        $center = $centerStmt->fetch();
        
        if (!$center && $schoolInfo['department']) {
             $centerStmt = $pdo->prepare("SELECT id FROM users WHERE role = 'school' AND is_center = 1 AND department = ? LIMIT 1");
             $centerStmt->execute([$schoolInfo['department']]);
             $center = $centerStmt->fetch();
        }
        
        if ($center) { $centerId = $center['id']; }
    }

    // 2. Generate Credentials
    $password = substr(bin2hex(random_bytes(4)), 0, 8);
    $maxStmt = $pdo->query("SELECT MAX(table_number) FROM candidates WHERE exam_session_id = $session_id");
    $maxNum = $maxStmt->fetchColumn();
    $tableNumber = $maxNum ? $maxNum + 1 : 1000;
    $matricule = date("Y") . strtoupper(substr(uniqid(), -5));

    $sql = "INSERT INTO candidates (school_user_id, exam_session_id, series_id, first_name, last_name, dob, pob, gender, matricule, password, table_number, center_id, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    try {
        $stmt->execute([
            $data->school_user_id,
            $session_id,
            $data->series_id,
            $data->first_name,
            $data->last_name,
            $data->dob,
            $data->pob,
            $data->gender,
            $matricule,
            $password,
            $tableNumber,
            $centerId,
            $photo_url
        ]);
        echo json_encode(["message" => "Candidate registered", "matricule" => $matricule, "table_number" => $tableNumber, "center_assigned" => (bool)$centerId]);
    } catch (Exception $e) {
        http_response_code(500); echo json_encode(["message" => $e->getMessage()]);
    }
}

function getSchoolCandidates($pdo, $schoolId) {
    $stmt = $pdo->prepare("SELECT c.*, s.name as series_name FROM candidates c JOIN series s ON c.series_id = s.id WHERE c.school_user_id = ?");
    $stmt->execute([$schoolId]);
    echo json_encode($stmt->fetchAll());
}

function getAllCandidates($pdo) {
    $stmt = $pdo->query("SELECT c.*, u.school_name, s.name as series_name FROM candidates c JOIN users u ON c.school_user_id = u.id JOIN series s ON c.series_id = s.id LIMIT 100");
    echo json_encode($stmt->fetchAll());
}

function getCandidate($pdo, $id) {
    $stmt = $pdo->prepare("SELECT * FROM candidates WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode($stmt->fetch());
}

function deleteCandidate($pdo, $id) {
    $stmt = $pdo->prepare("DELETE FROM candidates WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(["message" => "Candidate deleted"]);
}
?>
