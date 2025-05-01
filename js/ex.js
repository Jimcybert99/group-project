//starter exercises
const exMap = {
  "Walking": "Cardio",
  "Chair Squats": "Weighted",
  "Arm Circles": "Cardio",
  "Wall Push-ups": "Weighted",
  "Resistance Band Rows": "Weighted",
  "Stationary Cycling": "Cardio"
};
//reference containers
const exBox = document.getElementById("exBox");//exercise check box
const logArea = document.getElementById("exLog");//today's workouts
const add = document.getElementById("add");//add new exercise
const remove = document.getElementById("remove");//remove exercise
const submit = document.getElementById("submit");//submit todays workout

//creates dynamic list of exercises
function makeList() {
  exBox.innerHTML = "";//clear list
  Object.keys(exMap).forEach(ex => {
    const wrap = document.createElement("div");
    //wrap checkbox and label
    wrap.className = "cbItem";
    //box is checked?
    const chk = document.createElement("input");
    chk.type = "checkbox";
    chk.id = `chk-${ex}`;
    chk.value = ex;
    chk.addEventListener("change", () => togEx(ex, chk.checked));
    //add/remove on toggle

    const label = document.createElement("label");
    label.htmlFor = `chk-${ex}`;
    label.textContent = ex;

    wrap.appendChild(chk);//checkbox to wrapper
    wrap.appendChild(label);//label to wrapper
    exBox.appendChild(wrap);//wrapper to exercise list
  });
}

//add and remove exercise in active workout
function togEx(ex, enabled) {
  const id = `log-${ex}`;//exercise ID
  const type = exMap[ex];//exercise type 

  if (!enabled) {
    const old = document.getElementById(id);//find by id if not checkerd
    if (old) logArea.removeChild(old);//remove from list
    return;
  }

  const box = document.createElement("div");//new div for inputs
  box.className= "exLogBox";
  box.id = id;

  const title = document.createElement("h3");//title exercise
  title.textContent = ex;
  box.appendChild(title);
  //display relevant input types based on exercise
  if (type === "Cardio") {
    box.innerHTML += `
      <label>Distance (miles): <input type='number' step='0.1'></label>
      <label>Time (minutes): <input type='number'></label>
    `;
  } else {//create table for weighted exercises
    const tbl = document.createElement("table");
    tbl.innerHTML = "<thead><tr><th>Set</th><th>Weight</th><th>Reps</th></tr></thead><tbody></tbody>";
    for (let i = 1; i <= 3; i++) addSet(tbl, i);//3 set default
    box.appendChild(tbl);

    //button to add sets
    const addSetBtn= document.createElement("button");
    addSetBtn.textContent = "+ Add Set";
    addSetBtn.onclick = () => addSet(tbl, tbl.querySelectorAll("tbody tr").length + 1);
    box.appendChild(addSetBtn);
  }

  logArea.appendChild(box);//append everything to 
}

//add set to exercise
function addSet(tbl, index){
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${index}</td>
    <td><input type='number' placeholder='lbs'></td>
    <td><input type='number' placeholder='reps'></td>
  `;
  tbl.querySelector("tbody").appendChild(tr);
}


//event handler for adding exercise
add.addEventListener("click", () => {
  const newName = prompt("Enter exercise name:");
  if (!newName) return; //do nothing

  //select type
  const typeContainer = document.createElement("div");
  typeContainer.className = "typePopup"; // use predefined CSS class for style
  typeContainer.innerHTML = `
    <p>Choose type:</p>
    <button id="chooseCardio">Cardio</button>
    <button id="chooseWeighted">Weighted</button>
  `;
  document.body.appendChild(typeContainer);

  // Set type and update list
  document.getElementById("chooseCardio").onclick = () => {
    exMap[newName] = "Cardio";
    document.body.removeChild(typeContainer);
    makeList();
  };
  document.getElementById("chooseWeighted").onclick = () => {
    exMap[newName] = "Weighted";
    document.body.removeChild(typeContainer);
    makeList();
  };
});

//remove exercise from list
remove.addEventListener("click", () => {
  const marked = Array.from(exBox.querySelectorAll("input[type='checkbox']:checked")).map(c => c.value);
  marked.forEach(name => {
    delete exMap[name];
    const form = document.getElementById(`log-${name}`);
    if (form) logArea.removeChild(form);
  });
  makeList();
});

//display workout summary
submit.addEventListener("click", () => {
  const summary = [];
  //compile exercise details
  document.querySelectorAll(".exLogBox").forEach(box => {
    const title = box.querySelector("h3").textContent;//name
    const table = box.querySelector("table");//weight input
    const inputs = box.querySelectorAll("input[type='number']");//cardio input
    //if weight
    if (table) {
      const rows = table.querySelectorAll("tbody tr");
      const sets = Array.from(rows).map(row => {
        const w = row.cells[1].querySelector("input").value || 0;
        const r = row.cells[2].querySelector("input").value || 0;
        return `${r} reps @ ${w} lbs`;
      });
      summary.push(`${title}: ${sets.length} sets (${sets.join(", ")})`);
    //else cardio
    } else if (inputs.length >= 2) {
      const dist = inputs[0].value || 0;
      const time = inputs[1].value || 0;
      summary.push(`${title}: ${dist} mi in ${time} min`);
    }
  });
  //display results in popup
  const summaryList = document.getElementById("summaryList");
  summaryList.innerHTML = "";
  summary.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    summaryList.appendChild(li);
  });

  document.getElementById("openSummary").style.display = "block";
});
//close workout summary
document.getElementById("closeSummary").addEventListener("click", () => {
  document.getElementById("openSummary").style.display = "none";
});
//render exercise list
makeList();
