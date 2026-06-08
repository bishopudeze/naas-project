// ════════════════════════════════════════════════════════════════
//  useAlerts — Real-time alert subscription hook
//
//  In DEMO mode:  polls the in-memory DB every 8 seconds
//  In PROD mode:  uses Firebase onSnapshot (true real-time)
//
//  To switch to production, set VITE_USE_FIREBASE=true in .env
//  and make sure firebase.js is configured with your project.
// ════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from "react";
import { NotificationService }  from "../services/notifications.js";
import { sendSMSAlert }         from "../services/sms.js";

// In-memory mock DB (replaced by Firestore in production)
import { MOCK_DB } from "../data/mockData.js";

const USE_FIREBASE = import.meta.env.VITE_USE_FIREBASE === "true";

/**
 * @param {string}   userState  - User's current state (e.g. "Lagos")
 * @param {string}   userLga    - User's current LGA (e.g. "Ikeja")
 * @param {object}   user       - Full user object (for SMS prefs/phone)
 * @returns {{ alerts, myAlerts, lastPoll, stats }}
 */
export function useAlerts(userState, userLga, user) {
  const [alerts,   setAlerts]   = useState(MOCK_DB.getAlerts());
  const [lastPoll, setLastPoll] = useState(Date.now());
  const seenIds = useRef(new Set(MOCK_DB.getAlerts().map((a) => a.id)));

  // ── New alert handler ────────────────────────────────────────
  const handleNewAlert = useCallback((alert) => {
    // Push notification
    NotificationService.show(alert);

    // SMS fallback — only if user opted in and alert is local or critical
    const isLocal = alert.state === userState || alert.lga === userLga;
    if (user?.smsAlerts !== false && (isLocal || alert.severity === "CRITICAL")) {
      sendSMSAlert(user.phone, alert);
    }
  }, [userState, userLga, user]);

  // ── Firebase real-time subscription ─────────────────────────
  useEffect(() => {
    if (!USE_FIREBASE) return;

    // Dynamically import to avoid crashing in demo mode
    import("../services/firebase.js").then(({ subscribeToAlerts }) => {
      const unsub = subscribeToAlerts((newAlerts) => {
        setAlerts(newAlerts);
        setLastPoll(Date.now());

        // Detect new alerts
        newAlerts.forEach((a) => {
          if (!seenIds.current.has(a.id)) {
            seenIds.current.add(a.id);
            const isLocal = a.state === userState || a.lga === userLga;
            if (isLocal || a.severity === "CRITICAL") handleNewAlert(a);
          }
        });
      }, userState, userLga);

      return unsub;
    });
  }, [userState, userLga, handleNewAlert]);

  // ── Demo polling (replaces Firestore in demo) ───────────────
  useEffect(() => {
    if (USE_FIREBASE) return;

    const interval = setInterval(() => {
      const current = MOCK_DB.getAlerts();
      setAlerts(current);
      setLastPoll(Date.now());

      current.forEach((a) => {
        if (!seenIds.current.has(a.id)) {
          seenIds.current.add(a.id);
          const isLocal = a.state === userState || a.lga === userLga;
          if (isLocal || a.severity === "CRITICAL") handleNewAlert(a);
        }
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [userState, userLga, handleNewAlert]);

  const myAlerts = alerts.filter(
    (a) => a.state === userState || a.lga === userLga
  );

  const stats = {
    total:    alerts.length,
    critical: alerts.filter((a) => a.severity === "CRITICAL").length,
    high:     alerts.filter((a) => a.severity === "HIGH").length,
    verified: alerts.filter((a) => a.verified).length,
    reports:  MOCK_DB.getReportCount(),
  };

  return { alerts, myAlerts, lastPoll, stats, handleNewAlert };
}
