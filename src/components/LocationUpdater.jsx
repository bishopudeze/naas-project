import { useState } from "react";
import { NIGERIA_STATES, LGA_MAP } from "../data/mockData.js";

export default function LocationUpdater({ user, onUpdate, onBack }) {
  const [state, setState] = useState(user.state || "");
  const [lga,   setLga]   = useState(user.lga   || "");
  const lgas = LGA_MAP[state] || [];

  return (
    <div style={{ minHeight:"100vh", background:"#f0fdf4", padding:20 }}>
      <button onClick={onBack} style={{ background:"none", border:"none", color:"#006400", fontSize:14, cursor:"pointer", marginBottom:18, fontWeight:700 }}>
        ← Back
      </button>

      <div style={{ fontFamily:"'Georgia',serif", fontSize:20, fontWeight:700, marginBottom:5 }}>Update Location</div>
      <div style={{ fontSize:13, color:"#4a5568", marginBottom:18, lineHeight:1.6 }}>
        Travelling? Update your location to receive alerts relevant to where you are now. You can change this anytime.
      </div>

      {/* Current location badge */}
      <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:10, padding:"12px 14px", marginBottom:18, display:"flex", alignItems:"center", gap:10, fontSize:13 }}>
        <span style={{ fontSize:20 }}>📍</span>
        <div>
          <div style={{ fontWeight:700, color:"#1a202c" }}>Current: {user.lga}, {user.state}</div>
          <div style={{ fontSize:11, color:"#718096" }}>Select below to change</div>
        </div>
      </div>

      <div style={{ marginBottom:13 }}>
        <label style={{ display:"block", fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:"#4a5568", marginBottom:5 }}>New State</label>
        <select
          value={state}
          onChange={(e) => { setState(e.target.value); setLga(""); }}
          style={{ width:"100%", padding:"12px 13px", borderRadius:8, border:"1.5px solid #cbd5e0", fontSize:14, fontFamily:"inherit", background:"#f7fafc" }}
        >
          <option value="">-- Select State --</option>
          {NIGERIA_STATES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div style={{ marginBottom:22 }}>
        <label style={{ display:"block", fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:"#4a5568", marginBottom:5 }}>New LGA</label>
        <select
          value={lga}
          onChange={(e) => setLga(e.target.value)}
          disabled={!state}
          style={{ width:"100%", padding:"12px 13px", borderRadius:8, border:"1.5px solid #cbd5e0", fontSize:14, background: state ? "#f7fafc" : "#edf2f7", fontFamily:"inherit" }}
        >
          <option value="">-- Select LGA --</option>
          {lgas.map((l) => <option key={l}>{l}</option>)}
          {!lgas.length && state && <option value={state + " General"}>{state} (General)</option>}
        </select>
        {!lgas.length && state && (
          <div style={{ fontSize:11, color:"#718096", marginTop:4 }}>Full LGA list for {state} will be complete in the production build.</div>
        )}
      </div>

      <button
        onClick={() => onUpdate(state, lga || state + " General")}
        disabled={!state}
        style={{ width:"100%", padding:"14px", background: state ? "#006400" : "#a0aec0", color:"#fff", border:"none", borderRadius:10, fontSize:15, fontWeight:700, cursor: state ? "pointer" : "not-allowed", fontFamily:"'Georgia',serif" }}
      >
        ✓ Update My Location
      </button>
    </div>
  );
}
