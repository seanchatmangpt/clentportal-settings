function sendMessageToClient(winClients, redirectPath, refId) {
  try {
    for (i = 0; i < winClients.length; i++) {
      winClients[i].postMessage({
        action: 'redirect-from-notificationclick',
        redirectPath: redirectPath,
        refId: refId,
      })
    }
  } catch (error) {
    console.error(error)
  }
}

self.addEventListener('notificationclick', function (event) {
  // Prevent the browser's default notification handling
  event.notification.close()

  // Get the redirectPath from the notification data
  const redirectPath = event.notification.data.FCM_MSG.data.redirectPath
  const refId = event.notification.data.FCM_MSG.data?.refId

  // Navigate all clients to the redirectPath
  event.waitUntil(
    new Promise((resolve, reject) => {
      const checkForWindow = () => {
        clients
          .matchAll({ includeUncontrolled: true, type: 'window' })
          .then(clients => {
            if (clients.length > 0) {
              sendMessageToClient(clients, redirectPath, refId)
              resolve()
              return
            }

            // Check again after 300ms unless 10 seconds have passed
            const elapsed = Date.now() - startTime
            if (elapsed > 10000) {
              reject()
              return
            }

            setTimeout(checkForWindow, 2000)
          })
      }

      const startTime = Date.now()
      checkForWindow()
    })
  )
})

importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-messaging.js')

const firebaseConfig = {
  apiKey: 'AIzaSyAPYXqAWLD3B09ZJYOQrDeeshCZ1nn1-sc',
  authDomain: 'highlevel-backend.firebaseapp.com',
  projectId: 'highlevel-backend',
  storageBucket: 'highlevel-backend.appspot.com',
  messagingSenderId: '439472444885',
  appId: '1:439472444885:web:6fa4c26d1bcbeb87',
  measurementId: 'G-M0VFMNEXPR',
}

const app = firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging(app)

try {
  const messaging = firebase.messaging(app)
  messaging.onBackgroundMessage(payload => {})
} catch (error) {
  console.error('ignored fcm')
}
