# Faraday

Take-home for Faraday. Small Expo app: tap **Send Faraday ping**, allow notifications if asked, then a local notification shows up (title Faraday, custom `notification.wav`).

**APK:** [Download](https://we.tl/t-OFN6Obr2JJNXbabk)

Repo: [sujitmemane/faraday-assignment](https://github.com/sujitmemane/faraday-assignment)  
EAS project: `9ed9f7a8-c361-47d8-814b-8332cbf627ea`  
Bundle id: `com.sujeethmemane.faradayassignment`

Expo 57, React Native 0.86, expo-router, expo-notifications, expo-dev-client, EAS.

## Screenshots

| Home | Notification |
| --- | --- |
| ![Home](assets/screenshots/home.png) | ![Notification](assets/screenshots/notification.png) |

## Notifications

This is all **local** (scheduled on the phone). Nothing is sent through FCM or APNs yet.

Flow:

1. Tap Send Faraday ping
2. Check / request permission
3. On Android, set up channel `faraday-ping` with `notification.wav`
4. `scheduleNotificationAsync` — iOS uses `trigger: null` (now), Android waits 1s so the channel sound actually plays
5. `setNotificationHandler` controls what happens in the foreground (banner, list, sound, no badge)

The wav lives at `assets/notification.wav`. I registered it in the expo-notifications plugin. In JS you pass the filename only (`sound: 'notification.wav'`), not a require().

```json
["expo-notifications", { "sounds": ["./assets/notification.wav"] }]
```

The home screen also has my email, phone, and WhatsApp.

## If we add remote push

Same package. You need credentials, a token, and something that sends the push.

- `eas credentials` for FCM (Android) and APNs (iOS)
- Real device, or Android emulator with Play. Android remote push does not work in Expo Go from SDK 53 — needs a dev/preview build
- After permission:

```ts
const projectId = Constants.expoConfig?.extra?.eas?.projectId;
const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
```

Send with the [Expo push API](https://docs.expo.dev/push-notifications/sending-notifications/) or FCM/APNs. Listen with `addNotificationReceivedListener` / `addNotificationResponseReceivedListener`. On Android 13+, create a channel before `getExpoPushTokenAsync` (this app already has `faraday-ping`).

## Files

- `src/app/index.tsx` — ping button, contact links, schedule call
- `src/app/_layout.tsx` — tabs + splash
- `src/components/animated-icon.tsx` — splash overlay
- `assets/notification.wav` — custom sound
- `assets/images/icon.png` — icon / splash
- `app.json` — plugins, icons, EAS project id

## Contact

Sujit Memane, SDE-1 (fintech)

- [officialsujitmemane@gmail.com](mailto:officialsujitmemane@gmail.com)
- [+91 8624800390](tel:+918624800390)
- [WhatsApp](https://wa.me/918624800390)
