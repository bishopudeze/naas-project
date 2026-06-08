// ════════════════════════════════════════════════════════════════
//  SMS SERVICE — Termii (Nigerian SMS Gateway)
//  Sign up at: https://termii.com
//  Docs:       https://developers.termii.com
//
//  IMPORTANT: Never call Termii directly from the browser —
//  your API key would be exposed. Instead, call your own
//  backend (Firebase Cloud Function) which calls Termii.
//  The function below calls YOUR Cloud Function endpoint.
// ════════════════════════════════════════════════════════════════

const CLOUD_FUNCTION_URL = "https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/sendSMS";

/**
 * Send an SMS alert via your Firebase Cloud Function → Termii.
 *
 * @param {string} phone   - Nigerian number, e.g. "08012345678"
 * @param {object} alert   - The alert object from Firestore
 */
export async function sendSMSAlert(phone, alert) {
  const formattedPhone = formatNigerianNumber(phone);
  const message = buildSMSMessage(alert);

  try {
    const res = await fetch(CLOUD_FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: formattedPhone, message }),
    });

    const data = await res.json();
    return { success: true, messageId: data.message_id };
  } catch (err) {
    console.error("[CCU Alert SMS] Failed to send SMS:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Format a Nigerian phone number to international format.
 * "08012345678"  →  "+2348012345678"
 */
function formatNigerianNumber(phone) {
  const clean = phone.replace(/\s+/g, "").replace(/[^0-9+]/g, "");
  if (clean.startsWith("+234")) return clean;
  if (clean.startsWith("0"))    return "+234" + clean.slice(1);
  if (clean.startsWith("234"))  return "+"   + clean;
  return "+234" + clean;
}

/**
 * Build the SMS message text from an alert object.
 * Termii standard SMS max is 160 characters.
 */
function buildSMSMessage(alert) {
  const ALERT_LABELS = {
    BANDIT:"BANDITRY", KIDNAP:"KIDNAPPING", FLOOD:"FLOOD",
    FIRE:"FIRE", CULT:"CULT ACTIVITY", PROTEST:"CIVIL UNREST",
    ACCIDENT:"ACCIDENT", TERROR:"TERROR THREAT",
    DISEASE:"DISEASE OUTBREAK", ROBBERY:"ARMED ROBBERY",
  };
  const label = ALERT_LABELS[alert.type] || "SECURITY ALERT";
  const msg   = alert.msg?.slice(0, 80) || "";
  return `CCU Alert ALERT [${alert.severity}]: ${label} in ${alert.lga}, ${alert.state}. ${msg} Call 199 (Police) or 767 (NEMA). Reply STOP to opt out.`;
}

// ── FIREBASE CLOUD FUNCTION (deploy this separately) ─────────────────────────
// File: functions/index.js
//
// const functions = require("firebase-functions");
// const admin     = require("firebase-admin");
// const fetch     = require("node-fetch");
// admin.initializeApp();
//
// exports.sendSMS = functions.https.onCall(async (data) => {
//   const { to, message } = data;
//   const res = await fetch("https://api.ng.termii.com/api/sms/send", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       to,
//       from:    "CCU Alert-NG",           // Your approved Termii Sender ID
//       sms:     message,
//       type:    "plain",
//       channel: "generic",
//       api_key: functions.config().termii.key,   // firebase functions:config:set termii.key="xxx"
//     }),
//   });
//   return res.json();
// });
