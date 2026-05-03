/**
 * @fileoverview Service Worker for VoteWise India.
 * Implements cache-first strategy for static assets and
 * network-first strategy for API calls to optimize performance.
 * 
 * @module sw
 */

const CACHE_NAME = 'votewise-cache-v2';

/** @constant {string[]} STATIC_ASSETS - Assets to precache on install */
const STATIC_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './main.js',
  './manifest.json',
  './src/components/chat.js',
  './src/components/eligibility.js',
  './src/components/guide.js',
  './src/components/faq.js',
  './src/services/googleService.js',
  './src/services/aiService.js',
  './src/config.js',
  './src/utils/dom.js',
  './src/utils/toast.js',
  './src/data/chatKnowledge.js'
];

/**
 * Install event: Precache static assets for offline support.
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

/**
 * Activate event: Clean up old caches when a new version is available.
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

/**
 * Fetch event: Implements a cache-first strategy for static assets
 * and a network-first strategy for Google API requests.
 */
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Network-first for Google API calls
  if (url.hostname.includes('googleapis.com')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            const cloned = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
          }
          return response;
        });
      })
  );
});
