<?php
// PHP/register.php

require_once __DIR__ . '/Functions.php';

if ($_SERVER['REQUEST_METHOD']!=='POST') {
    header('Location: ../html/register.php');
    exit;
}

$email    = $_POST['email']    ?? '';
$password = $_POST['password'] ?? '';
$confirm  = $_POST['confirm']  ?? '';

if (empty($email)||empty($password)||empty($confirm)) {
    header('Location: ../html/register.php?error=' . urlencode('All fields required'));
    exit;
}
if ($password!==$confirm) {
    header('Location: ../html/register.php?error=' . urlencode('Passwords do not match'));
    exit;
}

$res = registerUser($email, $password);
if ($res['success']) {
    header('Location: ../html/login.php?registered=1');
    exit;
} else {
    header('Location: ../html/register.php?error=' . urlencode($res['message']));
    exit;
}
