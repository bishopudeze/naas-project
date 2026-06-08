import { useState } from "react";
import { NIGERIA_STATES, ALERT_TYPES, SEVERITY_COLOR, MOCK_DB } from "../data/mockData.js";

function timeAgo(ts) {
  const d = Date.now() - ts;
  if (d < 60000)    return `${Math.floor(d/1000)}s ago`;
  if (d < 3600000)  return `${Math.floor(d/60000)}m ago`;
  if (d < 86400000) return `${Math.floor(d/3600000)}h ago`;
  return `${Math.floor(d/86400000)}d ago`;
}

const AGENCIES = [
  "Nigeria Police Force","Nigerian Army","DSS Intelligence","NEMA",
  "Military Intelligence","State Government","NCDC",
  "FCT Police Command","Nigerian Navy","NAFDAC",
];

export default function AdminPanel({ onBack }) {
  const [form, setForm] = useState({ type:"BANDIT", state:"Lagos", lga:"", severity:"HIGH", msg:"", source:"Nigeria Police Force" });
  const [sent, setSent] = useState(false);
  const [log,  setLog]  = useState(MOCK_DB.getAlerts().slice(0, 6));
  const [tab,  setTab]  = useState("broadcast");

  const S = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const publish = () => {
    if (!form.msg.trim() || !form.lga.trim()) return;
    const a = MOCK_DB.addAlert({ ...form, verified: true });
    setSent(true);
    setLog(MOCK_DB.getAlerts().slice(0, 8));
    setTimeout(() => { setSent(false); setForm((p) => ({ ...p, msg:"", lga:"" })); }, 3000);
  };

  // Stat cards for the overview tab
  const allAlerts = MOCK_DB.getAlerts();
  const stats = [
    { label:"Total Alerts",  value: allAlerts.length,                                     color:"#3182ce" },
    { label:"Critical",      value: allAlerts.filter(a=>a.severity==="CRITICAL").length,   color:"#e53e3e" },
    { label:"Verified",      value: allAlerts.filter(a=>a.verified).length,               color:"#006400" },
    { label:"Reports",       value: MOCK_DB.getReportCount(),                              color:"#805ad5" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#0d1117", color:"#fff", fontFamily:"'Courier New',monospace" }}>

      {/* Header */}
      <div style={{ background:"#161b22", padding:"13px 16px", display:"flex", alignItems:"center", gap:11, borderBottom:"1px solid #30363d" }}>
        <button onClick={onBack} style={{ background:"none", border:"1px solid #30363d", color:"#8b949e", borderRadius:6, padding:"5px 11px", cursor:"pointer", fontSize:12 }}>← Back</button>
        <div>
          <div style={{ fontSize:9, letterSpacing:3, color:"#3fb950", textTransform:"uppercase" }}>CCU Alert — Admin Console</div>
          <div style={{ fontSize:14, fontWeight:700 }}>Agency Broadcast Panel</div>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", gap:5, alignItems:"center" }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:"#3fb950", animation:"pulse2 1.5s ease infinite" }}/>
          <span style={{ fontSize:10, color:"#3fb950" }}>ONLINE</span>
        </div>
      </div>

      {/* Admin tabs */}
      <div style={{ display:"flex", gap:1, background:"#161b22", borderBottom:"1px solid #30363d" }}>
        {[["broadcast","📡 Broadcast"],["log","📋 Log"],["stats","📊 Stats"]].map(([k,l]) => (
          <button key={k} onClick={()=>setTab(k)} style={{ flex:1, padding:"10px", border:"none", background: tab===k?"#0d1117":"transparent", color: tab===k?"#3fb950":"#8b949e", fontSize:12, cursor:"pointer", fontFamily:"inherit", fontWeight: tab===k?700:400, borderBottom: tab===k?"2px solid #3fb950":"2px solid transparent" }}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ padding:15 }}>

        {/* BROADCAST TAB */}
        {tab === "broadcast" && (
          <div style={{ background:"#161b22", border:"1px solid #30363d", borderRadius:10, padding:15 }}>
            <div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"#3fb950", marginBottom:13 }}>Broadcast New Alert</div>

            <div style={{ display:"flex", gap:9, marginBottom:11, flexWrap:"wrap" }}>
              <div style={{ flex:1, minWidth:140 }}>
                <label style={{ display:"block", fontSize:9, color:"#8b949e", marginBottom:4, letterSpacing:1 }}>INCIDENT TYPE</label>
                <select value={form.type} onChange={(e) => S("type", e.target.value)} style={{ width:"100%", background:"#0d1117", color:"#fff", border:"1px solid #30363d", borderRadius:6, padding:"8px 9px", fontSize:12, fontFamily:"inherit" }}>
                  {Object.entries(ALERT_TYPES).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
                </select>
              </div>
              <div style={{ flex:1, minWidth:120 }}>
                <label style={{ display:"block", fontSize:9, color:"#8b949e", marginBottom:4, letterSpacing:1 }}>SEVERITY</label>
                <select value={form.severity} onChange={(e) => S("severity", e.target.value)} style={{ width:"100%", background:"#0d1117", color:"#fff", border:"1px solid #30363d", borderRadius:6, padding:"8px 9px", fontSize:12, fontFamily:"inherit" }}>
                  {["CRITICAL","HIGH","MODERATE","LOW"].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display:"flex", gap:9, marginBottom:11 }}>
              <div style={{ flex:1 }}>
                <label style={{ display:"block", fontSize:9, color:"#8b949e", marginBottom:4, letterSpacing:1 }}>STATE</label>
                <select value={form.state} onChange={(e) => S("state", e.target.value)} style={{ width:"100%", background:"#0d1117", color:"#fff", border:"1px solid #30363d", borderRadius:6, padding:"8px 9px", fontSize:12, fontFamily:"inherit" }}>
                  {NIGERIA_STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ flex:1 }}>
                <label style={{ display:"block", fontSize:9, color:"#8b949e", marginBottom:4, letterSpacing:1 }}>LGA</label>
                <input value={form.lga} onChange={(e) => S("lga", e.target.value)} placeholder="Enter LGA name" style={{ width:"100%", boxSizing:"border-box", background:"#0d1117", color:"#fff", border:"1px solid #30363d", borderRadius:6, padding:"8px 9px", fontSize:12, fontFamily:"inherit" }}/>
              </div>
            </div>

            <div style={{ marginBottom:11 }}>
              <label style={{ display:"block", fontSize:9, color:"#8b949e", marginBottom:4, letterSpacing:1 }}>ISSUING AGENCY</label>
              <select value={form.source} onChange={(e) => S("source", e.target.value)} style={{ width:"100%", background:"#0d1117", color:"#fff", border:"1px solid #30363d", borderRadius:6, padding:"8px 9px", fontSize:12, fontFamily:"inherit" }}>
                {AGENCIES.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>

            <div style={{ marginBottom:14 }}>
              <label style={{ display:"block", fontSize:9, color:"#8b949e", marginBottom:4, letterSpacing:1 }}>ALERT MESSAGE</label>
              <textarea value={form.msg} onChange={(e) => S("msg", e.target.value)} placeholder="Write a clear, factual public safety message..." rows={3} style={{ width:"100%", boxSizing:"border-box", background:"#0d1117", color:"#fff", border:"1px solid #30363d", borderRadius:6, padding:"9px 10px", fontSize:12, fontFamily:"inherit", resize:"vertical" }}/>
              <div style={{ fontSize:9, color:"#8b949e", marginTop:2 }}>{form.msg.length} / 200 chars</div>
            </div>

            {sent ? (
              <div style={{ textAlign:"center", padding:"13px", background:"rgba(63,185,80,.1)", border:"1px solid #3fb950", borderRadius:8, color:"#3fb950", fontWeight:700, fontSize:13 }}>
                ✓ BROADCAST SENT — PUSH + SMS TO ALL {form.state.toUpperCase()} SUBSCRIBERS
              </div>
            ) : (
              <button onClick={publish} disabled={!form.msg.trim() || !form.lga.trim()} style={{ width:"100%", padding:"12px", background: form.msg.trim() && form.lga.trim() ? "#da3633" : "#21262d", color:"#fff", border:"none", borderRadius:7, fontSize:13, fontWeight:700, cursor: form.msg.trim() && form.lga.trim() ? "pointer" : "not-allowed", fontFamily:"inherit", letterSpacing:1 }}>
                📡 BROADCAST ALERT TO {form.state.toUpperCase()}
              </button>
            )}
          </div>
        )}

        {/* LOG TAB */}
        {tab === "log" && (
          <div style={{ background:"#161b22", border:"1px solid #30363d", borderRadius:10, padding:13 }}>
            <div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"#3fb950", marginBottom:11 }}>Alert Broadcast Log</div>
            {log.map((a) => (
              <div key={a.id} style={{ borderTop:"1px solid #21262d", padding:"9px 0" }}>
                <div style={{ display:"flex", gap:8, marginBottom:3, fontSize:12 }}>
                  <span>{ALERT_TYPES[a.type]?.icon}</span>
                  <span style={{ color: SEVERITY_COLOR[a.severity], fontWeight:700 }}>{a.severity}</span>
                  <span style={{ color:"#8b949e" }}>·</span>
                  <span style={{ color:"#e6edf3" }}>{a.lga}, {a.state}</span>
                  <span style={{ marginLeft:"auto", color:"#8b949e", fontSize:10 }}>{timeAgo(a.timestamp)}</span>
                </div>
                <div style={{ color:"#8b949e", fontSize:11 }}>{a.msg?.slice(0, 90)}…</div>
                <div style={{ color:"#3fb950", fontSize:10, marginTop:3 }}>Source: {a.source} · {a.verified ? "✓ Verified" : "Unverified"}</div>
              </div>
            ))}
          </div>
        )}

        {/* STATS TAB */}
        {tab === "stats" && (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
              {stats.map(({ label, value, color }) => (
                <div key={label} style={{ background:"#161b22", border:"1px solid #30363d", borderRadius:10, padding:"14px 16px", borderTop:`3px solid ${color}` }}>
                  <div style={{ fontSize:28, fontWeight:800, color, fontFamily:"'Georgia',serif" }}>{value}</div>
                  <div style={{ fontSize:11, color:"#8b949e", marginTop:2, textTransform:"uppercase", letterSpacing:1 }}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{ background:"#161b22", border:"1px solid #30363d", borderRadius:10, padding:13 }}>
              <div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"#3fb950", marginBottom:11 }}>Alerts by Type</div>
              {Object.entries(ALERT_TYPES).map(([k, v]) => {
                const count = allAlerts.filter(a => a.type === k).length;
                const pct   = allAlerts.length ? Math.round((count / allAlerts.length) * 100) : 0;
                return (
                  <div key={k} style={{ marginBottom:9 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:3 }}>
                      <span style={{ color:"#e6edf3" }}>{v.icon} {v.label}</span>
                      <span style={{ color:"#8b949e" }}>{count}</span>
                    </div>
                    <div style={{ background:"#21262d", borderRadius:4, height:6 }}>
                      <div style={{ width:`${pct}%`, height:"100%", background:v.color, borderRadius:4, transition:"width .5s" }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
      <style>{`@keyframes pulse2{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </div>
  );
}
