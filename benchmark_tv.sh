#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-}"
RUNS="${RUNS:-5}"
ADB="${ADB:-adb}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STAMP="$(date +%Y%m%d-%H%M%S)"

case "$MODE" in
  webview) PACKAGE="com.bubblesafari.tv" ;;
  defold)  PACKAGE="com.bubblesafari.tv.defold" ;;
  *) echo "Usage: $0 {webview|defold}" >&2; exit 2 ;;
esac

OUT="$ROOT/benchmark-results/$MODE/$STAMP"
mkdir -p "$OUT"

command -v "$ADB" >/dev/null || { echo "adb not found" >&2; exit 3; }
"$ADB" get-state >/dev/null

DEVICE="$($ADB shell getprop ro.product.model | tr -d '\r')"
SDK="$($ADB shell getprop ro.build.version.sdk | tr -d '\r')"
REFRESH="$($ADB shell dumpsys display 2>/dev/null | grep -m1 -Eo 'refreshRate=[0-9.]+' | cut -d= -f2 || true)"
printf 'mode=%s\npackage=%s\ndevice=%s\nsdk=%s\nrefresh_hz=%s\nruns=%s\n' "$MODE" "$PACKAGE" "$DEVICE" "$SDK" "${REFRESH:-unknown}" "$RUNS" > "$OUT/device.txt"

run_scenario() {
  local dir="$1"
  mkdir -p "$dir"
  "$ADB" shell dumpsys gfxinfo "$PACKAGE" reset >/dev/null 2>&1 || true
  "$ADB" logcat -c || true

  # Same deterministic remote sequence for both engines.
  sleep 1
  "$ADB" shell input keyevent KEYCODE_DPAD_RIGHT
  sleep .35
  "$ADB" shell input keyevent KEYCODE_DPAD_LEFT
  sleep .35
  "$ADB" shell input keyevent KEYCODE_DPAD_CENTER
  sleep 1.15
  "$ADB" shell input keyevent KEYCODE_DPAD_RIGHT
  sleep .35
  "$ADB" shell input keyevent KEYCODE_DPAD_CENTER
  sleep 1.15
  "$ADB" shell input keyevent KEYCODE_DPAD_RIGHT
  sleep .25
  "$ADB" shell input keyevent KEYCODE_DPAD_RIGHT
  sleep .35
  "$ADB" shell input keyevent KEYCODE_DPAD_CENTER
  sleep 1.15
  "$ADB" shell input keyevent KEYCODE_BACK
  sleep .35
  "$ADB" shell input keyevent KEYCODE_BACK
  sleep .5

  local pid
  pid="$($ADB shell pidof "$PACKAGE" | tr -d '\r' | awk '{print $1}')"
  for sample in $(seq 1 8); do
    "$ADB" shell dumpsys meminfo "$PACKAGE" > "$dir/mem-$sample.txt" 2>/dev/null || true
    if [[ -n "$pid" ]]; then
      "$ADB" shell top -b -n 1 -p "$pid" > "$dir/cpu-$sample.txt" 2>/dev/null || true
    fi
    sleep .20
  done

  "$ADB" shell dumpsys gfxinfo "$PACKAGE" framestats > "$dir/framestats.txt" 2>&1 || true
  "$ADB" shell dumpsys gfxinfo "$PACKAGE" > "$dir/gfxinfo.txt" 2>&1 || true
  "$ADB" shell dumpsys SurfaceFlinger --latency > "$dir/surfaceflinger-latency.txt" 2>&1 || true
  "$ADB" shell dumpsys gpu > "$dir/gpu.txt" 2>&1 || true
  "$ADB" logcat -d -v epoch > "$dir/logcat.txt" 2>&1 || true
}

for kind in cold warm; do
  for run in $(seq 1 "$RUNS"); do
    DIR="$OUT/${kind}-run-$(printf '%02d' "$run")"
    mkdir -p "$DIR"
    echo "[$MODE] $kind run $run/$RUNS"

    if [[ "$kind" == "cold" ]]; then
      "$ADB" shell am force-stop "$PACKAGE" || true
      "$ADB" shell pm clear "$PACKAGE" > "$DIR/pm-clear.txt" 2>&1 || true
    else
      "$ADB" shell am force-stop "$PACKAGE" || true
    fi

    # am start -W supplies ThisTime/TotalTime/WaitTime startup metrics.
    "$ADB" shell am start -W -S "$PACKAGE" > "$DIR/startup.txt" 2>&1 || true
    run_scenario "$DIR"
    python3 "$ROOT/benchmark/parse_run.py" "$DIR" "$PACKAGE" > "$DIR/summary.json"
  done
done

python3 "$ROOT/benchmark/aggregate.py" "$OUT" > "$OUT/aggregate.json"
echo "Results: $OUT"
