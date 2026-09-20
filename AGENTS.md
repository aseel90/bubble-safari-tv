# Agent note — Zoryvo external updates

Read this before publishing an Android build.

- All **APK/external updates** for Bubble Safari TV are to be distributed through `aseel90/zoryvo-app-hub`.
- The current Android wrapper bundles the web/game assets into the APK. Therefore a bundled game/content change is an external APK update unless the architecture is deliberately changed to support runtime content updates.
- Genuine runtime data/config updates that the installed app can consume without replacing the APK may remain internal.
- Preserve `com.bubblesafari.tv` and increment `versionCode` for each distributed external release.
- **Do not publish a Zoryvo update from an ephemeral debug signing key.** A stable signing certificate must be established first and then preserved.
- Do not make this repository private unless explicitly requested.
