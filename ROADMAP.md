# Bubble Safari — Roadmap

## Story audio reliability

### Incident: Arin & the Fox — Scene 23 narration is truncated

**Status:** Confirmed source-asset issue. Awaiting a new recording for Scene 23 only.

#### What was verified

- `arin-fox-23-fox-apology.wav` is incomplete.
- The recording ends abruptly after the grandmother says the equivalent of:
  > "... يمكنك الاعتذار، ولكن عليك أيضًا..."
- `arin-fox-24-return.wav` starts with the Scene 24 return narration ("عندما حان وقت العودة..."), so Scene 24 is not the missing continuation of Scene 23.
- The current runtime workaround stitches the beginning of Scene 24 onto Scene 23 and starts Scene 24 at an offset. This was introduced to compensate for the incomplete Scene 23 asset and must not be kept as the final production design.

#### Required fix

1. Record a **new complete Scene 23 narration only**.
2. Keep Scene 24 as its own complete file.
3. After the new Scene 23 file is reviewed and approved:
   - replace `arin-fox-23-fox-apology.wav`;
   - remove `stitchParts` from Scene 23;
   - remove `startAt` from Scene 24;
   - bump the story audio cache/version;
   - verify sequential playback from Scene 22 through Scene 25 on Android TV/WebView.

#### Scene 23 acceptance criteria

The final Scene 23 asset must:

- contain the full intended Scene 23 narration from beginning to end;
- end naturally, never mid-word or mid-sentence;
- contain **no words from Scene 24**;
- start playback from `0.0` seconds;
- use the same approved narration voice and production settings as the story;
- remain compatible with the story audio format used by the app (currently PCM WAV, 24 kHz, mono, 16-bit unless the whole story pipeline is intentionally migrated);
- include a short natural tail/silence after the final spoken word, rather than depending on runtime cutting;
- be listened to and approved before being wired into the production story.

### Prevention rules for all future stories

**One scene = one final audio asset.** A production scene should not depend on the head or tail of another scene's file.

Before integrating any story audio:

1. **Freeze the script first.** Each scene has an approved final text before recording/generation.
2. **Produce one complete file per scene.** Every file starts at 0 and contains only that scene.
3. **Listen, do not infer.** Silence/RMS analysis can help find candidate edit points, but it is not proof of sentence boundaries or semantic completeness.
4. **Do not use cross-scene stitching as a production fix.** `stitchParts`, `startAt`, and `endAt` should be treated as temporary diagnostics or explicitly reviewed exceptions, not normal story authoring.
5. **Run an asset-to-script review.** For every scene, verify the spoken content against the approved scene text before coding.
6. **Validate technical properties.** Check filename, duration, sample rate, channels, bit depth, readable WAV metadata, and that the file is not truncated/corrupt.
7. **Run sequential QA, not only per-file QA.** Test the full transition chain, especially the last 5 scenes and every scene boundary.
8. **Test on the target runtime.** Final acceptance must include Android TV / the same WebView class used by the app.
9. **Log the playback identity during QA.** Capture scene index, expected filename, actual `audio.src`, `currentTime`, `duration`, playback token, and `ended` transition.
10. **Cache carefully.** Any replaced narration asset must ship with an audio version/cache bump so Android TV does not keep an older file.

### Definition of done for a story audio release

A story is ready only when:

- every scene's spoken content matches its approved script;
- every scene uses its own final audio file starting at 0;
- there are no unintended cross-scene words, abrupt cuts, or overlaps;
- scene N's visual/text remains visible until scene N's audio actually finishes;
- the next scene starts only after the previous audio finishes and the intended transition delay completes;
- the full story is played from start to finish on the Android TV target with no audio/visual drift.
