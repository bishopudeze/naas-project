import { useState } from "react";
import { NIGERIA_STATES, LGA_MAP } from "../data/mockData.js";
import { NotificationService } from "../services/notifications.js";

export default function Signup({ onComplete }) {
  const [form, setForm] = useState({
    firstName:"", lastName:"", phone:"", email:"",
    state:"", lga:"", role:"Civilian",
    smsAlerts:true, pushAlerts:true, neighbouringLGA:true,
  });
  const [step, setStep]   = useState(1);
  const [err,  setErr]    = useState("");
  const [notif,setNotif]  = useState(NotificationService.isGranted());

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v, ...(k === "state" ? { lga:"" } : {}) }));
  const lgas = LGA_MAP[form.state] || [];

  const validatePhone = (p) => /^0[789][01]\d{8}$/.test(p.replace(/\s/g, ""));

  const next = () => {
    if (step === 1) {
      if (!form.firstName.trim() || !form.lastName.trim() || !form.phone.trim())
        return setErr("Please fill in your name and phone number.");
      if (!validatePhone(form.phone))
        return setErr("Enter a valid Nigerian phone number — e.g. 08012345678.");
      setErr(""); setStep(2);
    } else {
      if (!form.state) return setErr("Please select your state.");
      setErr("");
      onComplete({ ...form, lga: form.lga || form.state + " (General)" });
    }
  };

  const Field = ({ label, k, type = "text", ph = "" }) => (
    <div style={{ marginBottom:13 }}>
      <label style={{ display:"block", fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:"#4a5568", marginBottom:5 }}>{label}</label>
      <input
        type={type} value={form[k]}
        onChange={(e) => set(k, e.target.value)}
        placeholder={ph}
        style={{ width:"100%", boxSizing:"border-box", padding:"11px 13px", borderRadius:8, border:"1.5px solid #cbd5e0", fontSize:14, outline:"none", fontFamily:"inherit", background:"#f7fafc" }}
      />
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#f0fdf4", display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#006400,#14532d)", padding:"16px 18px 22px", color:"#fff" }}>
        <div style={{ fontSize:10, letterSpacing:3, textTransform:"uppercase", color:"#86efac", marginBottom:3 }}>
          Registration · Step {step} of 2
        </div>
        <div style={{ fontFamily:"'Georgia',serif", fontSize:19, fontWeight:700 }}>
          {step === 1 ? "Your Profile" : "Location & Alerts"}
        </div>
        <div style={{ marginTop:10, display:"flex", gap:6 }}>
          {[1, 2].map((s) => (
            <div key={s} style={{ flex:1, height:3, borderRadius:3, background: s <= step ? "#86efac" : "rgba(255,255,255,.2)", transition:"background .3s" }}/>
          ))}
        </div>
      </div>

      <div style={{ flex:1, padding:18 }}>
        {step === 1 && (
          <>
            <Field label="First Name"      k="firstName" ph="e.g. Chinedu" />
            <Field label="Last Name"       k="lastName"  ph="e.g. Okafor" />
            <Field label="Phone Number"    k="phone"     type="tel"   ph="e.g. 08012345678" />
            <Field label="Email (Optional)"k="email"     type="email" ph="for account recovery" />
            <div style={{ marginBottom:13 }}>
              <label style={{ display:"block", fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:"#4a5568", marginBottom:6 }}>I am a</label>
              <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                {["Civilian","Student","Trader","Security Personnel","Journalist","Health Worker","Driver","Pastor/Imam"].map((r) => (
                  <button key={r} onClick={() => set("role", r)} style={{ padding:"7px 11px", borderRadius:18, border:`1.5px solid ${form.role === r ? "#006400" : "#cbd5e0"}`, background: form.role === r ? "#006400" : "#fff", color: form.role === r ? "#fff" : "#4a5568", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:10, padding:12, marginBottom:14, fontSize:12, color:"#4a5568", lineHeight:1.6 }}>
              📍 Your state and LGA determine which alerts you receive. You can update this anytime when you travel.
            </div>

            {/* State selector */}
            <div style={{ marginBottom:12 }}>
              <label style={{ display:"block", fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:"#4a5568", marginBottom:5 }}>State</label>
              <select value={form.state} onChange={(e) => set("state", e.target.value)} style={{ width:"100%", padding:"11px 13px", borderRadius:8, border:"1.5px solid #cbd5e0", fontSize:14, background:"#f7fafc", fontFamily:"inherit" }}>
                <option value="">-- Select State --</option>
                {NIGERIA_STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* LGA selector */}
            <div style={{ marginBottom:14 }}>
              <label style={{ display:"block", fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:"#4a5568", marginBottom:5 }}>Local Government Area</label>
              <select value={form.lga} onChange={(e) => set("lga", e.target.value)} disabled={!form.state} style={{ width:"100%", padding:"11px 13px", borderRadius:8, border:"1.5px solid #cbd5e0", fontSize:14, background: form.state ? "#f7fafc" : "#edf2f7", fontFamily:"inherit" }}>
                <option value="">-- Select LGA --</option>
                {lgas.map((l) => <option key={l}>{l}</option>)}
                {!lgas.length && form.state && <option value={form.state + " General"}>{form.state} (General)</option>}
              </select>
            </div>

            {/* Notification banner */}
            {!notif ? (
              <div style={{ background:"#fffbeb", border:"1px solid #f6e05e", borderRadius:8, padding:"10px 12px", fontSize:12, color:"#744210", marginBottom:14 }}>
                <div style={{ fontWeight:700, marginBottom:4 }}>🔕 Push Notifications Off</div>
                <div style={{ marginBottom:8 }}>Enable to get emergency alerts even when CCU Alert is closed.</div>
                <button onClick={async () => { const ok = await NotificationService.requestPermission(); setNotif(ok); }} style={{ background:"#006400", color:"#fff", border:"none", borderRadius:6, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                  Enable Now
                </button>
              </div>
            ) : (
              <div style={{ background:"#f0fff4", border:"1px solid #68d391", borderRadius:8, padding:"8px 12px", fontSize:12, color:"#276749", marginBottom:14, display:"flex", gap:6, alignItems:"center" }}>
                🔔 Push notifications <strong>active</strong>.
              </div>
            )}

            {/* Toggles */}
            {[
              ["smsAlerts",       "📱 Receive SMS alerts (works without internet)"],
              ["pushAlerts",      "🔔 Enable in-app push notifications"],
              ["neighbouringLGA", "📍 Also receive alerts for neighbouring LGAs"],
            ].map(([k, lb]) => (
              <label key={k} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", fontSize:13, color:"#2d3748", marginBottom:11 }}>
                <input type="checkbox" checked={form[k]} onChange={(e) => set(k, e.target.checked)} style={{ width:17, height:17, accentColor:"#006400" }} />
                {lb}
              </label>
            ))}
          </>
        )}

        {err && (
          <div style={{ color:"#e53e3e", fontSize:13, marginBottom:12, background:"#fff5f5", padding:"9px 13px", borderRadius:8, border:"1px solid #fed7d7" }}>
            ⚠️ {err}
          </div>
        )}

        <div style={{ display:"flex", gap:10 }}>
          {step > 1 && (
            <button onClick={() => setStep(1)} style={{ flex:1, padding:"13px", background:"#fff", border:"1.5px solid #cbd5e0", borderRadius:10, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>
              ← Back
            </button>
          )}
          <button onClick={next} style={{ flex:2, padding:"13px", background:"#006400", color:"#fff", border:"none", borderRadius:10, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"'Georgia',serif" }}>
            {step === 1 ? "Continue →" : "Activate Alerts ✓"}
          </button>
        </div>
      </div>
    </div>
  );
}
