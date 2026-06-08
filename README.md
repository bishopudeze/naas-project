# 🛡️ NAAS — Nigeria Alert & Awareness System
### v2.0 · AI-Powered · Real-Time · PWA

> Real-time security alerts for all 36 Nigerian states + FCT.  
> Modelled after the US Amber Alert system — built for Nigeria.

---

## Features

| Feature | Tech Used |
|---------|-----------|
| 🔔 Push notifications (foreground + background) | Web Notifications API + Firebase Cloud Messaging |
| 📱 SMS fallback (works without internet on recipient's end) | Termii Nigeria API |
| 🤖 AI incident analysis | Anthropic Claude |
| 🛰️ Real-time alert feed | Firebase Firestore onSnapshot |
| 📍 Location-based alert filtering | User state/LGA matching |
| 📲 Installable as a phone app | Progressive Web App (PWA) |
| ⚙️ Agency broadcast console | Admin panel with stats |
| 🔒 Secure backend | Firebase Cloud Functions + Auth |
| ✈️ Works offline | Workbox service worker caching |

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build
```

---

## Project Structure

```
naas-nigeria/
├── src/
│   ├── App.jsx                    # Root app + navigation
│   ├── main.jsx                   # React entry + PWA registration
│   ├── components/
│   │   ├── AlertBanner.jsx        # Emergency popup banner
│   │   ├── AlertCard.jsx          # Individual alert card
│   │   ├── AdminPanel.jsx         # Agency broadcast console
│   │   ├── Signup.jsx             # 2-step registration
│   │   ├── Splash.jsx             # Landing screen
│   │   └── LocationUpdater.jsx    # Travel location switcher
│   ├── services/
│   │   ├── firebase.js            # Firestore + FCM + Auth
│   │   ├── sms.js                 # Termii SMS gateway
│   │   ├── ai.js                  # Claude AI analysis
│   │   └── notifications.js       # Web Notifications API
│   ├── hooks/
│   │   └── useAlerts.js           # Real-time alert subscription
│   └── data/
│       └── mockData.js            # Demo data + Nigeria constants
├── functions/
│   └── index.js                   # Firebase Cloud Functions
├── public/
│   ├── icons/                     # PWA icons (all 8 sizes)
│   ├── firebase-messaging-sw.js   # Background push handler
│   └── apple-touch-icon.png
├── firestore.rules                # Database security rules
├── firebase.json                  # Firebase config
├── vite.config.js                 # Vite + PWA config
└── DEPLOYMENT_GUIDE.md            # Step-by-step setup guide
```

---

## Deployment

See **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** for the full step-by-step guide.

Short version:
1. `cp .env.example .env` and fill in your keys
2. Create Firebase project → paste config into `.env`
3. Sign up on Termii → get SMS API key
4. Push to GitHub → deploy on Vercel (free)
5. Share link on WhatsApp — users install it from their browser

---

## Emergency Numbers (Nigeria)

| Service | Number |
|---------|--------|
| Nigeria Police Force | 199 |
| NEMA | 767 |
| Ambulance | 112 |
| Federal Fire Service | 08039148754 |
| DSS Tip Line | 08000767 |
| NCDC Disease Hotline | 0800-970000-10 |

---

## Contributing

NAAS is a community safety project. Contributions welcome — especially:
- LGA data completion for all 36 states
- Hausa, Yoruba, Igbo translations
- Integration with official police/NEMA data feeds
- Android APK build via Bubblewrap/TWA

---

*Built to save Nigerian lives. Use responsibly.*
