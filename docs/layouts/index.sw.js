(() => {

  let cacheName = 'Cache v1'

  self.addEventListener('install', event => {
    self.skipWaiting()
    event.waitUntil(caches.open(cacheName).then(cache => {
      return cache.addAll([
        '/fonts/ubuntu-300-italic.woff2',
        '/fonts/ubuntu-300.woff2',
        '/fonts/ubuntu-500-italic.woff2',
        '/fonts/ubuntu-500.woff2',
        '/fonts/ubuntu-700-italic.woff2',
        '/fonts/ubuntu-700.woff2',
        '/fonts/ubuntu-italic.woff2',
        '/fonts/ubuntu-mono-700-italic.woff2',
        '/fonts/ubuntu-mono-700.woff2',
        '/fonts/ubuntu-mono-italic.woff2',
        '/fonts/ubuntu-mono-regular.woff2',
        '/fonts/ubuntu-regular.woff2',
        '/images/chrome-icon-192.png',
        '/images/chrome-icon-512.png',
        '/images/explorer-square-70.png',
        '/images/explorer-square-150.png',
        '/images/explorer-square-310.png',
        '/images/explorer-wide.png',
        '/images/og.png',
        '/images/twitter.png',
        '/images/safari-home.png',
        '/images/safari-pinned.svg',
        '/lottie/lottie0.json',
        '/lottie/lottie1.json',
        '/lottie/lottie2.json',
        '/lottie/lottie3.json',
        '/lottie/lottie4.json',
        '/lottie/lottie5.json',
        '/lottie/lottie6.json',
        '/browserconfig.xml',
        '/bundle.min.js',
        '/favicon.ico',
        '/manifest.json',
        '/styles.min.css',
        '/404/',
        '/offline/',
        '/'
      ])
    }))
  })

  self.addEventListener('activate', event => {
    event.waitUntil(caches.keys().then(cacheNames => {
      return Promise.all(cacheNames.map(currentCacheName => {
        if (cacheName.indexOf(currentCacheName) === -1) {
          return caches.delete(currentCacheName)
        }
      }))
    }))
  })

  self.addEventListener('fetch', event => {
    if (event.request.method === 'POST') {
      return
    }
    event.respondWith(caches.match(event.request).then(response => {
      if (response) {
        return response
      }
      return fetch(event.request).then(response => {
        if (response.status === 404) {
          return caches.match('/404/')
        }
        return response;
      })
    }).catch(function() {
        return caches.match('/offline/')
    }))
  })

})()