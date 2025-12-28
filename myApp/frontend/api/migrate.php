<?php
require "config/db.php";

try {
    $pdo->exec("ALTER TABLE users ADD COLUMN is_center TINYINT(1) DEFAULT 0 AFTER status");
    echo "Column is_center added successfully\n";
} catch (Exception $e) {
    if (strpos($e->getMessage(), "Duplicate column name") !== false) {
        echo "Column is_center already exists\n";
    } else {
        echo "Error: " . $e->getMessage() . "\n";
    }
}
?>
