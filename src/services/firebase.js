// ════════════════════════════════════════════════════════════════
//  FIREBASE CONFIGURATION
//  Replace the values below with your own Firebase project config.
//  Get them from: Firebase Console → Project Settings → Your Apps
// ════════════════════════════════════════════════════════════════

import { initializeApp }              from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot,
         query, orderBy, where, serverTimestamp,
         getDocs, updateDoc, doc }     from "firebase/firestore";
import { getAuth, signInWithPhoneNumber,
         RecaptchaVerifier }           from "firebase/auth";
import { getMessaging, getToken,
         onMessage }                   from "firebase/messaging";
import { getAnalytics }               from "firebase/analytics";

// ── YOUR FIREBASE CONFIG (replace all values) ─────────────────────────────────
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID",
  measurementId:     "YOUR_MEASUREMENT_ID",
};

// ── INITIALIZE ─────────────────────────────────────────────────────────────────
const app       = initializeApp(firebaseConfig);
const db        = getFirestore(app);
const auth      = getAuth(app);
const messaging = getMessaging(app);
const analytics = getAnalytics(app);

// ── FIRESTORE COLLECTIONS ──────────────────────────────────────────────────────
// alerts/          — all published security alerts
// users/           — registered user profiles
// reports/         — citizen incident reports
// subscriptions/   — push token ↔ user mapping

// ── ALERTS ────────────────────────────────────────────────────────────────────

/**
 * Subscribe to real-time alerts.
 * Returns an unsubscribe function — call it on component unmount.
 *
 * @param {function} onUpdate  - called with the full alerts array whenever data changes
 * @param {string}   userState - filter to include this state
 * @param {string}   userLga   - filter to include this LGA
 */
export function subscribeToAlerts(onUpdate, userState, userLga) {
  const q = query(
    collection(db, "alerts"),
    orderBy("timestamp", "desc"),
  );

  return onSnapshot(q, (snapshot) => {
    const alerts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    onUpdate(alerts);
  });
}

/**
 * Publish a new alert (admin/agency use only).
 */
export async function publishAlert(alertData) {
  const docRef = await addDoc(collection(db, "alerts"), {
    ...alertData,
    timestamp:    serverTimestamp(),
    reportCount:  0,
    createdAt:    new Date().toISOString(),
  });
  return docRef.id;
}

// ── USERS ─────────────────────────────────────────────────────────────────────

/**
 * Save or update a user profile in Firestore.
 */
export async function saveUserProfile(uid, profileData) {
  await updateDoc(doc(db, "users", uid), {
    ...profileData,
    updatedAt: serverTimestamp(),
  });
}

// ── REPORTS ───────────────────────────────────────────────────────────────────

/**
 * Submit a citizen incident report.
 */
export async function submitReport(reportData) {
  const docRef = await addDoc(collection(db, "reports"), {
    ...reportData,
    status:    "pending",
    timestamp: serverTimestamp(),
  });
  return docRef.id;
}

// ── FIREBASE CLOUD MESSAGING (Push Notifications) ────────────────────────────

/**
 * Request permission and get the FCM push token for this device.
 * Store the token in Firestore so the backend can target this device.
 *
 * VAPID key: Firebase Console → Project Settings → Cloud Messaging → Web Push certificates
 */
export async function requestPushToken(userId) {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    const token = await getToken(messaging, {
      vapidKey: "YOUR_VAPID_KEY_FROM_FIREBASE_CONSOLE",
    });

    if (token && userId) {
      // Save token to Firestore so Cloud Functions can send targeted pushes
      await addDoc(collection(db, "subscriptions"), {
        userId,
        token,
        platform: navigator.userAgent,
        createdAt: serverTimestamp(),
      });
    }

    return token;
  } catch (err) {
    console.error("[CCU Alert FCM] Push token error:", err);
    return null;
  }
}

/**
 * Listen for incoming FCM messages while the app is in the foreground.
 */
export function onForegroundMessage(callback) {
  return onMessage(messaging, (payload) => {
    callback(payload);
  });
}

// ── PHONE AUTH (OTP login) ────────────────────────────────────────────────────

/**
 * Send OTP to a Nigerian phone number.
 * @param {string} phoneNumber - e.g. "+2348012345678"
 * @param {string} recaptchaContainerId - ID of the DOM element for reCAPTCHA
 */
export async function sendOTP(phoneNumber, recaptchaContainerId) {
  const recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
    size: "invisible",
  });
  const result = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  return result; // result.confirm(otpCode) to verify
}

export { db, auth, messaging, analytics };
