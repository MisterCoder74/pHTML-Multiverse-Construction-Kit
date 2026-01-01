// ============================================================
// BASE ELEMENT CLASS
// ============================================================
class PhtmlElement extends HTMLElement {
getAttr(name, def = '') {
return this.getAttribute(name) || def;
}
hasAttr(name) {
return this.hasAttribute(name);
}
}

// ============================================================
// MULTIVERSE WRAPPER
// ============================================================
class PMultiverseElement extends PhtmlElement {
connectedCallback() {
const name = this.getAttr('name', '');
const inner = this.innerHTML;
this.innerHTML = `
<div class="p-multiverse">
${name ? `<h2>🌀 ${name}</h2>` : ''}
${inner}
</div>`;
}
}

// ============================================================
// UNIVERSE COMPONENT
// ============================================================
class PUniverseElement extends PhtmlElement {
connectedCallback() {
const name = this.getAttr('name', 'Universe');
const version = this.getAttr('version', '2.0');
const age = this.getAttr('age', '13.4 billion years');        
const coordSys = this.getAttr('coordinate-system', '');
const timeScale = this.getAttr('time-scale', '');
const distance = this.getAttr('distance', '');
const inner = this.innerHTML;

this.innerHTML = `
<div class="p-universe-block">
<h2>🌌 ${name}</h2>
<div class="universe-meta" style="opacity:.7;">
Version: ${version}
Age: ${age}
${coordSys ? `<br>Coordinate System: ${coordSys}` : ''}
${timeScale ? `<br>Time Scale: ${timeScale}` : ''}
${distance ? `<br>Distance: ${distance}` : ''}
</div>
<div class="universe-content">${inner}</div>
</div>`;
}
}

// ============================================================
// SOLAR SYSTEM WRAPPER
// ============================================================
class PSolarSystemElement extends PhtmlElement {
connectedCallback() {
const name = this.getAttr('name', 'Solar System');
const age = this.getAttr('age', 'unknown');
const distance = this.getAttr('distance', '');
const inner = this.innerHTML;
this.innerHTML = `
<div class="p-solarsystem-block">
<h3>⭐ ${name}</h3>
<div class="system-age" style="opacity:.8;">
Age: ${age}${distance ? ` | Distance: ${distance}` : ''}
</div>
<div class="system-content">${inner}</div>
</div>`;
}
}

// ============================================================
// STAR COMPONENT
// ============================================================
class StarElement extends PhtmlElement {
connectedCallback() {
const name = this.getAttr('name', 'Star');
const type = this.getAttr('type');
const mass = this.getAttr('mass');
const temp = this.getAttr('temperature');
const luminosity = this.getAttr('luminosity');
const radius = this.getAttr('radius');
const age = this.getAttr('age');
const distance = this.getAttr('distance', '');

this.innerHTML = `
<div class="star-visual"></div>
<div class="star-info">
<h3>☀️ ${name}</h3>
<div class="star-data">
Type: ${type || '?'} | Mass: ${mass || '?'}<br>
Temperature: ${temp || '?'} | Luminosity: ${luminosity || '?'}
${radius ? `<br>Radius: ${radius}` : ''}
${age ? `<br>Age: ${age}` : ''}
${distance ? `<br>Distance: ${distance}` : ''}
</div>
</div>`;
}
}

// ============================================================
// PLANET COMPONENT (Base for all planets)
// ============================================================
class PlanetElement extends PhtmlElement {
connectedCallback() {
const tagType = this.tagName.toLowerCase();
const displayName = this.getAttr('name') || tagType.replace(/^p-/, '');
const order = this.getAttr('order');
const water = this.getAttr('water', '0%');
const terrain = this.getAttr('terrain', '100%');
const mass = this.getAttr('mass');
const radius = this.getAttr('radius');
const air = this.getAttr('air', 'none');
const hasLife = this.hasAttr('population-autoevolve');
const gravity = this.getAttr('gravity');
const orbitalPeriod = this.getAttr('period');
const rotation = this.getAttr('rotation');
const distance = this.getAttr('distance', '');
const hasRings = this.hasAttr('hasrings'); // ✅ nuova proprietà

const waterNum = parseInt(water);
const terrainNum = parseInt(terrain);
const hasNumericComp =
(!isNaN(waterNum) && waterNum > 0) || (!isNaN(terrainNum) && terrainNum > 0);

const moons = Array.from(this.querySelectorAll('p-moon'));
const moonsHtml = moons.length
? `<div class="moons-container">
<div class="moons-title">🌙 Moons: ${moons.length}</div>
${moons.map((m) => m.outerHTML).join('')}
</div>`
: '';

this.innerHTML = `
<div class="planet-header">
<div class="planet-visual"></div>
<div>
<div class="planet-name">${displayName}</div>
${order ? `<div class="planet-order">Position #${order}</div>` : ''}
${distance ? `<div class="planet-distance">Distance: ${distance}</div>` : ''}
</div>
</div>

${hasNumericComp
? `<div class="composition-bar">
${
!isNaN(waterNum) && waterNum > 0
? `<div class="water-section" style="width:${waterNum}%" title="Water ${waterNum}%"></div>`
: ''
}
${
!isNaN(terrainNum) && terrainNum > 0
? `<div class="land-section" style="width:${terrainNum}%" title="Land ${terrainNum}%"></div>`
: ''
}
</div>`
: `<div class="composition-desc"><em>${terrain}</em></div>`}

<div class="planet-stats">
<div><strong>Mass:</strong> ${mass || '?'}</div>
<div><strong>Radius:</strong> ${radius || '?'}</div>
<div><strong>Atmosphere:</strong> ${air}</div>
${gravity ? `<div><strong>Gravity:</strong> ${gravity}</div>` : ''}
${orbitalPeriod ? `<div><strong>Orbital period:</strong> ${orbitalPeriod}</div>` : ''}
${rotation ? `<div><strong>Rotation:</strong> ${rotation}</div>` : ''}
${hasRings ? `<div><strong>💍 Has Rings:</strong> Yes</div>` : ''}
</div>
${hasLife ? '<div class="biosphere-indicator">🧬 Has Life</div>' : ''}
${moonsHtml}`;
}
}

// ============================================================
// MOON COMPONENT
// ============================================================
class MoonElement extends PhtmlElement {
connectedCallback() {
const name = this.getAttr('name', 'Moon');
const distance = this.getAttr('distance');
const locked = this.hasAttr('tidal-locked');
const mass = this.getAttr('mass');
const radius = this.getAttr('radius');
this.innerHTML = `
<div class="moon-visual"></div>
<span>${name}${locked ? ' 🔒' : ''}</span>
<small>${distance ? `Dist: ${distance}` : ''} ${mass ? `<br>Mass: ${mass}` : ''} ${radius ? `<br>R: ${radius}` : ''}</small>`;
}
}

// ============================================================
// COMET GROUP
// ============================================================
class CometGroupElement extends PhtmlElement {
connectedCallback() {
const name = this.getAttr('name', 'Comet Group');
const composition = this.getAttr('composition');
const count = this.getAttr('count');
const orbitType = this.getAttr('orbitType');
const inclination = this.getAttr('inclination');
const discoveryYear = this.getAttr('discoveryYear');
const distance = this.getAttr('distance', '');
this.innerHTML = `
<div class="cometgroup">
<h4>☄️ ${name}</h4>
<div>Composition: ${composition || '?'}</div>
<div>Count: ${count || '?'}</div>
<div>Orbit: ${orbitType || '?'} Incl. ${inclination || '?'}</div>
${discoveryYear ? `<div>Discovered: ${discoveryYear}</div>` : ''}
${distance ? `<div>Distance: ${distance}</div>` : ''}
</div>`;
}
}

// ============================================================
// QUASAR
// ============================================================
class QuasarElement extends PhtmlElement {
connectedCallback() {
const name = this.getAttr('name', 'Quasar');
const redshift = this.getAttr('redshift');
const luminosity = this.getAttr('luminosity');
const distance = this.getAttr('distance');
const massBH = this.getAttr('massBH');
const spectral = this.getAttr('spectralType');
this.innerHTML = `
<div class="quasar">
<h4>✨ ${name}</h4>
<div>Redshift: ${redshift || '?'}</div>
<div>Luminosity: ${luminosity || '?'}</div>
<div>Distance: ${distance || '?'}</div>
<div>BH Mass: ${massBH || '?'}</div>
${spectral ? `<div>Spectrum: ${spectral}</div>` : ''}
</div>`;
}
}

// ============================================================
// PULSAR
// ============================================================
class PulsarElement extends PhtmlElement {
connectedCallback() {
const name = this.getAttr('name', 'Pulsar');
const period = this.getAttr('period');
const magneticField = this.getAttr('magneticField');
const distance = this.getAttr('distance');
const mass = this.getAttr('mass');
const age = this.getAttr('age');
const type = this.getAttr('type');
this.innerHTML = `
<div class="pulsar">
<h4>🌀 ${name}</h4>
<div>Type: ${type || '?'}</div>
<div>Period: ${period || '?'}</div>
<div>Mag Field: ${magneticField || '?'}</div>
<div>Distance: ${distance || '?'}</div>
${mass ? `<div>Mass: ${mass}</div>` : ''}
${age ? `<div>Age: ${age}</div>` : ''}
</div>`;
}
}

// ============================================================
// CONSTELLATION
// ============================================================
class ConstellationElement extends PhtmlElement {
connectedCallback() {
const name = this.getAttr('name', 'Constellation');
const stars = this.getAttr('stars', '');
const hemisphere = this.getAttr('hemisphere', '');
const myth = this.getAttr('myth', '');
const brightest = this.getAttr('brightest', '');
const distance = this.getAttr('distance', '');
this.innerHTML = `
<div class="constellation">
<h4>🌟 ${name}</h4>
${hemisphere ? `<div>Hemisphere: ${hemisphere}</div>` : ''}
${brightest ? `<div>Brightest: ${brightest}</div>` : ''}
${stars ? `<div>Stars: ${stars}</div>` : ''}
${myth ? `<div>Myth: ${myth}</div>` : ''}
${distance ? `<div>Distance: ${distance}</div>` : ''}
</div>`;
}
}

// ============================================================
// NEBULA
// ============================================================
class NebulaElement extends PhtmlElement {
connectedCallback() {
const name = this.getAttr('name', 'Nebula');
const type = this.getAttr('type', '');
const distance = this.getAttr('distance', '');
const size = this.getAttr('size', '');
const composition = this.getAttr('composition', '');
const luminosity = this.getAttr('luminosity', '');
const temperature = this.getAttr('temperature', '');
this.innerHTML = `
<div class="nebula">
<h4>🌫️ ${name}</h4>
${type ? `<div>Type: ${type}</div>` : ''}
${distance ? `<div>Distance: ${distance}</div>` : ''}
${size ? `<div>Size: ${size}</div>` : ''}
${composition ? `<div>Composition: ${composition}</div>` : ''}
${luminosity ? `<div>Luminosity: ${luminosity}</div>` : ''}
${temperature ? `<div>Temperature: ${temperature}</div>` : ''}
</div>`;
}
}

// ============================================================
// ASTEROID BELT (NUOVO COMPONENTE)
// ============================================================
class AsteroidBeltElement extends PhtmlElement {
connectedCallback() {
const name = this.getAttr('name', 'Asteroid Belt');
const composition = this.getAttr('composition', 'rock and metal');
const count = this.getAttr('count', '?');
const distance = this.getAttr('distance', '');
const width = this.getAttr('width', '');
const discovery = this.getAttr('discovered', '');

this.innerHTML = `
<div class="asteroidbelt">
<h4>🪨 ${name}</h4>
<div>Composition: ${composition}</div>
<div>Asteroids: ${count}</div>
${distance ? `<div>Distance: ${distance}</div>` : ''}
${width ? `<div>Width: ${width}</div>` : ''}
${discovery ? `<div>Discovered: ${discovery}</div>` : ''}
</div>`;
}
}

// ============================================================
// REGISTER ALL COMPONENTS
// ============================================================
customElements.define('p-star', StarElement);
customElements.define('p-moon', MoonElement);
customElements.define('p-universe', PUniverseElement);
customElements.define('p-solarsystem', PSolarSystemElement);
customElements.define('p-multiverse', PMultiverseElement);

// pianeti di tipo noto
[
'mercury','venus','earth','mars','jupiter','saturn','uranus','neptune'
].forEach(name => customElements.define(`p-${name}`, class extends PlanetElement {}));

// pianeta generico
customElements.define('p-planet', PlanetElement);

// nuovi componenti
customElements.define('p-cometgroup', CometGroupElement);
customElements.define('p-quasar', QuasarElement);
customElements.define('p-pulsar', PulsarElement);
customElements.define('p-constellation', ConstellationElement);
customElements.define('p-nebula', NebulaElement);
customElements.define('p-asteroidbelt', AsteroidBeltElement);

console.log('✅ pHTML Universe tags loaded');
console.log('📋 Registered elements:', [
'p-star','p-moon','p-planet','p-cometgroup','p-quasar','p-pulsar','p-constellation','p-nebula','p-asteroidbelt'
]);
