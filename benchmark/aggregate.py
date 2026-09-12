#!/usr/bin/env python3
import json
import math
import statistics
import sys
from pathlib import Path

root = Path(sys.argv[1])


def percentile(values, p):
    if not values:
        return None
    xs = sorted(values)
    if len(xs) == 1:
        return xs[0]
    k = (len(xs) - 1) * p / 100.0
    lo, hi = math.floor(k), math.ceil(k)
    if lo == hi:
        return xs[lo]
    return xs[lo] * (hi - k) + xs[hi] * (k - lo)


def flatten(prefix, value, out):
    if isinstance(value, dict):
        for k, v in value.items():
            flatten(f"{prefix}.{k}" if prefix else k, v, out)
    elif isinstance(value, (int, float)) and not isinstance(value, bool):
        out[prefix] = float(value)


def aggregate_kind(kind):
    runs = []
    for path in sorted(root.glob(f"{kind}-run-*/summary.json")):
        try:
            runs.append(json.loads(path.read_text()))
        except Exception:
            pass
    series = {}
    for run in runs:
        flat = {}
        flatten("", run, flat)
        for key, value in flat.items():
            series.setdefault(key, []).append(value)
    metrics = {}
    for key, values in sorted(series.items()):
        metrics[key] = {
            "median": round(statistics.median(values), 3),
            "p95": round(percentile(values, 95), 3),
            "min": round(min(values), 3),
            "max": round(max(values), 3),
            "samples": len(values),
        }
    return {"run_count": len(runs), "metrics": metrics}

print(json.dumps({
    "cold": aggregate_kind("cold"),
    "warm": aggregate_kind("warm"),
}, indent=2, sort_keys=True))
