#!/usr/bin/env python3
import json
import sys
from pathlib import Path

root = Path(sys.argv[1] if len(sys.argv) > 1 else "benchmark-results")


def latest(mode):
    dirs = sorted(p for p in (root / mode).glob("*") if p.is_dir() and (p / "aggregate.json").exists())
    if not dirs:
        raise SystemExit(f"No aggregate results for {mode} under {root / mode}")
    path = dirs[-1]
    return path, json.loads((path / "aggregate.json").read_text())


def med(data, kind, key):
    try:
        return data[kind]["metrics"][key]["median"]
    except KeyError:
        return None

web_path, web = latest("webview")
def_path, de = latest("defold")
keys = [
    ("startup.totaltime_ms", "Startup total ms", "lower"),
    ("frames.frame_time_p50_ms", "Frame P50 ms", "lower"),
    ("frames.frame_time_p95_ms", "Frame P95 ms", "lower"),
    ("frames.frame_time_p99_ms", "Frame P99 ms", "lower"),
    ("frames.frame_pacing_stddev_ms", "Frame pacing stddev ms", "lower"),
    ("frames.janky_percent_over_25", "Janky >25ms %", "lower"),
    ("cpu.cpu_avg_percent", "CPU avg %", "lower"),
    ("cpu.cpu_peak_percent", "CPU peak %", "lower"),
    ("memory.pss_avg_kb", "PSS avg KB", "lower"),
    ("memory.pss_peak_kb", "PSS peak KB", "lower"),
]

report = {
    "webview_source": str(web_path),
    "defold_source": str(def_path),
    "cold": {},
    "warm": {},
}

for kind in ("cold", "warm"):
    for key, label, direction in keys:
        w, d = med(web, kind, key), med(de, kind, key)
        row = {"webview": w, "defold": d}
        if w is not None and d is not None and w != 0:
            delta = (d - w) / w * 100.0
            row["defold_vs_webview_percent"] = round(delta, 2)
            row["better"] = "defold" if (delta < 0 if direction == "lower" else delta > 0) else "webview"
        report[kind][label] = row

out_dir = root / "comparison"
out_dir.mkdir(parents=True, exist_ok=True)
out_path = out_dir / "latest.json"
out_path.write_text(json.dumps(report, indent=2, ensure_ascii=False, sort_keys=True) + "\n")
print(json.dumps(report, indent=2, ensure_ascii=False, sort_keys=True))
