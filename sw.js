const cacheName = 'resmini-dynamic-v1';
const staticAssets = [
    './',
    './index.html',
    './app.js',
    './manifest.json'
];

// Install Event
self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll(staticAssets);
        })
    );
});

// Activate Event
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== cacheName)
                .map(key => caches.delete(key))
            );
        })
    );
});

// Fetch Event - Network First Strategy
// මේකෙන් වෙන්නේ මුලින්ම අලුත් ෆයිල් එකක් තියෙනවාද බලනවා, නැත්නම් විතරක් cache එකෙන් ගන්නවා.
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {
                return caches.open(cacheName).then(cache => {
                    // අලුත් ෆයිල් එකක් ලැබුනොත් ඒක cache එකටත් දානවා
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            })
            .catch(() => {
                // නෙට්වර්ක් නැත්නම් විතරක් cache එකෙන් ගන්නවා
                return caches.match(event.request);
            })
    );
});

// Message Listener for manual skipWaiting
self.addEventListener('message', event => {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});