# BeSafe — Verify Before You Ride

> A transport safety & verification platform for Lagos, Nigeria.
> This repository contains the **mobile frontend** (Expo + React Native), built to be plugged into any BeSafe backend later.

---

## What's in this build

- **Full onboarding**: role choice (Rider / Driver) → phone → OTP → NIN verification → emergency contacts (riders) or vehicle registration (drivers).
- **Rider flow**: map home with nearby verified vehicles + unsafe-zone heatmap, QR scanner, plate-number verification, live ride tracking with location sharing, panic SOS.
- **Driver flow**: dashboard with online/offline toggle, vehicle registration, downloadable printable QR code, trips, profile.
- **Emergency SOS**: full-screen alert screen with siren-style vibration, live ETA, notified authorities + contacts, 4-digit PIN cancellation.
- **Dark + light theme** with system preference support, persisted per user.
- **All screens run on dummy data** — API clients + endpoints are fully wired, just flip `USE_MOCK` to `false` when your backend is ready.

---

## Requirements

- **Node.js 20+**
- **npm** or **yarn**
- **Expo Go** on your phone (iOS or Android), or an emulator

---

## Getting started

```bash
# 1. Unzip the project
cd BeSafe

# 2. Install dependencies
npm install

# 3. Start the dev server
npx expo start
```

Then either:
- Scan the QR with **Expo Go** on your phone, or
- Press `i` for iOS simulator / `a` for Android emulator.

> The app depends on native modules (camera, maps, media library, secure store). All of these are supported inside Expo Go SDK 52 out of the box.

---

## Demo credentials

| Where              | Value                             |
| ------------------ | --------------------------------- |
| Phone OTP          | **`000000`** (or any 6 digits)    |
| NIN                | **Any 11 digits** (e.g. `12345678901`) |
| SOS cancel PIN     | **`1234`**                        |

The mock verification service considers **any plate starting with `LAG-`** as verified, and **any other plate** as unverified — perfect for demoing both success and failure paths.

To scan a working QR: register a vehicle as a driver → open the QR screen → point the rider scanner at the same phone/screen (or print the QR).

---

## Google Maps setup

Maps render out of the box on iOS Simulator with Apple Maps.
For **Google Maps** on Android (recommended) and iOS, add your API keys to `app.json`:

```jsonc
// app.json
{
  "expo": {
    "ios": {
      "config": {
        "googleMapsApiKey": "YOUR_IOS_KEY_HERE"
      }
    },
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_ANDROID_KEY_HERE"
        }
      }
    }
  }
}
```

The map style JSON (dark and light) lives in `app/(rider)/(tabs)/mapStyles.ts` and can be swapped for your own [Google Maps Style](https://mapstyle.withgoogle.com/) at any time.

---

## Wiring a real backend

All API traffic goes through `services/api.ts`. To switch off mocks:

```ts
// services/api.ts
export const USE_MOCK = false; // <-- flip this
```

Then set your API base URL:

```ts
// services/endpoints.ts
export const API_BASE_URL = 'https://api.your-backend.com/v1';
```

Every service file (`auth.service.ts`, `verify.service.ts`, `rides.service.ts`, `sos.service.ts`, `driver.service.ts`, `rider.service.ts`) already contains **both the mock branch and the real-request branch**, keyed off `USE_MOCK`. Endpoint paths are grouped in `services/endpoints.ts`.

Auth tokens are held in **`expo-secure-store`** via `tokenStore` in `services/api.ts` and attached automatically to every axios call.

---

## Emergency numbers (Nigeria)

Wired throughout the app:

| Number | Purpose                                |
| ------ | -------------------------------------- |
| `112`  | Unified national emergency line        |
| `199`  | Alternate national emergency line      |
| `767`  | Lagos State Rapid Response Squad (RRS) |

---

## Project structure

```
BeSafe/
├── app/                    # expo-router routes
│   ├── _layout.tsx         # root providers + Stack
│   ├── index.tsx           # role-based redirect
│   ├── (onboarding)/       # welcome → role → phone → otp → nin → contacts
│   ├── (rider)/(tabs)/     # home map, scan, trips, profile
│   ├── (driver)/           # dashboard tabs, register-vehicle, qr-code
│   ├── verify-ride.tsx     # QR/plate verification result
│   ├── active-ride.tsx     # live ride tracking + share
│   ├── sos.tsx             # emergency SOS
│   ├── emergency-contacts.tsx
│   └── settings.tsx
├── components/
│   ├── ui/                 # Button, Input, Card, Badge, Screen, Header, Text, Logo…
│   └── shared/             # SOSButton, DriverCard
├── constants/
│   ├── Colors.ts           # light + dark themes
│   └── Theme.ts            # spacing, radius, typography, shadows
├── contexts/
│   ├── ThemeContext.tsx
│   ├── authStore.ts        # zustand
│   └── rideStore.ts
├── services/               # api.ts + all service modules + endpoints
├── data/mockData.ts        # dummy drivers, contacts, rides, unsafe zones
├── types/index.ts          # shared TS types
└── assets/images/          # icon, splash, adaptive icon
```

---

## Tech stack

| Category           | Choice                                     |
| ------------------ | ------------------------------------------ |
| Framework          | **Expo SDK 52** + React Native 0.76        |
| Router             | **expo-router v4** (file-based)            |
| Language           | TypeScript                                 |
| State              | **Zustand** + React Context                |
| Animations         | **react-native-reanimated 3** + **Moti**   |
| Maps               | **react-native-maps** (Google + Apple)     |
| Camera / QR        | **expo-camera**                            |
| QR generation      | **react-native-qrcode-svg**                |
| Screenshot / share | **react-native-view-shot** + **expo-sharing** + **expo-media-library** |
| Secure token store | **expo-secure-store**                      |
| HTTP               | **axios**                                  |
| Haptics            | **expo-haptics**                           |

> **GSAP was intentionally not used** — it has known instability on React Native. Reanimated 3 + Moti give the same quality of motion natively and integrate cleanly with expo-router transitions.

---

## Roadmap (backend + phase 2)

Not built (frontend-only for now), but the app is structured to accept:
- Real NIN / BVN verification pipelines
- Backend for QR issuance + revocation
- Real-time GPS streaming (WebSocket or polling) — hook in `ridesService.updateLocation`
- Government dashboard (separate web app)
- AI unsafe-zone predictions — feed into `mockUnsafeZones`
- Facial verification for drivers (extend NIN step)

---

## License

Proprietary — © 2025 BeSafe. All rights reserved.
