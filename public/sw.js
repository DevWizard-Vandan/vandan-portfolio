// public/sw.js
const CACHE_NAME = 'portfolio-frames-v1';

self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('r2.dev') &&
        event.request.url.includes('frame_')) {
        event.respondWith(
            caches.match(event.request).then((cached) => {
                if (cached) return cached;

                return fetch(event.request).then((response) => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, clone);
                    });
                    return response;
                });
            })
        );
    }
});