<?php
session_start();
// 未登录跳转到登录页（同目录下）
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Bariatric Forum</title>
  <!-- 引到上级的 css 文件夹 -->
  <link rel="stylesheet" href="../css/Forums.css">
</head>
<body>
  <div class="title-bar">
    <h1>Forum</h1>
    <div class="current-date" id="current-date"></div>
    <!-- 注销跳到 php 文件夹 -->
    <a href="../php/logout.php" style="position:absolute; top:20px; right:20px; color:#fff;">Logout</a>
    <a href="./homepage.html" style="position:absolute; top:50px; right:20px; color:#fff;">&larr; Home</a><!--home button--> 
  </div>

  <div class="nav-bar">
    <ul class="nav-links">
      <li class="active" data-section="message-board"><a href="#">Message Board</a></li>
      <li data-section="history"><a href="#">My History</a></li>
      <li data-section="ask-experts"><a href="#">Ask Experts</a></li>
    </ul>
  </div>

  <section id="message-board" class="content-section active-section">
    <h2>Community Message Board</h2>
    <div class="messages-container"></div>
    <div class="message-form">
      <h3>Post a Message</h3>
      <textarea id="content" placeholder="Share your thoughts with the community..."></textarea>
      <button class="submit-btn" id="postBtn">Post Message</button>
    </div>
  </section>

  <!-- history 和 ask-experts 保持原样 -->
  <section id="history" class="content-section"> … </section>
  <section id="ask-experts" class="content-section"> … </section>
  <div class="modal" id="detailModal"> … </div>

  <script>
    // 显示当前日期
    const options = { weekday:'long', year:'numeric', month:'long', day:'numeric' };
    document.getElementById('current-date')
            .textContent = new Date().toLocaleDateString('en-US', options);

    // 导航切换
    document.querySelectorAll('.nav-links li').forEach(item=>{
      item.addEventListener('click', function(){
        document.querySelectorAll('.nav-links li')
                .forEach(n=>n.classList.remove('active'));
        this.classList.add('active');
        document.querySelectorAll('.content-section')
                .forEach(s=>s.classList.remove('active-section'));
        document.getElementById(this.dataset.section)
                .classList.add('active-section');
      });
    });

    // 指向 php 文件夹下的 API
    const API = '../php/forums_api.php';

    // 拉取并渲染帖子
    async function loadMessages(){
      const res = await fetch(API);
      if (!res.ok) {
        if (res.status === 401) return window.location='login.php';
        throw new Error('Failed to load');
      }
      const posts = await res.json();
      const container = document.querySelector('.messages-container');
      container.innerHTML = '';
      posts.forEach(p=>{
        const div = document.createElement('div');
        div.className = 'message';
        div.innerHTML = `
          <div class="message-header">
            <span>${p.author}</span>
            <span>${new Date(p.created_at).toLocaleDateString('en-US')}</span>
          </div>
          <p>${p.content}</p>
        `;
        container.appendChild(div);
      });
    }

    // 发布新帖
    document.getElementById('postBtn').addEventListener('click', async ()=>{
      const content = document.getElementById('content').value.trim();
      if (!content) return alert('内容不能为空');
      const res = await fetch(API, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ content })
      });
      const result = await res.json();
      if (result.status === 'success') {
        document.getElementById('content').value = '';
        loadMessages();
      } else {
        alert('发布失败：' + result.message);
      }
    });

    // 初始化加载
    loadMessages();
  </script>
</body>
</html>
