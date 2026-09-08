const pages={home:"Command Center",scan:"AI Waste Scanner",bins:"Smart Bin Network",route:"Collection Route",rewards:"EcoPoints"};
function showPage(id){document.querySelectorAll(".page").forEach(x=>x.classList.remove("activePage"));document.getElementById(id).classList.add("activePage");document.querySelectorAll(".nav").forEach(x=>x.classList.toggle("active",x.dataset.page===id));document.getElementById("pageTitle").textContent=pages[id];}
document.querySelectorAll(".nav").forEach(b=>b.onclick=()=>showPage(b.dataset.page));
setInterval(()=>document.getElementById("clock").textContent=new Date().toLocaleTimeString(),1000);
const data=[
  ["BIN-042",96,"4.2 hours","HIGH"],
  ["BIN-107",63,"11.8 hours","MEDIUM"],
  ["BIN-219",31,"28+ hours","LOW"],
  ["BIN-118",89,"6.1 hours","HIGH"],
  ["BIN-203",47,"17.5 hours","LOW"],
  ["BIN-088",76,"9.3 hours","MEDIUM"],
  ["BIN-305",92,"5.0 hours","HIGH"]
];
document.getElementById("binGrid").innerHTML=data.map(x=>`
  <div class="bin">
    <small>${x[0]} · LIVE</small>
    <div class="pct">${x[1]}%</div>
    <div class="meter"><i style="width:${x[1]}%"></i></div>
    <p>Predicted overflow: <b>${x[2]}</b></p>
    <em>${x[3]} PRIORITY</em>
    ${x[1] >= 90 ? '<p style="color:#ffb76d;font-weight:bold">⚠ OVERFLOW RISK</p>' : ''}
  </div>
`).join("");

document.getElementById("item").addEventListener("keydown",e=>{if(e.key==="Enter")scan()});
document.getElementById("wasteImage").addEventListener("change", function(e){
  const file = e.target.files[0];
  const preview = document.getElementById("imagePreview");
  const result = document.getElementById("scanResult");

  if(file){
    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";

    result.innerHTML = "◌ ANALYZING WASTE IMAGE...";

    setTimeout(() => {
      result.innerHTML = `
        <b style="color:#58ff9c">IMAGE ANALYSIS COMPLETE</b>
        <br><br>
        AI detected a waste item.
        <br><br>
        <span style="color:#8ea79a">
        For accurate classification, enter the item name below.
        </span>
      `;
    }, 1500);
  }
});
function recalculate(){
  const msg = document.getElementById("routeMsg");

  msg.innerHTML = `
    <p style="color:#58ff9c">
      ✓ Route recalculated successfully.
      <br>
      BIN-042 moved to priority #1.
      <br>
      🚛 Collection vehicle dispatched.
    </p>
  `;
}
function addPoints(){
  const points = document.getElementById("ecoPoints");
  let current = parseInt(points.textContent.replace(",", ""));
  current += 50;
  points.textContent = current.toLocaleString();
}
document.querySelectorAll(".counter").forEach(counter => {
  const target = parseFloat(counter.dataset.target);
  let current = 0;
  const step = target / 40;

  const timer = setInterval(() => {
    current += step;

    if (current >= target) {
      current = target;
      clearInterval(timer);
    }

    if (target % 1 !== 0) {
      counter.textContent = current.toFixed(1) + (target === 8.7 ? " T" : "K");
    } else {
      counter.textContent = Math.floor(current).toLocaleString();
    }
  }, 30);
});
window.addEventListener("load", function () {
  const map = L.map("liveMap").setView([11.1085, 77.3411], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  const points = [
    [11.1085, 77.3411, "BIN-042 - 96% full"],
    [11.1150, 77.3500, "BIN-118 - 89% full"],
    [11.1000, 77.3300, "SORTING HUB"]
  ];

  points.forEach(point => {
    L.marker([point[0], point[1]])
      .addTo(map)
      .bindPopup(point[2]);
  });

  L.polyline(
    points.map(point => [point[0], point[1]]),
    { weight: 5 }
  ).addTo(map);
});
