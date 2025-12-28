<?php
// Database Configuration
$host = "127.0.0.1";
$db_name = "exam_platform";
$username = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $pdo->exec("set names utf8");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $exception) {
    echo json_encode(array("message" => "Connection error: " . $exception->getMessage()));
    exit();
}
?>
