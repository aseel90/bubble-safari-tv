#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BOB_JAR="${BOB_JAR:-${BOB:-}}"
JAVA_BIN="${JAVA_BIN:-java}"
VARIANT="${VARIANT:-debug}"
OUT_DIR="${OUT_DIR:-$PROJECT_DIR/build/android}"
ARCHITECTURES="${ARCHITECTURES:-armv7-android,arm64-android}"

if [[ -z "$BOB_JAR" ]]; then
  echo "Set BOB_JAR (or BOB) to bob.jar before building." >&2
  echo "Current Defold bob requires Java 25+." >&2
  exit 2
fi

[[ -f "$BOB_JAR" ]] || { echo "bob.jar not found: $BOB_JAR" >&2; exit 3; }
BOB_JAR="$(cd "$(dirname "$BOB_JAR")" && pwd)/$(basename "$BOB_JAR")"
command -v "$JAVA_BIN" >/dev/null || { echo "Java not found: $JAVA_BIN" >&2; exit 4; }

bash "$PROJECT_DIR/tools/sync_assets.sh"
mkdir -p "$PROJECT_DIR/build" "$OUT_DIR"

cd "$PROJECT_DIR"
"$JAVA_BIN" -jar "$BOB_JAR" \
  --platform armv7-android \
  --architectures "$ARCHITECTURES" \
  --variant "$VARIANT" \
  --archive \
  --bundle-format apk \
  --bundle-output "$OUT_DIR" \
  --build-report-json "$PROJECT_DIR/build/build-report.json" \
  --build-report-html "$PROJECT_DIR/build/build-report.html" \
  resolve distclean build bundle

echo "Defold Android bundle created under: $OUT_DIR"
echo "Build reports: defold-prototype/build/build-report.{json,html}"
