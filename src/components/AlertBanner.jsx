// ── AlertBanner — full-screen emergency banner (Amber Alert style) ────────────

export default function AlertBanner({ alert, onDismiss }) {
  const TYPES = {
    BANDIT:"⚔️", KIDNAP:"🚨", FLOOD:"🌊", FIRE:"🔥",
    CULT:"⚠️", PROTEST:"📢", ACCIDENT:"🚗", TERROR:"💣",
    DISEASE:"🦠", ROBBERY:"🔫",
  };
  const LABELS = {
    BANDIT:"Banditry", KIDNAP:"Kidnapping", FLOOD:"Flood Warning",
    FIRE:"Fire Outbreak", CULT:"Cult Activity", PROTEST:"Civil Unrest",
    ACCIDENT:"Major Accident", TERROR:"Terror Threat",
    DISEASE:"Disease Outbreak", ROBBERY:"Armed Robbery",
  };
  const COLORS = {
    BANDIT:"#e53e3e", KIDNAP:"#d69e2e", FLOOD:"#3182ce", FIRE:"#dd6b20",
    CULT:"#805ad5", PROTEST:"#2d3748", ACCIDENT:"#718096", TERROR:"#c53030",
    DISEASE:"#00897b", ROBBERY:"#b7410e",
  };

  const color  = COLORS[alert.type]  || "#e53e3e";
  const icon   = TYPES[alert.type]   || "🚨";
  const label  = LABELS[alert.type]  || "Security Alert";
  const isCrit = alert.severity === "CRITICAL";

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
      background: isCrit
        ? `repeating-linear-gradient(45deg,${color},${color} 10px,#7b0000 10px,#7b0000 20px)`
        : color,
      color: "#fff",
      animation: "slideDown .35s cubic-bezier(.22,1,.36,1)",
      boxShadow: "0 6px 40px rgba(0,0,0,.6)",
      maxWidth: 500, margin: "0 auto",
    }}>

      {/* Ticker bar */}
      {isCrit && (
        <div style={{ background:"#000", padding:"4px 14px", display:"flex", alignItems:"center", gap:8, fontSize:10, fontFamily:"'Courier New',monospace", letterSpacing:3, justifyContent:"center" }}>
          <span style={{ animation:"blink .6s step-end infinite", color:"#ff4444" }}>■</span>
          EMERGENCY BROADCAST — ALL RESIDENTS ACT IMMEDIATELY
          <span style={{ animation:"blink .6s step-end infinite", color:"#ff4444" }}>■</span>
        </div>
      )}

      {/* System bar */}
      <div style={{ background:"rgba(0,0,0,.3)", padding:"5px 14px", display:"flex", alignItems:"center", gap:8, fontSize:10, fontFamily:"'Courier New',monospace", letterSpacing:2 }}>
        <span style={{ animation:"blink 1s step-end infinite" }}>●</span>
        CCU ALERT — COMMUNITY CRISIS UNIT
        <span style={{ marginLeft:"auto", background: isCrit?"#e53e3e":"rgba(255,255,255,.25)", padding:"2px 7px", borderRadius:4, fontSize:10, fontWeight:700 }}>
          {alert.severity}
        </span>
      </div>

      {/* Main content */}
      <div style={{ padding:"12px 16px", display:"flex", gap:12, alignItems:"flex-start" }}>
        <div style={{ fontSize:36, lineHeight:1, animation: isCrit?"shake .5s ease infinite":"none", flexShrink:0 }}>{icon}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:"'Georgia',serif", fontSize:16, fontWeight:700, marginBottom:3 }}>
            {label} — {alert.lga}, {alert.state}
          </div>
          <div style={{ fontSize:12, lineHeight:1.55, opacity:.93, marginBottom:5 }}>{alert.msg}</div>
          {alert.verified && (
            <div style={{ fontSize:10, background:"rgba(255,255,255,.2)", display:"inline-block", padding:"2px 8px", borderRadius:10 }}>
              ✓ Verified · {alert.source}
            </div>
          )}
        </div>
        <button onClick={onDismiss} style={{ background:"rgba(255,255,255,.2)", border:"1px solid rgba(255,255,255,.3)", color:"#fff", borderRadius:6, padding:"5px 10px", cursor:"pointer", fontSize:12, fontWeight:700, flexShrink:0 }}>
          ✕
        </button>
      </div>

      {/* Emergency action bar */}
      <div style={{ background:"rgba(0,0,0,.25)", padding:"7px 14px", display:"flex", gap:7 }}>
        {[["🚔","Police","199"],["🚑","NEMA","767"],["🏥","Amb.","112"]].map(([ic,lb,num]) => (
          <a key={num} href={`tel:${num}`} style={{ flex:1, textAlign:"center", background:"rgba(255,255,255,.15)", color:"#fff", textDecoration:"none", padding:"7px 4px", borderRadius:6, fontSize:11, fontWeight:700 }}>
            {ic} {lb} {num}
          </a>
        ))}
      </div>

      <style>{`
        @keyframes slideDown { from { transform: translateY(-100%) } to { transform: translateY(0) } }
        @keyframes blink     { 50% { opacity: 0 } }
        @keyframes shake     { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-3px)} 75%{transform:translateX(3px)} }
      `}</style>
    </div>
  );
}
