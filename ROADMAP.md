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

## Resolved technical incident — Arin & the Fox Scene 23

**Status: Resolved and user-verified.**

The original `arin-fox-23-fox-apology.wav` recording was incomplete and ended before the intended Scene 23 narration was finished. Scene 24 contained its own independent narration and was not a valid continuation.

### Implemented fix
1. Re-recorded Scene 23 as a complete standalone file.
2. Added `arin-fox-23-fox-apology-v2.wav`.
3. Kept Scene 24 independent.
4. Removed cross-scene stitching and Scene 24 offset workarounds.
5. Verified sequential playback.
6. Removed the obsolete truncated Scene 23 file during Phase 5 cleanup.

### Production rule for story audio
**One scene = one final audio asset.**

For future stories:
- freeze the script before recording;
- keep each scene self-contained from 0.0 seconds;
- never repair production narration by borrowing audio from adjacent scenes;
- verify filename, duration and technical WAV integrity;
- listen to the complete scene and compare it with the approved text;
- run sequential QA across scene boundaries;
- test on the Android TV runtime;
- bump relevant cache/audio versions when replacing production assets.
