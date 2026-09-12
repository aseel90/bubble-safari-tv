# Bubble Safari TV — Defold Native Prototype

This directory is an isolated native 2D prototype. It does not replace or restructure the existing WebView application.

Project-level decisions, current APK behavior, known gaps, and the Go/No-Go plan are documented in [`../ROADMAP.md`](../ROADMAP.md).

## Scope

The prototype contains only the ocean A/B slice:

- three answer bubbles
- animal, size and color questions loaded from `data/ocean_questions.json`
- TV D-pad navigation, OK/DPAD_CENTER and Back
- animated focus
- success overlay and lightweight confetti
- Leda audio resources reused from the repository audio library
- simple settings overlay
- internal `BS_METRIC` telemetry for frame/GC/input/question-transition diagnostics
- Android TV manifest merge fragment with `LEANBACK_LAUNCHER` and no touchscreen requirement

Android package: `com.bubblesafari.tv.defold` so it can coexist with the WebView package on the same TV.

## Current APK

A real APK is produced by CI and published to:

`dist/bubble-safari-defold-prototype.apk`

Current SHA-256:

`8ba34a78c1aca0f4dd8d28e33cffb06c43324570acbc4b576cd373d44e476ad3`

The APK build is validated. Xiaomi TV Stick runtime/performance validation is intentionally deferred.

## What the current runtime actually does

The current build is not a full game port. It boots directly into the native ocean prototype with three looping questions: fish, big size, and blue color.

Correct answers show the native success overlay, confetti, and `feedback_welldone` audio. Wrong answers animate the selected bubble. Back opens a minimal Sound ON/OFF overlay.

Audio resources for question/choice prompts are bundled, but the current GUI script does not yet trigger those prompt/choice sounds. Only the success sound is currently wired into gameplay logic.

## Asset policy

Existing repository assets remain the source of truth. `tools/sync_assets.sh` copies only the audio required by this prototype into `assets/audio/` before a build. Generated copies are ignored by Git.

SVG artwork remains master/source artwork. Runtime packaging should use raster textures/atlases rather than parsing SVG during gameplay.

## Android TV integration

`android_tv/` is a manifest-only Defold extension. It merges TV-specific declarations into Defold's current built-in Android manifest instead of replacing the entire base manifest. This keeps the prototype compatible with Defold manifest updates while adding a Leanback launcher entry and declaring that a touchscreen is not required.

## Build

Requirements:

- Defold `bob.jar`
- Java 25 or newer for current Bob releases

From the repository root:

```bash
BOB_JAR=/path/to/bob.jar bash ./defold-prototype/build_android.sh
```

By default the script builds a debug APK containing both `armv7-android` and `arm64-android`. Override with environment variables when needed:

```bash
VARIANT=release ARCHITECTURES=arm64-android BOB_JAR=/path/to/bob.jar bash ./defold-prototype/build_android.sh
```

The build also writes JSON and HTML build reports. These reports are intended to make resource-size changes visible before the device benchmark stage.

## Benchmark stage

Device testing is intentionally deferred. The repository-level runner is already prepared for the later Xiaomi stage:

```bash
bash ./benchmark_tv.sh webview
bash ./benchmark_tv.sh defold
```

Generated benchmark output is stored under `benchmark-results/`.
