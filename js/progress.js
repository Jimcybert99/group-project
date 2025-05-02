  const today = new Date();
  let dData = {};
  let chart;
  let exTypes = {}; //store exercise types keyed by name

  const exSel = document.getElementById("exerciseSelect");
  const metSel = document.getElementById("metricSelect");
  const rngSel = document.getElementById("timeframeSelect");
  const ctx = document.getElementById("progressGraph").getContext("2d");

  const uMap = {
    "distance": "miles",
    "time": "minutes",
    "average speed": "mph",
    "best weight": "lbs",
    "volume": "lbs",
    "total reps": "reps"
  };

  function loadProgress(name) {
    fetch(`../php/exercise_api.php?action=progress&name=${encodeURIComponent(name)}`)
      .then(res => res.json())
      .then(data => {
        console.log("Loaded progress data:", data);
        if (!Array.isArray(data)) {
          console.error("Progress data is not an array:", data);
          return;
        }
        dData[name] = data;
        graph();
      })
      
      .catch(err => {
        console.error("Failed to load progress data", err);
      });
  }

  function graph() {
    const ex = exSel.value;
    const met = metSel.value;
    const rng = parseInt(rngSel.value);
    const now = new Date();

    const logs = dData[ex] || [];
    const plot = logs
      .filter(e => (now - new Date(e.date)) / (1000 * 60 * 60 * 24) <= rng)
      .map(e => {
        let y = 0;
        if (met === "distance") y = e.distance;
        else if (met === "time") y = e.time;
        else if (met === "average speed") {
          const time = parseFloat(e.time);
          y = time > 0 ? e.distance / (time / 60) : 0;
        }
        else if (met === "best weight") y = e.best_weight;
        else if (met === "volume") y = e.volume;
        else if (met === "total reps") y = e.total_reps;

      
        return { x: e.date, y: parseFloat(y) };
      })
      .filter(p => !isNaN(p.y)); // ✅ filter out invalid points
      

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: plot.map(p => p.x),
        datasets: [{
          label: `${ex} - ${met}`,
          data: plot.map(p => p.y),
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

    if (plot.length === 0) {
      console.warn("No data to display for:", ex, met);
    }
  }

  function updateMetricOptions(type) {
    const cardioMetrics = ["distance", "time", "average speed"];
    const weightedMetrics = ["best weight", "volume", "total reps"];
  
    metSel.innerHTML = ""; // clear current options
  
    const metrics = type === "Cardio" ? cardioMetrics : weightedMetrics;
  
    metrics.forEach(m => {
      const opt = document.createElement("option");
      opt.value = m;
      opt.textContent = m.charAt(0).toUpperCase() + m.slice(1);
      metSel.appendChild(opt);
    });
  }
  

  // Load initial exercise list
  fetch("../php/exercise_api.php?action=with_logs")
  .then(res => res.json())
  .then(data => {
    exSel.innerHTML = "";
    exTypes = {}; // reset types

    data.forEach(ex => {
      const opt = document.createElement("option");
      opt.value = ex.name;
      opt.textContent = ex.name;
      exSel.appendChild(opt);
      exTypes[ex.name] = ex.type; // save type
    });

    if (data.length > 0) {
      exSel.value = data[0].name;
      updateMetricOptions(data[0].type);
      loadProgress(data[0].name);
    }
  });


  exSel.addEventListener("change", () => {
    const selectedName = exSel.value;
    const type = exTypes[selectedName];
    updateMetricOptions(type);
    loadProgress(selectedName);
  });
    metSel.addEventListener("change", graph);
  rngSel.addEventListener("change", graph);

