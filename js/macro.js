// js/macro.js

const mealPlans = [
  {
    name: 'High-Protein Day',
    meals: [
      { food: 'Grilled Chicken Breast', calories: 200, protein: 35, fat: 4, carbs: 0 },
      { food: 'Greek Yogurt', calories: 150, protein: 15, fat: 5, carbs: 10 },
      { food: 'Salmon & Veggies', calories: 350, protein: 30, fat: 20, carbs: 10 },
      { food: 'Protein Shake', calories: 180, protein: 25, fat: 2, carbs: 8 }
    ]
  },
  {
    name: 'Balanced Macronutrient Day',
    meals: [
      { food: 'Oatmeal with Berries', calories: 250, protein: 8, fat: 5, carbs: 45 },
      { food: 'Turkey Sandwich', calories: 300, protein: 20, fat: 10, carbs: 30 },
      { food: 'Beef Stir-Fry', calories: 400, protein: 25, fat: 15, carbs: 35 },
      { food: 'Mixed Nuts Snack', calories: 200, protein: 6, fat: 18, carbs: 6 }
    ]
  },
  {
    name: 'Low-Carb Day',
    meals: [
      { food: 'Scrambled Eggs & Avocado', calories: 280, protein: 18, fat: 22, carbs: 4 },
      { food: 'Caesar Salad with Chicken', calories: 350, protein: 30, fat: 20, carbs: 10 },
      { food: 'Steak & Asparagus', calories: 400, protein: 35, fat: 25, carbs: 5 },
      { food: 'Cheese & Veggie Plate', calories: 220, protein: 12, fat: 18, carbs: 6 }
    ]
  }
];

// Chart Example Global Save
let macroChart = null;

// Click on the button to generate the menu and chart
document.getElementById('generate-btn').addEventListener('click', () => {
  // Randomly selected set of plans
  const plan = mealPlans[Math.floor(Math.random() * mealPlans.length)];
  
  const totals = plan.meals.reduce((acc, m) => {
    acc.calories += m.calories;
    acc.protein  += m.protein;
    acc.fat      += m.fat;
    acc.carbs    += m.carbs;
    return acc;
  }, { calories: 0, protein: 0, fat: 0, carbs: 0 });

  // Display menu name and details on the page.
  const mealList = document.getElementById('meal-list');
  mealList.innerHTML = `<li><strong>${plan.name}</strong></li>`;
  plan.meals.forEach(m => {
    const li = document.createElement('li');
    li.textContent = `${m.food}: ${m.calories} kcal, P${m.protein}g / F${m.fat}g / C${m.carbs}g`;
    mealList.appendChild(li);
  });

  const data = [totals.protein, totals.fat, totals.carbs];

  if (macroChart) {
    macroChart.destroy();
  }

  // Creating a Chart.js Ring
  const ctx = document.getElementById('mealMacroChart').getContext('2d');
  macroChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Protein (g)', 'Fat (g)', 'Carbs (g)'],
      datasets: [{
        data: data,
        backgroundColor: ['#4caf50', '#ff9800', '#2196f3']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: `Total: ${totals.calories} kcal`
        },
        legend: {
          position: 'bottom'
        }
      }
    }
  });
});
