// ════════════════════════════════════════════════════════════════
//  PUSH NOTIFICATION SERVICE
//  Uses Web Notifications API in the browser.
//  In production, Firebase Cloud Messaging handles background push.
// ════════════════════════════════════════════════════════════════

const ALERT_SMS_LABELS = {
  BANDIT:"BANDITRY ALERT", KIDNAP:"KIDNAPPING ALERT", FLOOD:"FLOOD ALERT",
  FIRE:"FIRE ALERT", CULT:"SECURITY ALERT", PROTEST:"CIVIL UNREST ALERT",
  ACCIDENT:"ACCIDENT ALERT", TERROR:"TERROR ALERT",
  DISEASE:"HEALTH ALERT", ROBBERY:"ROBBERY ALERT",
};

export const NotificationService = {

  /** Request browser notification permission. Returns true if granted. */
  async requestPermission() {
    if (!("Notification" in window)) return false;
    const result = await Notification.requestPermission();
    return result === "granted";
  },

  /** Is permission currently granted? */
  isGranted() {
    return "Notification" in window && Notification.permission === "granted";
  },

  /** Is the Notifications API available in this browser? */
  isSupported() {
    return "Notification" in window;
  },

  /**
   * Show a push notification for an alert.
   * For CRITICAL alerts: stays on screen until dismissed, vibrates aggressively.
   */
  show(alert) {
    if (!this.isGranted()) return;

    const label   = ALERT_SMS_LABELS[alert.type] || "SECURITY ALERT";
    const isCrit  = alert.severity === "CRITICAL";
    const body    = `${alert.lga}, ${alert.state}: ${alert.msg?.slice(0, 100)}${alert.msg?.length > 100 ? "…" : ""}`;

    try {
      const notif = new Notification(`🚨 CCU Alert — ${label}`, {
        body,
        icon:               "/icons/icon-192x192.png",
        badge:              "/icons/icon-72x72.png",
        tag:                `naas-alert-${alert.id}`,
        requireInteraction: isCrit,
        vibrate:            isCrit ? [400, 100, 400, 100, 800] : [200, 100, 200],
        data:               { alertId: alert.id, url: "/" },
        actions: [
          { action: "call-police", title: "📞 Call Police (199)" },
          { action: "dismiss",     title: "Dismiss" },
        ],
      });

      // Auto-close LOW severity alerts after 8 seconds
      if (alert.severity === "LOW") {
        setTimeout(() => notif.close(), 8000);
      }

      notif.onclick = () => {
        window.focus();
        notif.close();
      };
    } catch (err) {
      console.error("[CCU Alert Notif]", err);
    }
  },

  /** Show a test notification to confirm permissions are working. */
  sendTest() {
    if (!this.isGranted()) return;
    new Notification("✅ CCU Alert Notifications Active", {
      body:    "You will now receive emergency alerts for your state and LGA.",
      icon:    "/icons/icon-192x192.png",
      tag:     "naas-test",
      vibrate: [200],
    });
  },
};
