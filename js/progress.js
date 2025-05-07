//today's date
const today = new Date();
//workout containers
let dData = {};//exercise data
let chart;//chart.js
let exTypes = {};//type of exercise
//references
const exSel = document.getElementById("exerciseSelect");
const metSel = document.getElementById("metricSelect");
const rngSel = document.getElementById("timeframeSelect");
const ctx = document.getElementById("progressGraph").getContext("2d");

  //unit labels
  const uMap = {
    "distance": "miles",
    "time": "minutes",
    "average speed": "mph",
    "best weight": "lbs",
    "volume": "lbs",
    "total reps": "reps"
  };
  //load data from backend api
  function loadProgress(name) {
    fetch(`../php/exercise_api.php?action=progress&name=${encodeURIComponent(name)}`)
      .then(res => res.json())
      .then(data => {
        console.log("Loaded progress data:", data);
        dData[name] = data;//send data
        graph();//draw graph
      })
  }
  //create graph function
  function graph() {
    const ex = exSel.value;//select exercise
    const met = metSel.value;//select metric
    const rng = parseInt(rngSel.value);//time range
    const now = new Date();

    let logs = dData[ex] || [];//load data for exercise
    let plotLogs = logs;
      //display best weight
      if (met === "best weight") {
        const grouped = {};

        logs.forEach(entry => {
          const date = entry.date;
          const weight = entry.best_weight || 0;
          if (!grouped[date] || weight > grouped[date]) {
            grouped[date] = weight;
          }
        });

        plotLogs = Object.entries(grouped).map(([date, weight]) => ({ date, best_weight: weight }));
      }

    //timestamp to filter
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    //filter logs by time range
    const plot = plotLogs
    .filter(e => {
        const logDate = new Date(e.date + "T00:00:00");
        const daysAgo = (midnight - logDate) / (1000 * 60 * 60 * 24);
        return daysAgo >= 0 && daysAgo <= rng;
      })
      //map out logs
      .map(e => {
        let y = 0;
        if (met === "distance") y = e.distance;
        else if (met === "time") y = e.time;
        else if (met === "average speed") {
          const time = parseFloat(e.time);
          y = time > 0 ? e.distance / (time / 60) : 0;//calculate speed
        }
        else if (met === "best weight") y = e.best_weight;
        else if (met === "volume") y = e.volume;
        else if (met === "total reps") y = e.total_reps;

      
        return { x: e.date, y: parseFloat(y) };
      })
      .filter(p => !isNaN(p.y) && p.y !== 0);//filter 0's
      
    //destroy previous chart
    if (chart) chart.destroy();
    //build new chart
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: plot.map(p => p.x),//x axis dates
        datasets: [{
          label: `${ex} - ${met}`,
          data: plot.map(p => p.y),//y axis variable
          borderColor: "#1976d2",
          backgroundColor: "#1976d2",
          fill: false,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { title: { display: true, text: "Date" } },
          y: { title: { display: true, text: uMap[met] || met }, beginAtZero: true }
        },
        plugins: { legend: { display: true } }
      }
    });
    if (plot.length === 0) {//test for empty exercise
      console.warn("No data to display for:", ex, met);
    }
  }


  //restrict options bested on type
  function updateMetricOptions(type) {
    const cardioMetrics = ["distance", "time", "average speed"];
    const weightedMetrics = ["best weight", "volume", "total reps"];
  
    metSel.innerHTML = "";//clear current options
    const metrics = type === "Cardio" ? cardioMetrics : weightedMetrics;
  //add options to dropdwon
    metrics.forEach(m => {
      const opt = document.createElement("option");
      opt.value = m;
      opt.textContent = m.charAt(0).toUpperCase() + m.slice(1);
      metSel.appendChild(opt);
    });
  }
  

  //load initial exercise list
  fetch("../php/exercise_api.php?action=with_logs")
  .then(res => res.json())
  .then(data => {
    exSel.innerHTML = "";
    exTypes = {}; //reset types

    data.forEach(ex => {
      const opt = document.createElement("option");
      opt.value = ex.name;
      opt.textContent = ex.name;
      exSel.appendChild(opt);
      exTypes[ex.name] = ex.type; //save type
    });

    if (data.length > 0) {
      exSel.value = data[0].name;
      updateMetricOptions(data[0].type);
      loadProgress(data[0].name);
    }
  });

  //when exercise/time range is selected reload chart
  exSel.addEventListener("change", () => {
    const selectedName = exSel.value;
    const type = exTypes[selectedName];
    updateMetricOptions(type);
    loadProgress(selectedName);
  });
    metSel.addEventListener("change", graph);
  rngSel.addEventListener("change", graph);

