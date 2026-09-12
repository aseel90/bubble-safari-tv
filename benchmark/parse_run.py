#!/usr/bin/env python3
import json
import math
import re
import statistics
import sys
from pathlib import Path

run_dir = Path(sys.argv[1])
package = sys.argv[2]


def percentile(values, p):
    if not values:
        return None
    xs = sorted(values)
    if len(xs) == 1:
        return xs[0]
    k = (len(xs) - 1) * p / 100.0
    f, c = math.floor(k), math.ceil(k)
    if f == c:
        return xs[int(k)]
    return xs[f] * (c - k) + xs[c] * (k - f)


def startup_metrics():
    text = (run_dir / "startup.txt").read_text(errors="ignore") if (run_dir / "startup.txt").exists() else ""
    out = {}
    for key in ("ThisTime", "TotalTime", "WaitTime"):
        m = re.search(rf"^{key}:\s*(\d+)", text, re.M)
        if m:
            out[key.lower() + "_ms"] = int(m.group(1))
    return out


def frame_metrics():
    path = run_dir / "framestats.txt"
    if not path.exists():
        return {}
    lines = path.read_text(errors="ignore").splitlines()
    header = None
    frames = []
    for line in lines:
        if line.startswith("Flags,IntendedVsync,Vsync"):
            header = [x.strip() for x in line.split(",")]
            continue
        if not header or not re.match(r"^\d+,", line):
            continue
        cols = line.split(",")
        if len(cols) < len(header):
            continue
        row = dict(zip(header, cols))
        try:
            if int(row.get("Flags", "0")) != 0:
                continue
            start = int(row["IntendedVsync"])
            end = int(row["FrameCompleted"])
            dt = (end - start) / 1_000_000.0
            if 0 < dt < 1000:
                frames.append(dt)
        except (KeyError, ValueError):
            pass
    if not frames:
        return {}
    mean = statistics.fmean(frames)
    return {
        "frame_count": len(frames),
        "frame_time_mean_ms": round(mean, 3),
        "frame_time_p50_ms": round(percentile(frames, 50), 3),
        "frame_time_p95_ms": round(percentile(frames, 95), 3),
        "frame_time_p99_ms": round(percentile(frames, 99), 3),
        "frame_time_max_ms": round(max(frames), 3),
        "fps_estimate": round(min(60.0, 1000.0 / mean), 2),
        "slow_frames_over_16_67": sum(x > 16.67 for x in frames),
        "janky_frames_over_25": sum(x > 25.0 for x in frames),
        "janky_percent_over_25": round(100.0 * sum(x > 25.0 for x in frames) / len(frames), 2),
        "frame_pacing_stddev_ms": round(statistics.pstdev(frames), 3),
    }


def memory_metrics():
    pss = []
    for path in sorted(run_dir.glob("mem-*.txt")):
        text = path.read_text(errors="ignore")
        m = re.search(r"TOTAL PSS:\s*([0-9,]+)", text)
        if not m:
            m = re.search(r"^\s*TOTAL\s+([0-9,]+)", text, re.M)
        if m:
            pss.append(int(m.group(1).replace(",", "")))
    if not pss:
        return {}
    return {
        "pss_avg_kb": round(statistics.fmean(pss), 1),
        "pss_peak_kb": max(pss),
        "pss_samples": len(pss),
    }


def cpu_metrics():
    values = []
    for path in sorted(run_dir.glob("cpu-*.txt")):
        for line in path.read_text(errors="ignore").splitlines():
            if package not in line:
                continue
            percents = [float(x) for x in re.findall(r"(\d+(?:\.\d+)?)%", line)]
            if percents:
                values.append(percents[0])
                break
    if not values:
        return {}
    return {
        "cpu_avg_percent": round(statistics.fmean(values), 2),
        "cpu_peak_percent": round(max(values), 2),
        "cpu_samples": len(values),
    }


def internal_metrics():
    path = run_dir / "logcat.txt"
    if not path.exists():
        return {}
    text = path.read_text(errors="ignore")
    transitions = [float(x) for x in re.findall(r"BS_METRIC question_transition .*?ms=([0-9.]+)", text)]
    handled = [float(x) for x in re.findall(r"BS_METRIC input .*?handled_ms=([0-9.]+)", text)]
    slow = len(re.findall(r"BS_METRIC slow_frame\b", text))
    gc = [float(x) for x in re.findall(r"gc_delta_kb=([-0-9.]+)", text)]
    out = {"internal_slow_frame_events": slow}
    if transitions:
        out.update({
            "question_transition_avg_ms": round(statistics.fmean(transitions), 3),
            "question_transition_p95_ms": round(percentile(transitions, 95), 3),
        })
    if handled:
        out.update({
            "input_handler_avg_ms": round(statistics.fmean(handled), 3),
            "input_handler_p95_ms": round(percentile(handled, 95), 3),
            "input_latency_note": "App handler time only; not end-to-end photon latency. Use Perfetto/high-speed camera for reliable visual latency.",
        })
    if gc:
        out["gc_delta_peak_kb"] = round(max(gc), 1)
    return out

result = {
    "package": package,
    "startup": startup_metrics(),
    "frames": frame_metrics(),
    "memory": memory_metrics(),
    "cpu": cpu_metrics(),
    "internal": internal_metrics(),
    "raw_gpu_available": (run_dir / "gpu.txt").exists() and (run_dir / "gpu.txt").stat().st_size > 0,
}
print(json.dumps(result, indent=2, ensure_ascii=False, sort_keys=True))
