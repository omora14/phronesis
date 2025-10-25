# Phronesis

Phronesis is a mobile-first Expo + React Native app with a small Node/Express backend and Firebase Cloud Functions.  
It records short audio/video reflections, sends them for transcription & sentiment analysis, persists results in Firestore, and surfaces daily emotional insights.

This README describes how to clone the repository, set up environment variables, install dependencies, run the client/backend/functions locally, and troubleshoot common issues.

---

Table of contents
- Prerequisites
- Clone the repo
- Environment variables
- Install dependencies
- Run locally (developer flow)
  - Start the backend
  - Start the Expo client
  - Run functions emulator or deploy
- Auth & userId guidance
- Testing & debugging tips
- Troubleshooting
- Useful scripts
- Contributing & license

---

Prerequisites
- Node.js (LTS recommended; Node 18+). Cloud Functions may target Node 22; check functions/package.json.
- npm or yarn.
- Expo CLI (optional global): `npm install -g expo-cli` (or use `npx expo`).
- Firebase CLI if you plan to run emulators or deploy functions: https://firebase.google.com/docs/cli
- (Optional) Android Studio / Xcode for simulators.

Clone the repository
    git clone <your-repo-url>
    cd phronesis

Environment variables

This project uses separate .env files for the Expo client (root), the backend, and the functions runtime. Create these with your keys before running.

Root (Expo client) — file: .env (placed at project root)
This file is read by app.config.js and exposed to the app via Expo constants.

Example entries (replace placeholders with your project values):
    EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...your_key_here

Backend — file: backend/.env
The backend uses AssemblyAI for transcription + sentiment. Provide the backend variables:

    ASSEMBLY_API_KEY=your_assemblyai_key
    FIREBASE_API=your_firebase_web_api_key
    PORT=5000

Cloud Functions
- For local emulation, set environment variables with Firebase functions config or export in your shell.
  Example (one-time):
    firebase functions:config:set assemblyai.key="YOUR_KEY"
- For deployed functions, use Firebase environment/config or Secret Manager as recommended by Firebase.

Tip: add a `.env.example` at repo root documenting required keys for contributors.

Install dependencies

Root (client)
    npm install
    # or
    yarn

Backend
    cd backend
    npm install

Functions
    cd functions
    npm install

Run locally (developer flow)

1) Start the backend (local analysis server)
- The backend handles recording uploads to AssemblyAI and polling results. From the backend directory:
    cd backend
    npm run dev
  or
    npm start
- Default port is commonly 5000 (check backend/src/index.ts).

Note: when testing from a physical device, replace `localhost` in client config with your machine IP (e.g., 192.168.1.100) and ensure firewall permits incoming connections on the backend port.

2) Start the Expo client (mobile / web)
From project root:
    npx expo start
or
    npm run start

Run on Android emulator or device:
    npx expo run:android
or
    npm run android

Run on iOS simulator (macOS):
    npx expo run:ios
or
    npm run ios

Important:
- app.config.js reads the root .env. If you change .env, restart Expo and clear the Metro cache:
    npx expo start -c
- For device testing, set the backend URL to your machine IP, not localhost.

3) Optional — Run Firebase Functions emulator or deploy
Start functions emulator:
    cd functions
    npm run serve
or
    firebase emulators:start --only functions

Deploy functions:
    cd functions
    npm run deploy
or
    firebase deploy --only functions

When using emulator, ensure required config keys are present via `firebase functions:config:set` or exported env vars.

Auth & userId guidance

Records should be associated with an authenticated user. Two recommended patterns:

1) Client supplies UID:
- After authentication in the client, include `auth.currentUser.uid` in requests that save sentiment data.
- Example payload fields: `{ uid, transcript, sentimentScore }`

2) Server verifies the user (more secure):
- Use Firebase Admin SDK on the server or callable functions and verify the user's ID token to derive the UID server-side. This prevents clients from impersonating other users.

In short: prefer server-side verification if the backend is trusted or requires secure writes; otherwise send the UID from the authenticated client.

Testing & debugging tips
- Expo:
  - Clear Metro cache: `npx expo start -c`
  - Use Expo dev tools to inspect logs.
- Backend:
  - Run in debug/watch mode: `npm run dev` (nodemon / ts-node-dev).
  - Use VS Code debugger attaching to the Node process.
- Functions:
  - Use Firebase emulator logs: `firebase emulators:start --only functions`.
  - Inspect function logs with `firebase functions:log` after deploy.
- Device network:
  - Replace `localhost` with your dev machine IP when using a physical device.
  - Confirm firewall or OS networking permits the connections.

Troubleshooting — common issues
- Missing AssemblyAI API key: ensure ASSEMBLY_API_KEY (backend) or functions config is set.
- Expo not picking up .env changes: restart with `-c`.
- CORS errors: ensure backend allows requests from your client origin in development (or use open CORS for local dev).
- Firestore permission errors: check rules and correct Firebase project. Confirm the client is initialized with the correct API key/project values.
- Device cannot reach backend: use machine IP, disable firewall temporarily for testing, check port.

Useful scripts (check package.json files)
- Root (client):
  - start: starts Expo
  - android / ios: run on respective platforms
- Backend:
  - dev: run backend in watch mode
  - start: run backend normally
- Functions:
  - serve: build and run emulator
  - deploy: build and deploy functions

Key files & pointers
- Root firebase initializer: `firebase.ts`
- Expo config: `app.config.js`
- Backend entry: `backend/src/index.ts`
- Backend sentiment route: `backend/src/routes/sentimentRoutes.ts`
- Backend AI helper: `backend/src/services/aiService.ts` (analyzeAudio)
- Functions entry: `functions/src/index.ts`
- Functions AI helper: `functions/src/services/aiService.ts`
- Functions Firestore writer: `functions/src/services/firebaseService.ts`
- Add `.env.example` to document environment variables required for each component.