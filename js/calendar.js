//get date
const today = new Date();
//generate date in a string
function fmtDt(offset) {
  const d = new Date(today);
  d.setDate(today.getDate() + offset);
  return d.toISOString().split("T")[0];//format date
}

//initialize events and workouts
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

//month navigation button
//previous month
document.getElementById("prev").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  showCal(currentDate);
});
//next month
document.getElementById("next").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  showCal(currentDate);
});
//close listener
closeBtn.addEventListener("click", () => {
  pop.style.display = "none";
});

//save new event and update events
saveBtn.addEventListener("click", () => {
  const date = evDate.value;
  const time = evTime.value;
  const desc = evDesc.value;
  if (!date || !time || !desc) return;//no empty values

  const form = new FormData();
  form.append("date", date);
  form.append("time", time);
  form.append("desc", desc);
  //send form to backend api
  fetch("../php/calendar_api.php?action=add", {
    method: "POST",
    body: form
  }).then(() => {
    loadData();//reload data
    pop.style.display = "none";
  });
});

//add check to workout days
function markWorkoutDays(logs) {
  Object.entries(logs).forEach(([date, exercises]) => {
    const cell = document.querySelector(`.day[data-date="${date}"]`);
    if (cell) {
      //add checkmark
      const check = document.createElement("span");
      check.textContent = "✅";
      check.style.position = "absolute";
      check.style.top = "4px";
      check.style.right = "4px";
      cell.appendChild(check);

      //bullet list for workouts
      const ul = document.createElement("ul");
      ul.style.paddingLeft = "16px"; //indent bullets
      ul.style.margin = "4px 0";     //space around the list
      ul.style.listStyleType = "disc"; //bullet points

      exercises.forEach(name => {
        const li = document.createElement("li");
        li.className = "event-text";  //match event style
        li.textContent = name;
        ul.appendChild(li);
      });

      cell.appendChild(ul);
    }
  });
}


//fetch events and workouts from backend api
async function loadData() {
    const evRes = await fetch("../php/calendar_api.php?action=fetch");
    events = await evRes.json(); //event format: {date: (id, time, text)}

    const wkRes = await fetch("../php/calendar_api.php?action=workouts");
    workoutDays = await wkRes.json();//workout format: {date: (exercise1, exercise2)}

    showCal(currentDate);//display calendar
}




//build calendar 
function showCal(date) {
  calendar.innerHTML = "";//start empty

  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);//first of the month
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);//last day of the month
  //display month and year
  moYr.textContent = `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`;
  //weekday heading
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  weekdays.forEach(day => {
    const div = document.createElement("div");
    div.textContent = day;//set days
    div.style.fontWeight = "bold";
    calendar.appendChild(div);//add to calendar
  });

  //spot holders for empty days so 1st of month matches
  for (let i = 0; i < firstDay.getDay(); i++) {
    calendar.appendChild(document.createElement("div"));
  }

  //loop through days
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const fullDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const cell = document.createElement("div");
    cell.className = "day";
    cell.setAttribute("data-date", fullDate);
        cell.innerHTML = `<strong>${day}</strong>`;//label
    //display events
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

    //add/remove event popup
    cell.addEventListener("click", () => {
      evDate.value = fullDate;//set date
      evTime.value = "";//clear
      evDesc.value = "";
      evList.innerHTML = "";
      dateHeader.textContent = "Schedule for " + fullDate;//show day
      //sort events by time
      if (events[fullDate]) {
        const toMinutes = (t) => {
          if (!t || !/^\d{2}:\d{2}$/.test(t.trim())) return 9999;
          const [h, m] = t.trim().split(":").map(Number);
          return h * 60 + m;
        };
      
        const sorted = [...events[fullDate]].sort((a, b) => toMinutes(a.time) - toMinutes(b.time));
      
        sorted.forEach(ev => {
          const li = document.createElement("li");
          //AM PM time
          const [hour, minute] = ev.time.split(":").map(Number);
          const ampm = hour >= 12 ? "PM" : "AM";
          const hour12 = hour % 12 || 12;
          const formattedTime = `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
          //delete button
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
  loadData();//reload after calendar deleted
  pop.style.display = "none";
}

loadData();
