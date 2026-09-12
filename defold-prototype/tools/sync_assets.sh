#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DEST="$ROOT/defold-prototype/assets/audio"
mkdir -p "$DEST"

for f in \
  feedback_welldone.wav \
  animal_fish.wav \
  size_big.wav \
  color_blue.wav; do
  cp "$ROOT/audio/$f" "$DEST/$f"
done

echo "Synced prototype audio into defold-prototype/assets/audio"
