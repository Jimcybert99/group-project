const exMap = {};

//starter exercises
fetch("../php/exercise_api.php?action=fetch")
  .then(res => res.json())
  .then(data => {
    data.forEach(ex => {
      exMap[ex.name] = ex.type; // this supports the rest of your logic
    });
    makeList();
  });

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
  if (!newName) return;

  const typeContainer = document.createElement("div");
  typeContainer.className = "typePopup";
  typeContainer.innerHTML = `
    <p>Choose type:</p>
    <button id="chooseCardio">Cardio</button>
    <button id="chooseWeighted">Weighted</button>
  `;
  document.body.appendChild(typeContainer);

  const handleAdd = (type) => {
    fetch("../php/exercise_api.php?action=add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, type })
    }).then(() => {
      exMap[newName] = type;
      makeList();
      document.body.removeChild(typeContainer);
    });
  };

  document.getElementById("chooseCardio").onclick = () => handleAdd("Cardio");
  document.getElementById("chooseWeighted").onclick = () => handleAdd("Weighted");
});


//remove exercise from list
remove.addEventListener("click", () => {
  const marked = Array.from(exBox.querySelectorAll("input[type='checkbox']:checked")).map(c => c.value);

  marked.forEach(name => {
    // Check if the exercise has any logged data before deleting
fetch(`../php/exercise_api.php?action=check_logs&name=${encodeURIComponent(name)}`) 
      .then(res => res.json())
      .then(data => {
        const hasLogs = data.hasLogs;

        if (!hasLogs || confirm(`This will delete all workout data for "${name}". Are you sure?`)) {
          // Proceed with deletion
          fetch("../php/exercise_api.php?action=delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name })
          })
          .then(res => res.json())
          .then(result => {
            if (result.success) {
              delete exMap[name];
              const form = document.getElementById(`log-${name}`);
              if (form) logArea.removeChild(form);
              makeList();
            } else {
              alert("Failed to delete exercise.");
            }
          });
        }
      });
  });
});


//display workout summary
submit.addEventListener("click", () => {
  const summary = [];
  const payload = [];

  // use local date in YYYY-MM-DD
  const today = new Date();
  const date = today.toLocaleDateString('en-CA');

  document.querySelectorAll(".exLogBox").forEach(box => {
    const name = box.querySelector("h3").textContent;
    const type = exMap[name];
    const table = box.querySelector("table");
    const inputs = box.querySelectorAll("input[type='number']");

    if (type === "Cardio") {
      const distance = parseFloat(inputs[0].value || 0);
      const time = parseInt(inputs[1].value || 0);
      payload.push({
        date,
        name,
        type,
        distance,
        time,
        sets: null,
        reps: null,
        weight: null
      });
      summary.push(`${name}: ${distance} mi in ${time} min`);
    } else {
      const rows = table.querySelectorAll("tbody tr");
      const sets = [];

      rows.forEach(row => {
        const reps = parseInt(row.cells[2].querySelector("input").value || 0);
        const weight = parseFloat(row.cells[1].querySelector("input").value || 0);
        payload.push({
          date,
          name,
          type,
          distance: null,
          time: null,
          sets: 1,
          reps,
          weight
        });
        sets.push(`${reps} reps @ ${weight} lbs`);
      });

      summary.push(`${name}: ${sets.length} sets (${sets.join(", ")})`);
    }
  });

  // send to backend
  fetch("../php/exercise_api.php?action=log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(result => {
    console.log("Workout saved:", result);

    // Reload exercise dropdown and graph
    fetch("../php/exercise_api.php?action=with_logs")
      .then(res => res.json())
      .then(data => {
        exSel.innerHTML = "";
        exTypes = {};

        data.forEach(ex => {
          const opt = document.createElement("option");
          opt.value = ex.name;
          opt.textContent = ex.name;
          exSel.appendChild(opt);
          exTypes[ex.name] = ex.type;
        });

        if (payload.length > 0) {
          const lastEx = payload[payload.length - 1].name;
          exSel.value = lastEx;
          updateMetricOptions(exTypes[lastEx]);
          loadProgress(lastEx);
        }
      });

    // clear the form
    document.querySelectorAll(".exLogBox").forEach(box => box.remove());
    document.querySelectorAll("#exBox input[type='checkbox']").forEach(c => c.checked = false);
  })
  .catch(err => {
    console.error("Failed to save workout", err);
  });

  // Display summary
  const summaryList = document.getElementById("summaryList");
  summaryList.innerHTML = "";
  summary.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    summaryList.appendChild(li);
  });

  const popup = document.getElementById("openSummary");
  popup.style.display = "block";
  popup.style.visibility = "visible";
});


//close workout summary
document.getElementById("closeSummary").addEventListener("click", () => {
  const popup = document.getElementById("openSummary");
  popup.style.display = "none";
  popup.style.visibility = "hidden";
  });
