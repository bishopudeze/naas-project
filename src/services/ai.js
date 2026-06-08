// ════════════════════════════════════════════════════════════════
//  AI ANALYSIS SERVICE — Anthropic Claude
//  Called when a citizen submits an incident report.
//  Determines severity, drafts public alert, routes to agencies.
//
//  NOTE: In production, route this through a Firebase Cloud
//  Function so your Anthropic API key is never in the browser.
// ════════════════════════════════════════════════════════════════

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

// In production this would be your Cloud Function URL:
// const PROXY_URL = "https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/analyzeReport";

/**
 * Analyze a citizen incident report using Claude AI.
 *
 * @param {object} report - { type, state, lga, location, desc }
 * @returns {object}      - { severity, suggestedMsg, safetyTips, agencies, confidence, broadcastRecommended, reasoning }
 */
export async function analyzeReport(report) {
  const prompt = buildPrompt(report);

  try {
    const res = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // In production: remove this and call via your Cloud Function proxy
        // "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY,
        // "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model:      "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages:   [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
    const text = data.content?.find((c) => c.type === "text")?.text || "{}";
    const clean = text.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);

    return {
      severity:             result.severity             || "MODERATE",
      suggestedMsg:         result.suggestedMsg         || fallbackMsg(report),
      safetyTips:           result.safetyTips           || DEFAULT_TIPS,
      agencies:             result.agencies             || ["Nigeria Police Force"],
      confidence:           result.confidence           || 0.5,
      broadcastRecommended: result.broadcastRecommended || false,
      reasoning:            result.reasoning            || "Analysis complete.",
    };
  } catch (err) {
    console.error("[CCU Alert AI] Analysis failed, using defaults:", err);
    return fallbackAnalysis(report);
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildPrompt(report) {
  return `You are a security analyst for the CCU Alert — Community Crisis Unit, a public safety platform serving Nigerian citizens across all 36 states and FCT.

Analyze this citizen-submitted incident report and return ONLY a valid JSON object — no markdown, no preamble, no explanation outside the JSON.

INCIDENT REPORT:
- Type: ${report.type}
- State: ${report.state}
- LGA: ${report.lga}
- Specific location: ${report.location || "Not specified"}
- Description: ${report.desc}

Consider the typical security context of this region of Nigeria when assessing severity.

Return EXACTLY this JSON structure:
{
  "severity": "CRITICAL|HIGH|MODERATE|LOW",
  "suggestedMsg": "Public-safe alert message, max 120 characters, factual, calm but urgent",
  "safetyTips": ["Actionable tip 1", "Actionable tip 2", "Actionable tip 3"],
  "agencies": ["Most relevant agency 1", "Most relevant agency 2"],
  "confidence": 0.85,
  "broadcastRecommended": true,
  "reasoning": "One sentence explaining your severity assessment"
}

Agency options: Nigeria Police Force, Nigerian Army, DSS Intelligence, NEMA, NCDCs, State Government, FCT Police Command, Nigerian Navy, Nigerian Air Force, NAFDAC.`;
}

function fallbackMsg(report) {
  return `Security incident reported in ${report.lga}, ${report.state}. Exercise caution and contact authorities.`;
}

function fallbackAnalysis(report) {
  return {
    severity:             "MODERATE",
    suggestedMsg:         fallbackMsg(report),
    safetyTips:           DEFAULT_TIPS,
    agencies:             ["Nigeria Police Force", "NEMA"],
    confidence:           0.5,
    broadcastRecommended: false,
    reasoning:            "AI service temporarily unavailable. Default analysis applied.",
  };
}

const DEFAULT_TIPS = [
  "Stay indoors and keep doors locked",
  "Call 199 (Police) or 767 (NEMA) if in immediate danger",
  "Avoid the affected area until authorities confirm it is safe",
];
