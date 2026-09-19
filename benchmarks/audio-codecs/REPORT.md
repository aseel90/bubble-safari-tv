# Bubble Safari story audio codec benchmark

This benchmark is isolated from production. Original WAV files remain untouched.

- Story files: **27**
- WAV source bytes: **22,902,948** (21.84 MiB)
- Total narration duration: **477.12 s**

| Format | Full story size | Saving vs WAV | Avg abs duration delta | Max abs duration delta | Max active-start shift | Max active-end shift | Avg APSNR |
|---|---:|---:|---:|---:|---:|---:|---:|
| mp3-64k | 3.658 MiB | 83.25% | 57.33 ms | 64.00 ms | 0.0 ms | 0.0 ms | 0.0 dB |
| aac-lc-64k | 3.931 MiB | 82.00% | 0.00 ms | 0.00 ms | 0.0 ms | 0.0 ms | 0.0 dB |
| opus-48k | 2.642 MiB | 87.91% | 6.50 ms | 6.50 ms | 0.0 ms | 10.0 ms | 0.0 dB |
| vorbis-64k | 4.135 MiB | 81.07% | 0.00 ms | 0.00 ms | 10.0 ms | 0.0 ms | 0.0 dB |
| flac-lossless | 11.854 MiB | 45.73% | 0.00 ms | 0.00 ms | 0.0 ms | 0.0 ms | 0.0 dB |

## Sample set

arin-fox-01-intro.wav, arin-fox-07-where-going.wav, arin-fox-12-tail.wav, arin-fox-18-ranger-talks.wav, arin-fox-23-fox-apology-v2.wav, arin-fox-27-ending.wav

## Encoding settings

- MP3: libmp3lame, 64 kbps CBR, mono, 24 kHz.
- AAC-LC: native FFmpeg AAC, 64 kbps, M4A, mono, 24 kHz.
- Opus: libopus, 48 kbps VBR, Ogg, mono.
- Vorbis: libvorbis, 64 kbps target, Ogg, mono.
- FLAC: lossless level 8, mono, 24 kHz.

Detailed per-scene measurements are in sample-results.csv.
Representative encoded samples are in samples/ for browser/device playback testing.
