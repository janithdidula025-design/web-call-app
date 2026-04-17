const CACHE_NAME = 'nexcall-cache-v' + Date.now();
const ASSETS = [
  '/',
  'index.html',
  'manifest.json',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((res) => res || fetch(event.request))
    );
});
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('push', (event) => {
    const data = event.data ? event.data.text() : 'Incoming Secure Call';
    event.waitUntil(
        self.registration.showNotification('NexCall Pro', {
            body: data,
            icon: 'https://cdn-icons-png.flaticon.com/512/174/174879.png',
            vibrate: [200, 100, 200],
            tag: 'call-notification',
            renotify: true
        })
    );
});

// යූසර් Notification එක ක්ලික් කළොත් ඇප් එක ඕපන් කිරීම
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});
