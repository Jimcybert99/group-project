<?php
// PHP/create_db_and_insert.php

$dbHost = 'localhost';
$dbUser = 'root';
$dbPass = '';
$dbName = 'bariatric_app';

try {
    // 1. Connecting to MySQL (without specifying a database)
    $pdo = new PDO(
        "mysql:host=$dbHost;charset=utf8mb4",
        $dbUser,
        $dbPass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    // 2. Creating a database
    $pdo->exec("
        CREATE DATABASE IF NOT EXISTS `$dbName`
        CHARACTER SET utf8mb4
        COLLATE utf8mb4_unicode_ci;
    ");
    echo "✅ Database `$dbName` ready.\n";

    // 3. Switching databases
    $pdo->exec("USE `$dbName`;");

    // 4. Create users table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `users` (
          `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
          `email` VARCHAR(255) NOT NULL UNIQUE,
          `password_hash` VARCHAR(255) NOT NULL,
          `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
    echo "✅ Table `users` ready.\n";

    // 5. Insert test user
    $testEmail    = 'user@example.com';
    $testPassword = 'SecretPass123';
    $passwordHash = password_hash($testPassword, PASSWORD_BCRYPT);

    $stmt = $pdo->prepare("
        INSERT IGNORE INTO `users` (`email`, `password_hash`)
        VALUES (:email, :hash)
    ");
    $stmt->execute([
        ':email' => $testEmail,
        ':hash'  => $passwordHash
    ]);
    echo "✅ Test user inserted.\n";

} catch (PDOException $e) {
    exit("❌ Error: " . $e->getMessage() . "\n");
}
