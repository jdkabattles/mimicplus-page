"""verify_receipt.py — Re-run every seed in a GOLD receipt and confirm
the numbers match exactly.  Proves the receipt is reproducible, not a
one-time artifact.

Usage:
    python3 verify_receipt.py [receipt.json]

Exit code 0 = all seeds reproduce exactly.
Exit code 1 = at least one mismatch.
"""
import hashlib
import inspect
import json
import math
import os
import random
import sys
import time

# Import the harness
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from algorithmic_gold import judge, candidate_trend, baseline_ewma, Domain, _sample, _truth


def _round(v, places=4):
    """Match judge()'s rounding for comparison."""
    return round(v, places)


def verify(receipt_path="~/gold_receipt.json"):
    path = os.path.expanduser(receipt_path)
    with open(path) as f:
        receipt = json.load(f)

    print(f"Receipt: {path}")
    print(f"  GATE: {receipt['GATE']}")
    print(f"  commit_fingerprint: {receipt['commit_fingerprint']}")
    print(f"  verification: {receipt['verification']}")
    print(f"  python_version: {receipt.get('python_version', 'N/A')}")
    print(f"  harness_sha256: {receipt.get('harness_sha256', 'N/A')[:16]}...")
    print(f"  judge_params: {receipt.get('judge_params', {})}")
    print()

    # Verify harness integrity
    harness_path = os.path.join(os.path.dirname(path), "algorithmic_gold.py")
    if os.path.exists(harness_path):
        actual_sha = hashlib.sha256(open(harness_path, "rb").read()).hexdigest()
        recorded_sha = receipt.get("harness_sha256", "")
        sha_match = actual_sha == recorded_sha
        print(f"  Harness SHA-256 match: {sha_match}")
    else:
        print(f"  Harness file not found at {harness_path}")
        sha_match = False

    # Verify procedure fingerprints
    # _fingerprint returns full 64-char hex; judge() concatenates full hashes,
    # then hashes and truncates to 16.
    cand_fp_actual = hashlib.sha256(
        inspect.getsource(candidate_trend).encode()).hexdigest()
    base_fp_actual = hashlib.sha256(
        inspect.getsource(baseline_ewma).encode()).hexdigest()
    fp_actual = cand_fp_actual + base_fp_actual
    computed_commit = hashlib.sha256(fp_actual.encode()).hexdigest()[:16]
    recorded_fp = receipt.get("commit_fingerprint", "")
    print(f"  Candidate fingerprint:  {cand_fp_actual[:16]}...")
    print(f"  Baseline fingerprint:   {base_fp_actual[:16]}...")
    print(f"  Commit fingerprint:     {computed_commit}")
    print(f"  Recorded fingerprint:   {recorded_fp}")
    print(f"  Fingerprint match:      {computed_commit == recorded_fp}")
    print()

    # Reconstruct the domain
    params = receipt.get("judge_params", {})
    n = params.get("n", 2000)
    alpha = params.get("alpha", 0.05)
    min_effect = params.get("min_effect", 0.0)
    time_slack = params.get("time_slack", 3.0)
    goodhart_tol = params.get("goodhart_tol", 0.25)

    dom = Domain("forecast", _sample, _truth, slices=("trend", "flat"))

    all_match = True
    entries = list(receipt["seeds"]) + [receipt["holdout"]]

    for entry in entries:
        idx = entry["seed_index"]
        stype = entry["seed_type"]
        entropy_hex = entry["entropy_hex"]
        entropy = bytes.fromhex(entropy_hex)

        # Re-run judge with the recorded entropy
        r = judge(candidate_trend, baseline_ewma, dom,
                  n=n, alpha=alpha, min_effect=min_effect,
                  time_slack=time_slack, goodhart_tol=goodhart_tol,
                  entropy=entropy)

        # Compare results
        gold_match = r["GOLD"] == entry["GOLD"]
        checks = entry["checks"]
        trend_match = (
            _round(r["checks"]["slice:trend"]["mean_gain"]) == checks["slice:trend"]["mean_gain"]
            and _round(r["checks"]["slice:trend"]["lower_bound"]) == checks["slice:trend"]["lower_bound"]
            and r["checks"]["slice:trend"]["win"] == checks["slice:trend"]["win"]
        )
        flat_match = (
            _round(r["checks"]["slice:flat"]["mean_gain"]) == checks["slice:flat"]["mean_gain"]
            and _round(r["checks"]["slice:flat"]["lower_bound"]) == checks["slice:flat"]["lower_bound"]
            and r["checks"]["slice:flat"]["win"] == checks["slice:flat"]["win"]
        )
        placebo_match = r["checks"]["placebo_clean"] == checks["placebo_clean"]
        goodhart_match = r["checks"]["goodhart_ok"] == checks["goodhart_ok"]
        cost_match = r["checks"]["cost_parity"] == checks["cost_parity"]

        seed_ok = all([gold_match, trend_match, flat_match, placebo_match, goodhart_match, cost_match])
        status = "PASS" if seed_ok else "MISMATCH"
        all_match &= seed_ok

        print(f"[{status}] seed {idx} ({stype}): GOLD={entry['GOLD']}")
        if not seed_ok:
            print(f"  gold:       expected={entry['GOLD']} got={r['GOLD']}")
            print(f"  trend:      expected mg={checks['slice:trend']['mean_gain']} lb={checks['slice:trend']['lower_bound']} win={checks['slice:trend']['win']}")
            print(f"              got     mg={r['checks']['slice:trend']['mean_gain']} lb={r['checks']['slice:trend']['lower_bound']} win={r['checks']['slice:trend']['win']}")
            print(f"  flat:       expected mg={checks['slice:flat']['mean_gain']} lb={checks['slice:flat']['lower_bound']} win={checks['slice:flat']['win']}")
            print(f"              got     mg={r['checks']['slice:flat']['mean_gain']} lb={r['checks']['slice:flat']['lower_bound']} win={r['checks']['slice:flat']['win']}")
            print(f"  placebo:    expected={checks['placebo_clean']} got={r['checks']['placebo_clean']}")
            print(f"  goodhart:   expected={checks['goodhart_ok']} got={r['checks']['goodhart_ok']}")
            print(f"  cost:       expected={checks['cost_parity']} got={r['checks']['cost_parity']}")

    print()
    print(f"SHA-256 harness match:  {sha_match}")
    print(f"Fingerprint match:      {computed_commit == recorded_fp}")
    print(f"All seeds reproduce:    {all_match}")
    print(f"GATE:                   {receipt['GATE']}")

    overall = sha_match and (computed_commit == recorded_fp) and all_match
    print(f"\nVERDICT: {'ALL CHECKS PASS — receipt is reproducible' if overall else 'MISMATCH — receipt is NOT reproducible'}")
    return 0 if overall else 1


if __name__ == "__main__":
    receipt_path = sys.argv[1] if len(sys.argv) > 1 else "~/gold_receipt.json"
    sys.exit(verify(receipt_path))
