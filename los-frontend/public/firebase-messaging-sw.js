importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB1HL7KfA2tiMhbKEKj2J-xhL-5XubIp-o",
  authDomain: "fundflick-96f2b.firebaseapp.com",
  projectId: "fundflick-96f2b",
  storageBucket: "fundflick-96f2b.firebasestorage.app",
  messagingSenderId: "981452297470",
  appId: "1:981452297470:web:19935d291de525fe3bc1af",
  measurementId: "G-WCZD066QMG"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve Firebase Messaging
const messaging = firebase.messaging();

// Handle background message
messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png'
  };

  self.registration.showNotification(payload.notification.title, notificationOptions)
    .then(() => {
      console.log('Notification successfully displayed');
    })
    .catch((error) => {
      console.log('Error showing notification:', error);
    });

});

// Handle on click notification
self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  event.waitUntil(
    clients.openWindow('https://los.fundflick.tech/')
  );
});


