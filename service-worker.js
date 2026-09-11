const CACHE = 'bubble-safari-v9';
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
  // Cache API rejects partial (206) responses. Never let a cache-write failure
  // turn a perfectly valid network response into a failed media request.
  if (response?.ok && response.status === 200) {
    try {
      const cache = await caches.open(CACHE);
      await cache.put(request, response.clone());
    } catch {}
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
    const isRange = request.headers.has('range');

    if (isAudio) {
      const cachedAudio = await caches.match(request);
      if (cachedAudio) return cachedAudio;

      try {
        // Media elements usually request byte ranges. Return 206 responses directly;
        // a parallel full fetch from voice.js warms the offline cache safely.
        const response = await fetch(request);
        if (isRange || response.status === 206) return response;
        return await cachePut(request, response);
      } catch {
        return Response.error();
      }
    }

    // Always revalidate app code and HTML so Smart TVs don't keep stale modules.
    try {
      return await cachePut(request, await fetch(request, { cache: 'no-store' }));
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
