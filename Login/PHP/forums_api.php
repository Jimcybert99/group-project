<?php
// forums_api.php
session_start();
require_once __DIR__ . '/DatabaseSetUp.php';  // 提供 $pdo 连接:contentReference[oaicite:8]{index=8}
require_once __DIR__ . '/Functions.php';      // 提供 sanitize() 等工具:contentReference[oaicite:10]{index=10}

// 登录校验
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status'=>'error','message'=>'Unauthorized']);
    exit;
}

// 确保 posts 表存在，并关联到 users 表
$pdo->exec("
  CREATE TABLE IF NOT EXISTS `posts` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED NOT NULL,
    `content` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
");

// 插入新帖
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');
    $input   = json_decode(file_get_contents('php://input'), true);
    $content = sanitize($input['content'] ?? '');
    if ($content === '') {
        echo json_encode(['status'=>'error','message'=>'内容不能为空']);
        exit;
    }
    $stmt = $pdo->prepare("INSERT INTO `posts` (`user_id`,`content`) VALUES (?,?)");
    $stmt->execute([$_SESSION['user_id'], $content]);
    echo json_encode(['status'=>'success']);
    exit;
}

// 获取所有帖子
header('Content-Type: application/json');
$stmt = $pdo->query("
    SELECT p.id, p.content, p.created_at, u.email AS author
    FROM posts p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.id DESC
");
echo json_encode($stmt->fetchAll());
