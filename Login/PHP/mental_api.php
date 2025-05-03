<?php
session_start();
require_once __DIR__ . '/DatabaseSetUp.php';  // 提供 $pdo
require_once __DIR__ . '/Functions.php';      // 提供 sanitize()

// 登录校验
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status'=>'error','message'=>'Unauthorized']);
    exit;
}

// 1. 确保数据表存在
$pdo->exec("
  CREATE TABLE IF NOT EXISTS `posts` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED NOT NULL,
    `content` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
");
$pdo->exec("
  CREATE TABLE IF NOT EXISTS `mood_entries` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED NOT NULL,
    `mood` VARCHAR(50) NOT NULL,
    `energy` TINYINT NOT NULL,
    `stress` TINYINT NOT NULL,
    `journal` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
");

// 2. 处理 POST 请求
$input = json_decode(file_get_contents('php://input'), true);
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');

    // —— 心情保存
    if (isset($input['mood'])) {
        $mood    = sanitize($input['mood']);
        $energy  = intval($input['energy'] ?? 0);
        $stress  = intval($input['stress'] ?? 0);
        $journal = sanitize($input['journal'] ?? '');
        $stmt = $pdo->prepare("
          INSERT INTO `mood_entries` 
            (`user_id`,`mood`,`energy`,`stress`,`journal`)
          VALUES (?,?,?,?,?)
        ");
        $stmt->execute([$_SESSION['user_id'], $mood, $energy, $stress, $journal]);
        echo json_encode(['status'=>'success']);
        exit;
    }

    // —— 论坛发帖
    if (isset($input['content'])) {
        $content = sanitize($input['content']);
        if ($content === '') {
            echo json_encode(['status'=>'error','message'=>'内容不能为空']);
            exit;
        }
        $stmt = $pdo->prepare("
          INSERT INTO `posts` (`user_id`,`content`) 
          VALUES (?,?)
        ");
        $stmt->execute([$_SESSION['user_id'], $content]);
        echo json_encode(['status'=>'success']);
        exit;
    }

    // 无效请求
    echo json_encode(['status'=>'error','message'=>'Invalid request']);
    exit;
}

// 3. GET 请求：返回所有帖子
header('Content-Type: application/json');
$stmt = $pdo->query("
  SELECT p.id, p.content, p.created_at, u.email AS author
  FROM posts p
  JOIN users u ON p.user_id = u.id
  ORDER BY p.id DESC
");
echo json_encode($stmt->fetchAll());
