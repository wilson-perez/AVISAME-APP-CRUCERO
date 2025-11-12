// app.js
const centro = [5.5128, -72.9461]; // Laguna de Tota
const map = L.map('map', { zoomControl: true }).setView(centro, 11);
// ✅ ACTIVAR UBICACIÓN ACTUAL DEL USUARIO
map.locate({ setView: true, maxZoom: 16, watch: true });

function onLocationFound(e) {
  const radius = e.accuracy / 2;
  L.marker(e.latlng).addTo(map)
    .bindPopup("📍 Estás aquí").openPopup();
  L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
  alert("No se pudo obtener tu ubicación. Verifica permisos de GPS o activa el servicio de ubicación.");
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
L.tileLayer(tileUrl, { maxZoom: 18, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);

const icons = {
  alerta: L.icon({ iconUrl: 'icons/alerta.png', iconSize: [36,36], iconAnchor: [18,36] }),
  peaje: L.icon({ iconUrl: 'icons/peaje.png', iconSize: [36,36], iconAnchor: [18,36] }),
  turismo: L.icon({ iconUrl: 'icons/turismo.png', iconSize: [36,36], iconAnchor: [18,36] }),
  curva: L.icon({ iconUrl: 'icons/curva.png', iconSize: [36,36], iconAnchor: [18,36] }),
  perro: L.icon({ iconUrl: 'icons/perro.png', iconSize: [36,36], iconAnchor: [18,36] }),
  hombres: L.icon({ iconUrl: 'icons/hombres.png', iconSize: [36,36], iconAnchor: [18,36] }),
  accidente: L.icon({ iconUrl: 'icons/accidente.png', iconSize: [36,36], iconAnchor: [18,36] })
};

const routeCoords = [
  [5.4049, -72.9599],
  [5.4105, -72.9580],
  [5.4200, -72.9555],
  [5.4300, -72.9535],
  [5.4405, -72.9522],
  [5.4508, -72.9510],
  [5.4605, -72.9500],
  [5.4704, -72.9490],
  [5.4806, -72.9482],
  [5.4950, -72.9470],
  [5.5050, -72.9465],
  [5.5128, -72.9461],
  [5.5200, -72.9458],
  [5.5350, -72.9452],
  [5.5550, -72.9445],
  [5.5750, -72.9440],
  [5.5950, -72.9445],
  [5.6150, -72.9455],
  [5.6350, -72.9470],
  [5.6550, -72.9485],
  [5.6750, -72.9495],
  [5.6950, -72.9300],
  [5.7056, -72.9350],
  [5.7156, -72.9349]
];
const route = L.polyline(routeCoords, { color: '#0077cc', weight: 5, opacity: 0.9, smoothFactor: 1 }).addTo(map);
map.fitBounds(route.getBounds(), { padding: [20,20] });

const curvas = [
  { coord: [5.4200, -72.9555], title: 'Curva peligrosa - sector 1' },
  { coord: [5.4806, -72.9482], title: 'Curva peligrosa - sector 2' },
  { coord: [5.6750, -72.9495], title: 'Curva peligrosa - sector 3' }
];
curvas.forEach(c => L.marker(c.coord, { icon: icons.curva }).addTo(map).bindPopup(`<strong>${c.title}</strong><br>Reduzca la velocidad.`));
L.marker([5.5950, -72.9445], { icon: icons.peaje }).addTo(map).bindPopup('<strong>Peaje</strong><br>Peaje en tramo.');
L.marker([5.5128, -72.9461], { icon: icons.turismo }).addTo(map).bindPopup('<strong>Laguna de Tota</strong><br>Punto turístico.');
L.marker([5.5350, -72.9452], { icon: icons.perro }).addTo(map).bindPopup('Cruce frecuente de animales.');
L.marker([5.6550, -72.9485], { icon: icons.hombres }).addTo(map).bindPopup('Hombres trabajando - mantenimiento vial.');
L.marker([5.7056, -72.9350], { icon: icons.accidente }).addTo(map).bindPopup('Accidente reportado - proceda con precaución.');

map.on('click', e => { const c = e.latlng; L.popup().setLatLng(c).setContent(`Lat: ${c.lat.toFixed(6)}<br>Lng: ${c.lng.toFixed(6)}`).openOn(map); });

document.getElementById('alertsBtn').addEventListener('click', () => {
  alert('Mostrando alertas en el mapa. Actualización futura: geolocalización.');
});

const aboutBtn = document.getElementById('aboutBtn');
const aboutModal = document.getElementById('aboutModal');
const closeAbout = document.getElementById('closeAbout');
aboutBtn.addEventListener('click', ()=> aboutModal.style.display = 'block');
closeAbout.addEventListener('click', ()=> aboutModal.style.display = 'none');
window.addEventListener('click', e => { if (e.target === aboutModal) aboutModal.style.display = 'none'; });

let deferredPrompt;
const installBtn = document.getElementById('installBtn');
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; installBtn.hidden = false; });
installBtn.addEventListener('click', async () => { if (!deferredPrompt) return; deferredPrompt.prompt(); const choice = await deferredPrompt.userChoice; if (choice.outcome === 'accepted') installBtn.hidden = true; deferredPrompt = null; });

console.log('AVÍSAME listo. Abra la app en línea al menos una vez y recorra la ruta para cachear los tiles.');
