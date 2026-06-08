export default function Splash({ onStart }) {
  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#003d00 0%,#006400 45%,#1a3300 100%)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:28, color:"#fff", position:"relative", overflow:"hidden" }}>
      {/* Grid pattern */}
      <div style={{ position:"absolute", inset:0, opacity:.04, backgroundImage:"repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 40px)" }}/>

      <div style={{ position:"relative", display:"flex", flexDirection:"column", alignItems:"center", maxWidth:380, width:"100%" }}>
        {/* Logo */}
        <div style={{ width:96, height:96, borderRadius:"50%", background:"radial-gradient(circle,#22c55e,#006400)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:48, boxShadow:"0 0 0 10px rgba(34,197,94,.15),0 14px 40px rgba(0,0,0,.4)", marginBottom:18, animation:"glow 2.5s ease-in-out infinite" }}>
          🛡️
        </div>

        <div style={{ fontFamily:"'Georgia',serif", fontSize:34, fontWeight:700, letterSpacing:2 }}>CCU Alert</div>
        <div style={{ fontSize:11, letterSpacing:4, textTransform:"uppercase", color:"#86efac", marginTop:4, marginBottom:3 }}>CCU Alert</div>
        <div style={{ fontSize:10, color:"rgba(255,255,255,.4)", marginBottom:28, letterSpacing:1 }}>v2.0 · AI-Powered</div>

        <p style={{ textAlign:"center", fontSize:13, color:"rgba(255,255,255,.75)", lineHeight:1.8, marginBottom:30, margin:"0 0 30px" }}>
          Real-time security alerts for your state and LGA — powered by AI, push notifications, and SMS backup. Every life matters.
        </p>

        {/* Feature grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:30, width:"100%" }}>
          {[["🔔","Push Alerts"],["📍","LGA-Precise"],["🤖","AI Analysis"],["🆘","Report Now"],["📱","SMS Backup"],["✓","Verified Info"]].map(([ic, lb]) => (
            <div key={lb} style={{ background:"rgba(255,255,255,.08)", borderRadius:8, padding:"10px 6px", textAlign:"center" }}>
              <div style={{ fontSize:20, marginBottom:3 }}>{ic}</div>
              <div style={{ fontSize:9, color:"#86efac", letterSpacing:.5 }}>{lb}</div>
            </div>
          ))}
        </div>

        <button onClick={onStart} style={{ width:"100%", background:"linear-gradient(135deg,#22c55e,#006400)", color:"#fff", border:"none", borderRadius:14, padding:"16px", fontSize:16, fontWeight:700, cursor:"pointer", letterSpacing:1, boxShadow:"0 6px 24px rgba(34,197,94,.4)", fontFamily:"'Georgia',serif" }}>
          GET STARTED — FREE →
        </button>

        <div style={{ marginTop:14, fontSize:10, color:"rgba(255,255,255,.3)", textAlign:"center" }}>
          Works offline · 36 states covered · Push + SMS alerts
        </div>
      </div>

      <style>{`@keyframes glow{0%,100%{box-shadow:0 0 0 10px rgba(34,197,94,.15),0 14px 40px rgba(0,0,0,.4)}50%{box-shadow:0 0 0 18px rgba(34,197,94,.1),0 14px 60px rgba(34,197,94,.35)}}`}</style>
    </div>
  );
}
