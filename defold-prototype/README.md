# Bubble Safari TV — Defold Native Prototype

Independent native 2D experiment for the ocean world. It intentionally lives beside the existing WebView app and uses Android package `com.bubblesafari.tv.defold`, so both builds can be installed on the same TV for A/B testing.

## Scope

- Three native GUI choice bubbles.
- Animal, size and color questions loaded from `data/ocean_questions.json`.
- TV D-pad navigation, OK/DPAD_CENTER-equivalent Enter binding and Back.
- Animated focus, success overlay, lightweight GUI confetti and simple sound setting.
- Reuses the existing Leda `feedback_welldone.wav` through a generated local asset copy.
- Emits `BS_METRIC` log lines for question transitions, input-handler time, slow frames and Lua GC samples.

## Prepare existing assets

From repository root:

```bash
bash defold-prototype/tools/sync_assets.sh
```

This copies only the required audio from the existing top-level `audio/` directory into the ignored `defold-prototype/assets/audio/` build input. The original WebView assets are not modified.

## Open/build

Open `defold-prototype/game.project` in Defold after running the asset sync. Android application id is deliberately different from WebView so both APKs can coexist.

The first prototype uses Defold GUI primitives rather than SVG at runtime. Current SVG/art remains the master source and can later be rasterized into atlases after the engine decision.

## Benchmark

After installing both APKs on the Xiaomi TV Stick and connecting ADB:

```bash
./benchmark_tv.sh webview
./benchmark_tv.sh defold
python3 benchmark/compare.py
```

Default is five cold and five warm runs for each engine. Raw evidence and JSON summaries are stored below `benchmark-results/`.

End-to-end input-to-photon latency is intentionally **not** claimed from app timestamps. The prototype logs handler time only; reliable visual latency requires Perfetto correlation when supported or a high-speed camera/photodiode method.
