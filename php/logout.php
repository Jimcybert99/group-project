<?php
// PHP/logout.php
session_start();
$_SESSION = [];
session_destroy();
header('Location: ../html/Login.php?error=' . urlencode('You have been logged out.'));
exit;
