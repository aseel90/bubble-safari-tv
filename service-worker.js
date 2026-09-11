const CACHE = 'bubble-safari-v17';
const CORE = [
  './', './index.html', './styles.css', './art.css', './worlds.css', './game-v3.js',
  './game-data.js', './tv-nav.js', './voice.js', './art.js', './scene-art.js', './manifest.webmanifest', './favicon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(CORE.map(async path => {
      const response = await fetch(new Request(path, { cache: 'reload' }));
      if (response.ok && response.status === 200) await cache.put(path, response.clone());
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

async function cachePut(request, response) {
  if (response?.ok && response.status === 200) {
    const cache = await caches.open(CACHE);
    try { await cache.put(request, response.clone()); } catch {}
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
      try {
        const cachedAudio = await caches.match(request);
        if (cachedAudio && !request.headers.has('Range')) return cachedAudio;
        const response = await fetch(request);
        if (!request.headers.has('Range') && response.status === 200) return cachePut(request, response);
        return response;
      } catch {
        return (await caches.match(request)) || Response.error();
      }
    }

    try {
      const response = await fetch(request, { cache: 'no-store' });
      return cachePut(request, response);
    } catch {
      const cached = await caches.match(request);
      if (cached) return cached;
      if (request.mode === 'navigate') return (await caches.match('./index.html')) || Response.error();
      return Response.error();
    }
  })());
});
