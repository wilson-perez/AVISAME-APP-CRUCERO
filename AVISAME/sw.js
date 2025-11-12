const CACHE_NAME = 'avisame-v2';
const PRECACHE_URLS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/alerta.png',
  './icons/peaje.png',
  './icons/turismo.png',
  './icons/curva.png',
  './icons/perro.png',
  './icons/hombres.png',
  './icons/accidente.png'
];

// Instalar y guardar en caché los archivos iniciales
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
});

// Activar y limpiar versiones de caché antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Interceptar peticiones y servir desde caché o red
self.addEventListener('fetch', event => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then(cachedResp => {
      if (cachedResp) return cachedResp;
      return fetch(req)
        .then(networkResp => {
          if (req.method === 'GET') {
            caches.open(CACHE_NAME).then(cache => {
              try {
                cache.put(req, networkResp.clone());
              } catch (e) {}
            });
          }
          return networkResp;
        })
        .catch(() => {
          if (req.mode === 'navigate') return caches.match('./index.html');
          if (req.destination === 'image') return caches.match('./icons/icon-192.png');
        });
    })
  );
});
