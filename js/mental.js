const tips = [
    "Drink a glass of water when you wake up.",
    "Avoid screens 1 hour before sleep.",
    "Stretch for 5 minutes after waking up to improve circulation.",
    "Laugh more—watch something funny or chat with a friend.",
    "Try deep breathing exercises for 5 minutes.",
    "Take a short walk outside.",
    "Do a random act of kindness.",
    "Listen to calming music.",
    "Write down three things you're grateful for.",
    "Eat a balanced meal today.",
    "Smile at someone—you never know whose day you'll brighten!"
];

// Function to shuffle and pick random tips
function getRandomTips() {
    const shuffled = [...tips].sort(() => Math.random() - 0.5); // Shuffle array
    return shuffled.slice(0, 3); // Select 3 random tips
}

// Function to display random tips
function displayRandomTips() {
    const tipsList = document.querySelector(".tips-section ul"); // Find the tips list
    tipsList.innerHTML = ""; // Clear existing tips

    const selectedTips = getRandomTips(); // Get new tips
    selectedTips.forEach(tip => {
        const li = document.createElement("li");
        li.textContent = tip;
        tipsList.appendChild(li);
    });
}

// Run the function when the page loads
window.onload = displayRandomTips;
