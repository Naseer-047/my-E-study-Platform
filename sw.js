const CACHE_NAME = 'academia-v6';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './frontend/courses.html',
  './frontend/player.html',
  './frontend/js/config.js',
  './frontend/js/notifications.js',
  './frontend/js/player.js',
  './admin/index.html',
  './admin/login.html',
  './admin/editor.html',
  './admin/hackathon-editor.html',
  './manifest.json',
  './offline.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const isNavigation = event.request.mode === 'navigate';
  const isHTML = event.request.url.endsWith('.html') || isNavigation;

  if (isHTML) {
    // Network First then Cache for HTML
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request) || caches.match('./offline.html'))
    );
  } else {
    // Cache First for Assets
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request).then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        });
      })
    );
  }
});
