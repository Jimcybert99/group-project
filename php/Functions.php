<?php
// PHP/Functions.php

require_once __DIR__ . '/DatabaseSetUp.php';

/**
 * 清理输入
 */
function sanitize(string $str): string {
    return htmlspecialchars(strip_tags(trim($str)), ENT_QUOTES, 'UTF-8');
}

/**
 * User Registration
 */
function registerUser(string $email, string $password): array {
    global $pdo;
    $email = sanitize($email);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return ['success'=>false, 'message'=>'Invalid email.'];
    }
    // Check if it already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email=?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        return ['success'=>false, 'message'=>'Email already registered.'];
    }
    $hash = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("INSERT INTO users(email,password_hash) VALUES(?,?)");
    $stmt->execute([$email,$hash]);
    return ['success'=>true, 'message'=>'Registration successful.'];
}

/**
 * user login
 */
function loginUser(string $email, string $password): array {
    global $pdo;
    $email = sanitize($email);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return ['success'=>false, 'message'=>'Invalid email.'];
    }
    $stmt = $pdo->prepare("SELECT id,password_hash FROM users WHERE email=?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    if (!$user) {
        return ['success'=>false, 'message'=>'Email not found.'];
    }
    if (!password_verify($password, $user['password_hash'])) {
        return ['success'=>false, 'message'=>'Wrong password.'];
    }
    return ['success'=>true, 'message'=>'Login successful.', 'user_id'=>$user['id']];
}
