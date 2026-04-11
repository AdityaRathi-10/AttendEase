importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyDRacIQY-Vf9o93FtXhU24h9532d9SBETs",
  authDomain: "attend-ease-8b4e7.firebaseapp.com",
  projectId: "attend-ease-8b4e7",
  storageBucket: "attend-ease-8b4e7.firebasestorage.app",
  messagingSenderId: "385066415930",
  appId: "1:385066415930:web:68ce373c2c92bcf12d0203",
  measurementId: "G-FNG6XT3CEH"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon.png",
  });
});