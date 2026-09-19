# Bubble Safari TV — Voice Guide

This file is the official reference for generating and adding Arabic voice assets to Bubble Safari TV.

For the complete narrated-story production process, also read:
[`STORY_PRODUCTION_ROADMAP.md`](../STORY_PRODUCTION_ROADMAP.md).

## Voice

- Platform: **Google AI Studio**
- TTS: **Gemini TTS / Text-to-Speech**
- Voice: **Leda**
- Language: Arabic
- Style: youthful, warm, friendly, clear, playful, child-friendly
- Target audience: young children
- Usage: TV game played with a remote control

Keep the same voice and direction for all generated files so the game sounds like one consistent voice identity.

## Generation method — browser only

Voice files are generated manually through **Google AI Studio** in the browser. No API workflow is required for the current production process.

For short game/UI clips:

1. Open Google AI Studio.
2. Open the Gemini TTS / speech generation experience.
3. Select the **Leda** voice.
4. Paste the standard prompt below.
5. Replace `[ARABIC TRANSCRIPT]` with the exact Arabic line required by the game.
6. Generate the audio.
7. Listen to the complete result and confirm pronunciation, pace, warmth, energy and ending.
8. Download/export the generated audio as WAV.
9. Keep the final asset as **mono PCM WAV, 24 kHz, 16-bit** to match the current pack.
10. Rename the file using the exact game asset name.
11. Upload the file under the root `audio/` tree.
12. Commit/push. GitHub Actions includes `audio/**` in the TV APK and published game bundle.

## Standard generation prompt — short game clip

```text
Speak the following Arabic text using the Leda voice.

Voice direction:
A warm, youthful, friendly Arabic voice for an educational TV game designed for young children.

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

## Narrated stories — production batch workflow

Story narration is **not** generated as one giant recording.

The method used for `أرين والثعلب` is:

1. Freeze the approved scene texts first.
2. Group **consecutive scenes that naturally continue each other** into a short generation batch.
3. Keep batches short enough that a bad result can be regenerated without repeating the whole story.
4. Generate the batch in Google AI Studio with the same **Leda** voice and one continuous storytelling direction.
5. Do not let the model add, remove or paraphrase words.
6. Leave clean natural pauses between scene blocks.
7. Listen to the complete batch.
8. Split/export the approved batch into **one final WAV file per Runtime scene**.
9. Listen again to every separated scene from beginning to end.
10. Verify the final word/syllable is not cut.

There is no fixed number of scenes per batch. Group by narrative continuity, location/emotion and total length.

### Story batch prompt template

```text
Use the Leda voice.

Narrate the following consecutive Arabic story scenes as one coherent,
warm children's storytelling session.

Voice direction:
- clear Modern Standard Arabic
- warm, youthful, friendly narrator
- gentle and safe for young children
- natural storytelling, not an announcer
- slightly slower than normal conversation
- clear pronunciation of every word
- consistent voice identity and loudness
- preserve emotional continuity across the consecutive scenes
- no shouting
- no whispering
- no exaggerated acting

Important:
- Do not add, remove, repeat, paraphrase, or change any word.
- Do not read the SCENE labels.
- Keep a clean natural pause between scene blocks so each scene can be separated afterward.
- Finish every scene completely; do not cut the final word or syllable.

SCENE [NN]
[EXACT APPROVED ARABIC TEXT]

SCENE [NN+1]
[EXACT APPROVED ARABIC TEXT]
```

### Runtime rule

Even when several scenes were generated together for continuity:

**one Runtime scene = one final audio file.**

Runtime code may technically support multipart/stitching cases, but that must not be used to hide a bad or truncated production recording.

## Audio format

Preferred current production format:

- Container: WAV
- Codec: PCM
- Sample rate: 24 kHz
- Channels: Mono
- Bit depth: 16-bit

Do not normalize different clips to noticeably different loudness. Keep the perceived volume close to the existing files.

## Naming convention

The filename must match the key expected by the game.

Game examples:

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

Story examples:

- `arin-fox-01-intro.wav`
- `arin-fox-17-ranger-arrives.wav`
- `arin-fox-23-fox-apology-v2.wav`

Do not use spaces, Arabic characters, uppercase letters, or random suffixes in filenames.

A version suffix such as `-v2` is allowed when intentionally replacing a production story clip during correction/QA.

## Current game mapping

The main learning game loads voice files from:

```text
./audio/<voice-key>.wav
```

Narrated story audio is stored under:

```text
./audio/stories/<story-id>/
```

Special aliases currently used by `voice.js`:

- `prompt_match` → `prompt_choose_picture.wav`
- `prompt_odd` → `prompt_choose_different_picture.wav`

If a new voice key or story segment is introduced, make sure the filename and JavaScript mapping remain synchronized.

## Quality checklist

Before adding a generated clip:

- Same Leda voice.
- Clear Arabic pronunciation.
- Suitable for young children.
- No extra words before or after the requested transcript.
- No missing words.
- No excessive pauses.
- No shouting or exaggerated acting.
- Similar loudness to the existing pack.
- Correct WAV format.
- Exact filename expected by the game.
- Listen through the **entire ending**, not only the beginning/middle.

For story clips also verify:
- exact match with the approved Scene text;
- no clipped final syllable;
- smooth continuity with previous/next Scene;
- one complete final Runtime asset per Scene.

## TV / APK workflow

Bubble Safari remains a TV-first game. The game UI and logic run inside the Android TV WebView wrapper, and GitHub Actions produces the APK.

Audio files placed in `audio/` are copied into the generated WebView assets and included in the APK build automatically.

Do not manually copy generated voice files into the Android project. The source of truth is the root `audio/` directory tree.
