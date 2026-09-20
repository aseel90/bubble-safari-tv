# Bubble Safari — Update & Distribution Contract

This file is the operational contract for `aseel90/bubble-safari-tv`.

## Update routing

### Internal update

If the already-installed APK can consume the change without replacing the APK, keep using Bubble Safari's existing internal OTA/content mechanism.

```text
Bubble Safari internal update → user
```

Do not bump Android `versionCode` only for an internal content update.

### External update

Any change that requires a new/replaced APK is an external update.

```text
Bubble Safari repo → Build/Test APK → Zoryvo App Hub → user
```

External distribution owner:
- repository: `aseel90/zoryvo-app-hub`
- app id: `bubble-safari-tv`
- asset: `Bubble-Safari-TV.apk`

## Android identity contract

For every external release:
1. Keep `applicationId/packageName = com.bubblesafari.tv`.
2. Increment `versionCode` above the currently distributed Zoryvo version.
3. Keep the same signing certificate as the currently distributed APK.
4. Verify package, versionCode, versionName, signer certificate and SHA-256.
5. If signer continuity cannot be proven, stop the external release.

## Repository roles

Bubble Safari remains the source/development repository for development, tests, internal OTA, QA and APK candidate builds.

A Bubble Safari GitHub Release may only be a **source candidate transfer point** for Zoryvo. It is not the primary user distribution channel.

Do not create a new independent APK updater/distribution channel in Bubble Safari.

Zoryvo owns final external distribution through `apps-current` and `catalog/apps.json`.

Until explicit cross-repository credentials are configured, do not assume Bubble Safari can write to the Zoryvo repository automatically.

## Signing

External candidates require a persistent signing identity. Never commit keystores or passwords into the repository.

Expected repository secrets for the external-candidate workflow:
- `BUBBLE_SAFARI_KEYSTORE_BASE64`
- `BUBBLE_SAFARI_KEYSTORE_PASSWORD`
- `BUBBLE_SAFARI_KEY_ALIAS`
- `BUBBLE_SAFARI_KEY_PASSWORD`

## Repository visibility

Keep this repository Public unless the user explicitly requests otherwise.
