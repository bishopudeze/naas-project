// ════════════════════════════════════════════════════════════════
//  CCU Alert — Firebase Cloud Functions
//
//  These run on Google's servers, keeping your API keys safe.
//  Deploy with: firebase deploy --only functions
//
//  Setup:
//    firebase functions:config:set termii.key="YOUR_TERMII_KEY"
//    firebase functions:config:set anthropic.key="YOUR_ANTHROPIC_KEY"
// ════════════════════════════════════════════════════════════════

const functions  = require("firebase-functions");
const admin      = require("firebase-admin");
const fetch      = require("node-fetch");

admin.initializeApp();
const db = admin.firestore();

// ── 1. Send SMS via Termii ────────────────────────────────────────────────────
//    Called from the browser via: sendSMSAlert(phone, alert)
exports.sendSMS = functions
  .region("europe-west1")
  .https.onCall(async (data, context) => {
    // Require authentication
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "Must be logged in.");
    }

    const { to, message } = data;
    if (!to || !message) {
      throw new functions.https.HttpsError("invalid-argument", "Missing to or message.");
    }

    const termiiKey = functions.config().termii?.key;
    if (!termiiKey) {
      functions.logger.error("Termii key not configured.");
      throw new functions.https.HttpsError("internal", "SMS service not configured.");
    }

    try {
      const res = await fetch("https://api.ng.termii.com/api/sms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to,
          from:    "CCU Alert-NG",
          sms:     message,
          type:    "plain",
          channel: "generic",
          api_key: termiiKey,
        }),
      });
      const result = await res.json();
      functions.logger.info(`[CCU Alert SMS] Sent to ${to}:`, result);
      return { success: true, data: result };
    } catch (err) {
      functions.logger.error("[CCU Alert SMS] Error:", err);
      throw new functions.https.HttpsError("internal", "SMS failed to send.");
    }
  });


// ── 2. Analyze Incident Report with Claude AI ─────────────────────────────────
exports.analyzeReport = functions
  .region("europe-west1")
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "Must be logged in.");
    }

    const { type, state, lga, location, desc } = data;
    const anthropicKey = functions.config().anthropic?.key;

    if (!anthropicKey) {
      throw new functions.https.HttpsError("internal", "AI service not configured.");
    }

    const prompt = `You are a security analyst for the CCU Alert — Community Crisis Unit.
Analyze this citizen incident report and return ONLY a valid JSON object.

Report:
- Type: ${type}
- State: ${state}
- LGA: ${lga}
- Location: ${location || "Not specified"}
- Description: ${desc}

Return EXACTLY:
{
  "severity": "CRITICAL|HIGH|MODERATE|LOW",
  "suggestedMsg": "Public alert, max 120 chars",
  "safetyTips": ["tip1","tip2","tip3"],
  "agencies": ["agency1","agency2"],
  "confidence": 0.85,
  "broadcastRecommended": true,
  "reasoning": "One sentence"
}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type":      "application/json",
          "x-api-key":         anthropicKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model:      "claude-sonnet-4-20250514",
          max_tokens: 800,
          messages:   [{ role: "user", content: prompt }],
        }),
      });

      const result = await res.json();
      const text   = result.content?.find((c) => c.type === "text")?.text || "{}";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());

      // If broadcast recommended, auto-publish the alert
      if (parsed.broadcastRecommended && parsed.severity !== "LOW") {
        await db.collection("alerts").add({
          type, state, lga,
          severity:    parsed.severity,
          msg:         parsed.suggestedMsg,
          verified:    false,
          source:      "Community Report (AI Verified)",
          reportCount: 1,
          timestamp:   admin.firestore.FieldValue.serverTimestamp(),
        });
        functions.logger.info(`[CCU Alert AI] Auto-published ${parsed.severity} alert for ${lga}, ${state}`);
      }

      return { success: true, analysis: parsed };
    } catch (err) {
      functions.logger.error("[CCU Alert AI] Error:", err);
      return {
        success: false,
        analysis: {
          severity: "MODERATE", confidence: 0.5, broadcastRecommended: false,
          suggestedMsg: `Incident reported in ${lga}, ${state}. Exercise caution.`,
          safetyTips: ["Stay indoors", "Call 199", "Avoid the area"],
          agencies: ["Nigeria Police Force"],
          reasoning: "AI temporarily unavailable.",
        },
      };
    }
  });


// ── 3. Broadcast Push Notifications to All Subscribers in a State ─────────────
//    Triggered automatically when a new alert is added to Firestore
exports.onNewAlert = functions
  .region("europe-west1")
  .firestore.document("alerts/{alertId}")
  .onCreate(async (snap, context) => {
    const alert    = snap.data();
    const alertId  = context.params.alertId;

    functions.logger.info(`[CCU Alert Push] New alert: ${alert.severity} in ${alert.lga}, ${alert.state}`);

    // Get all push tokens for subscribers in this state
    const subsSnap = await db.collection("subscriptions")
      .where("state", "==", alert.state)
      .get();

    if (subsSnap.empty) {
      functions.logger.info("[CCU Alert Push] No subscribers for this state.");
      return null;
    }

    const LABELS = {
      BANDIT:"Banditry Alert", KIDNAP:"Kidnapping Alert", FLOOD:"Flood Warning",
      FIRE:"Fire Alert", CULT:"Security Alert", PROTEST:"Civil Unrest",
      ACCIDENT:"Accident Alert", TERROR:"Terror Threat",
      DISEASE:"Health Alert", ROBBERY:"Robbery Alert",
    };

    const label   = LABELS[alert.type] || "Security Alert";
    const isCrit  = alert.severity === "CRITICAL";
    const tokens  = subsSnap.docs.map((d) => d.data().token).filter(Boolean);
    const batches = [];

    // FCM allows max 500 tokens per multicast — batch them
    for (let i = 0; i < tokens.length; i += 500) {
      batches.push(tokens.slice(i, i + 500));
    }

    const messaging = admin.messaging();

    for (const batch of batches) {
      await messaging.sendEachForMulticast({
        tokens: batch,
        notification: {
          title: `🚨 CCU Alert — ${label}`,
          body:  `${alert.lga}, ${alert.state}: ${alert.msg?.slice(0, 100)}`,
        },
        data: {
          alertId,
          severity: alert.severity,
          state:    alert.state,
          lga:      alert.lga,
          type:     alert.type,
        },
        android: {
          priority:     isCrit ? "high" : "normal",
          notification: {
            sound:           "default",
            channelId:       "naas_alerts",
            priority:        isCrit ? "max" : "high",
            defaultVibrateTimings: false,
            vibrateTimingsMillis:  isCrit ? [400, 100, 400, 100, 800] : [200, 100, 200],
          },
        },
        apns: {
          payload: {
            aps: {
              sound:              "default",
              badge:              1,
              "interruption-level": isCrit ? "critical" : "active",
            },
          },
        },
        webpush: {
          notification: {
            requireInteraction: isCrit,
            icon:               "/icons/icon-192x192.png",
            badge:              "/icons/icon-72x72.png",
          },
        },
      });
    }

    functions.logger.info(`[CCU Alert Push] Sent to ${tokens.length} devices in ${alert.state}`);
    return null;
  });


// ── 4. Cleanup stale push tokens (runs daily at midnight) ─────────────────────
exports.cleanupTokens = functions
  .region("europe-west1")
  .pubsub.schedule("0 0 * * *")
  .timeZone("Africa/Lagos")
  .onRun(async () => {
    const cutoff  = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days
    const stale   = await db.collection("subscriptions")
      .where("createdAt", "<", cutoff)
      .get();

    const batch = db.batch();
    stale.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    functions.logger.info(`[CCU Alert Cleanup] Deleted ${stale.size} stale push tokens.`);
    return null;
  });
