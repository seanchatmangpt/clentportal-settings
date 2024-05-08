const fileCache = 'file-cache'

const skipDomains = new Set([
  'http://localhost:7000',
  'https://staging.services.leadconnectorhq.com',
  'https://services.leadconnectorhq.com',
])

const skipEndpoints = {
  startsWith: ['courses'],
  endsWith: ['.css'],
}
//const dataPaths = []

const cacheFirstEndpoints = []

const deleteCache = async () => {
  await caches.delete(fileCache)
}

const getRequestData = async event => {
  const url = new URL(event.request.url)
  //Skip service worker for below condition
  const endsWith = url.pathname.split('/').pop()
  const startsWith = url.pathname.split('/')[0]
  if (
    event.request.method !== 'GET' ||
    skipDomains.has(url.origin) ||
    skipEndpoints.endsWith.includes(endsWith) ||
    skipEndpoints.startsWith.includes(startsWith) ||
    event.request.url.includes('assets') ||
    event.request.url.includes('chrome-extension')
  ) {
    return
  }

  event.respondWith(
    (async function () {
      const wellKnownFilePattern = /.well-known\/.*/
      const extensionPattern = /\.[0-9a-z]+$/i

      //Condition to fetch index file
      if (
        !extensionPattern.test(url.pathname) &&
        !wellKnownFilePattern.test(url.pathname) &&
        (url.pathname.startsWith('/communities/') ||
          url.pathname.startsWith('/courses/'))
      ) {
        return handleStagingPortalIndexRequest(event)
      }

      if (
        extensionPattern.test(url.pathname) ||
        url.href.includes('kollab') ||
        url.href.includes('fonts.googleapis.com')
      ) {
        return cacheOnly(event)
      }

      //return cacheFirst(event)
      if (cacheFirstEndpoints.includes(url.pathname)) {
        return cacheFirst(event)
      }

      return cacheFirst(event)
    })()
  )
}

const cacheOnly = async event => {
  const cache = await caches.open(fileCache)
  let response = await cache.match(event.request)
  if (!response) {
    response = await fetch(event.request)
    cache.put(event.request, response.clone())
  }
  return response
}

const cacheFirst = async event => {
  const cache = await caches.open(fileCache)
  let response = await cache.match(event.request)
  if (!response) {
    response = await fetch(event.request)
    cache.put(event.request, response.clone())
  } else {
    networkFirst(event)
  }
  return response
}

const networkFirst = async event => {
  const cache = await caches.open(fileCache)
  let response
  try {
    response = await fetch(event.request)
    cache.put(event.request, response.clone())
  } catch (err) {
    response = await cache.match(event.request)
  } finally {
    return response
  }
}

const handleStagingPortalIndexRequest = async event => {
  const requestToCache = event.request.clone()
  const url = new URL(requestToCache.url)
  if (url.pathname.startsWith('/courses')) {
    return await fetchDataFromCache('courseIndexFile', url.href)
  } else if (url.pathname.startsWith('/communities')) {
    return await fetchDataFromCache('communitiesIndexFile', url.href)
  } else {
    return await fetchDataFromCache('clientportalIndexFile', url.href)
  }
}
async function fetchDataFromCache(cacheKey, url) {
  try {
    const cache = await caches.open(fileCache)
    const cachedResponse = await cache.match(cacheKey)
    if (!cachedResponse) {
      return fetchAndStoreIndexData(url, cacheKey, cache)
    } else {
      fetchAndStoreIndexData(url, cacheKey, cache)
    }
    return cachedResponse
  } catch (err) {
    console.log('Error ', err)
  }
}

async function fetchAndStoreIndexData(url, cacheKey, cache) {
  try {
    const response = await fetch(url)
    if (response.status === 200 || response.status === 404) {
      await cache.put(cacheKey, response.clone())
      return response
    }
  } catch (err) {
    console.log('Error fetching data from cache', err)
  }
}

async function prefetchIndexFiles() {
  const hostname = 'https://' + self.location.hostname
  fetchDataFromCache('communitiesIndexFile', hostname + '/communities/')
  fetchDataFromCache('courseIndexFile', hostname + '/courses/library-v2')
  fetchDataFromCache('clientportalIndexFile', hostname + '/')
}

self.addEventListener('install', async function (event) {})

self.addEventListener('activate', async function (event) {
  event.waitUntil(
    (async function () {
      const cache = await caches.open(fileCache)
      await cache.addAll([
        '/',
        '/index.html',
        '/communities/?',
        '/courses/library-v2',
        'login',
        'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700;800&display=swap',
        'https://rsms.me/inter/inter.css',
        'https://preview-internal.clientclub.net/communities/favicon-safari.png',
        //TODO add other fonts and css files as well
      ])
    })()
  )
  event.waitUntil(deleteCache())
  prefetchIndexFiles()
})

self.addEventListener('fetch', getRequestData)
