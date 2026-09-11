const CACHE = 'bubble-safari-v22';
const CORE = [
  './', './index.html', './styles.css', './art.css', './worlds.css', './polish-v08.css',
  './game-v3.js', './game-data.js', './tv-nav.js', './voice.js', './art.js', './scene-art.js',
  './manifest.webmanifest', './favicon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(CORE.map(async path => {
      const response = await fetch(new Request(path, { cache: 'reload' }));
      if (!response.ok || response.status !== 200) throw new Error(`Failed to cache ${path}: ${response.status}`);
      await cache.put(path, response.clone());
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

async function cachePut(cache, request, response) {
  if (response?.ok && response.status === 200) {
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
    const cache = await caches.open(CACHE);
    const isAudio = url.pathname.includes('/audio/');

    if (isAudio) {
      try {
        const cachedAudio = await cache.match(request, { ignoreSearch: true });
        if (cachedAudio && !request.headers.has('Range')) return cachedAudio;
        const response = await fetch(request);
        if (!request.headers.has('Range') && response.status === 200) return cachePut(cache, request, response);
        return response;
      } catch {
        return (await cache.match(request, { ignoreSearch: true })) || Response.error();
      }
    }

    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;

    try {
      const response = await fetch(request, { cache: 'no-store' });
      return cachePut(cache, request, response);
    } catch {
      if (request.mode === 'navigate') return (await cache.match('./index.html')) || Response.error();
      return Response.error();
    }
  })());
});
