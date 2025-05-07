<?php
// PHP/login_check.php

require_once __DIR__ . '/Functions.php';

session_start();


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../html/Login.php');
    exit;
}

$email    = $_POST['email']    ?? '';
$password = $_POST['password'] ?? '';

if (empty($email) || empty($password)) {
    header('Location: ../html/Login.php?error=' . urlencode('Enter both fields'));
    exit;
}

$res = loginUser($email, $password);
if ($res['success']) {
    // Successful login, save user ID (and email) to session
    $_SESSION['user_id']    = $res['user_id'];
    $_SESSION['user_email'] = $email;

    header('Location: ../html/diet.php');
    exit;
} else {
    header('Location: ../html/Login.php?error=' . urlencode($res['message']));
    exit;
}
