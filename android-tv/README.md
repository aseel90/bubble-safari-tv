# Bubble Safari — Android TV wrapper

This module packages the existing Bubble Safari web game as an offline Android TV APK.

## What it does

- Copies the current web game and `audio/` assets from the repository root at build time.
- Serves them inside WebView through `https://appassets.androidplatform.net/assets/` using `WebViewAssetLoader`.
- Maps Android TV D-pad / OK / Back buttons to the game's existing keyboard navigation.
- Runs immersive landscape fullscreen and keeps the screen awake during play.
- Declares `LEANBACK_LAUNCHER` and no touchscreen requirement for Android TV / Google TV.
- Blocks navigation away from the bundled local app assets.

## Build

Requirements: JDK 17, Android SDK 36, Build Tools 36.0.0, Gradle 9.6.0.

```bash
gradle -p android-tv :app:assembleDebug
```

Debug APK:

```text
android-tv/app/build/outputs/apk/debug/app-debug.apk
```

GitHub Actions also builds an installable debug APK artifact on Android TV changes.
