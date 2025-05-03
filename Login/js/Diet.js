// Getting Form and Form Body References
const form = document.getElementById('diet-form');
const tbody = document.querySelector('#diet-table tbody');

const labels = [];
const caloriesData = [];

// Initialize Line Chart
const ctx = document.getElementById('calorieChart').getContext('2d');
const calorieChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: labels,
    datasets: [{
      label: 'Calories per Entry',
      data: caloriesData,
      fill: false,
      tension: 0.1,
      borderWidth: 2,
      pointRadius: 4
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: {
        title: { display: true, text: 'Entry #' }
      },
      y: {
        title: { display: true, text: 'Calories (kcal)' },
        beginAtZero: true
      }
    },
    plugins: {
      legend: { position: 'top' }
    }
  }
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const entry = {
    food: form.food.value.trim(),
    calories: parseInt(form.calories.value, 10),
    protein: parseFloat(form.protein.value),
    fat: parseFloat(form.fat.value),
    carbs: parseFloat(form.carbs.value)
  };

  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${entry.food}</td>
    <td>${entry.calories}</td>
    <td>${entry.protein}</td>
    <td>${entry.fat}</td>
    <td>${entry.carbs}</td>
    <td><button class="del">Delete</button></td>
  `;
  tbody.appendChild(tr);

  // Update Line Chart Data
  labels.push(`#${labels.length + 1}`);
  caloriesData.push(entry.calories);
  calorieChart.update();

  // Clearing the form in preparation for the next entry
  form.reset();
});

tbody.addEventListener('click', e => {
  if (e.target.classList.contains('del')) {
    const row = e.target.closest('tr');
    const idx = Array.from(tbody.children).indexOf(row);
    row.remove();

    labels.splice(idx, 1);
    caloriesData.splice(idx, 1);
    calorieChart.update();
  }
});
