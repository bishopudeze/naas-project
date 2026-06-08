import { useState, useEffect, useRef, useCallback } from "react";

// ════════════════════════════════════════════════════════════════
//  CONSTANTS & DATA
// ════════════════════════════════════════════════════════════════

const NIGERIA_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT – Abuja","Gombe",
  "Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
  "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto",
  "Taraba","Yobe","Zamfara",
];

const LGA_MAP = {
  "Anambra":["Aguata","Awka North","Awka South","Ayamelum","Dunukofia","Ekwusigo","Idemili North","Idemili South","Ihiala","Njikoka","Nnewi North","Nnewi South","Ogbaru","Onitsha North","Onitsha South","Orumba North","Orumba South","Oyi"],
  "Lagos":["Agege","Ajeromi-Ifelodun","Alimosho","Amuwo-Odofin","Badagry","Epe","Eti-Osa","Ibeju-Lekki","Ifako-Ijaiye","Ikeja","Ikorodu","Kosofe","Lagos Island","Lagos Mainland","Mushin","Ojo","Oshodi-Isolo","Shomolu","Surulere"],
  "Rivers":["Abua-Odual","Ahoada East","Ahoada West","Andoni","Asari-Toru","Bonny","Degema","Eleme","Emohua","Etche","Gokana","Ikwerre","Khana","Obio-Akpor","Ogba-Egbema-Ndoni","Ogu-Bolo","Okrika","Omuma","Opobo-Nkoro","Oyigbo","Port Harcourt","Tai"],
  "Kano":["Ajingi","Albasu","Bagwai","Bebeji","Bichi","Bunkure","Dala","Dambatta","Dawakin Kudu","Dawakin Tofa","Doguwa","Fagge","Gabasawa","Garko","Garun Malam","Gaya","Gezawa","Gwale","Gwarzo","Kabo","Kano Municipal","Karaye","Kibiya","Kiru","Kumbotso","Kunchi","Kura","Madobi","Makoda","Minjibir","Nasarawa","Rano","Rimin Gado","Rogo","Shanono","Sumaila","Takai","Tarauni","Tofa","Tsanyawa","Tudun Wada","Ungogo","Warawa","Wudil"],
  "FCT – Abuja":["Abaji","Bwari","Gwagwalada","Kuje","Kwali","Municipal Area Council"],
  "Kaduna":["Birnin Gwari","Chikun","Giwa","Igabi","Ikara","Jaba","Jema'a","Kachia","Kaduna North","Kaduna South","Kagarko","Kajuru","Kaura","Kauru","Kubau","Kudan","Lere","Makarfi","Sabon Gari","Sanga","Soba","Zangon Kataf","Zaria"],
  "Borno":["Abadam","Askira-Uba","Bama","Bayo","Biu","Chibok","Damboa","Dikwa","Gubio","Guzamala","Gwoza","Hawul","Jere","Kaga","Kala-Balge","Konduga","Kukawa","Kwaya Kusar","Mafa","Magumeri","Maiduguri","Marte","Mobbar","Monguno","Ngala","Nganzai","Shani"],
  "Oyo":["Afijio","Akinyele","Atiba","Atisbo","Egbeda","Ibadan North","Ibadan North-East","Ibadan North-West","Ibadan South-East","Ibadan South-West","Ibarapa Central","Ibarapa East","Ibarapa North","Ido","Irepo","Iseyin","Itesiwaju","Iwajowa","Kajola","Lagelu","Ogbomosho North","Ogbomosho South","Ogo Oluwa","Olorunsogo","Oluyole","Ona Ara","Orelope","Ori Ire","Oyo East","Oyo West","Saki East","Saki West","Surulere"],
};

const ALERT_TYPES = {
  BANDIT:  { label:"Banditry",        color:"#e53e3e", icon:"⚔️",  sms:"BANDIT ALERT"  },
  KIDNAP:  { label:"Kidnapping",      color:"#d69e2e", icon:"🚨",  sms:"KIDNAP ALERT"  },
  FLOOD:   { label:"Flood Warning",   color:"#3182ce", icon:"🌊",  sms:"FLOOD ALERT"   },
  FIRE:    { label:"Fire Outbreak",   color:"#dd6b20", icon:"🔥",  sms:"FIRE ALERT"    },
  CULT:    { label:"Cult Activity",   color:"#805ad5", icon:"⚠️",  sms:"SECURITY ALERT"},
  PROTEST: { label:"Civil Unrest",    color:"#2d3748", icon:"📢",  sms:"UNREST ALERT"  },
  ACCIDENT:{ label:"Major Accident",  color:"#718096", icon:"🚗",  sms:"ACCIDENT ALERT"},
  TERROR:  { label:"Terror Threat",   color:"#c53030", icon:"💣",  sms:"TERROR ALERT"  },
  DISEASE: { label:"Disease Outbreak",color:"#00897b", icon:"🦠",  sms:"HEALTH ALERT"  },
  ROBBERY: { label:"Armed Robbery",   color:"#b7410e", icon:"🔫",  sms:"ROBBERY ALERT" },
};

const SEVERITY_COLOR = { CRITICAL:"#e53e3e", HIGH:"#dd6b20", MODERATE:"#d69e2e", LOW:"#38a169" };
const SEVERITY_BG    = { CRITICAL:"#fff5f5", HIGH:"#fffaf0", MODERATE:"#fffff0", LOW:"#f0fff4"  };

const INITIAL_ALERTS = [
  { id:1,  type:"BANDIT",  state:"Zamfara",     lga:"Anka",          severity:"CRITICAL", timestamp:Date.now()-600000,   msg:"Armed bandits reported on Anka-Birnin Magaji road. Avoid travel. Security forces deployed.",                                         verified:true,  source:"Nigeria Police Force",      reportCount:14 },
  { id:2,  type:"KIDNAP",  state:"Kaduna",      lga:"Birnin Gwari",  severity:"HIGH",     timestamp:Date.now()-1920000,  msg:"Kidnapping incident reported near Birnin Gwari. Residents advised to stay indoors and alert police.",                              verified:true,  source:"DSS Intelligence",          reportCount:6  },
  { id:3,  type:"FLOOD",   state:"Benue",       lga:"Makurdi",       severity:"MODERATE", timestamp:Date.now()-3600000,  msg:"River Benue overflowing banks around Makurdi. Low-lying areas to evacuate immediately.",                                          verified:true,  source:"NEMA",                      reportCount:22 },
  { id:4,  type:"FIRE",    state:"Lagos",       lga:"Mushin",        severity:"HIGH",     timestamp:Date.now()-7200000,  msg:"Fire outbreak at Ladipo Market, Mushin. LASG Fire Service responding. Avoid the area.",                                           verified:true,  source:"Lagos State Fire Service",  reportCount:9  },
  { id:5,  type:"CULT",    state:"Rivers",      lga:"Port Harcourt", severity:"HIGH",     timestamp:Date.now()-10800000, msg:"Cult clash reported in Diobu axis. Stay away from Marine Base and Eagle Cement areas.",                                           verified:false, source:"Community Report",          reportCount:4  },
  { id:6,  type:"BANDIT",  state:"Katsina",     lga:"Jibia",         severity:"CRITICAL", timestamp:Date.now()-18000000, msg:"Bandit attack on Jibia-Kankia highway. Multiple casualties reported. Road closed by security forces.",                            verified:true,  source:"Nigeria Army",              reportCount:31 },
  { id:7,  type:"TERROR",  state:"Borno",       lga:"Maiduguri",     severity:"CRITICAL", timestamp:Date.now()-21600000, msg:"IED detonation reported on outskirts of Maiduguri. Security forces on high alert. Avoid outskirts.",                             verified:true,  source:"Military Intelligence",     reportCount:18 },
  { id:8,  type:"PROTEST", state:"Oyo",         lga:"Ibadan North",  severity:"LOW",      timestamp:Date.now()-28800000, msg:"Civil demonstration along Ring Road, Ibadan. Traffic diverted. Remain calm and obey security instructions.",                      verified:true,  source:"Oyo State Government",     reportCount:3  },
  { id:9,  type:"DISEASE", state:"Anambra",     lga:"Onitsha South", severity:"MODERATE", timestamp:Date.now()-43200000, msg:"Suspected cholera outbreak in parts of Onitsha South. Drink clean water only. NCDC notified.",                                   verified:false, source:"Community Report",          reportCount:7  },
  { id:10, type:"ROBBERY", state:"FCT – Abuja", lga:"Bwari",         severity:"HIGH",     timestamp:Date.now()-54000000, msg:"Series of armed robbery attacks reported in Bwari area. Police on patrol. Secure your homes by 9 PM.",                           verified:true,  source:"FCT Police Command",        reportCount:11 },
];

const EMERGENCY_CONTACTS = [
  { icon:"🚔", name:"Nigeria Police Force",        number:"199",            available:"24/7" },
  { icon:"🚑", name:"NEMA Emergency",              number:"767",            available:"24/7" },
  { icon:"🏥", name:"National Ambulance Service",  number:"112",            available:"24/7" },
  { icon:"🔥", name:"Federal Fire Service",        number:"08039148754",    available:"24/7" },
  { icon:"🪖", name:"Nigerian Army Hotline",       number:"08156814965",    available:"24/7" },
  { icon:"🦠", name:"NCDC Disease Helpline",       number:"0800-970000-10", available:"24/7" },
  { icon:"⚡", name:"DSS Tip Line",               number:"08000767",       available:"24/7" },
];

// ════════════════════════════════════════════════════════════════
//  BACKEND SIMULATION  (replace with Firebase/Supabase in prod)
// ════════════════════════════════════════════════════════════════

const DB = {
  _store: { alerts:[...INITIAL_ALERTS], reports:[] },
  getAlerts:   ()         => [...DB._store.alerts].sort((a,b)=>b.timestamp-a.timestamp),
  getByLoc:    (s,l)      => DB._store.alerts.filter(a=>a.state===s||a.lga===l).sort((a,b)=>b.timestamp-a.timestamp),
  addAlert:    (alert)    => { const a={...alert,id:Date.now(),timestamp:Date.now(),reportCount:0}; DB._store.alerts.unshift(a); return a; },
  addReport:   (report)   => { const r={...report,id:Date.now(),status:"pending",timestamp:Date.now()}; DB._store.reports.push(r); return r; },
  getStats:    ()         => ({
    total:    DB._store.alerts.length,
    critical: DB._store.alerts.filter(a=>a.severity==="CRITICAL").length,
    high:     DB._store.alerts.filter(a=>a.severity==="HIGH").length,
    verified: DB._store.alerts.filter(a=>a.verified).length,
    reports:  DB._store.reports.length,
  }),
};

// ════════════════════════════════════════════════════════════════
//  PUSH NOTIFICATION SERVICE  (Web Notifications API)
//  Production: Firebase Cloud Messaging / OneSignal
// ════════════════════════════════════════════════════════════════

const NotifSvc = {
  async requestPermission() {
    if (!("Notification" in window)) return false;
    const r = await Notification.requestPermission();
    return r === "granted";
  },
  send(alert) {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    const t = ALERT_TYPES[alert.type];
    try {
      new Notification(`🚨 CCU Alert — ${t.sms}`, {
        body: `${alert.lga}, ${alert.state}: ${alert.msg.slice(0,100)}`,
        tag:  `naas-${alert.id}`,
        requireInteraction: alert.severity === "CRITICAL",
        vibrate: alert.severity === "CRITICAL" ? [300,100,300,100,600] : [200,100,200],
      });
    } catch {}
  },
  isGranted: () => "Notification" in window && Notification.permission === "granted",
};

// ════════════════════════════════════════════════════════════════
//  SMS FALLBACK SERVICE  (Termii / Africa's Talking simulation)
//  Production: POST https://api.ng.termii.com/api/sms/send
// ════════════════════════════════════════════════════════════════

const SMSSvc = {
  _log: [],
  send(phone, alert) {
    const t   = ALERT_TYPES[alert.type];
    const msg = `CCU ALERT: ${t.sms} in ${alert.lga}, ${alert.state}. ${alert.msg.slice(0,100)} Reply STOP to opt out. -CCU Alert Nigeria`;
    SMSSvc._log.unshift({ phone, msg, sentAt:new Date().toLocaleTimeString(), alertId:alert.id });
    /* Production call would be:
    fetch("https://api.ng.termii.com/api/sms/send", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ to:phone, from:"CCU-ALERT", sms:msg, type:"plain",
                             channel:"generic", api_key: TERMII_API_KEY })
    }); */
    return { success:true };
  },
  getLog: () => [...SMSSvc._log],
};

// ════════════════════════════════════════════════════════════════
//  AI ALERT ANALYSIS  (Claude API)
// ════════════════════════════════════════════════════════════════

async function analyzeWithAI(report) {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `You are a security analyst for the CCU Alert — Community Crisis Unit.
Analyze this citizen incident report for Nigeria and return ONLY a valid JSON object, no markdown, no preamble.

Report type: ${report.type}
State: ${report.state}
LGA: ${report.lga}
Location detail: ${report.location}
Description: ${report.desc}

Return EXACTLY this JSON:
{
  "severity": "CRITICAL|HIGH|MODERATE|LOW",
  "suggestedMsg": "concise public safety message max 120 chars",
  "safetyTips": ["tip1","tip2","tip3"],
  "agencies": ["agency1","agency2"],
  "confidence": 0.85,
  "broadcastRecommended": true,
  "reasoning": "one sentence explanation"
}`
        }],
      }),
    });
    const data = await res.json();
    const raw  = data.content?.find(c=>c.type==="text")?.text || "{}";
    return JSON.parse(raw.replace(/```json|```/g,"").trim());
  } catch {
    return {
      severity:"MODERATE", confidence:0.5, broadcastRecommended:false,
      suggestedMsg:`${report.type} reported in ${report.lga}, ${report.state}. Stay alert.`,
      safetyTips:["Stay indoors","Alert authorities","Avoid the area"],
      agencies:["Nigeria Police Force","NEMA"],
      reasoning:"AI unavailable — default analysis applied.",
    };
  }
}

// ════════════════════════════════════════════════════════════════
//  REAL-TIME POLLING (Supabase Realtime / Firebase onSnapshot sim)
// ════════════════════════════════════════════════════════════════

function useRealTime(userState, userLga, onNew) {
  const [alerts,   setAlerts]   = useState(DB.getAlerts());
  const [lastPoll, setLastPoll] = useState(Date.now());
  const seen = useRef(new Set(INITIAL_ALERTS.map(a=>a.id)));

  useEffect(() => {
    const iv = setInterval(() => {
      const current = DB.getAlerts();
      setAlerts(current);
      current.forEach(a => {
        if (!seen.current.has(a.id)) {
          seen.current.add(a.id);
          const local = a.state===userState || a.lga===userLga;
          if (local || a.severity==="CRITICAL") onNew(a);
        }
      });
      setLastPoll(Date.now());
    }, 8000);
    return () => clearInterval(iv);
  }, [userState, userLga, onNew]);

  return { alerts, lastPoll };
}

// ════════════════════════════════════════════════════════════════
//  HELPERS
// ════════════════════════════════════════════════════════════════

function useLS(key, init) {
  const [v, setV] = useState(() => {
    try { const s=localStorage.getItem(key); return s?JSON.parse(s):init; } catch { return init; }
  });
  const save = nv => { setV(nv); try { localStorage.setItem(key,JSON.stringify(nv)); } catch {} };
  return [v, save];
}

function ago(ts) {
  const d=Date.now()-ts;
  if(d<60000)  return `${Math.floor(d/1000)}s ago`;
  if(d<3600000)return `${Math.floor(d/60000)}m ago`;
  if(d<86400000)return `${Math.floor(d/3600000)}h ago`;
  return `${Math.floor(d/86400000)}d ago`;
}

// ════════════════════════════════════════════════════════════════
//  UI COMPONENTS
// ════════════════════════════════════════════════════════════════

function AlertBanner({ alert, onDismiss }) {
  const t  = ALERT_TYPES[alert.type];
  const crit = alert.severity==="CRITICAL";
  return (
    <div style={{ position:"fixed",top:0,left:0,right:0,zIndex:9999,
      background: crit
        ? `repeating-linear-gradient(45deg,${t.color},${t.color} 10px,#7b0000 10px,#7b0000 20px)`
        : t.color,
      color:"#fff", animation:"slideDown .35s cubic-bezier(.22,1,.36,1)",
      boxShadow:"0 6px 40px rgba(0,0,0,.6)", maxWidth:500, margin:"0 auto" }}>
      {crit && (
        <div style={{ background:"#000",padding:"4px 16px",display:"flex",alignItems:"center",gap:8,fontSize:10,fontFamily:"'Courier New',monospace",letterSpacing:3,justifyContent:"center" }}>
          <span style={{ animation:"blink .6s step-end infinite",color:"#ff4444" }}>■</span>
          EMERGENCY BROADCAST — ALL RESIDENTS ACT IMMEDIATELY
          <span style={{ animation:"blink .6s step-end infinite",color:"#ff4444" }}>■</span>
        </div>
      )}
      <div style={{ background:"rgba(0,0,0,.3)",padding:"5px 14px",display:"flex",alignItems:"center",gap:8,fontSize:10,fontFamily:"'Courier New',monospace",letterSpacing:2 }}>
        <span style={{ animation:"blink 1s step-end infinite" }}>●</span>
        CCU ALERT — COMMUNITY CRISIS UNIT
        <span style={{ marginLeft:"auto",background:SEVERITY_COLOR[alert.severity],padding:"2px 7px",borderRadius:4,fontSize:10 }}>{alert.severity}</span>
      </div>
      <div style={{ padding:"12px 16px",display:"flex",gap:12,alignItems:"flex-start" }}>
        <div style={{ fontSize:36,lineHeight:1,animation:crit?"shake .5s ease infinite":"none" }}>{t.icon}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:"'Georgia',serif",fontSize:16,fontWeight:700,marginBottom:3 }}>{t.label} — {alert.lga}, {alert.state}</div>
          <div style={{ fontSize:12,lineHeight:1.55,opacity:.92,marginBottom:5 }}>{alert.msg}</div>
          {alert.verified && <div style={{ fontSize:10,background:"rgba(255,255,255,.2)",display:"inline-block",padding:"2px 8px",borderRadius:10 }}>✓ Verified · {alert.source}</div>}
        </div>
        <button onClick={onDismiss} style={{ background:"rgba(255,255,255,.2)",border:"1px solid rgba(255,255,255,.3)",color:"#fff",borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:12,fontWeight:700,flexShrink:0 }}>✕</button>
      </div>
      <div style={{ background:"rgba(0,0,0,.2)",padding:"7px 14px",display:"flex",gap:8 }}>
        {[["🚔","Police","199"],["🚑","NEMA","767"],["🏥","Amb.","112"]].map(([ic,lb,num])=>(
          <a key={num} href={`tel:${num}`} style={{ flex:1,textAlign:"center",background:"rgba(255,255,255,.15)",color:"#fff",textDecoration:"none",padding:"7px 4px",borderRadius:6,fontSize:11,fontWeight:700 }}>{ic} {lb} {num}</a>
        ))}
      </div>
      <style>{`@keyframes slideDown{from{transform:translateY(-100%)}to{transform:translateY(0)}} @keyframes blink{50%{opacity:0}} @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}`}</style>
    </div>
  );
}

function AlertCard({ alert, compact }) {
  const t  = ALERT_TYPES[alert.type];
  const sc = SEVERITY_COLOR[alert.severity];
  const sb = SEVERITY_BG[alert.severity];
  const [exp, setExp] = useState(false);
  return (
    <div onClick={()=>setExp(e=>!e)} style={{ background:"#fff",borderRadius:12,border:"1px solid #e2e8f0",borderLeft:`4px solid ${sc}`,boxShadow:"0 1px 5px rgba(0,0,0,.05)",marginBottom:10,cursor:"pointer",animation:"fadeUp .3s ease" }}>
      <div style={{ padding:compact?"10px 12px":"12px 14px" }}>
        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:5 }}>
          <span style={{ fontSize:17 }}>{t.icon}</span>
          <span style={{ fontFamily:"'Georgia',serif",fontWeight:700,fontSize:14,color:"#1a202c",flex:1 }}>{t.label}</span>
          <span style={{ background:sb,color:sc,fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:99,border:`1px solid ${sc}`,flexShrink:0 }}>{alert.severity}</span>
        </div>
        <div style={{ fontSize:12,color:"#4a5568",lineHeight:1.5,marginBottom:5,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:exp?999:2,WebkitBoxOrient:"vertical" }}>{alert.msg}</div>
        <div style={{ display:"flex",gap:8,fontSize:11,color:"#718096",flexWrap:"wrap" }}>
          <span>📍 {alert.lga}, {alert.state}</span>
          <span>🕐 {ago(alert.timestamp)}</span>
          {alert.verified && <span style={{ color:"#006400",fontWeight:700 }}>✓ Verified</span>}
          <span>👥 {alert.reportCount}</span>
        </div>
      </div>
      {exp && (
        <div style={{ background:"#f7fafc",borderTop:"1px solid #e2e8f0",padding:"10px 14px",fontSize:12,color:"#4a5568" }}>
          <strong>Source:</strong> {alert.source||"Community Report"}
          <div style={{ marginTop:8,display:"flex",gap:8 }}>
            <a href="tel:199" style={{ flex:1,textAlign:"center",background:"#006400",color:"#fff",textDecoration:"none",padding:"7px",borderRadius:6,fontSize:11,fontWeight:700 }}>🚔 Police</a>
            <a href="tel:767" style={{ flex:1,textAlign:"center",background:"#dd6b20",color:"#fff",textDecoration:"none",padding:"7px",borderRadius:6,fontSize:11,fontWeight:700 }}>🚑 NEMA</a>
            <a href="tel:112" style={{ flex:1,textAlign:"center",background:"#3182ce",color:"#fff",textDecoration:"none",padding:"7px",borderRadius:6,fontSize:11,fontWeight:700 }}>🏥 Amb.</a>
          </div>
        </div>
      )}
    </div>
  );
}

function StatBadge({ label, value, color }) {
  return (
    <div style={{ background:"#fff",borderRadius:10,padding:"11px 12px",flex:1,borderTop:`3px solid ${color}`,boxShadow:"0 1px 4px rgba(0,0,0,.05)" }}>
      <div style={{ fontSize:20,fontWeight:800,color,fontFamily:"'Georgia',serif" }}>{value}</div>
      <div style={{ fontSize:9,color:"#718096",marginTop:1,textTransform:"uppercase",letterSpacing:.8 }}>{label}</div>
    </div>
  );
}

function NotifBanner({ granted, onRequest }) {
  if (granted) return (
    <div style={{ background:"#f0fff4",border:"1px solid #68d391",borderRadius:8,padding:"8px 12px",fontSize:12,color:"#276749",display:"flex",alignItems:"center",gap:6,marginBottom:12 }}>
      🔔 Push notifications <strong>active</strong>. You'll be alerted even when the app is closed.
    </div>
  );
  return (
    <div style={{ background:"#fffbeb",border:"1px solid #f6e05e",borderRadius:8,padding:"10px 12px",fontSize:12,color:"#744210",marginBottom:12 }}>
      <div style={{ fontWeight:700,marginBottom:4 }}>🔕 Push Notifications Off</div>
      <div style={{ marginBottom:8 }}>Enable to receive emergency alerts even when CCU Alert is closed.</div>
      <button onClick={onRequest} style={{ background:"#006400",color:"#fff",border:"none",borderRadius:6,padding:"6px 14px",fontSize:12,fontWeight:700,cursor:"pointer" }}>Enable Now</button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  SPLASH
// ════════════════════════════════════════════════════════════════

function Splash({ onStart }) {
  return (
    <div style={{ minHeight:"100vh",background:"linear-gradient(160deg,#003d00 0%,#006400 45%,#1a3300 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:28,color:"#fff",position:"relative",overflow:"hidden" }}>
      <div style={{ position:"absolute",inset:0,opacity:.04,backgroundImage:"repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 40px)" }}/>
      <div style={{ position:"relative",display:"flex",flexDirection:"column",alignItems:"center",maxWidth:380,width:"100%" }}>
        <div style={{ width:96,height:96,borderRadius:"50%",background:"radial-gradient(circle,#22c55e,#006400)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:48,boxShadow:"0 0 0 10px rgba(34,197,94,.15),0 14px 40px rgba(0,0,0,.4)",marginBottom:18,animation:"glow 2.5s ease-in-out infinite" }}>🛡️</div>
        <div style={{ fontFamily:"'Georgia',serif",fontSize:34,fontWeight:700,letterSpacing:2 }}>CCU Alert</div>
        <div style={{ fontSize:11,letterSpacing:4,textTransform:"uppercase",color:"#86efac",marginTop:4,marginBottom:3 }}>Community Crisis Unit</div>
        <div style={{ fontSize:10,color:"rgba(255,255,255,.4)",marginBottom:28,letterSpacing:1 }}>v2.0 · AI-Powered</div>
        <div style={{ textAlign:"center",fontSize:13,color:"rgba(255,255,255,.75)",lineHeight:1.8,marginBottom:30 }}>
          Real-time security alerts for your state and LGA — powered by AI, push notifications, and SMS backup. Every life matters.
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:30,width:"100%" }}>
          {[["🔔","Push Alerts"],["📍","LGA-Precise"],["🤖","AI Analysis"],["🆘","Report Now"],["📱","SMS Backup"],["✓","Verified Info"]].map(([ic,lb])=>(
            <div key={lb} style={{ background:"rgba(255,255,255,.08)",borderRadius:8,padding:"10px 6px",textAlign:"center" }}>
              <div style={{ fontSize:20,marginBottom:3 }}>{ic}</div>
              <div style={{ fontSize:9,color:"#86efac",letterSpacing:.5 }}>{lb}</div>
            </div>
          ))}
        </div>
        <button onClick={onStart} style={{ width:"100%",background:"linear-gradient(135deg,#22c55e,#006400)",color:"#fff",border:"none",borderRadius:14,padding:"16px",fontSize:16,fontWeight:700,cursor:"pointer",letterSpacing:1,boxShadow:"0 6px 24px rgba(34,197,94,.4)",fontFamily:"'Georgia',serif" }}>
          GET STARTED — FREE →
        </button>
        <div style={{ marginTop:14,fontSize:10,color:"rgba(255,255,255,.3)",textAlign:"center" }}>Works offline · 36 states covered · Push + SMS alerts</div>
      </div>
      <style>{`@keyframes glow{0%,100%{box-shadow:0 0 0 10px rgba(34,197,94,.15),0 14px 40px rgba(0,0,0,.4)}50%{box-shadow:0 0 0 18px rgba(34,197,94,.1),0 14px 60px rgba(34,197,94,.35)}}`}</style>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  SIGNUP
// ════════════════════════════════════════════════════════════════

function Signup({ onComplete }) {
  const [form,setForm]=useState({firstName:"",lastName:"",phone:"",email:"",state:"",lga:"",role:"Civilian",smsAlerts:true,pushAlerts:true,neighbouringLGA:true});
  const [step,setStep]=useState(1);
  const [err,setErr]=useState("");
  const [notif,setNotif]=useState(NotifSvc.isGranted());
  const set=(k,v)=>setForm(p=>({...p,[k]:v,...(k==="state"?{lga:""}:{})}));
  const lgas=LGA_MAP[form.state]||[];

  const next=()=>{
    if(step===1){
      if(!form.firstName.trim()||!form.lastName.trim()||!form.phone.trim()) return setErr("Please fill in name and phone number.");
      if(!/^0[789][01]\d{8}$/.test(form.phone.replace(/\s/g,""))) return setErr("Enter a valid Nigerian phone (e.g. 08012345678).");
      setErr(""); setStep(2);
    } else {
      if(!form.state) return setErr("Please select your state.");
      setErr("");
      onComplete({...form, lga: form.lga||(form.state+" General")});
    }
  };

  const Inp=({label,k,type="text",ph=""})=>(
    <div style={{marginBottom:13}}>
      <label style={{display:"block",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"#4a5568",marginBottom:5}}>{label}</label>
      <input type={type} value={form[k]} onChange={e=>set(k,e.target.value)} placeholder={ph}
        style={{width:"100%",boxSizing:"border-box",padding:"11px 13px",borderRadius:8,border:"1.5px solid #cbd5e0",fontSize:14,outline:"none",fontFamily:"inherit",background:"#f7fafc"}}/>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"#f0fdf4",display:"flex",flexDirection:"column"}}>
      <div style={{background:"linear-gradient(135deg,#006400,#14532d)",padding:"16px 18px 22px",color:"#fff"}}>
        <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:"#86efac",marginBottom:3}}>Registration · Step {step} of 2</div>
        <div style={{fontFamily:"'Georgia',serif",fontSize:19,fontWeight:700}}>{step===1?"Your Profile":"Location & Alerts"}</div>
        <div style={{marginTop:10,display:"flex",gap:6}}>
          {[1,2].map(s=><div key={s} style={{flex:1,height:3,borderRadius:3,background:s<=step?"#86efac":"rgba(255,255,255,.2)",transition:"background .3s"}}/>)}
        </div>
      </div>
      <div style={{flex:1,padding:18}}>
        {step===1&&<>
          <Inp label="First Name" k="firstName" ph="e.g. Chinedu"/>
          <Inp label="Last Name"  k="lastName"  ph="e.g. Okafor"/>
          <Inp label="Phone Number" k="phone" type="tel" ph="e.g. 08012345678"/>
          <Inp label="Email (Optional)" k="email" type="email" ph="for account recovery"/>
          <div style={{marginBottom:13}}>
            <label style={{display:"block",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"#4a5568",marginBottom:6}}>I am a</label>
            <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
              {["Civilian","Student","Trader","Security Personnel","Journalist","Health Worker","Driver","Pastor/Imam"].map(r=>(
                <button key={r} onClick={()=>set("role",r)} style={{padding:"7px 11px",borderRadius:18,border:`1.5px solid ${form.role===r?"#006400":"#cbd5e0"}`,background:form.role===r?"#006400":"#fff",color:form.role===r?"#fff":"#4a5568",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>{r}</button>
              ))}
            </div>
          </div>
        </>}

        {step===2&&<>
          <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:12,marginBottom:14,fontSize:12,color:"#4a5568",lineHeight:1.6}}>
            📍 Your state and LGA determine which alerts you receive. You can update this anytime when you travel.
          </div>
          <div style={{marginBottom:12}}>
            <label style={{display:"block",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"#4a5568",marginBottom:5}}>State</label>
            <select value={form.state} onChange={e=>set("state",e.target.value)} style={{width:"100%",padding:"11px 13px",borderRadius:8,border:"1.5px solid #cbd5e0",fontSize:14,background:"#f7fafc",fontFamily:"inherit"}}>
              <option value="">-- Select State --</option>
              {NIGERIA_STATES.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{marginBottom:14}}>
            <label style={{display:"block",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"#4a5568",marginBottom:5}}>LGA</label>
            <select value={form.lga} onChange={e=>set("lga",e.target.value)} disabled={!form.state} style={{width:"100%",padding:"11px 13px",borderRadius:8,border:"1.5px solid #cbd5e0",fontSize:14,background:form.state?"#f7fafc":"#edf2f7",fontFamily:"inherit"}}>
              <option value="">-- Select LGA --</option>
              {lgas.map(l=><option key={l}>{l}</option>)}
              {!lgas.length&&form.state&&<option value={form.state+" General"}>{form.state} (General)</option>}
            </select>
          </div>
          <NotifBanner granted={notif} onRequest={async()=>{ const ok=await NotifSvc.requestPermission(); setNotif(ok); }}/>
          {[["smsAlerts","📱 Receive SMS alerts (works without internet)"],["pushAlerts","🔔 Enable in-app push notifications"],["neighbouringLGA","📍 Also receive alerts for neighbouring LGAs"]].map(([k,lb])=>(
            <label key={k} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",fontSize:13,color:"#2d3748",marginBottom:11}}>
              <input type="checkbox" checked={form[k]} onChange={e=>set(k,e.target.checked)} style={{width:17,height:17,accentColor:"#006400"}}/>
              {lb}
            </label>
          ))}
        </>}

        {err&&<div style={{color:"#e53e3e",fontSize:13,marginBottom:12,background:"#fff5f5",padding:"9px 13px",borderRadius:8,border:"1px solid #fed7d7"}}>⚠️ {err}</div>}
        <div style={{display:"flex",gap:10}}>
          {step>1&&<button onClick={()=>setStep(1)} style={{flex:1,padding:"13px",background:"#fff",border:"1.5px solid #cbd5e0",borderRadius:10,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>← Back</button>}
          <button onClick={next} style={{flex:2,padding:"13px",background:"#006400",color:"#fff",border:"none",borderRadius:10,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"'Georgia',serif"}}>
            {step===1?"Continue →":"Activate Alerts ✓"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  DASHBOARD
// ════════════════════════════════════════════════════════════════

function Dashboard({ user, onSignOut, onChangeLocation, onAdmin }) {
  const [banner,setBanner]=useState(null);
  const [tab,setTab]=useState("feed");
  const [notif,setNotif]=useState(NotifSvc.isGranted());
  const [stats,setStats]=useState(DB.getStats());
  const [rf,setRF]=useState({type:"",desc:"",location:"",state:user.state,lga:user.lga});
  const [rStep,setRStep]=useState("form");
  const [aiRes,setAiRes]=useState(null);
  const [smsLog,setSmsLog]=useState(SMSSvc.getLog());
  const initDone=useRef(false);

  const handleNew=useCallback((alert)=>{
    setBanner(alert);
    NotifSvc.send(alert);
    if(user.smsAlerts!==false){ SMSSvc.send(user.phone,alert); setSmsLog(SMSSvc.getLog()); }
  },[user]);

  const {alerts,lastPoll}=useRealTime(user.state,user.lga,handleNew);

  useEffect(()=>{
    if(initDone.current) return; initDone.current=true;
    setTimeout(()=>{ const c=alerts.find(a=>a.severity==="CRITICAL"); if(c) handleNew(c); },5000);
  },[]);

  useEffect(()=>setStats(DB.getStats()),[alerts]);

  const myAlerts=alerts.filter(a=>a.state===user.state||a.lga===user.lga);
  const S=(k,v)=>setRF(p=>({...p,[k]:v}));

  const submit=async()=>{
    if(!rf.type||!rf.desc.trim()) return;
    setRStep("analyzing");
    const res=await analyzeWithAI(rf);
    setAiRes(res);
    DB.addReport({...rf,aiAnalysis:res});
    if(res.broadcastRecommended){
      const a=DB.addAlert({type:rf.type,state:rf.state,lga:rf.lga,severity:res.severity,msg:res.suggestedMsg,verified:false,source:"Community (AI Verified)"});
      handleNew(a);
    }
    setRStep("done"); setStats(DB.getStats());
  };

  return (
    <div style={{minHeight:"100vh",background:"#f0fdf4",maxWidth:500,margin:"0 auto",position:"relative",fontFamily:"system-ui,sans-serif"}}>
      {banner&&<AlertBanner alert={banner} onDismiss={()=>setBanner(null)}/>}

      {/* HEADER */}
      <div style={{background:"linear-gradient(135deg,#006400,#14532d)",color:"#fff",padding:"13px 15px",paddingTop:banner?"170px":"13px",transition:"padding .3s"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div>
            <div style={{fontSize:9,letterSpacing:3,color:"#86efac",textTransform:"uppercase"}}>CCU Alert · Nigeria</div>
            <div style={{fontFamily:"'Georgia',serif",fontSize:16,fontWeight:700}}>Welcome, {user.firstName} 👋</div>
          </div>
          <div style={{display:"flex",gap:7}}>
            <button onClick={()=>setBanner(alerts[0])} title="Test Alert" style={{background:"rgba(255,255,255,.15)",border:"none",color:"#fff",borderRadius:7,padding:"6px 8px",cursor:"pointer",fontSize:13}}>🔔</button>
            <button onClick={onAdmin} style={{background:"rgba(255,255,255,.15)",border:"none",color:"#fff",borderRadius:7,padding:"6px 9px",cursor:"pointer",fontSize:11,fontWeight:700}}>⚙️</button>
            <button onClick={onSignOut} style={{background:"rgba(255,255,255,.15)",border:"none",color:"#fff",borderRadius:7,padding:"6px 9px",cursor:"pointer",fontSize:11}}>Exit</button>
          </div>
        </div>
        <div style={{background:"rgba(0,0,0,.25)",borderRadius:10,padding:"9px 13px",display:"flex",alignItems:"center",gap:9}}>
          <span>📍</span>
          <div style={{flex:1}}>
            <div style={{fontSize:12,fontWeight:700}}>{user.lga}, {user.state}</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,.6)"}}>Polled {ago(lastPoll)}</div>
          </div>
          <div style={{display:"flex",gap:4,alignItems:"center"}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:"#4ade80",animation:"pulse2 1.5s ease infinite"}}/>
            <span style={{fontSize:10,color:"#86efac"}}>LIVE</span>
          </div>
          <button onClick={onChangeLocation} style={{background:"rgba(255,255,255,.2)",border:"none",color:"#fff",borderRadius:6,padding:"4px 9px",cursor:"pointer",fontSize:10}}>Change</button>
        </div>
      </div>

      {/* STATS */}
      <div style={{padding:"11px 13px 0",display:"flex",gap:7}}>
        <StatBadge label="Critical" value={stats.critical} color="#e53e3e"/>
        <StatBadge label="High"     value={stats.high}     color="#dd6b20"/>
        <StatBadge label="Total"    value={stats.total}    color="#006400"/>
        <StatBadge label="Reports"  value={stats.reports}  color="#3182ce"/>
      </div>

      {/* TABS */}
      <div style={{display:"flex",padding:"10px 13px 0",gap:6}}>
        {[["feed","📰 Feed"],["national","🗺️ Nigeria"],["report","🆘 Report"],["profile","👤 Me"]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"9px 2px",border:"none",borderRadius:8,background:tab===k?"#006400":"#fff",color:tab===k?"#fff":"#718096",fontSize:11,fontWeight:tab===k?700:400,cursor:"pointer",fontFamily:"inherit",boxShadow:tab===k?"0 2px 8px rgba(0,100,0,.3)":"0 1px 3px rgba(0,0,0,.06)"}}>
            {l}
          </button>
        ))}
      </div>

      <div style={{padding:"12px 13px 90px"}}>

        {/* MY FEED */}
        {tab==="feed"&&<>
          {!notif&&<NotifBanner granted={false} onRequest={async()=>{const ok=await NotifSvc.requestPermission();setNotif(ok);}}/>}
          <div style={{fontSize:12,color:"#4a5568",marginBottom:10,display:"flex",justifyContent:"space-between"}}>
            <span>Alerts for <strong>{user.lga}, {user.state}</strong></span>
            <span style={{color:"#718096"}}>{myAlerts.length} active</span>
          </div>
          {myAlerts.length===0?(
            <div style={{textAlign:"center",padding:"30px 16px",background:"#fff",borderRadius:12,marginBottom:12}}>
              <div style={{fontSize:36,marginBottom:10}}>🟢</div>
              <div style={{fontFamily:"'Georgia',serif",fontSize:16,marginBottom:5,color:"#276749"}}>Your Area is Currently Clear</div>
              <div style={{fontSize:12,color:"#718096"}}>No active alerts for {user.lga}. Stay vigilant.</div>
            </div>
          ):myAlerts.map(a=><AlertCard key={a.id} alert={a}/>)}
          {myAlerts.length===0&&<>
            <div style={{fontSize:12,fontWeight:700,color:"#2d3748",marginBottom:8}}>⚠️ Active Alerts — Other States</div>
            {alerts.slice(0,4).map(a=><AlertCard key={a.id} alert={a} compact/>)}
          </>}
          {smsLog.length>0&&(
            <div style={{background:"#fff",borderRadius:10,padding:13,marginTop:8,boxShadow:"0 1px 4px rgba(0,0,0,.05)"}}>
              <div style={{fontSize:12,fontWeight:700,color:"#2d3748",marginBottom:8}}>📱 SMS Log — {user.phone}</div>
              {smsLog.slice(0,3).map((s,i)=>(
                <div key={i} style={{fontSize:11,color:"#4a5568",padding:"5px 0",borderTop:i>0?"1px solid #f0f0f0":"none"}}>
                  <span style={{color:"#718096"}}>{s.sentAt}</span> — {s.msg.slice(0,75)}…
                </div>
              ))}
              <div style={{fontSize:10,color:"#718096",marginTop:6}}>Production: Delivered via Termii / Africa's Talking SMS gateway</div>
            </div>
          )}
        </>}

        {/* NATIONAL */}
        {tab==="national"&&<>
          <div style={{fontSize:12,color:"#4a5568",marginBottom:10}}>All active alerts — 36 states + FCT</div>
          {["CRITICAL","HIGH","MODERATE","LOW"].map(sev=>{
            const group=alerts.filter(a=>a.severity===sev);
            if(!group.length) return null;
            return <div key={sev} style={{marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:700,color:SEVERITY_COLOR[sev],marginBottom:7,textTransform:"uppercase",letterSpacing:1}}>
                {sev==="CRITICAL"?"🔴":sev==="HIGH"?"🟠":sev==="MODERATE"?"🟡":"🟢"} {sev} — {group.length}
              </div>
              {group.map(a=><AlertCard key={a.id} alert={a} compact/>)}
            </div>;
          })}
        </>}

        {/* REPORT */}
        {tab==="report"&&<>
          <div style={{background:"#fff3cd",border:"1px solid #ffc107",borderRadius:10,padding:12,marginBottom:14,fontSize:12,color:"#856404",lineHeight:1.6}}>
            ⚠️ <strong>Life in danger?</strong> Call <strong>112</strong> · <strong>199</strong> (Police) · <strong>767</strong> (NEMA) first. Use this form for non-emergency community reports.
          </div>

          {rStep==="form"&&<>
            <div style={{marginBottom:12}}>
              <label style={{display:"block",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"#4a5568",marginBottom:6}}>Incident Type</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                {Object.entries(ALERT_TYPES).map(([k,v])=>(
                  <button key={k} onClick={()=>S("type",k)} style={{padding:"6px 11px",borderRadius:18,border:`1.5px solid ${rf.type===k?v.color:"#cbd5e0"}`,background:rf.type===k?v.color:"#fff",color:rf.type===k?"#fff":"#4a5568",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
                    {v.icon} {v.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:11}}>
              <div style={{flex:1}}>
                <label style={{display:"block",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"#4a5568",marginBottom:4}}>State</label>
                <select value={rf.state} onChange={e=>S("state",e.target.value)} style={{width:"100%",padding:"10px 11px",borderRadius:8,border:"1.5px solid #cbd5e0",fontSize:13,fontFamily:"inherit"}}>
                  {NIGERIA_STATES.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={{flex:1}}>
                <label style={{display:"block",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"#4a5568",marginBottom:4}}>LGA</label>
                <input value={rf.lga} onChange={e=>S("lga",e.target.value)} placeholder="Your LGA" style={{width:"100%",boxSizing:"border-box",padding:"10px 11px",borderRadius:8,border:"1.5px solid #cbd5e0",fontSize:13,fontFamily:"inherit"}}/>
              </div>
            </div>
            <div style={{marginBottom:11}}>
              <label style={{display:"block",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"#4a5568",marginBottom:4}}>Exact Location</label>
              <input value={rf.location} onChange={e=>S("location",e.target.value)} placeholder="e.g. Near Total filling station on Airport Road" style={{width:"100%",boxSizing:"border-box",padding:"10px 12px",borderRadius:8,border:"1.5px solid #cbd5e0",fontSize:13,fontFamily:"inherit"}}/>
            </div>
            <div style={{marginBottom:16}}>
              <label style={{display:"block",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"#4a5568",marginBottom:4}}>What Did You Observe?</label>
              <textarea value={rf.desc} onChange={e=>S("desc",e.target.value)} placeholder="Describe: who, what, when, how many people affected, direction of movement..." rows={4} style={{width:"100%",boxSizing:"border-box",padding:"10px 12px",borderRadius:8,border:"1.5px solid #cbd5e0",fontSize:13,fontFamily:"inherit",resize:"vertical"}}/>
            </div>
            <button onClick={submit} disabled={!rf.type||!rf.desc.trim()} style={{width:"100%",padding:"13px",background:rf.type&&rf.desc.trim()?"#e53e3e":"#a0aec0",color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:rf.type&&rf.desc.trim()?"pointer":"not-allowed",fontFamily:"'Georgia',serif"}}>
              🤖 AI-Analyse & Submit
            </button>
            <div style={{fontSize:10,color:"#718096",textAlign:"center",marginTop:5}}>AI analyses severity and routes to appropriate security agencies</div>
          </>}

          {rStep==="analyzing"&&(
            <div style={{textAlign:"center",padding:"48px 20px"}}>
              <div style={{fontSize:48,marginBottom:14,animation:"spin 1.5s linear infinite"}}>🤖</div>
              <div style={{fontFamily:"'Georgia',serif",fontSize:18,marginBottom:8}}>AI Analysing Your Report…</div>
              <div style={{fontSize:13,color:"#718096"}}>Determining severity · Drafting alert · Routing to agencies</div>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          )}

          {rStep==="done"&&aiRes&&(
            <div style={{animation:"fadeUp .3s ease"}}>
              <div style={{textAlign:"center",marginBottom:18}}>
                <div style={{fontSize:44,marginBottom:10}}>✅</div>
                <div style={{fontFamily:"'Georgia',serif",fontSize:18,color:"#006400",marginBottom:5}}>Report Submitted</div>
                <div style={{fontSize:13,color:"#4a5568"}}>AI analysis complete. Routed to relevant security agencies.</div>
              </div>
              <div style={{background:"#fff",borderRadius:12,padding:15,marginBottom:12,border:"1px solid #e2e8f0"}}>
                <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"#4a5568",marginBottom:11}}>🤖 AI Analysis Result</div>
                <div style={{display:"flex",gap:8,marginBottom:10}}>
                  {[
                    [aiRes.severity, "Severity",   SEVERITY_COLOR[aiRes.severity], SEVERITY_BG[aiRes.severity]],
                    [`${Math.round((aiRes.confidence||.5)*100)}%`,"Confidence","#006400","#f0fff4"],
                    [aiRes.broadcastRecommended?"📡 Broadcast":"🔕 Hold","Action",aiRes.broadcastRecommended?"#e53e3e":"#718096",aiRes.broadcastRecommended?"#fff5f5":"#f7fafc"],
                  ].map(([v,l,c,bg])=>(
                    <div key={l} style={{flex:1,background:bg,border:`1px solid ${c}22`,borderRadius:8,padding:"9px 6px",textAlign:"center"}}>
                      <div style={{fontSize:14,fontWeight:800,color:c}}>{v}</div>
                      <div style={{fontSize:9,color:"#718096",marginTop:1}}>{l}</div>
                    </div>
                  ))}
                </div>
                <div style={{fontSize:12,color:"#4a5568",marginBottom:6}}><strong>Alert message:</strong> "{aiRes.suggestedMsg}"</div>
                <div style={{fontSize:12,color:"#4a5568",marginBottom:6}}><strong>Agencies:</strong> {aiRes.agencies?.join(", ")}</div>
                <div style={{fontSize:12,color:"#4a5568",marginBottom:6}}><strong>AI note:</strong> {aiRes.reasoning}</div>
                <div style={{fontSize:12,color:"#4a5568"}}>
                  <strong>Safety tips:</strong>
                  <ul style={{margin:"4px 0 0 16px",padding:0,lineHeight:1.7}}>
                    {aiRes.safetyTips?.map((t,i)=><li key={i}>{t}</li>)}
                  </ul>
                </div>
              </div>
              <button onClick={()=>{setRStep("form");setRF({type:"",desc:"",location:"",state:user.state,lga:user.lga});setAiRes(null);}} style={{width:"100%",padding:"12px",background:"#006400",color:"#fff",border:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                Submit Another Report
              </button>
            </div>
          )}
        </>}

        {/* PROFILE */}
        {tab==="profile"&&<>
          <div style={{background:"#fff",borderRadius:12,padding:15,marginBottom:12,boxShadow:"0 1px 4px rgba(0,0,0,.05)"}}>
            <div style={{display:"flex",gap:13,alignItems:"center",marginBottom:13}}>
              <div style={{width:50,height:50,borderRadius:"50%",background:"linear-gradient(135deg,#006400,#22c55e)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,fontWeight:700,fontFamily:"'Georgia',serif",flexShrink:0}}>
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div>
                <div style={{fontFamily:"'Georgia',serif",fontSize:16,fontWeight:700,color:"#1a202c"}}>{user.firstName} {user.lastName}</div>
                <div style={{fontSize:11,color:"#718096"}}>{user.role}</div>
              </div>
            </div>
            {[["📱","Phone",user.phone],["📧","Email",user.email||"Not provided"],["📍","Location",`${user.lga}, ${user.state}`],["🧑","Role",user.role]].map(([ic,lb,val])=>(
              <div key={lb} style={{display:"flex",gap:11,padding:"8px 0",borderTop:"1px solid #f7f7f7"}}>
                <span style={{fontSize:14}}>{ic}</span>
                <div><div style={{fontSize:10,color:"#718096",textTransform:"uppercase",letterSpacing:.5}}>{lb}</div><div style={{fontSize:13,color:"#2d3748",fontWeight:500}}>{val}</div></div>
              </div>
            ))}
          </div>

          <div style={{background:"#fff",borderRadius:12,padding:13,marginBottom:12,boxShadow:"0 1px 4px rgba(0,0,0,.05)"}}>
            <div style={{fontSize:12,fontWeight:700,color:"#2d3748",marginBottom:9}}>Alert Preferences</div>
            {[
              ["Push Notifications", notif?"🟢 Active":"🔴 Off", async()=>{const ok=await NotifSvc.requestPermission();setNotif(ok);}],
              ["SMS Alerts",         user.smsAlerts!==false?"🟢 Active":"🔴 Off", null],
              ["Neighbouring LGA",   user.neighbouringLGA!==false?"🟢 On":"🔴 Off", null],
            ].map(([name,status,action])=>(
              <div key={name} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderTop:"1px solid #f7f7f7"}}>
                <span style={{fontSize:12,color:"#2d3748"}}>{name}</span>
                {action
                  ?<button onClick={action} style={{background:"none",border:"1px solid #cbd5e0",borderRadius:6,padding:"3px 9px",cursor:"pointer",fontSize:11,color:"#4a5568"}}>{status}</button>
                  :<span style={{fontSize:11,color:"#718096"}}>{status}</span>}
              </div>
            ))}
          </div>

          <button onClick={onChangeLocation} style={{width:"100%",padding:"12px",background:"#006400",color:"#fff",border:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer",marginBottom:10,fontFamily:"inherit"}}>
            📍 Update My Location
          </button>

          <div style={{background:"#fff",borderRadius:12,padding:13,boxShadow:"0 1px 4px rgba(0,0,0,.05)",marginBottom:12}}>
            <div style={{fontSize:12,fontWeight:700,color:"#2d3748",marginBottom:9}}>🆘 Emergency Contacts</div>
            {EMERGENCY_CONTACTS.map(({icon,name,number,available})=>(
              <div key={name} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderTop:"1px solid #f7f7f7"}}>
                <span style={{fontSize:18}}>{icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:600,color:"#2d3748"}}>{name}</div>
                  <div style={{fontSize:10,color:"#718096"}}>{number} · {available}</div>
                </div>
                <a href={`tel:${number}`} style={{background:"#006400",color:"#fff",padding:"5px 11px",borderRadius:16,fontSize:11,textDecoration:"none",fontWeight:700}}>Call</a>
              </div>
            ))}
          </div>

          <div style={{background:"#1a202c",borderRadius:12,padding:14,fontSize:11,color:"#a0aec0",fontFamily:"'Courier New',monospace"}}>
            <div style={{color:"#68d391",fontWeight:700,marginBottom:8}}>// Production Stack</div>
            <div>Backend:   Firebase Firestore + Realtime DB</div>
            <div>Auth:      Firebase Auth (phone OTP)</div>
            <div>Push:      Firebase Cloud Messaging (FCM)</div>
            <div>SMS:       Termii / Africa's Talking API</div>
            <div>AI:        Anthropic Claude (report analysis)</div>
            <div>Maps:      Google Maps SDK (Nigeria)</div>
            <div>Hosting:   Firebase Hosting / Vercel</div>
          </div>
        </>}
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}} @keyframes pulse2{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  ADMIN PANEL  (Security Agency Console)
// ════════════════════════════════════════════════════════════════

function Admin({ onBack }) {
  const [form,setForm]=useState({type:"BANDIT",state:"Lagos",lga:"",severity:"HIGH",msg:"",source:"Nigeria Police Force"});
  const [sent,setSent]=useState(false);
  const [log,setLog]=useState(DB.getAlerts().slice(0,5));
  const S=(k,v)=>setForm(p=>({...p,[k]:v}));

  const publish=()=>{
    if(!form.msg.trim()||!form.lga.trim()) return;
    const a=DB.addAlert({...form,verified:true});
    NotifSvc.send(a);
    setSent(true); setLog(DB.getAlerts().slice(0,6));
    setTimeout(()=>{setSent(false);setForm(p=>({...p,msg:"",lga:""}));},3000);
  };

  return (
    <div style={{minHeight:"100vh",background:"#0d1117",color:"#fff",fontFamily:"'Courier New',monospace"}}>
      <div style={{background:"#161b22",padding:"13px 16px",display:"flex",alignItems:"center",gap:11,borderBottom:"1px solid #30363d"}}>
        <button onClick={onBack} style={{background:"none",border:"1px solid #30363d",color:"#8b949e",borderRadius:6,padding:"5px 11px",cursor:"pointer",fontSize:12}}>← Back</button>
        <div>
          <div style={{fontSize:9,letterSpacing:3,color:"#3fb950",textTransform:"uppercase"}}>CCU Alert Admin</div>
          <div style={{fontSize:14,fontWeight:700}}>Security Agency Broadcast Panel</div>
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:5,alignItems:"center"}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:"#3fb950",animation:"pulse2 1.5s ease infinite"}}/>
          <span style={{fontSize:10,color:"#3fb950"}}>SYSTEM ONLINE</span>
        </div>
      </div>

      <div style={{padding:15}}>
        <div style={{background:"#161b22",border:"1px solid #30363d",borderRadius:10,padding:15,marginBottom:14}}>
          <div style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",color:"#3fb950",marginBottom:13}}>Broadcast New Alert</div>

          <div style={{display:"flex",gap:9,marginBottom:11,flexWrap:"wrap"}}>
            <div style={{flex:1,minWidth:140}}>
              <label style={{display:"block",fontSize:9,color:"#8b949e",marginBottom:4,letterSpacing:1}}>INCIDENT TYPE</label>
              <select value={form.type} onChange={e=>S("type",e.target.value)} style={{width:"100%",background:"#0d1117",color:"#fff",border:"1px solid #30363d",borderRadius:6,padding:"8px 9px",fontSize:12,fontFamily:"inherit"}}>
                {Object.entries(ALERT_TYPES).map(([k,v])=><option key={k} value={k}>{v.icon} {v.label}</option>)}
              </select>
            </div>
            <div style={{flex:1,minWidth:120}}>
              <label style={{display:"block",fontSize:9,color:"#8b949e",marginBottom:4,letterSpacing:1}}>SEVERITY</label>
              <select value={form.severity} onChange={e=>S("severity",e.target.value)} style={{width:"100%",background:"#0d1117",color:"#fff",border:"1px solid #30363d",borderRadius:6,padding:"8px 9px",fontSize:12,fontFamily:"inherit"}}>
                {["CRITICAL","HIGH","MODERATE","LOW"].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div style={{display:"flex",gap:9,marginBottom:11}}>
            <div style={{flex:1}}>
              <label style={{display:"block",fontSize:9,color:"#8b949e",marginBottom:4,letterSpacing:1}}>STATE</label>
              <select value={form.state} onChange={e=>S("state",e.target.value)} style={{width:"100%",background:"#0d1117",color:"#fff",border:"1px solid #30363d",borderRadius:6,padding:"8px 9px",fontSize:12,fontFamily:"inherit"}}>
                {NIGERIA_STATES.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={{flex:1}}>
              <label style={{display:"block",fontSize:9,color:"#8b949e",marginBottom:4,letterSpacing:1}}>LGA</label>
              <input value={form.lga} onChange={e=>S("lga",e.target.value)} placeholder="Enter LGA" style={{width:"100%",boxSizing:"border-box",background:"#0d1117",color:"#fff",border:"1px solid #30363d",borderRadius:6,padding:"8px 9px",fontSize:12,fontFamily:"inherit"}}/>
            </div>
          </div>

          <div style={{marginBottom:11}}>
            <label style={{display:"block",fontSize:9,color:"#8b949e",marginBottom:4,letterSpacing:1}}>ISSUING AGENCY</label>
            <select value={form.source} onChange={e=>S("source",e.target.value)} style={{width:"100%",background:"#0d1117",color:"#fff",border:"1px solid #30363d",borderRadius:6,padding:"8px 9px",fontSize:12,fontFamily:"inherit"}}>
              {["Nigeria Police Force","Nigerian Army","DSS Intelligence","NEMA","Military Intelligence","State Government","NCDC","FCT Police Command","NAFDAC"].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>

          <div style={{marginBottom:14}}>
            <label style={{display:"block",fontSize:9,color:"#8b949e",marginBottom:4,letterSpacing:1}}>ALERT MESSAGE</label>
            <textarea value={form.msg} onChange={e=>S("msg",e.target.value)} placeholder="Write clear, factual alert for the public..." rows={3} style={{width:"100%",boxSizing:"border-box",background:"#0d1117",color:"#fff",border:"1px solid #30363d",borderRadius:6,padding:"9px 10px",fontSize:12,fontFamily:"inherit",resize:"vertical"}}/>
            <div style={{fontSize:9,color:"#8b949e",marginTop:2}}>{form.msg.length}/200 chars</div>
          </div>

          {sent?(
            <div style={{textAlign:"center",padding:"13px",background:"rgba(63,185,80,.1)",border:"1px solid #3fb950",borderRadius:8,color:"#3fb950",fontWeight:700,fontSize:13}}>
              ✓ ALERT BROADCAST — PUSH + SMS SENT TO ALL {form.state.toUpperCase()} SUBSCRIBERS
            </div>
          ):(
            <button onClick={publish} disabled={!form.msg.trim()||!form.lga.trim()} style={{width:"100%",padding:"12px",background:form.msg.trim()&&form.lga.trim()?"#da3633":"#21262d",color:"#fff",border:"none",borderRadius:7,fontSize:13,fontWeight:700,cursor:form.msg.trim()&&form.lga.trim()?"pointer":"not-allowed",fontFamily:"inherit",letterSpacing:1}}>
              📡 BROADCAST TO {form.state.toUpperCase()}
            </button>
          )}
        </div>

        <div style={{background:"#161b22",border:"1px solid #30363d",borderRadius:10,padding:13}}>
          <div style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",color:"#3fb950",marginBottom:11}}>Recent Broadcasts</div>
          {log.map(a=>(
            <div key={a.id} style={{borderTop:"1px solid #21262d",padding:"9px 0",fontSize:12}}>
              <div style={{display:"flex",gap:8,marginBottom:3}}>
                <span>{ALERT_TYPES[a.type]?.icon}</span>
                <span style={{color:SEVERITY_COLOR[a.severity],fontWeight:700}}>{a.severity}</span>
                <span style={{color:"#8b949e"}}>·</span>
                <span style={{color:"#e6edf3"}}>{a.lga}, {a.state}</span>
                <span style={{marginLeft:"auto",color:"#8b949e",fontSize:10}}>{ago(a.timestamp)}</span>
              </div>
              <div style={{color:"#8b949e",fontSize:11}}>{a.msg?.slice(0,85)}…</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes pulse2{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </div>
  );
}

function LocationUpdater({ user, onUpdate, onBack }) {
  const [state,setState]=useState(user.state);
  const [lga,setLga]=useState(user.lga);
  const lgas=LGA_MAP[state]||[];
  return (
    <div style={{minHeight:"100vh",background:"#f0fdf4",padding:20}}>
      <button onClick={onBack} style={{background:"none",border:"none",color:"#006400",fontSize:14,cursor:"pointer",marginBottom:18,fontWeight:700}}>← Back</button>
      <div style={{fontFamily:"'Georgia',serif",fontSize:20,fontWeight:700,marginBottom:5}}>Update Location</div>
      <div style={{fontSize:13,color:"#4a5568",marginBottom:18}}>Travelling? Update to receive local alerts for where you are now.</div>
      <div style={{marginBottom:13}}>
        <label style={{display:"block",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"#4a5568",marginBottom:5}}>State</label>
        <select value={state} onChange={e=>{setState(e.target.value);setLga("");}} style={{width:"100%",padding:"12px 13px",borderRadius:8,border:"1.5px solid #cbd5e0",fontSize:14,fontFamily:"inherit"}}>
          <option value="">-- Select State --</option>
          {NIGERIA_STATES.map(s=><option key={s}>{s}</option>)}
        </select>
      </div>
      <div style={{marginBottom:22}}>
        <label style={{display:"block",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"#4a5568",marginBottom:5}}>LGA</label>
        <select value={lga} onChange={e=>setLga(e.target.value)} disabled={!state} style={{width:"100%",padding:"12px 13px",borderRadius:8,border:"1.5px solid #cbd5e0",fontSize:14,background:state?"#f7fafc":"#edf2f7",fontFamily:"inherit"}}>
          <option value="">-- Select LGA --</option>
          {lgas.map(l=><option key={l}>{l}</option>)}
          {!lgas.length&&state&&<option value={state+" General"}>{state} (General)</option>}
        </select>
      </div>
      <button onClick={()=>onUpdate(state,lga||(state+" General"))} disabled={!state} style={{width:"100%",padding:"14px",background:state?"#006400":"#a0aec0",color:"#fff",border:"none",borderRadius:10,fontSize:15,fontWeight:700,cursor:state?"pointer":"not-allowed",fontFamily:"'Georgia',serif"}}>
        ✓ Update Location
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  ROOT
// ════════════════════════════════════════════════════════════════

export default function App() {
  const [screen,setScreen]=useLS("ccu_screen","splash");
  const [user,setUser]=useLS("ccu_user",null);
  const go=s=>setScreen(s);
  if(screen==="splash")   return <Splash onStart={()=>go("signup")}/>;
  if(screen==="signup")   return <Signup onComplete={d=>{setUser(d);go("dashboard");}}/>;
  if(screen==="location") return <LocationUpdater user={user} onUpdate={(s,l)=>{setUser(p=>({...p,state:s,lga:l}));go("dashboard");}} onBack={()=>go("dashboard")}/>;
  if(screen==="admin")    return <Admin onBack={()=>go("dashboard")}/>;
  return <Dashboard user={user} onSignOut={()=>{setUser(null);go("splash");}} onChangeLocation={()=>go("location")} onAdmin={()=>go("admin")}/>;
}
