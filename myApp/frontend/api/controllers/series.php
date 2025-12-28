<?php
// api/controllers/series.php
global $pdo;
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM series ORDER BY name");
    echo json_encode($stmt->fetchAll());
}
?>
