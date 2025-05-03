//get date
const today = new Date();
//generate date in a string
function fmtDt(offset) {
  const d = new Date(today);
  d.setDate(today.getDate() + offset);
  return d.toISOString().split("T")[0];//YYY-MM-DD
}

// Replace dummy data with server-loaded data
let events = {};
let workoutDays = [];

//reference html elements
const moYr = document.getElementById("monthYear");
const calendar = document.getElementById("calendar");
const currentDate = new Date();
const pop = document.getElementById("pop");
const closeBtn = document.getElementById("close");
const evDate = document.getElementById("eventDate");
const evTime = document.getElementById("eventTime");
const evDesc = document.getElementById("eventDescription");
const saveBtn = document.getElementById("saveEvent");
const evList = document.getElementById("eventList");
const dateHeader = document.getElementById("popupDate");

//month navigation button listeners
document.getElementById("prev").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  showCal(currentDate);
});

document.getElementById("next").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  showCal(currentDate);
});

//close button listener
closeBtn.addEventListener("click", () => {
  pop.style.display = "none";
});

//save new event and update event list
saveBtn.addEventListener("click", () => {
  const date = evDate.value;
  const time = evTime.value;
  const desc = evDesc.value;
  if (!date || !time || !desc) return;

  const form = new FormData();
  form.append("date", date);
  form.append("time", time);
  form.append("desc", desc);

  fetch("../php/calendar_api.php?action=add", {
    method: "POST",
    body: form
  }).then(() => {
    loadData();
    pop.style.display = "none";
  });
});

function markWorkoutDays(logs) {
  Object.entries(logs).forEach(([date, exercises]) => {
    const cell = document.querySelector(`.day[data-date="${date}"]`);
    if (cell) {
      // Add checkmark
      const check = document.createElement("span");
      check.textContent = "✅";
      check.style.position = "absolute";
      check.style.top = "4px";
      check.style.right = "4px";
      cell.appendChild(check);

      // Create a styled bullet list for workouts
      const ul = document.createElement("ul");
      ul.style.paddingLeft = "16px"; // indent bullets slightly
      ul.style.margin = "4px 0";     // space around the list
      ul.style.listStyleType = "disc"; // bullet points

      exercises.forEach(name => {
        const li = document.createElement("li");
        li.className = "event-text";  // match event styling
        li.textContent = name;
        ul.appendChild(li);
      });

      cell.appendChild(ul);
    }
  });
}





// Load events and workouts from backend
async function loadData() {
  try {
    const evRes = await fetch("../php/calendar_api.php?action=fetch");
    events = await evRes.json();

    const wkRes = await fetch("../php/calendar_api.php?action=workouts");
    workoutDays = await wkRes.json();

    showCal(currentDate); // this now includes markWorkoutDays internally
  } catch (err) {
    console.error("Failed to load calendar data", err);
  }
}




//build calendar 
function showCal(date) {
  calendar.innerHTML = "";//start empty

  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);//1st of the month
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);//last day
  moYr.textContent = `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`;
  //heading
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  weekdays.forEach(day => {
    const div = document.createElement("div");
    div.textContent = day;//set days
    div.style.fontWeight = "bold";
    calendar.appendChild(div);//add to calendar
  });

  //spot holders for empty days so 1st of month matches weekday
  for (let i = 0; i < firstDay.getDay(); i++) {
    calendar.appendChild(document.createElement("div"));
  }

  //generate day slots
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const fullDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const cell = document.createElement("div");
    cell.className = "day";
    cell.setAttribute("data-date", fullDate);
        cell.innerHTML = `<strong>${day}</strong>`;//label

    if (events[fullDate]) {
      events[fullDate].forEach(ev => {
        const evTxt = document.createElement("div");
        evTxt.className = "event-text";
        evTxt.textContent = ev.text;
        cell.appendChild(evTxt);
      });
      
    }
    

    //highlight current day
    if (day === new Date().getDate() && date.getMonth() === new Date().getMonth()) {
      cell.classList.add("current");
    }

    //opens shcedule popup when day is clicked
    cell.addEventListener("click", () => {
      evDate.value = fullDate;//set date
      evTime.value = "";//clear
      evDesc.value = "";
      evList.innerHTML = "";
      dateHeader.textContent = "Schedule for " + fullDate;//show day

      if (events[fullDate]) {
        const toMinutes = (t) => {
          if (!t || !/^\d{2}:\d{2}$/.test(t.trim())) return 9999;
          const [h, m] = t.trim().split(":").map(Number);
          return h * 60 + m;
        };
      
        const sorted = [...events[fullDate]].sort((a, b) => toMinutes(a.time) - toMinutes(b.time));
      
        sorted.forEach(ev => {
          const li = document.createElement("li");
      
          const [hour, minute] = ev.time.split(":").map(Number);
          const ampm = hour >= 12 ? "PM" : "AM";
          const hour12 = hour % 12 || 12;
          const formattedTime = `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
      
          li.innerHTML = `<strong>${formattedTime}</strong> – ${ev.text} <button onclick="removeEvent(${ev.id})">❌</button>`;
          evList.appendChild(li);
        });
      }
      
      
      pop.style.display = "block";
    });
    calendar.appendChild(cell);//add to calendar
  }
  markWorkoutDays(workoutDays);

}

//remove an event
async function removeEvent(id) {
  await fetch("../php/calendar_api.php?action=delete", {
    method: "POST",  
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: id })
  });

  loadData();
  pop.style.display = "none";
}

loadData();
