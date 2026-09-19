# Conservative audio quality check

- WAV story total: **22,902,948 bytes** (21.84 MiB)
- MP3 96k story total: **5,752,863 bytes** (5.49 MiB)
- MP3 96k saving: **74.88%**

| Codec | Avg APSNR | Min APSNR | Avg SI-SDR | Min SI-SDR |
|---|---:|---:|---:|---:|
| mp3-64k | 168.10 dB | 167.43 dB | 27.08 dB | 23.95 dB |
| mp3-96k | 167.69 dB | 167.13 dB | 34.26 dB | 29.05 dB |
| aac-lc-64k | 167.61 dB | 166.86 dB | 25.65 dB | 24.09 dB |
| opus-48k | 168.59 dB | 167.65 dB | 21.34 dB | 18.86 dB |
| vorbis-64k | 167.10 dB | 166.35 dB | 27.88 dB | 26.37 dB |
| flac-lossless | 999.00 dB | 999.00 dB | 999.00 dB | 999.00 dB |

Notes:
- Metrics are engineering checks, not a replacement for listening on the target TV.
- MP3 container duration can include encoder padding in ffprobe; Chromium may expose the gapless-trimmed duration via HTMLAudioElement.
- Production WAV assets were not changed.
