#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DEST="$ROOT/defold-prototype/assets/audio"
mkdir -p "$DEST"

FILES=(
  feedback_welldone.wav
  prompt_choose_picture.wav
  animal_fish.wav
  animal_turtle.wav
  animal_crab.wav
  size_small.wav
  size_big.wav
  color_yellow.wav
  color_red.wav
  color_blue.wav
)

for f in "${FILES[@]}"; do
  src="$ROOT/audio/$f"
  [[ -f "$src" ]] || { echo "Missing source audio: $src" >&2; exit 1; }
  cp "$src" "$DEST/$f"
done

echo "Synced ${#FILES[@]} prototype audio files into defold-prototype/assets/audio"
