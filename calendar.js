const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

let currentDate = new Date();
displayCalendar(currentDate);

document.getElementById('prev').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    displayCalendar(currentDate);
});

document.getElementById('next').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    displayCalendar(currentDate);
});

function displayCalendar(date) {
    const monthYear = document.getElementById('monthYear');
    monthYear.textContent = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    // Days of the week
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyCell = document.createElement('div');
        calendar.appendChild(emptyCell);
    }

    // Fill the calendar with days
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dayCell = document.createElement('div');
        dayCell.textContent = day;
        dayCell.classList.add('day');
        
        if (day === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear()) {
            dayCell.classList.add('current');
        }

        // Add click event to each day
        dayCell.addEventListener('click', () => selectDay(day));
        calendar.appendChild(dayCell);
    }
}

function selectDay(day) {
    document.getElementById('pop').style.display = "block";
    document.getElementById('eventDate').value = `${currentDate.getFullYear()}-${('0' + (currentDate.getMonth() + 1)).slice(-2)}-${('0' + day).slice(-2)}`;
}

document.getElementById('close').addEventListener('click', () => {
    document.getElementById('pop').style.display = "none";
});

document.getElementById('saveEvent').addEventListener('click', () => {
    alert('Event saved!');
    document.getElementById('pop').style.display = "none";
});