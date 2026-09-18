# Bubble Safari — Roadmap

## Story audio reliability

### Incident: Arin & the Fox — Scene 23 narration is truncated

**Status:** Resolved and user-verified. Scene 23 was re-recorded as a standalone file, cross-scene stitching was removed, and the corrected playback was confirmed.

#### What was verified

- `arin-fox-23-fox-apology.wav` is incomplete.
- The recording ends abruptly after the grandmother says the equivalent of:
  > "... يمكنك الاعتذار، ولكن عليك أيضًا..."
- `arin-fox-24-return.wav` starts with the Scene 24 return narration ("عندما حان وقت العودة..."), so Scene 24 is not the missing continuation of Scene 23.
- The previous runtime workaround stitched the beginning of Scene 24 onto Scene 23 and started Scene 24 at an offset. It was removed after the standalone Scene 23 recording was created.

#### Implemented fix

1. Re-recorded **Scene 23 only** using the approved Leda narration voice.
2. Added the complete standalone asset as `arin-fox-23-fox-apology-v2.wav`.
3. Kept Scene 24 as its own independent complete file.
4. Removed `stitchParts` from Scene 23 and `startAt` from Scene 24.
5. Bumped the story audio and service-worker cache versions.
6. Sequential playback was accepted after the corrected Scene 23 asset was deployed; the incident is closed.

#### Scene 23 acceptance criteria

The accepted Scene 23 asset:

- contains the full intended Scene 23 narration from beginning to end;
- ends naturally, never mid-word or mid-sentence;
- contains **no words from Scene 24**;
- starts playback from `0.0` seconds;
- uses the approved Leda narration voice and matching story performance;
- remains compatible with the story audio pipeline;
- finishes as a self-contained recording without runtime cutting;
- was listened to and approved after deployment.

**Incident lesson:** if a scene recording is truncated, regenerate that scene as a complete standalone asset. Never borrow speech from the next scene to repair it at runtime.

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
