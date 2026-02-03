const planetas = [
  { nombre: "Mercurio", size: 12, distance: 120, period: 12, bg: "radial-gradient(circle at 35% 35%, #b0b0b0, #8a8a8a, #666666)" },
  { nombre: "Venus",   size: 18, distance: 160, period: 16, bg: "radial-gradient(circle at 40% 40%, #f0c987, #d8a95a, #b8873a)" },
  { nombre: "Tierra",  size: 20, distance: 200, period: 20 },
  { nombre: "Marte",   size: 16, distance: 240, period: 24, bg: "radial-gradient(circle at 35% 35%, #c1440e, #a6390c, #8a2f0a)" },
  { nombre: "Júpiter", size: 45, distance: 300, period: 36, bg: "radial-gradient(circle at 30% 30%, #d8ca9d, #c19c5a, #8c6f3e), repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.12) 4px, rgba(0,0,0,0.12) 8px)" },
  { nombre: "Saturno", size: 38, distance: 360, period: 44, bg: "radial-gradient(circle at 35% 35%, #e3d39f, #c9a85c, #9b7d3a)" },
  { nombre: "Urano",   size: 28, distance: 420, period: 52, bg: "radial-gradient(circle at 40% 40%, #a0e2e2, #7bb8b8, #4f8a8a)" },
  { nombre: "Neptuno", size: 27, distance: 480, period: 60, bg: "radial-gradient(circle at 35% 35%, #4b70d6, #3a51a8, #223166)" }
];

const datosInfo = {
  "Mercurio": { superficie: "Rocosa con cráteres", diametro: "4,879 km", gravedad: "3.7 m/s²", temperatura: "-173°C a 427°C", lunas: "0", nasa: "mercury" },
  "Venus": { superficie: "Volcánica, atmósfera densa", diametro: "12,104 km", gravedad: "8.87 m/s²", temperatura: "464°C", lunas: "0", nasa: "venus" },
  "Tierra": { superficie: "Océanos y continentes", diametro: "12,742 km", gravedad: "9.81 m/s²", temperatura: "-89°C a 56°C", lunas: "1", nasa: "earth" },
  "Marte": { superficie: "Desierto rojizo (óxido de hierro)", diametro: "6,779 km", gravedad: "3.72 m/s²", temperatura: "-125°C a 20°C", lunas: "2", nasa: "mars" },
  "Júpiter": { superficie: "Gaseoso con bandas", diametro: "139,820 km", gravedad: "24.79 m/s²", temperatura: "-145°C", lunas: "95+", nasa: "jupiter" },
  "Saturno": { superficie: "Gaseoso con anillos de hielo", diametro: "116,460 km", gravedad: "10.44 m/s²", temperatura: "-178°C", lunas: "146+", nasa: "saturn" },
  "Urano": { superficie: "Hielo y gas (metano)", diametro: "50,724 km", gravedad: "8.69 m/s²", temperatura: "-224°C", lunas: "27", nasa: "uranus" },
  "Neptuno": { superficie: "Hielo y gas (metano)", diametro: "49,244 km", gravedad: "11.15 m/s²", temperatura: "-214°C", lunas: "14", nasa: "neptune" }
};

const starsContainer = document.getElementById('stars');
for (let i = 0; i < 350; i++) {
  const star = document.createElement('div');
  star.className = 'star';
  star.style.width = `${Math.random() * 2.5}px`;
  star.style.height = star.style.width;
  star.style.left = `${Math.random() * 100}%`;
  star.style.top = `${Math.random() * 100}%`;
  star.style.setProperty('--dur', `${2 + Math.random() * 6}s`);
  starsContainer.appendChild(star);
}

const solarSystem = document.getElementById('solarSystem');
const infoCard = document.getElementById('infoCard');
const sunEl = document.getElementById('sun');

let planetaSeleccionado = null;
let sistemaEnZoom = false;

// Sol
let solPaused = false;
const animateSun = () => {
  if (!solPaused && !sistemaEnZoom) {
    sunEl.style.transform = `translate(-50%, -50%) rotate(${Date.now() / 30000}deg)`;
  }
  requestAnimationFrame(animateSun);
};
animateSun();

sunEl.addEventListener('mouseenter', (e) => {
  if (!sistemaEnZoom) {
    solPaused = true;
    infoCard.innerHTML = `
      <h3>Sol</h3>
      <p><span class="label">Tipo:</span> Estrella enana amarilla</p>
      <p><span class="label">Diámetro:</span> 1.392 millones km</p>
      <p><span class="label">Gravedad:</span> 274 m/s²</p>
      <p><span class="label">Temp.:</span> 5,500°C (superficie)</p>
      <p><span class="label">Composición:</span> 74% hidrógeno, 24% helio</p>
      <p style="margin-top:8px;text-align:center;">
        <a href="https://solarsystem.nasa.gov/solar-system/sun/overview/" target="_blank">🔍 Ver en NASA</a>
      </p>
    `;
    infoCard.style.opacity = '1';
    infoCard.style.left = e.pageX + 18 + 'px';
    infoCard.style.top = e.pageY + 18 + 'px';
  }
});

sunEl.addEventListener('mouseleave', () => {
  if (!sistemaEnZoom) {
    solPaused = false;
    infoCard.style.opacity = '0';
  }
});

sunEl.addEventListener('click', (e) => {
  e.stopPropagation();
  if (planetaSeleccionado) {
    const data = planetaSeleccionado.__animData;
    if (data) data.pausedByClick = false;
    planetaSeleccionado.classList.remove('planet-zoomed');
    planetaSeleccionado = null;
  }
  sistemaEnZoom = true;
  solPaused = true;
  solarSystem.style.transform = 'translate(-50%, -50%) scale(1.8)';
  infoCard.innerHTML = `
    <h3>Sol</h3>
    <p><span class="label">Superficie:</span> Plasma</p>
    <p><span class="label">Diámetro:</span> 1.392 millones km</p>
    <p><span class="label">Gravedad:</span> 274 m/s²</p>
    <p><span class="label">Temp.:</span> 5,500°C (superficie)<br>15 millones °C (núcleo)</p>
    <p><span class="label">Composición:</span> 74% hidrógeno, 24% helio</p>
    <p style="margin-top:8px;text-align:center;">
      <a href="https://solarsystem.nasa.gov/solar-system/sun/overview/" target="_blank">🔍 Ver en NASA</a>
    </p>
  `;
  infoCard.style.opacity = '1';
  infoCard.style.left = '50%';
  infoCard.style.top = '75%';
  infoCard.style.transform = 'translateX(-50%)';
  infoCard.style.pointerEvents = 'auto';
});

// Planetas
planetas.forEach(p => {
  const orbitEl = document.createElement('div');
  orbitEl.className = 'orbit';
  orbitEl.style.width = `${p.distance * 2}px`;
  orbitEl.style.height = `${p.distance * 2}px`;
  solarSystem.appendChild(orbitEl);

  const holder = document.createElement('div');
  holder.className = 'planet-holder';

  let planetEl;

  if (p.nombre === "Tierra") {
    planetEl = document.createElement('div');
    planetEl.className = 'planet';
    planetEl.dataset.name = p.nombre;
    planetEl.style.setProperty('--size', `${p.size}px`);
    planetEl.style.setProperty('--distance', `${p.distance}px`);

    const sphere = document.createElement('div');
    sphere.className = 'earth-sphere';
    const continents = document.createElement('div');
    continents.className = 'earth-continents';
    sphere.appendChild(continents);
    planetEl.appendChild(sphere);
  } else if (p.nombre === "Saturno") {
    planetEl = document.createElement('div');
    planetEl.className = 'planet saturn-planet';
    planetEl.dataset.name = p.nombre;
    planetEl.style.setProperty('--size', `${p.size}px`);
    planetEl.style.setProperty('--distance', `${p.distance}px`);
    planetEl.style.setProperty('--bg', p.bg);

    const rings = document.createElement('div');
    rings.className = 'saturn-rings';
    planetEl.appendChild(rings);
  } else {
    planetEl = document.createElement('div');
    planetEl.className = 'planet';
    planetEl.dataset.name = p.nombre;
    planetEl.style.setProperty('--size', `${p.size}px`);
    planetEl.style.setProperty('--distance', `${p.distance}px`);
    planetEl.style.setProperty('--bg', p.bg);
  }

  holder.appendChild(planetEl);
  solarSystem.appendChild(holder);

  let angle = Math.random() * Math.PI * 2;
  let pausedByHover = false;
  let pausedByClick = false;

  const animate = () => {
    if (!pausedByHover && !pausedByClick && !sistemaEnZoom) {
      angle += 0.0015 / (p.period / 60);
      holder.style.transform = `translate(-50%, -50%) rotate(${angle}rad)`;
    }
    requestAnimationFrame(animate);
  };
  animate();

  planetEl.addEventListener('mouseenter', (e) => {
    if (!sistemaEnZoom) {
      pausedByHover = true;
      const info = datosInfo[p.nombre];
      infoCard.innerHTML = `
        <h3>${p.nombre}</h3>
        <p><span class="label">Superficie:</span> ${info.superficie}</p>
        <p><span class="label">Diámetro:</span> ${info.diametro}</p>
        <p><span class="label">Gravedad:</span> ${info.gravedad}</p>
        <p><span class="label">Temp.:</span> ${info.temperatura}</p>
        <p><span class="label">Lunas:</span> ${info.lunas}</p>
        <p style="margin-top:8px;text-align:center;">
          <a href="https://solarsystem.nasa.gov/planets/${info.nasa}/overview/" target="_blank">🔍 Ver en NASA</a>
        </p>
      `;
      infoCard.style.opacity = '1';
      infoCard.style.left = e.pageX + 18 + 'px';
      infoCard.style.top = e.pageY + 18 + 'px';
    }
  });

  planetEl.addEventListener('mouseleave', () => {
    if (!sistemaEnZoom) {
      pausedByHover = false;
      infoCard.style.opacity = '0';
    }
  });

  planetEl.addEventListener('click', (e) => {
    e.stopPropagation();
    if (planetaSeleccionado && planetaSeleccionado !== planetEl) {
      const prevData = planetaSeleccionado.__animData;
      if (prevData) prevData.pausedByClick = false;
      planetaSeleccionado.classList.remove('planet-zoomed');
    }

    pausedByClick = true;
    planetaSeleccionado = planetEl;
    planetEl.__animData = { pausedByClick };

    const rect = planetEl.getBoundingClientRect();
    const offsetX = window.innerWidth / 2 - (rect.left + rect.width / 2);
    const offsetY = window.innerHeight / 2 - (rect.top + rect.height / 2);
    solarSystem.style.transform = `translate(-50%, -50%) translate(${offsetX * 0.8}px, ${offsetY * 0.8}px) scale(2)`;

    const info = datosInfo[p.nombre];
    infoCard.innerHTML = `
      <h3>${p.nombre}</h3>
      <p><span class="label">Superficie:</span> ${info.superficie}</p>
      <p><span class="label">Diámetro:</span> ${info.diametro}</p>
      <p><span class="label">Gravedad:</span> ${info.gravedad}</p>
      <p><span class="label">Temp.:</span> ${info.temperatura}</p>
      <p><span class="label">Lunas:</span> ${info.lunas}</p>
      <p style="margin-top:8px;text-align:center;">
        <a href="https://solarsystem.nasa.gov/planets/${info.nasa}/overview/" target="_blank">🔍 Ver en NASA</a>
      </p>
    `;
    infoCard.style.opacity = '1';
    infoCard.style.left = '50%';
    infoCard.style.top = '75%';
    infoCard.style.transform = 'translateX(-50%)';
    infoCard.style.pointerEvents = 'auto';
    sistemaEnZoom = true;
    solPaused = true;
  });
});

document.addEventListener('click', () => {
  if (sistemaEnZoom) {
    if (planetaSeleccionado) {
      const data = planetaSeleccionado.__animData;
      if (data) data.pausedByClick = false;
      planetaSeleccionado.classList.remove('planet-zoomed');
      planetaSeleccionado = null;
    }
    solPaused = false;
    solarSystem.style.transform = 'translate(-50%, -50%) scale(1)';
    infoCard.style.opacity = '0';
    infoCard.style.pointerEvents = 'none';
    infoCard.style.transform = 'none';
    sistemaEnZoom = false;
  }
});

const style = document.createElement('style');
style.textContent = `
  .planet-zoomed {
    transform: translateX(var(--distance)) translate(-50%, -50%) scale(1.8) !important;
    z-index: 50 !important;
    box-shadow: 0 0 35px 12px rgba(100, 200, 255, 0.8) !important;
    filter: brightness(1.25);
  }
`;
document.head.appendChild(style);
