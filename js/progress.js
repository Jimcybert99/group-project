//get current date
const today = new Date();

//generate date in a string
function fmtDt(offset) {
  const d = new Date(today);
  d.setDate(today.getDate() + offset);
  return d.toISOString().split("T")[0];//YYYY-MM-DD
}

//dummy workout data
const dData = {
  "Walking": [
    {date: fmtDt(-14), distance: 1.5, time: 20},
    {date: fmtDt(-10), distance: 1.8, time: 24},
    {date: fmtDt(-6), distance: 2.0, time: 28}
  ],
  "Chair Squats": [
    {date: fmtDt(-13), sets: 3, reps: 10, weight: 0 },
    {date: fmtDt(-7), sets: 4, reps: 12, weight: 10},
    {date: fmtDt(-2), sets: 5, reps: 14, weight: 15}
  ]
};

//units displayed on graph
const uMap = {
  "distance": "miles",
  "time": "minutes",
  "average speed": "mph",
  "best weight": "lbs",
  "volume": "lbs",
  "total reps": "reps"
};

//refernces to exercise inputs
const exSel = document.getElementById("exerciseSelect");
const metSel = document.getElementById("metricSelect");
const rngSel = document.getElementById("timeframeSelect");
const ctx = document.getElementById("progressGraph").getContext("2d");
let chart;

//generate chart
function graph() {

  const ex = exSel.value;//exercise name
  const met = metSel.value;//metric
  const rng = parseInt(rngSel.value);//time
  const now = new Date();//date

  const logs = dData[ex] || [];//array for exercise
  //plot data in array
  const plot = logs
    .filter(e => (now - new Date(e.date)) / (1000 * 60 * 60 * 24) <= rng)//arrange by time
    .map(e => {
      let y = 0;//start of y axis
      //assing appropriate exercise metric to y value
      if (met === "distance") y = e.distance;
      else if (met === "time") y = e.time;
      else if (met === "average speed") y = (e.distance / (e.time / 60)).toFixed(2);
      else if (met === "best weight") y = e.weight;
      else if (met === "volume") y = e.sets * e.reps * e.weight;
      else if (met === "total reps") y = e.sets * e.reps;
      return { x: e.date, y: parseFloat(y) };//return date and y
    });

  if (chart) chart.destroy();//clear previous chart

  //new chart
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: plot.map(p => p.x),//x axis labels
      datasets: [{
        label: `${ex} - ${met}`,//label
        data: plot.map(p => p.y),//y data
        borderColor: "#1976d2",
        backgroundColor: "#1976d2",
        fill: false,
        tension: 0.3//smooth
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {//label axis'
        x: { title: { display: true, text: "Date" } },
        y: { title: { display: true, text: uMap[met] || met }, beginAtZero: true }
      },//show legend
      plugins: { legend: { display: true } }
    }
  });
}

//redraw graph when dropdown criteria change
exSel.addEventListener("change", graph);
metSel.addEventListener("change", graph);
rngSel.addEventListener("change", graph);

graph();
