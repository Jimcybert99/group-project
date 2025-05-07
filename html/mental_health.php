<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mayo Clinic - Emotional Health Tracker</title>
  <link rel="stylesheet" href="../css/MentalHealthDashboard.css">
</head>
<body>
  
  <header>
    <h1>Mental & Emotional Health Tracker</h1>
    <a href="../php/logout.php">Logout</a>
    <a href="./homepage.html" style="position:absolute; top:60px; right:20px; color:#fff;">&larr; Home</a><!--home button--> 
  </header>

  
  <div class="container">
    <div class="date-display">
      Today is <span id="current-date"></span>
    </div>
    
    <div class="mood-tracker">
      <h2>How are you feeling today?</h2>
      <div class="mood-options">
        <div class="mood-option selected"><div class="mood-icon">😊</div><div>Happy</div></div>
        <div class="mood-option"><div class="mood-icon">😐</div><div>Neutral</div></div>
        <div class="mood-option"><div class="mood-icon">😔</div><div>Sad</div></div>
        <div class="mood-option"><div class="mood-icon">😠</div><div>Angry</div></div>
        <div class="mood-option"><div class="mood-icon">😰</div><div>Anxious</div></div>
      </div>
      
      <div class="slider-container">
        <div class="slider-label"><span>Energy Level</span><span id="energy-value">5</span>/10</div>
        <input type="range" min="1" max="10" value="5" class="slider" id="energy-slider">
      </div>
      
      <div class="slider-container">
        <div class="slider-label"><span>Stress Level</span><span id="stress-value">3</span>/10</div>
        <input type="range" min="1" max="10" value="3" class="slider" id="stress-slider">
      </div>
      
      <h3>Journal Entry (Optional)</h3>
      <textarea id="journal" placeholder="Write about your thoughts, feelings, or anything you'd like to share..."></textarea>
      
      <button class="btn" id="save-entry-btn">Save Today's Entry</button>
    </div>
    
    <div class="tips-section">
      <h3>Personalized Tips Based on Your Mood</h3>
      <div id="tips-content"></div>
    </div>
    
    <!-- 社区留言板（保持之前那块不变） -->
    <div class="mood-tracker">
      <h2>Community Message Board</h2>
      <div class="messages-container"></div>
      <div class="message-form">
        <textarea id="forum-content" placeholder="Share your thoughts with the community..."></textarea>
        <button class="btn" id="forum-post-btn">Post Message</button>
      </div>
    </div>
  </div>
  
  <footer>&copy; 2025 Mayo Clinic. All rights reserved.</footer>

  <script>
    // --- 显示当前日期 ---
    const options = { weekday:'long', year:'numeric', month:'long', day:'numeric' };
    document.getElementById('current-date')
            .textContent = new Date().toLocaleDateString('en-US', options);

    // --- 情绪追踪交互 ---
    const moodOptions = document.querySelectorAll('.mood-option');
    const energySlider = document.getElementById('energy-slider');
    const stressSlider = document.getElementById('stress-slider');
    const energyValue  = document.getElementById('energy-value');
    const stressValue  = document.getElementById('stress-value');
    const tipsContent  = document.getElementById('tips-content');
    
    moodOptions.forEach(opt => opt.addEventListener('click', () => {
      moodOptions.forEach(o=>o.classList.remove('selected'));
      opt.classList.add('selected');
      updateTips();
    }));
    energySlider.addEventListener('input', ()=>{
      energyValue.textContent = energySlider.value;
      updateTips();
    });
    stressSlider.addEventListener('input', ()=>{
      stressValue.textContent = stressSlider.value;
      updateTips();
    });
    function updateTips() {
      const mood   = document.querySelector('.mood-option.selected div:nth-child(2)').textContent;
      const energy = energySlider.value;
      tipsContent.innerHTML = `<p>Since you're feeling <strong>${mood}</strong> with energy level <strong>${energy}</strong>, consider doing something uplifting!</p>`;
    }
    updateTips();

    // 后端统一接口
    const API = '../php/mental_api.php';

    // === 保存心情条目 ===
    document.getElementById('save-entry-btn').addEventListener('click', async () => {
      const mood    = document.querySelector('.mood-option.selected div:nth-child(2)').textContent;
      const energy  = energySlider.value;
      const stress  = stressSlider.value;
      const journal = document.getElementById('journal').value.trim();

      const res = await fetch(API, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ mood, energy, stress, journal })
      });
      const result = await res.json();
      if (result.status === 'success') {
        alert('Mood entry saved!');
      } else {
        alert('保存失败：' + result.message);
      }
    });

    // === 加载 & 发布论坛贴子 ===
    async function loadMessages() {
      const res = await fetch(API);
      if (res.status === 401) return window.location = 'login.php';
      const posts = await res.json();
      const container = document.querySelector('.messages-container');
      container.innerHTML = '';
      posts.forEach(p => {
        const div = document.createElement('div');
        div.className = 'message';
        div.innerHTML = `
          <div class="message-header">
            <strong>${p.author}</strong>
            <span>${new Date(p.created_at).toLocaleDateString('en-US')}</span>
          </div>
          <p>${p.content}</p>
        `;
        container.appendChild(div);
      });
    }
    document.getElementById('forum-post-btn').addEventListener('click', async () => {
      const content = document.getElementById('forum-content').value.trim();
      if (!content) return alert('内容不能为空');
      const res = await fetch(API, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ content })
      });
      const result = await res.json();
      if (result.status === 'success') {
        document.getElementById('forum-content').value = '';
        loadMessages();
      } else {
        alert('发布失败：' + result.message);
      }
    });
    loadMessages();
  </script>
</body>
</html>

