# Bubble Safari — Roadmap

## Current status

### Phase 1 — Regression & integrity ✅
- Deep regression test for game boot, navigation, settings, worlds, questions, finish flow and resources.
- Fixed the legacy `#storyBackButton` binding regression.
- Confirmed clean console and stable remote/keyboard navigation.

### Phase 2 — Responsive story Split Layout ✅
- Restored the preferred story layout: complete illustration on the left and narrator panel on the right.
- Removed narration overlay from the illustration.
- Story images use `object-fit: contain` to avoid cropping.
- Verified responsive behavior on TV and landscape phone sizes.

### Phase 3 — Story QA 1→27 ✅
- Full sequential story playback from Scene 1 through Scene 27.
- Extra checks for Scenes 2, 17, 18, 23 and 27.
- Verified Pause/Resume, Replay Segment, Replay Story, ending actions and library return.
- Verified no story-layout overflow at the target resolutions.

### Phase 4 — Android TV branding ✅
- Finalized Android Vector App Icon.
- Finalized Android TV Banner.
- Kept branding consistent around Bubble Safari colors and safari/paw identity.
- Confirmed Android builds after resource changes.

### Phase 5 — Conservative cleanup ✅
- Audited runtime references before deleting anything.
- Removed obsolete truncated Scene 23 audio:
  `arin-fox-23-fox-apology.wav`
- Removed unused `audio/ui_listen.wav`.
- Kept all referenced JS/CSS, current story images and production audio.
- Confirmed Pages, APK and publish workflows after cleanup.

### Phase 6 — Final technical cleanup ✅
- Scoped Service Worker cleanup to Bubble Safari cache names only.
- Isolated cache reads to the current Bubble Safari cache.
- Bumped Service Worker cache version.
- Aligned the web favicon with the Android branding without introducing bitmap assets.
- Updated README and Roadmap to match the real project state.
- No gameplay/story logic was changed in this phase.

### Story image runtime optimization ✅
- Converted the 27 approved story illustrations from source PNG to runtime WebP Q95.
- Preserved the original image dimensions.
- Kept source PNG files for rollback/reference.
- APK and OTA package only the WebP runtime images.
- Story image payload dropped from 47,924,617 bytes to 7,858,980 bytes (83.60% reduction).
- Verified 27/27 WebP images decode successfully.
- Verified Pages, APK, release and story smoke test.

### Phase 7 — Final release validation ⏳
Planned final work:
1. Build the final release candidate APK.
2. Verify generated APK contents and update bundle.
3. Install/update it on the target Android TV device.
4. Run physical D-pad / OK / Back smoke tests.
5. Run final game + story regression.
6. Confirm OTA update behavior from an older installed build.
7. Produce the final signed release package and record checksum/version.

---

## Official story production standard

The repeatable production process for future narrated stories is documented in:

**[`STORY_PRODUCTION_ROADMAP.md`](./STORY_PRODUCTION_ROADMAP.md)**

It records the actual workflow used for **أرين والثعلب**:

- story/script freeze and scene breakdown;
- canonical character Master Sheets in **ChatGPT**;
- scene image generation in **ChatGPT**;
- image consistency / regeneration rules;
- story narration in **Google AI Studio / Gemini TTS** using **Leda**;
- generating narration in short batches of connected scenes rather than one giant recording;
- splitting/exporting final runtime audio to one file per scene;
- WebP Q95 runtime image optimization;
- image/audio synchronization;
- Android TV, APK and OTA validation;
- lessons learned from the character-drift, Scene 23 audio and transition issues.

Before producing Story #2, read that document first.

---

## Resolved technical incident — Arin & the Fox Scene 23

**Status: Resolved and user-verified.**

The original `arin-fox-23-fox-apology.wav` recording was incomplete and ended before the intended Scene 23 narration was finished. Scene 24 contained its own independent narration and was not a valid continuation.

### Implemented fix
1. Re-generated Scene 23 as a complete final scene asset.
2. Added `arin-fox-23-fox-apology-v2.wav`.
3. Kept Scene 24 independent in Runtime.
4. Removed cross-scene stitching and Scene 24 offset workarounds.
5. Verified sequential playback.
6. Removed the obsolete truncated Scene 23 file during Phase 5 cleanup.

### Production rule for story audio

**Generation batch and Runtime asset are different concepts.**

For future stories:
- freeze the script before narration generation;
- use **Google AI Studio / Gemini TTS / Leda**;
- generate narration in short batches of consecutive scenes that naturally continue each other;
- do **not** generate the entire story as one giant recording;
- after generation, split/export clean final files so **one Runtime scene = one final audio asset**;
- every final scene file must begin cleanly from its own 0.0 seconds and contain its complete approved narration;
- never repair a production scene by borrowing narration from the next scene;
- verify filename, duration and technical WAV integrity;
- listen to the complete scene and compare it word-for-word with the approved text;
- run sequential QA across scene boundaries;
- test on the Android TV runtime;
- bump relevant cache/audio versions when replacing production assets.

The detailed batch prompt, naming rules, image pipeline and QA gates live in `STORY_PRODUCTION_ROADMAP.md`.
