// Fake data to simulate dynamic behavior
const tips = [
    "Drink a glass of water when you wake up.",
    "Avoid screens 1 hour before sleep.",
    "Stretch for 5 minutes after waking up to improve circulation.",
    "Laugh more—watch something funny or chat with a friend.",
    "Try deep breathing exercises for 5 minutes.",
  ];
  
  const challenges = [
    "Drink 2L of water",
    "Walk 5,000 steps",
    "Stretch for 10 minutes",
    "Take the stairs instead of the elevator",
  ];
  
  // Load a random tip
  document.getElementById("health-tip").textContent =
    tips[Math.floor(Math.random() * tips.length)];
  
  // Show 3 random challenges
  const shuffled = challenges.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3);
  
  const list = document.getElementById("challenge-list");
  selected.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
  
  // Optional: Fill in some dummy metrics
  document.getElementById("heart-rate").textContent = 79;
  document.getElementById("bmi").textContent = 21.8;
  document.getElementById("sleep").textContent = 7.5;
  document.getElementById("water").textContent = 3.2;
document.getElementById("bmi-form").addEventListener("submit", function (e) {
  e.preventDefault(); // prevent page reload

  const weight = parseFloat(document.getElementById("weight").value);
  const heightCm = parseFloat(document.getElementById("height").value);

  if (isNaN(weight) || isNaN(heightCm) || heightCm <= 0 || weight <= 0) {
    document.getElementById("bmi-result").textContent = "Please enter valid numbers.";
    return;
  }

  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);
  let category = "";

  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 24.9) category = "Normal weight";
  else if (bmi < 29.9) category = "Overweight";
  else category = "Obese";

  document.getElementById("bmi-result").textContent =
    `Your BMI is ${bmi.toFixed(1)} — Category: ${category}`;
    document.getElementById("bmi").textContent = bmi.toFixed(1)
});
  