# Bahawal Market — Deploy Guide (Free, No Card)

## What is in this folder

A complete React + Vite frontend for Bahawal Market, ready to push to GitHub
and deploy on Vercel. The Firebase backend files (Firestore rules, indexes,
Cloud Functions) are included under `firebase/` for phase 2.

**Important:** the frontend currently runs on `localStorage` + mock data only.
There is no Firebase wiring in the app yet, so shops, products and approvals
are saved only in each visitor's own browser. That is fine for a first live
demo. Real shared data comes in phase 2.

## Step 1 — Push to GitHub

1. Create a new **empty** repository on GitHub (for example `bahawal-market`).
   Do not add a README, .gitignore or license — this folder already has them.
2. In this folder, run:

```bash
git init
git add .
git commit -m "Bahawal Market v1"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/bahawal-market.git
git push -u origin main
```

(Replace `YOUR-USERNAME` with your GitHub username.)

## Step 2 — Deploy the frontend on Vercel (free)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New → Project**, then **Import** the `bahawal-market` repo.
3. Vercel auto-detects Vite. `vercel.json` in this repo already sets the
   build command (`npm run build`), output folder (`dist`) and the SPA
   fallback rewrite — you do not need to change anything.
4. Click **Deploy**. You get a live link like `bahawal-market.vercel.app`.
5. Every future `git push` to `main` auto-deploys a new version.

No card is needed for the Vercel Hobby (free) plan.

## Step 3 — Firebase backend (phase 2, later)

This is a separate step, after the frontend is live:

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   on the **Spark (free)** plan — no card needed.
2. Enable Firestore Database and Authentication.
3. Deploy the rules, indexes and functions from this repo:

```bash
npm install -g firebase-tools
firebase login
firebase use --add        # pick your new Firebase project
firebase deploy --only firestore:rules,firestore:indexes
firebase deploy --only functions
```

4. Then the frontend must be wired to Firebase (add the `firebase` package,
   a config file with your project keys, and replace the `localStorage`
   state in `src/context/AppContext.jsx` with Firestore reads/writes).
   That wiring is **not** in this version yet — it is the next phase.

## Files not included (on purpose)

The old build output (`dist/` files like `index-Cx_s8_0X.js`) is not in this
repo. Vercel builds fresh files from source on every deploy, so they are not
needed here.
