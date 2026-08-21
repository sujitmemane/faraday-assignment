# Faraday

Expo (SDK 57) take-home app: **local notifications**, Faraday branding, and a hire card for **Sujit Memane (SDE-1, Fintech)**.

Tap **Send Faraday ping** → the OS asks for permission (if needed) → a local notification fires with title `Faraday`, custom `notification.wav`, and a hire-me body.

<p align="center">
  <img src="assets/images/icon.png" alt="Faraday app icon" width="120" />
</p>

**Repo:** [github.com/sujitmemane/faraday-assignment](https://github.com/sujitmemane/faraday-assignment)  
**EAS project:** `9ed9f7a8-c361-47d8-814b-8332cbf627ea`  
**Bundle / package:** `com.sujeethmemane.faradayassignment`

## APK / install links

| Build | How to get it |
| --- | --- |
| **Android APK** | `eas build --profile preview --platform android` then download from the [Expo project builds](https://expo.dev/projects/9ed9f7a8-c361-47d8-814b-8332cbf627ea) page |
| **iOS (internal)** | `eas build --profile preview --platform ios` (device UDID / Ad Hoc or internal distro) |
| **Dev client** | `eas build --profile development --platform ios` or `npx expo run:ios` |

Paste the latest APK URL here after the preview build finishes:

```
https://expo.dev/artifacts/eas/YOUR_BUILD_ID.apk
```

## Screenshots

Drop device captures into `assets/screenshots/` and they will show here.

| Home (ping + hire) | Notification |
| --- | --- |
| ![Home](assets/screenshots/home.png) | ![Notification](assets/screenshots/notification.png) |

App icon (launcher / splash source):

![Icon](assets/images/icon.png)

## What it does

- **Foreground handler** (`Notifications.setNotificationHandler`) — show banner + list, play sound, no badge.
- **Permission** — `getPermissionsAsync` / `requestPermissionsAsync` before scheduling.
- **Local trigger** — `scheduleNotificationAsync`. iOS: `trigger: null` (immediate). Android: 1s interval on channel `faraday-ping` so custom sound works on 8+.
- **Custom sound** — `assets/notification.wav` registered in the `expo-notifications` plugin, played as `sound: 'notification.wav'`.
- **Hire actions** — email `officialsujitmemane@gmail.com`, call `+91 8624800390`, WhatsApp `wa.me/918624800390` (“You're hired — let's have a call”).

This is **local** (scheduled on-device). It does **not** send pushes through FCM/APNs yet. Remote is outlined below.

## Stack

Expo 57 · React Native 0.86 · expo-router · expo-notifications · expo-dev-client · EAS Build

## Install (local)

Need **Node 20+**, npm, and Xcode (iOS) or Android Studio (Android). Custom icon, splash, and `.wav` live in the **native binary**, so Expo Go is not enough for the full demo.

```bash
git clone https://github.com/sujitmemane/faraday-assignment.git
cd faraday-assignment
npm install
npx expo prebuild --platform ios   # or android
npx expo run:ios                   # or: npx expo run:android
```

JS-only changes: reload Metro (`npx expo start`).  
Icon / splash / custom sound / plugins: **prebuild + run again** (or a new EAS build).

### EAS (cloud)

```bash
npm i -g eas-cli
eas login
eas build --profile development --platform ios
eas build --profile preview --platform android   # APK for recruiters
```

`preview` in `eas.json` is internal distribution — that is the APK you share.

## How the ping is triggered

1. User taps **Send Faraday ping**.
2. App reads notification permission; requests it if not granted.
3. Android creates/updates channel `faraday-ping` with `notification.wav`.
4. `scheduleNotificationAsync` posts the notification.
5. Handler decides foreground presentation (`shouldShowBanner`, `shouldPlaySound`).

Sound file stays at **`assets/notification.wav`**. Do not `require()` it in JS. It is copied into the app by the plugin:

```json
["expo-notifications", { "sounds": ["./assets/notification.wav"] }]
```

In code, pass the **filename only**: `sound: 'notification.wav'`.

## Adding remote (push) notifications

Same library (`expo-notifications`). Extra work is **credentials + a token + a server**.

1. **Credentials** — `eas credentials` (FCM for Android, APNs for iOS). Tied to this EAS project id.
2. **Physical device** (or Android emulator with Google Play). Remote push on Android is **not** available in Expo Go from SDK 53 — use a **dev/preview build**.
3. **Token** after permission:

```ts
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

const projectId = Constants.expoConfig?.extra?.eas?.projectId;
const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
// POST token to your backend
```

4. **Send** with [Expo Push API](https://docs.expo.dev/push-notifications/sending-notifications/) (`https://exp.host/--/api/v2/push/send`) or FCM/APNs directly.
5. **Tap / receive** — `addNotificationReceivedListener` and `addNotificationResponseReceivedListener` (same as local).
6. **Android 13+** — create a channel **before** `getExpoPushTokenAsync` (this app already creates `faraday-ping`).

Optional later: notification icon (`expo-notifications` plugin `icon` + `color`), categories/actions, badge, data payload deep links via `faradayassignment://`.

## Project map

| Path | Role |
| --- | --- |
| `src/app/index.tsx` | Home: ping, hire links, local schedule |
| `src/app/_layout.tsx` | Tabs + splash overlay |
| `src/components/animated-icon.tsx` | In-app splash using `icon.png` |
| `assets/notification.wav` | Custom notification sound |
| `assets/images/icon.png` | App icon, splash, Android adaptive foreground |
| `app.json` | Plugins, icons, EAS `projectId` |

## Contact

**Sujit Memane** · SDE-1, Fintech  

- Email: [officialsujitmemane@gmail.com](mailto:officialsujitmemane@gmail.com?subject=You%27re%20hired)  
- Call: [+91 8624800390](tel:+918624800390)  
- WhatsApp: [wa.me/918624800390](https://wa.me/918624800390?text=You%27re%20hired%20%E2%80%94%20let%27s%20have%20a%20call)

You're hired — let's have a call.
