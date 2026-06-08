// ════════════════════════════════════════════════════════════════
//  FIREBASE MESSAGING SERVICE WORKER
//  Handles push notifications when the app is in the BACKGROUND
//  or the device screen is off.
//
//  This file MUST live at /public/firebase-messaging-sw.js
//  so Firebase can find it at the root of your domain.
// ════════════════════════════════════════════════════════════════

importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

// ── Initialize Firebase in the service worker ─────────────────
firebase.initializeApp({
  apiKey:            self.FIREBASE_API_KEY            || "YOUR_API_KEY",
  authDomain:        self.FIREBASE_AUTH_DOMAIN        || "YOUR_PROJECT.firebaseapp.com",
  projectId:         self.FIREBASE_PROJECT_ID         || "YOUR_PROJECT_ID",
  storageBucket:     self.FIREBASE_STORAGE_BUCKET     || "YOUR_PROJECT.appspot.com",
  messagingSenderId: self.FIREBASE_MESSAGING_SENDER_ID|| "YOUR_SENDER_ID",
  appId:             self.FIREBASE_APP_ID             || "YOUR_APP_ID",
});

const messaging = firebase.messaging();

// ── Handle background messages ────────────────────────────────
messaging.onBackgroundMessage((payload) => {
  console.log("[CCU Alert SW] Background message received:", payload);

  const { title, body, icon, data } = payload.notification || {};
  const severity = data?.severity || "HIGH";

  const notificationTitle = title || "🚨 CCU Alert Security Alert";
  const notificationOptions = {
    body:    body || "A new security alert has been issued for your area.",
    icon:    icon || "/icons/icon-192x192.png",
    badge:   "/icons/icon-72x72.png",
    tag:     `naas-bg-${data?.alertId || Date.now()}`,
    vibrate: severity === "CRITICAL" ? [400, 100, 400, 100, 800] : [200, 100, 200],
    requireInteraction: severity === "CRITICAL",
    data:    { url: "/", ...data },
    actions: [
      { action: "open",  title: "View Alert" },
      { action: "call",  title: "📞 Call Police 199" },
    ],
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// ── Handle notification click ─────────────────────────────────
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "call") {
    // Open the phone dialer
    clients.openWindow("tel:199");
    return;
  }

  // Open or focus the app
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      return clients.openWindow("/");
    })
  );
});
