const CACHE = 'bubble-safari-v4';
const CORE = [
  './', './index.html', './styles.css', './worlds.css', './game-v3.js',
  './game-data.js', './tv-nav.js', './voice.js', './manifest.webmanifest', './favicon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

async function cachePut(request, response) {
  if (response?.ok) {
    const cache = await caches.open(CACHE);
    await cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const isAudio = url.pathname.includes('/audio/');

    if (isAudio) {
      const cachedAudio = await caches.match(request);
      if (cachedAudio) return cachedAudio;
      try {
        return await cachePut(request, await fetch(request));
      } catch {
        return Response.error();
      }
    }

    try {
      return await cachePut(request, await fetch(request));
    } catch {
      const cached = await caches.match(request);
      if (cached) return cached;
      if (request.mode === 'navigate') {
        return (await caches.match('./index.html')) || Response.error();
      }
      return Response.error();
    }
  })());
});
