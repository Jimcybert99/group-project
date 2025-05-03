<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Register – Bariatric App</title>
  <link rel="stylesheet" href="../css/login.css">
</head>
<body>
  <div class="container">
    <h2>Create Account</h2>

    <?php if(isset($_GET['error'])): ?>
      <p class="error"><?php echo htmlspecialchars($_GET['error']); ?></p>
    <?php endif; ?>

    <form action="../PHP/register.php" method="post">
      <label>Email</label>
      <input type="email" name="email" required placeholder="you@example.com">

      <label>Password</label>
      <input type="password" name="password" required placeholder="Enter password">

      <label>Confirm Password</label>
      <input type="password" name="confirm" required placeholder="Confirm password">

      <button type="submit">Register</button>
    </form>

    <p class="tip">
      Have account? <a href="login.php">Login here</a>
    </p>
  </div>
</body>
</html>
