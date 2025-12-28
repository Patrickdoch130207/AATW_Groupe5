<?php
// api/actions/add_admin.php
require __DIR__ . '/../config/db.php';

// Usage: php add_admin.php [username] [email] [password]
// Example: php add_admin.php superadmin admin@exam.com securepass

$username = $argv[1] ?? 'admin';
$email = $argv[2] ?? 'admin@exam.com';
$password = $argv[3] ?? 'admin123';

try {
    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password, role, status) VALUES (?, ?, ?, 'admin', 'active')");
    $stmt->execute([$username, $email, $hash]);
    echo "Admin user created successfully:\nUsername: $username\nEmail: $email\nPassword: $password\n";
} catch (PDOException $e) {
    echo "Error creating admin: " . $e->getMessage() . "\n";
}
?>
