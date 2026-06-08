import { useState } from "react";
import { ALERT_TYPES, SEVERITY_COLOR, SEVERITY_BG } from "../data/mockData.js";

function timeAgo(ts) {
  const d = Date.now() - ts;
  if (d < 60000)    return `${Math.floor(d / 1000)}s ago`;
  if (d < 3600000)  return `${Math.floor(d / 60000)}m ago`;
  if (d < 86400000) return `${Math.floor(d / 3600000)}h ago`;
  return `${Math.floor(d / 86400000)}d ago`;
}

export default function AlertCard({ alert, compact = false }) {
  const [expanded, setExpanded] = useState(false);
  const t  = ALERT_TYPES[alert.type]  || ALERT_TYPES.BANDIT;
  const sc = SEVERITY_COLOR[alert.severity] || "#718096";
  const sb = SEVERITY_BG[alert.severity]   || "#f7fafc";

  return (
    <div
      onClick={() => setExpanded((e) => !e)}
      style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #e2e8f0",
        borderLeft: `4px solid ${sc}`,
        boxShadow: "0 1px 5px rgba(0,0,0,.05)",
        marginBottom: 10,
        cursor: "pointer",
        animation: "fadeUp .3s ease",
        transition: "box-shadow .2s",
      }}
    >
      <div style={{ padding: compact ? "10px 12px" : "12px 14px" }}>
        {/* Header row */}
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
          <span style={{ fontSize: 18 }}>{t.icon}</span>
          <span style={{ fontFamily:"'Georgia',serif", fontWeight:700, fontSize:14, color:"#1a202c", flex:1 }}>
            {t.label}
          </span>
          <span style={{ background:sb, color:sc, fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:99, border:`1px solid ${sc}`, flexShrink:0 }}>
            {alert.severity}
          </span>
        </div>

        {/* Message */}
        <div style={{
          fontSize: 12, color: "#4a5568", lineHeight: 1.5, marginBottom: 6,
          overflow: "hidden", display: "-webkit-box",
          WebkitLineClamp: expanded ? 999 : 2, WebkitBoxOrient: "vertical",
        }}>
          {alert.msg}
        </div>

        {/* Meta row */}
        <div style={{ display:"flex", gap:10, fontSize:11, color:"#718096", flexWrap:"wrap" }}>
          <span>📍 {alert.lga}, {alert.state}</span>
          <span>🕐 {timeAgo(alert.timestamp)}</span>
          {alert.verified && <span style={{ color:"#006400", fontWeight:700 }}>✓ Verified</span>}
          <span>👥 {alert.reportCount || 0}</span>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ background:"#f7fafc", borderTop:"1px solid #e2e8f0", padding:"10px 14px", fontSize:12, color:"#4a5568" }}>
          <div style={{ marginBottom:8 }}>
            <strong>Source:</strong> {alert.source || "Community Report"}
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <a href="tel:199" style={{ flex:1, textAlign:"center", background:"#006400", color:"#fff", textDecoration:"none", padding:"7px", borderRadius:6, fontSize:11, fontWeight:700 }}>🚔 Police 199</a>
            <a href="tel:767" style={{ flex:1, textAlign:"center", background:"#dd6b20", color:"#fff", textDecoration:"none", padding:"7px", borderRadius:6, fontSize:11, fontWeight:700 }}>🚑 NEMA 767</a>
            <a href="tel:112" style={{ flex:1, textAlign:"center", background:"#3182ce", color:"#fff", textDecoration:"none", padding:"7px", borderRadius:6, fontSize:11, fontWeight:700 }}>🏥 Amb. 112</a>
          </div>
        </div>
      )}

      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
