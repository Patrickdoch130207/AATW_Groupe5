<?php
// api/controllers/schools.php
global $pdo;
$method = $_SERVER['REQUEST_METHOD'];

// Since we are dispatching manually in index.php, we might need to handle ID parsing or URI parsing
$uri_parts = explode('/', trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'));
// /schools or /schools/{id}
$id = (isset($uri_parts[1]) && is_numeric($uri_parts[1])) ? $uri_parts[1] : null;

if ($method === 'DELETE') {
    if ($id) {
        $stmt = $pdo->prepare("DELETE FROM users WHERE role = 'school' AND id = ?");
        $stmt->execute([$id]);
        echo json_encode(["message" => "School deleted"]);
    } else {
        http_response_code(400); echo json_encode(["message" => "ID required"]);
    }
} elseif ($method === 'PUT') {
    // Validate or Update school
    $data = json_decode(file_get_contents("php://input"));
    
    if ($id && (isset($data->status) || isset($data->is_center))) {
        // Update Status
        if (isset($data->status)) {
            if (!in_array($data->status, ['active', 'rejected', 'pending'])) {
                http_response_code(400); echo json_encode(["message" => "Invalid status"]); return;
            }
            $stmt = $pdo->prepare("UPDATE users SET status = ? WHERE id = ? AND role = 'school'");
            $stmt->execute([$data->status, $id]);
        }
        
        // Update Is Center
        if (isset($data->is_center)) {
            $stmt = $pdo->prepare("UPDATE users SET is_center = ? WHERE id = ? AND role = 'school'");
            $stmt->execute([$data->is_center ? 1 : 0, $id]);
        }
        
        echo json_encode(["success" => true, "message" => "School updated"]);
    } else {
        http_response_code(400);
        echo json_encode(["message" => "ID and data required"]);
    }
} elseif ($method === 'GET') {
    // If getting all schools, we might want to filter by status?
    // Let's return all details
    if ($id) {
        $stmt = $pdo->prepare("SELECT id, username, school_name, email, role, status, is_center, created_at FROM users WHERE role = 'school' AND id = ?");
        $stmt->execute([$id]);
        echo json_encode($stmt->fetch());
    } else {
        $status_filter = isset($_GET['status']) ? $_GET['status'] : null;
        if ($status_filter) {
            $stmt = $pdo->prepare("SELECT id, username, school_name, email, role, status, is_center, created_at FROM users WHERE role = 'school' AND status = ? ORDER BY created_at DESC");
            $stmt->execute([$status_filter]);
        } else {
            $stmt = $pdo->query("SELECT id, username, school_name, email, role, status, is_center, created_at FROM users WHERE role = 'school' ORDER BY created_at DESC");
        }
        echo json_encode($stmt->fetchAll());
    }
}
?>
