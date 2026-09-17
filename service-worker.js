const CACHE = 'bubble-safari-v37-final-polish-audio';
const CORE = [
  './', './index.html', './styles.css', './art.css', './worlds.css', './polish-v08.css', './stories-v12.css',
  './game-v3.js', './stories-v12.js', './game-data.js', './tv-nav.js', './voice.js', './art.js', './scene-art.js',
  './manifest.webmanifest', './favicon.svg'
];

const CORE_NAMES = new Set(CORE.map(path => new URL(path, self.location.href).pathname));

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

async function networkFirst(request) {
  try {
    const response = await fetch(request, { cache: 'no-store' });
    if (response.status === 200) return cachePut(request, response);
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.mode === 'navigate') return (await caches.match('./index.html')) || Response.error();
    return Response.error();
  }
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const isAudio = url.pathname.includes('/audio/');
    const isCoreAsset = CORE_NAMES.has(url.pathname);

    if (isAudio) {
      try {
        const response = await fetch(request, { cache: 'no-store' });
        if (response.status === 200) return cachePut(request, response);
        return response;
      } catch {
        const cached = await caches.match(request);
        if (cached) return cached;
        return Response.error();
      }
    }

    if (isCoreAsset) return networkFirst(request);
    return networkFirst(request);
  })());
});
