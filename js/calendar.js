//get date
const today = new Date();
//generate date in a string
function fmtDt(offset) {
  const d = new Date(today);
  d.setDate(today.getDate() + offset);
  return d.toISOString().split("T")[0];//YYY-MM-DD
}

//dummy data for workouts completed
const workoutDays = [
  fmtDt(-14), fmtDt(-13), fmtDt(-10), fmtDt(-7),
  fmtDt(-6), fmtDt(-2)
];

//dummy workouts
const events = {
  [fmtDt(-14)]: ["Walking - 1.5 mi"],
  [fmtDt(-13)]: ["Chair Squats - 3x10"],
  [fmtDt(-10)]: ["Walking - 1.8 mi"],
  [fmtDt(-7)]: ["Chair Squats - 4x12"],
  [fmtDt(-6)]: ["Walking - 2.0 mi"],
  [fmtDt(-2)]: ["Chair Squats - 5x14"]
};

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
  const date = evDate.value;//date
  const text = evTime.value + " - " + evDesc.value;//new event
  if (!events[date]) events[date] = [];//inititalize
  events[date].push(text);//add to list
  showCal(currentDate);//show in calendar
  pop.style.display = "none";//close
});

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
    cell.innerHTML = `<strong>${day}</strong>`;//label

    if (events[fullDate]) {
      events[fullDate].forEach(text => {
        const evTxt = document.createElement("div");
        evTxt.className = "event-text";
        evTxt.textContent = text;
        cell.appendChild(evTxt);//display event
      });
    }

    if (workoutDays.includes(fullDate)) {
      const check = document.createElement("span");
      check.textContent = "✅";//add checkmark if exercised
      check.style.position = "absolute";
      check.style.top = "4px";
      check.style.right = "4px";
      cell.appendChild(check);
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
        events[fullDate].forEach((event, index) => {
          const li = document.createElement("li");
          li.innerHTML = `${event} <button onclick="removeEvent('${fullDate}', ${index})">❌</button>`;//delete scheduled event
          evList.appendChild(li);
        });
      }
      pop.style.display = "block";
    });
    calendar.appendChild(cell);//add to calendar
  }
}

//remove an event
function removeEvent(date, i) {
  if (events[date]) {
    events[date].splice(i, 1);//remove element at i
    if (events[date].length === 0) delete events[date];
    showCal(currentDate);
    pop.style.display = "none";
  }
}

showCal(currentDate);
