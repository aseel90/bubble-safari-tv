#!/usr/bin/env bash
set -euo pipefail

APK="${1:-}"
PKG="${PKG:-com.bubblesafari.tv.defold}"
REPORT="${REPORT:-defold-prototype/dist/android-tv-smoke.txt}"
SCREENSHOT="${SCREENSHOT:-defold-prototype/dist/android-tv-smoke.png}"

mkdir -p "$(dirname "$REPORT")"
touch "$REPORT"
exec > >(tee -a "$REPORT") 2>&1

echo "Bubble Safari Defold Android TV smoke test"
echo "UTC: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "Package: $PKG"
echo "APK: $APK"

if [[ -z "$APK" || ! -f "$APK" ]]; then
  echo "FAIL: APK not found"
  exit 10
fi

adb wait-for-device
adb shell getprop ro.build.version.release | tr -d '\r' | sed 's/^/Android: /'
adb shell getprop ro.build.version.sdk | tr -d '\r' | sed 's/^/SDK: /'
adb shell getprop ro.product.model | tr -d '\r' | sed 's/^/Model: /'
adb shell getprop ro.product.cpu.abi | tr -d '\r' | sed 's/^/ABI: /'

adb uninstall "$PKG" >/dev/null 2>&1 || true
adb install -r "$APK"

echo "--- manifest/package assertions ---"
adb shell dumpsys package "$PKG" > /tmp/package.txt

AAPT_BIN="$(command -v aapt || true)"
if [[ -z "$AAPT_BIN" && -n "${ANDROID_HOME:-}" ]]; then
  AAPT_BIN="$(find "$ANDROID_HOME/build-tools" -type f -name aapt 2>/dev/null | sort -V | tail -n 1 || true)"
fi
if [[ -n "$AAPT_BIN" ]]; then
  echo "--- aapt badging ---"
  "$AAPT_BIN" dump badging "$APK" | tee /tmp/apk-badging.txt || true
  grep -q "android.software.leanback" /tmp/apk-badging.txt \
    && echo "Manifest check: leanback declaration present" \
    || echo "WARN: leanback declaration not shown by aapt badging"
  grep -q "leanback-launchable-activity:" /tmp/apk-badging.txt \
    && echo "Manifest check: leanback launchable activity present" \
    || echo "WARN: leanback launchable activity not shown by aapt badging"
fi

RESOLVED="$(adb shell cmd package resolve-activity --brief -a android.intent.action.MAIN -c android.intent.category.LEANBACK_LAUNCHER "$PKG" 2>/dev/null | tr -d '\r' | tail -n 1)"
echo "LEANBACK resolved activity: $RESOLVED"
if [[ -z "$RESOLVED" || "$RESOLVED" == "No activity found" || "$RESOLVED" != *"/"* ]]; then
  echo "FAIL: LEANBACK_LAUNCHER activity did not resolve"
  exit 22
fi

adb logcat -c

echo "--- launch ---"
echo "Launching resolved TV activity explicitly: $RESOLVED"
set +e
START_OUT="$(adb shell am start -W -n "$RESOLVED" 2>&1 | tr -d '\r')"
START_STATUS=$?
set -e
printf '%s\n' "$START_OUT"
echo "am start exit code: $START_STATUS"
if [[ "$START_STATUS" -ne 0 ]] || ! printf '%s\n' "$START_OUT" | grep -Eq "Status: ok|Starting: Intent"; then
  echo "FAIL: Android could not start the resolved DefoldActivity"
  echo "--- immediate logcat ---"
  adb logcat -d -v time | tail -n 250 || true
  exit 30
fi

sleep 6
PID="$(adb shell pidof "$PKG" | tr -d '\r' || true)"
echo "PID after launch: $PID"
[[ -n "$PID" ]] || { echo "FAIL: app process not alive after launch"; adb logcat -d -v time; exit 31; }

FOCUS="$(adb shell dumpsys window windows | grep -E 'mCurrentFocus|mFocusedApp' | tr -d '\r' || true)"
echo "$FOCUS"
echo "$FOCUS" | grep -q "$PKG" || { echo "FAIL: app is not foreground/focused"; exit 32; }

INITIAL_SCREENSHOT="${SCREENSHOT%.png}-initial.png"
adb exec-out screencap -p > "$INITIAL_SCREENSHOT" || true
if [[ -s "$INITIAL_SCREENSHOT" ]]; then
  echo "Initial screenshot captured: $INITIAL_SCREENSHOT"
else
  echo "WARN: initial screenshot capture failed"
fi

echo "--- remote input ---"
adb shell input keyevent KEYCODE_DPAD_RIGHT
adb shell input keyevent KEYCODE_DPAD_LEFT
adb shell input keyevent KEYCODE_DPAD_CENTER
sleep 1
adb shell input keyevent KEYCODE_BACK
sleep 2
PID2="$(adb shell pidof "$PKG" | tr -d '\r' || true)"
echo "PID after D-pad/OK/Back: $PID2"
[[ -n "$PID2" ]] || { echo "FAIL: app process died after TV remote input"; adb logcat -d -v time; exit 40; }

adb exec-out screencap -p > "$SCREENSHOT" || true
if [[ -s "$SCREENSHOT" ]]; then
  echo "Screenshot captured: $SCREENSHOT"
else
  echo "WARN: screenshot capture failed"
fi

LOG="$(adb logcat -d -v time)"
printf '%s\n' "$LOG" > defold-prototype/dist/android-tv-logcat.txt
if printf '%s\n' "$LOG" | grep -E "FATAL EXCEPTION|ANR in ${PKG}|Process: ${PKG}"; then
  echo "FAIL: fatal exception/ANR detected"
  exit 50
fi

echo "PASS: APK installed, LEANBACK launcher resolved, activity launched, process stayed alive, and D-pad/OK/Back did not crash it."
