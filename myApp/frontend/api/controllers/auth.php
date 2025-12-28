<?php
// api/controllers/auth.php
global $pdo;
$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"));

if ($method === 'POST') {
    $path = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';
    // Determine action based on URI or query param if simpler router wasn't capturing it perfectly
    // but index.php logic suggests handling via $uri[2] which was passed as $action variable if I included it?
    // Let's rely on index.php to set global context or just check the URL segment here?
    // Actually index.php doesn't pass variables to the included file scope easily unless global.
    // Let's re-parse or assume specific endpoints.
    
    // Better logic: The index.php likely dispatched here.
    // We can check the URL content again or rely on a standard dispatch method.
    // Let's assume the router in index.php works and we just need to identify "login" vs "register".
    
    $uri_parts = explode('/', trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'));
    // uri_parts[0] might be 'auth' or 'api' depending on server root.
    // Let's look for the last segment.
    $endpoint = end($uri_parts);

    if ($endpoint === 'login') {
        login($pdo, $data);
    } elseif ($endpoint === 'login-candidate') {
        loginCandidate($pdo, $data);
    } elseif ($endpoint === 'register') {
        registerSchool($pdo, $data);
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Auth endpoint not found"]);
    }
}

function loginCandidate($pdo, $data) {
    if (!isset($data->matricule) || !isset($data->password)) {
        http_response_code(400); echo json_encode(["message" => "Matricule et mot de passe requis"]); return;
    }
    
    // Check credentials in candidates table
    // Note: Password is stored in plaintext currently as per previous steps
    $stmt = $pdo->prepare("SELECT * FROM candidates WHERE matricule = ? AND password = ?");
    $stmt->execute([$data->matricule, $data->password]);
    $student = $stmt->fetch();
    
    if ($student) {
        unset($student['password']);
        // Normalize role for frontend
        $student['role'] = 'etudiant'; 
        
        echo json_encode([
            "success" => true,
            "message" => "Connexion réussie",
            "user" => $student
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Matricule ou mot de passe incorrect"]);
    }
}

function login($pdo, $data) {
    if ((!isset($data->username) && !isset($data->email)) || !isset($data->password)) {
        http_response_code(400);
        echo json_encode(["message" => "Missing credentials"]);
        return;
    }

    $identifier = isset($data->email) ? $data->email : $data->username;

    // Allow login by username or email
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = :identifier OR email = :identifier LIMIT 1");
    $stmt->execute(['identifier' => $identifier]);
    $user = $stmt->fetch();

    if ($user && password_verify($data->password, $user['password'])) {
        // Check if school is validated
        if ($user['role'] === 'school' && $user['status'] !== 'active') {
            http_response_code(403);
            echo json_encode(["success" => false, "message" => "Account not yet activated by admin."]);
            return;
        }

        unset($user['password']); // Don't send password back
        echo json_encode([
            "success" => true,
            "message" => "Login successful",
            "user" => $user
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Invalid credentials"]);
    }
}

function registerSchool($pdo, $data) {
    // "Inscription des écoles en ligne"
    if (!isset($data->username) || !isset($data->password) || !isset($data->school_name) || !isset($data->email)) {
        http_response_code(400);
        echo json_encode(["message" => "Missing data (username, password, school_name, email)"]);
        return;
    }

    try {
        // Default status is 'pending'
        $stmt = $pdo->prepare("INSERT INTO users (username, password, role, school_name, email, status, director_name, decree_number, department, city, address) VALUES (:username, :password, 'school', :school_name, :email, 'pending', :director_name, :decree_number, :department, :city, :address)");
        $stmt->execute([
            'username' => $data->username,
            'password' => password_hash($data->password, PASSWORD_DEFAULT),
            'school_name' => $data->school_name,
            'email' => $data->email,
            'director_name' => isset($data->director_name) ? $data->director_name : null,
            'decree_number' => isset($data->decree_number) ? $data->decree_number : null,
            'department' => isset($data->department) ? $data->department : null,
            'city' => isset($data->city) ? $data->city : null,
            'address' => isset($data->address) ? $data->address : null
        ]);
        
        http_response_code(201);
        echo json_encode(["success" => true, "message" => "School registered successfully. Please wait for admin validation."]);
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) { // Integrity constraint violation
            http_response_code(409);
            echo json_encode(["message" => "Username or Email already exists"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Error: " . $e->getMessage()]);
        }
    }
}
?>
