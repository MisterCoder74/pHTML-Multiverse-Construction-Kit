const canvas = document.getElementById('solarMap');
const ctx = canvas.getContext('2d');
let planetHitbox = []; // elenco dei pianeti per click detection

document.getElementById('fileInput').addEventListener('change', handleFile);
document.getElementById('loadBtn').addEventListener('click', handleText);

function handleFile(evt) {
const file = evt.target.files[0];
if (!file) return;
const reader = new FileReader();
reader.onload = e => processInput(e.target.result);
reader.readAsText(file);
}

function handleText() {
const text = document.getElementById('dataInput').value.trim();
if (!text) return alert("Incolla del contenuto JSON o pHTML prima.");
processInput(text);
}

function processInput(text) {
try {
let planets = [];
if (text.trim().startsWith('{')) {
const json = JSON.parse(text);
planets = extractFromJSON(json);
} else if (text.includes('<p-')) {
planets = extractFromPHTML(text);
} else {
alert('Formato non riconosciuto: deve essere JSON o markup pHTML.');
}
drawMap(planets);
} catch (err) {
console.error(err);
alert('Errore nella lettura dei dati: ' + err.message);
}
}

function extractFromJSON(json) {
const planets = json.universes?.[0]?.systems?.[0]?.planets || [];
return planets.map(p => ({
name: p.name,
order: p.order,
radius: parseFloat(p.radius.replace(/[^0-9.]/g, '')),
mass: p.mass || "sconosciuta",
air: p.air || "n/a",
terrain: p.terrain || "n/a",
hasLife: p.hasLife ? "Sì" : "No"
}));
}

function extractFromPHTML(markup) {
const parser = new DOMParser();
const doc = parser.parseFromString(markup, "text/html");
const tags = [
"p-mercury","p-venus","p-earth","p-mars","p-jupiter",
"p-saturn","p-uranus","p-neptune"
];
const all = [];
tags.forEach(tag => {
doc.querySelectorAll(tag).forEach(el => {
all.push({
name: tag.replace('p-',''),
order: parseInt(el.getAttribute('order')) || 0,
radius: parseFloat((el.getAttribute('radius') || '0').replace(/[^0-9.]/g, '')) || 0,
mass: el.getAttribute('mass') || "sconosciuta",
air: el.getAttribute('air') || "n/a",
terrain: el.getAttribute('terrain') || "n/a",
hasLife: el.hasAttribute('population-autoevolve') ? "Sì" : "No"
});
});
});
return all.sort((a,b)=>a.order - b.order);
}

function drawMap(planets) {
if (!planets.length) {
alert('Nessun pianeta trovato nei dati.');
return;
}

planetHitbox = [];
ctx.clearRect(0, 0, canvas.width, canvas.height);
const w = canvas.width, h = canvas.height;
const sunX = 100, sunY = h / 2;

// --- disegna il Sole ---
drawSun(sunX, sunY, 40);
planetHitbox.push({ name: "Sole", x: sunX, y: sunY, r: 40, data:{ type:"Star", mass:"1.0 solar" } });

// scala raggio pianeti
const minR = Math.min(...planets.map(p=>p.radius));
const maxR = Math.max(...planets.map(p=>p.radius));
const scaleRadius = r => {
const minPix = 6, maxPix = 40;
if (!r || r <= 0) return minPix;
return minPix + (Math.log(r/minR)/Math.log(maxR/minR))*(maxPix-minPix);
};

const colors = {
mercury:"#9e9e9e",
venus:"#ffdf91",
earth:"#3fa7ff",
mars:"#e57373",
jupiter:"#fbc02d",
saturn:"#ffeb3b",
uranus:"#4dd0e1",
neptune:"#2196f3"
};

const maxOrbit = w - 150;
const minOrbit = 80;
const orbitStep = (maxOrbit - minOrbit) / planets.length;

planets.forEach((p, i) => {
const orbitRadius = minOrbit + orbitStep * i;
const planetX = sunX + orbitRadius;
const planetY = sunY;
const pr = scaleRadius(p.radius);
const color = colors[p.name.toLowerCase()] || '#aaa';

// orbit (semicerchio verso destra)
ctx.strokeStyle = "rgba(255,255,255,0.2)";
ctx.beginPath();
ctx.arc(sunX, sunY, orbitRadius, Math.PI, 2*Math.PI, false);
ctx.stroke();

// pianeta
ctx.beginPath();
ctx.fillStyle = color;
ctx.arc(planetX, planetY, pr, 0, Math.PI*2);
ctx.fill();

// etichetta
ctx.fillStyle = "#fff";
ctx.font = "12px sans-serif";
ctx.textAlign = "center";
ctx.fillText(p.name[0].toUpperCase()+p.name.slice(1), planetX, planetY + pr + 15);

// hitbox per click
planetHitbox.push({
name: p.name,
x: planetX,
y: planetY,
r: pr,
data: {
Raggio: p.radius + " km",
Massa: p.mass,
Atmosfera: p.air,
Superficie: p.terrain,
Vita: p.hasLife
}
});
});
}

function drawSun(x, y, r) {
const gradient = ctx.createRadialGradient(x, y, r*0.3, x, y, r);
gradient.addColorStop(0, '#fff59d');
gradient.addColorStop(0.5, '#ffca28');
gradient.addColorStop(1, '#f57f17');
ctx.beginPath();
ctx.fillStyle = gradient;
ctx.arc(x, y, r, 0, Math.PI * 2);
ctx.fill();
ctx.beginPath();
ctx.strokeStyle = "rgba(255,215,0,0.4)";
ctx.lineWidth = 10;
ctx.arc(x, y, r + 10, 0, Math.PI * 2);
ctx.stroke();
}

// --- Click detection ---
canvas.addEventListener('click', e => {
const rect = canvas.getBoundingClientRect();
const clickX = e.clientX - rect.left;
const clickY = e.clientY - rect.top;
for (const obj of planetHitbox) {
const dx = clickX - obj.x;
const dy = clickY - obj.y;
if (Math.sqrt(dx*dx + dy*dy) <= obj.r) {
openModalCanvas(obj);
return;
}
}
});

// --- Modale ---
function openModalCanvas(obj) {
const modal = document.getElementById('planetModalcanvas');
document.getElementById('planetNamecanvas').textContent = obj.name.toUpperCase();
const infoDiv = document.getElementById('planetInfocanvas');
infoDiv.innerHTML = "";
for (let [k,v] of Object.entries(obj.data)) {
const line = document.createElement('div');
line.innerHTML = `<strong>${k}</strong>: ${v}`;
infoDiv.appendChild(line);
}
modal.style.display = 'flex';
}

document.querySelector('.closecanvas').onclick = () => {
document.getElementById('planetModalcanvas').style.display = 'none';
};
window.onclick = (e) => {
const modal = document.getElementById('planetModalcanvas');
if (e.target === modal) modal.style.display = 'none';
};