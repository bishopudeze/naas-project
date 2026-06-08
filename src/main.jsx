import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { registerSW } from "virtual:pwa-register";

// ── Register Service Worker (PWA offline support) ─────────────────────────────
const updateSW = registerSW({
  onNeedRefresh() {
    // New version available — prompt user
    if (confirm("New CCU Alert update available. Refresh to get the latest security features?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("[CCU Alert] App ready to work offline.");
  },
});

// ── Render ────────────────────────────────────────────────────────────────────
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
