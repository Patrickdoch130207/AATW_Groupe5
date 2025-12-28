<?php
// entry point for the API
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Robust Router
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$resource = null;
$valid_resources = ['auth', 'schools', 'admin', 'candidats', 'exam', 'series', 'grades'];

foreach ($valid_resources as $r) {
    // Check if the resource name exists in the URI segments
    // We look for "/resource" match
    if (preg_match("/\/$r(\/|$)/", $request_uri)) {
        $resource = $r;
        break;
    }
}

// Fallback for root or invalid
if (!$resource) {
    // maybe show nice message or 404
    // If it's just "/"
    if ($request_uri === '/' || $request_uri === '/api/' || $request_uri === '/api') {
        echo json_encode(["message" => "API is running"]);
        exit;
    }
}

require "config/db.php";

// Simple routing switch
switch ($resource) {
    case 'auth':
        require "controllers/auth.php";
        break;
    case 'schools':
        require "controllers/schools.php";
        break;
    case 'admin':
        require "controllers/admin.php";
        break;
    case 'candidats':
        require "controllers/candidats.php";
        break;
    case 'exam':
        require "controllers/exam.php";
        break;
    case 'series':
        require "controllers/series.php";
        break;
    case 'grades':
        require "controllers/grades.php";
        break;
    default:
        http_response_code(404);
        echo json_encode(array("message" => "Resource not found."));
        break;
}
?>
