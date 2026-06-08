# NAAS — Complete Deployment Guide
## Nigeria Alert & Awareness System v2.0

---

## WHAT YOU NEED (All Free to Start)

| Tool | Purpose | Cost |
|------|---------|------|
| Node.js | Run the project locally | Free |
| GitHub account | Store your code | Free |
| Vercel account | Host the website | Free |
| Firebase account | Database + Push notifications | Free tier |
| Termii account | SMS alerts to Nigerian numbers | Pay-per-SMS |
| Anthropic account | AI report analysis | Pay-per-use |

---

## STEP 1 — Install Node.js

1. Go to **https://nodejs.org**
2. Download the **LTS version** (the green button)
3. Install it on your computer
4. Open a terminal (Command Prompt on Windows, Terminal on Mac/Linux)
5. Verify it works by typing:
   ```
   node --version
   ```
   You should see something like `v20.11.0`

---

## STEP 2 — Set Up the Project

Open your terminal and run these commands one by one:

```bash
# 1. Navigate to where you want the project
cd Desktop

# 2. Create a new folder and go into it
mkdir naas-nigeria
cd naas-nigeria

# 3. Copy all the project files into this folder
#    (the files from this zip/folder you were given)

# 4. Install all dependencies
npm install

# 5. Start the development server
npm run dev
```

Your browser will open at **http://localhost:3000** and you'll see NAAS running.

---

## STEP 3 — Set Up Firebase (Database + Push Notifications)

### 3a. Create a Firebase Project

1. Go to **https://firebase.google.com**
2. Click "Get Started" → "Add Project"
3. Name it `naas-nigeria` → Continue
4. Enable Google Analytics (optional) → Create Project

### 3b. Add a Web App

1. In your Firebase project, click the **</>** (Web) icon
2. App nickname: `NAAS Web`
3. Check "Also set up Firebase Hosting" → Register App
4. You'll see a config object like this — **copy it**:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXX",
  authDomain: "naas-nigeria.firebaseapp.com",
  projectId: "naas-nigeria",
  ...
};
```

### 3c. Set Up Firestore Database

1. Left sidebar → Build → **Firestore Database**
2. Click "Create Database"
3. Choose **Production mode** → Select a region close to Nigeria:
   - `europe-west1` (Belgium) is closest and most reliable
4. Click Enable

#### Firestore Security Rules
In Firestore → Rules tab, paste this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Anyone can read alerts
    match /alerts/{alertId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    // Users can only read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    // Anyone authenticated can submit a report
    match /reports/{reportId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null;
    }
  }
}
```

### 3d. Enable Cloud Messaging (Push Notifications)

1. Firebase Console → Project Settings → Cloud Messaging tab
2. Scroll to "Web Push certificates" → **Generate key pair**
3. Copy the **VAPID key** — you'll need it in your .env file

### 3e. Create Your .env File

In your project folder, copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then open `.env` and fill in your Firebase values:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=naas-nigeria.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=naas-nigeria
VITE_FIREBASE_STORAGE_BUCKET=naas-nigeria.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
VITE_FIREBASE_VAPID_KEY=BXXXXXXX...your vapid key
VITE_USE_FIREBASE=true
```

---

## STEP 4 — Set Up SMS (Termii)

Termii is a Nigerian company that sends bulk SMS to Nigerian numbers.

1. Sign up at **https://termii.com**
2. Complete KYC verification (they need your BVN or business registration)
3. Go to Dashboard → API Keys → copy your API key
4. Buy credits (starts from ₦1,000)
5. Register a Sender ID: Apply for `NAAS-NG` as your sender name

Add to your `.env`:
```env
VITE_TERMII_KEY=TLXXXXXXXXXXXXXXXXXXx
```

> **Note:** For security, in production you should put the Termii key only in your Firebase Cloud Functions (not in the browser). The `src/services/sms.js` file has instructions for this.

---

## STEP 5 — Set Up AI (Anthropic Claude)

1. Go to **https://console.anthropic.com**
2. Sign up → Go to API Keys
3. Create a new key → copy it

Add to your `.env`:
```env
VITE_ANTHROPIC_KEY=sk-ant-api03-XXXXXXXXXXXXXXXXXXXX
```

> **Security note:** For production, route AI calls through a Firebase Cloud Function so your API key is never exposed in the browser. The `src/services/ai.js` file explains how.

---

## STEP 6 — Push the Code to GitHub

1. Create a free account at **https://github.com**
2. Click the **+** button → New repository
3. Name it `naas-nigeria` → Create repository
4. In your terminal:

```bash
# Initialize git in your project folder
git init
git add .
git commit -m "Initial NAAS v2.0 commit"

# Connect to your GitHub repo (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/naas-nigeria.git
git branch -M main
git push -u origin main
```

---

## STEP 7 — Deploy to Vercel (Live Website)

1. Go to **https://vercel.com** → Sign up with your GitHub account
2. Click "New Project"
3. Import your `naas-nigeria` repository
4. Framework preset: **Vite** (auto-detected)
5. Click **Environment Variables** and add ALL your `.env` values here
6. Click **Deploy**

After ~2 minutes, Vercel gives you a live URL like:
**https://naas-nigeria.vercel.app**

### Custom Domain (Optional)
If you have a domain like `naas.ng`:
- Vercel → Your Project → Settings → Domains
- Add your domain → Update your DNS as instructed

---

## STEP 8 — Test Your Live App

1. Open your Vercel URL on your phone
2. When prompted, tap **"Add to Home Screen"** — this installs the PWA
3. Allow notifications when prompted
4. The NAAS icon now appears on your phone home screen like a real app
5. To test push notifications, go to the Admin panel (⚙️ button) and broadcast a CRITICAL alert

---

## STEP 9 — Populate Initial Alert Data in Firestore

Once Firebase is connected, you can seed real alerts:

1. Firebase Console → Firestore → Start collection
2. Collection ID: `alerts`
3. Add documents manually, or use the Admin panel in the app to broadcast alerts

---

## MAINTENANCE

### Updating the App
```bash
# Make your changes locally, then:
git add .
git commit -m "describe what you changed"
git push
```
Vercel automatically redeploys in ~60 seconds.

### Monitoring
- Firebase Console → Usage tab to see active users
- Vercel Dashboard → Analytics for traffic
- Termii Dashboard to monitor SMS delivery rates

---

## PRODUCTION CHECKLIST

Before going fully public, complete these:

- [ ] Replace all `YOUR_API_KEY` values in `.env`
- [ ] Set `VITE_USE_FIREBASE=true` in `.env`
- [ ] Enable Firebase Phone Authentication for OTP login
- [ ] Move Anthropic API calls to a Cloud Function (hide the key)
- [ ] Move Termii API calls to a Cloud Function (hide the key)
- [ ] Set up Firebase Cloud Functions for background SMS sending
- [ ] Register NAAS as a verified Termii Sender ID
- [ ] Test push notifications on Android (Chrome) and iOS (Safari 16.4+)
- [ ] Add proper app icons to `/public/icons/` (all 8 sizes)
- [ ] Submit to Google Play Store as a TWA (Trusted Web Activity)
- [ ] Register `.ng` domain if possible (e.g. naas.ng)
- [ ] Partner with one state police command for data credibility

---

## SUPPORT & CONTACTS

| Need Help With | Resource |
|----------------|---------|
| Firebase setup | https://firebase.google.com/docs |
| Vercel deployment | https://vercel.com/docs |
| Termii SMS API | https://developers.termii.com |
| Anthropic Claude | https://docs.anthropic.com |
| React/Vite | https://vitejs.dev/guide |

---

*NAAS is built to save Nigerian lives. Deploy responsibly.*
