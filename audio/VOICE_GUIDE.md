# Bubble Safari TV — Voice Guide

This file is the official reference for generating and adding Arabic voice assets to Bubble Safari TV.

## Voice

- Provider: Gemini TTS
- Voice: **Leda**
- Language: Arabic
- Style: youthful, warm, friendly, clear, playful, child-friendly
- Target audience: children aged 2–5
- Usage: TV game played with a remote control

Keep the same voice and direction for all generated files so the game sounds like one consistent character.

## Generation method — browser only

Voice files are generated manually through the browser. No API workflow is required for the current production process.

1. Open Gemini TTS in the browser.
2. Select the **Leda** voice.
3. Paste the standard prompt below.
4. Replace `[ARABIC TRANSCRIPT]` with the exact Arabic line required by the game.
5. Generate the audio.
6. Listen to the result and confirm that pronunciation, pace, warmth, and energy match the existing voice pack.
7. Download/export the generated audio as WAV.
8. Keep the final asset as **mono PCM WAV, 24 kHz, 16-bit** to match the current pack.
9. Rename the file using the exact game asset name.
10. Upload the file to the repository under `audio/`.
11. Commit/push to `main`. GitHub Actions will include `audio/**` automatically when rebuilding the TV APK and the published game bundle.

## Standard generation prompt

```text
Speak the following Arabic text using the Leda voice.

Voice direction:
A warm, youthful, friendly Arabic voice for an educational TV game designed for children aged 2–5.

Use clear Modern Standard Arabic pronunciation.
Sound cheerful, gentle, encouraging, playful, and safe.
Speak naturally as if talking directly to a young child.

Keep the delivery short and easy to understand.
Use a slightly slower pace than normal conversation.
Pronounce every word clearly.
Use a warm smile in the voice without exaggeration.
Avoid dramatic acting, shouting, whispering, or an adult announcer style.
Keep the same voice character and speaking style across every generated file.

Do not add, remove, repeat, or change any words.

Transcript:
[ARABIC TRANSCRIPT]
```

## Audio format

Preferred production format:

- Container: WAV
- Codec: PCM
- Sample rate: 24 kHz
- Channels: Mono
- Bit depth: 16-bit

Do not normalize different clips to noticeably different loudness. Keep the perceived volume close to the existing files.

## Naming convention

The filename must match the key expected by the game.

Examples:

- `animal_lion.wav`
- `animal_elephant.wav`
- `color_red.wav`
- `shape_circle.wav`
- `number_1.wav`
- `size_big.wav`
- `feedback_great.wav`
- `feedback_tryagain.wav`
- `ui_start.wav`
- `ui_finish.wav`
- `prompt_choose_picture.wav`
- `prompt_choose_different_picture.wav`

Do not use spaces, Arabic characters, uppercase letters, or random suffixes in filenames.

## Current game mapping

The web game loads voice files from:

```text
./audio/<voice-key>.wav
```

Special aliases currently used by `voice.js`:

- `prompt_match` → `prompt_choose_picture.wav`
- `prompt_odd` → `prompt_choose_different_picture.wav`

If a new voice key is introduced, make sure the filename and the JavaScript key remain synchronized.

## Quality checklist

Before adding a generated clip:

- Same Leda voice.
- Clear Arabic pronunciation.
- Suitable for a child aged 2–5.
- No extra words before or after the requested transcript.
- No excessive pauses.
- No shouting or exaggerated acting.
- Similar loudness to the existing pack.
- Correct WAV format.
- Exact filename expected by the game.

## TV / APK workflow

Bubble Safari remains a TV-first game. The game UI and logic run inside the Android TV WebView wrapper, and GitHub Actions produces the APK.

Audio files placed in `audio/` are copied into the generated WebView assets and included in the APK build automatically.

Do not manually copy generated voice files into the Android project. The source of truth is the root `audio/` directory.
