<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Login – Bariatric App</title>
  <link rel="stylesheet" href="../css/Login.css">
</head>
<body>
  <div class="container">
    <h2>Sign In</h2>

    <?php if(isset($_GET['registered'])): ?>
      <p class="success">Registration succeeded. Please log in.</p>
    <?php elseif(isset($_GET['error'])): ?>
      <p class="error"><?php echo htmlspecialchars($_GET['error']); ?></p>
    <?php endif; ?>

    <form action="../php/login_check.php" method="post">
      <label>Email</label>
      <input type="email" name="email" required placeholder="you@example.com">

      <label>Password</label>
      <input type="password" name="password" required placeholder="Enter password">

      <button type="submit">Login</button>
    </form>

    <p class="tip">
      No account? <a href="../html/register.php">Register here</a>
    </p>
  </div>
</body>
</html>
