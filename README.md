# IronLog — install on your iPhone (no Mac, no $99 account)

A gym training PWA: multi-user profiles, tailored plan generation, exercise instructions, set logging with rest timer, and progress tracking. All data stays on the phone (localStorage).

## Deploy once (2 minutes, works from your phone)

1. Go to github.com → create a new **public** repo (e.g. `ironlog`).
2. Upload these 3 files: `index.html`, `sw.js`, `icon.png` (Add file → Upload files).
3. Repo → **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main`, folder `/ (root)` → Save.
4. Wait ~1 minute. Your app is live at `https://<your-username>.github.io/ironlog/`

## Install on iPhone

1. Open that URL in **Safari** (must be Safari).
2. Tap **Share → Add to Home Screen**.
3. Launch from the home screen icon — it runs fullscreen like a native app, works offline after first load, and keeps each user's profile, plan, and history on the device.

## Notes

- Multiple users: each person creates a profile (optional 4-digit PIN). Plans are generated from their goal, days/week, equipment, experience, and priority muscles.
- Data lives in Safari's storage for that home-screen app. Use **Profile → Export my data** for a JSON backup.
- To update the app later, just replace `index.html` in the repo — the service worker picks up the new version on next launch with internet.
# ironlog
