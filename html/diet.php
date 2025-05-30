<?php
session_start();
// 1. If not logged in, jump back to the login page
if (empty($_SESSION['user_id'])) {
    header('Location: Login.php?error=' . urlencode('Please log in first'));
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Diet & Nutrition – Bariatric App</title>
  <link rel="stylesheet" href="../css/Diet.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>

  <div class="container">
  <a href="./homepage.html">&larr; Home</a><!--home button--> 
  <a href="./macro.html">&larr; Macro</a><!--home button--> 



    <!-- Top: Welcome + Logout -->
    <div class="header">
      <span>Welcome, <?php echo htmlspecialchars($_SESSION['user_email']); ?>!</span>
      <a class="logout" href="../PHP/logout.php">Log out</a>
    </div>

    <h2>Food Log</h2>

    <!-- Dietary Entry Form -->
    <form id="diet-form" aria-label="Food entry form">
      <label for="food">Food Name</label>
      <input
        type="text"
        id="food"
        required
        placeholder="e.g. Grilled Chicken"
        aria-required="true"
      />

      <label for="calories">Calories (kcal)</label>
      <input type="number" id="calories" required min="0" aria-required="true" />

      <label for="protein">Protein (g)</label>
      <input type="number" id="protein" required min="0" aria-required="true" />

      <label for="fat">Fat (g)</label>
      <input type="number" id="fat" required min="0" aria-required="true" />

      <label for="carbs">Carbs (g)</label>
      <input type="number" id="carbs" required min="0" aria-required="true" />

      <button type="submit">Add Entry</button>
    </form>

    <!-- Today's Record Form -->
    <h3>Today’s Entries</h3>
    <table id="diet-table" aria-live="polite">
      <thead>
        <tr>
          <th>Food</th>
          <th>Calories</th>
          <th>Protein</th>
          <th>Fat</th>
          <th>Carbs</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>

    <!-- line graph -->
    <h3>Calorie Trend</h3>
    <canvas id="calorieChart" role="img" aria-label="Line chart showing calorie intake per entry"></canvas>

    <!-- Recommended Recipes -->
    <div class="recipes">
      <h3>Recommended Recipes</h3>
      <ul>
        <li>Grilled Chicken Salad with Mixed Greens</li>
        <li>Quinoa & Veggie Stir-Fry</li>
        <li>Greek Yogurt Parfait with Berries</li>
      </ul>
    </div>

    <!-- dietary pyramid  -->
    <div class="pyramid" aria-hidden="true">
      <h3>Food Pyramid</h3>
      <ul>
        <li class="tier tier1">Grains</li>
        <li class="tier tier2">Vegetables</li>
        <li class="tier tier3">Fruits</li>
        <li class="tier tier4">Protein</li>
        <li class="tier tier5">Dairy</li>
      </ul>
    </div>
  </div>

  <script src="../js/Diet.js"></script>
</body>
</html>
