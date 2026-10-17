"""algorithmic_gold.py

ALGORITHMIC GOLD = a procedure whose gains are verified by a signal it can't
game, and which still wins against a strong, fair baseline.

Domain-agnostic: plug in sample() + truth() and two procedures. Stdlib only.
Runs on Termux.
"""
import hashlib
import inspect
import json
import math
import os
import random
import sys
import time
from dataclasses import dataclass
from typing import Any, Callable, Optional, Sequence


@dataclass
class Domain:
    name: str
    # draw a fresh instance for a slice -> (public, hidden). Procedures see public only.
    sample: Callable[[random.Random, str], tuple]
    # SEALED signal: (public, hidden, output) -> float, higher is better.
    truth: Callable[[Any, Any, Any], float]
    slices: Sequence[str] = ("iid",)
    budget: int = 100  # identical for candidate and baseline
    # optional proxy the procedure may optimize (for the Goodhart check)
    proxy: Optional[Callable[[Any, Any, Any], float]] = None


def _fingerprint(f) -> str:
    try:
        src = inspect.getsource(f)
    except (OSError, TypeError):
        src = repr(f)
    return hashlib.sha256(src.encode()).hexdigest()


def _norm_ppf(p: float) -> float:
    """Inverse of the standard normal CDF (Acklam's rational approximation).

    Accurate to ~1e-9 across the full (0,1) range.  Needed because the
    stdlib ``math`` module ships no inverse-CDF, and scipy is not available.
    """
    _a = [-3.969683028665376e+01, 2.209460634111744e+02, -2.759296219425158e+02,
           1.385895126827748e+02, -3.066937821872808e+01, 2.506624425610071e+00]
    _b = [-5.447714726218827e+01, 1.610362139157351e+02, -1.559602663378619e+02,
           6.634592649794879e+01, -1.373400939343254e+01]
    _c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161475e+00,
          -2.549732539343734e+00,  4.374664140964477e+00,  2.938632645896953e+00]
    _d = [ 7.784695709090242e-03,  3.224671290700398e-01,  2.445677730264057e+00,
           3.524809457193622e+00]
    plow = 0.02425
    phigh = 1 - plow
    if p < plow:
        q = math.sqrt(-2 * math.log(p))
        x = (((((_c[0]*q+_c[1])*q+_c[2])*q+_c[3])*q+_c[4])*q+_c[5]) / \
            ((((_d[0]*q+_d[1])*q+_d[2])*q+_d[3])*q+1)
    elif p <= phigh:
        q = p - 0.5
        r = q*q
        x = (((((_a[0]*r+_a[1])*r+_a[2])*r+_a[3])*r+_a[4])*r+_a[5])*q / \
            (((((_b[0]*r+_b[1])*r+_b[2])*r+_b[3])*r+_b[4])*r+1)
    else:
        q = math.sqrt(-2 * math.log(1-p))
        x = -(((((_c[0]*q+_c[1])*q+_c[2])*q+_c[3])*q+_c[4])*q+_c[5]) / \
             (((( _d[0]*q+_d[1])*q+_d[2])*q+_d[3])*q+1)
    # one Halley refinement step for full machine precision
    e = 0.5 * math.erfc(-x / math.sqrt(2)) - p
    u = e * math.sqrt(2 * math.pi) * math.exp(x*x / 2)
    x = x - u / (1 + x * u / 2)
    return x


def _t_crit(alpha: float, df: int) -> float:
    """Upper (1-alpha) quantile of Student's t with *df* degrees of freedom.

    Uses the normal quantile + a Cornish-Fisher expansion.  For df > 100 the
    correction is negligible; for small df the 3-term expansion is accurate
    to < 2e-4.  Stdlib only — no scipy dependency.
    """
    if df < 1:
        df = 1
    z = _norm_ppf(1 - alpha)
    # Cornish-Fisher expansion for the t quantile (terms up to 1/df^3)
    t = z + (z**3 + z) / (4 * df) \
          + (5*z**5 + 16*z**3 + 3*z) / (96 * df**2) \
          + (3*z**7 + 19*z**5 + 17*z**3 + 5*z) / (384 * df**3)
    return t


def _t_ci(diffs: Sequence[float], alpha: float) -> float:
    """One-sided lower confidence bound for the mean of *diffs*.

    Deterministic (no resampling noise) — identical input always yields
    identical output, unlike the bootstrap percentile method which has
    B-sample sampling variance.  Uses the t-distribution which is exact
    under the CLT for n >= 30.
    """
    n = len(diffs)
    mean = sum(diffs) / n
    if n < 2:
        return mean
    var = sum((d - mean) ** 2 for d in diffs) / (n - 1)
    se = math.sqrt(var / n)
    if se == 0:
        return mean
    tcrit = _t_crit(alpha, n - 1)
    return mean - tcrit * se


def judge(cand, base, dom: Domain, n=2000, alpha=0.05, min_effect=0.0,
          time_slack=3.0, goodhart_tol=0.25, entropy: bytes = None):
    """Run the six-gate GOLD protocol.

    Gate 04 (Paired Win) uses a deterministic one-sided t-distribution lower
    confidence bound on the paired differences — no bootstrap resampling
    noise, fully reproducible given the seed.  Bonferroni-corrected across
    slices for family-wise error control.
    """
    report = {"domain": dom.name, "checks": {}}

    # 1. COMMIT: freeze both procedures BEFORE the sealed seed exists.
    commit = _fingerprint(cand) + _fingerprint(base)
    ent = entropy or os.urandom(32)
    seed = hashlib.sha256(commit.encode() + ent).hexdigest()
    report["commit"] = hashlib.sha256(commit.encode()).hexdigest()[:16]
    report["entropy"] = ent.hex()  # pass back in via entropy= to reproduce a run

    a = alpha / len(dom.slices)  # Bonferroni across slices
    all_slices_win, t_c, t_b = True, 0.0, 0.0
    proxy_gain, truth_gain = [], []
    spec_all = []

    for sl in dom.slices:
        rng = random.Random(seed + sl)  # fresh, unseen instances
        diffs, pdiffs, plac = [], [], []
        insts = [dom.sample(rng, sl) for _ in range(n)]
        for pub, hid in insts:  # 2. PARITY: same instance, same budget
            t0 = time.perf_counter()
            oc = cand(pub, dom.budget, random.Random(1))
            t_c += time.perf_counter() - t0
            t0 = time.perf_counter()
            ob = base(pub, dom.budget, random.Random(1))
            t_b += time.perf_counter() - t0
            diffs.append(dom.truth(pub, hid, oc) - dom.truth(pub, hid, ob))
            if dom.proxy:
                pdiffs.append(dom.proxy(pub, hid, oc) - dom.proxy(pub, hid, ob))
            # 3. PLACEBO: score against a mismatched hidden truth (prior-only gain)
            _, other = insts[len(diffs) % n]
            plac.append(dom.truth(pub, other, oc) - dom.truth(pub, other, ob))

        # 4. PAIRED, CORRECTED, EFFECT-SIZED win on this slice
        lb = _t_ci(diffs, a)
        win = lb > min_effect
        spec_all += [d - p for d, p in zip(diffs, plac)]
        all_slices_win &= win
        mean = sum(diffs) / n
        truth_gain.append(mean)
        proxy_gain.append(sum(pdiffs) / n if pdiffs else mean)
        report["checks"][f"slice:{sl}"] = {
            "mean_gain": round(mean, 4),
            "lower_bound": round(lb, 4),
            "win": win,
        }

    # gain must beat placebo (pooled): it comes from the instance, not just the prior
    slb = _t_ci(spec_all, alpha)
    placebo_ok = slb > 0

    # 5. GOODHART: gain on the optimizable proxy must not outrun gain on truth
    tg = sum(truth_gain) / len(truth_gain)
    pg = sum(proxy_gain) / len(proxy_gain)
    goodhart_ok = (pg - tg) <= goodhart_tol * max(abs(tg), 1e-9) if dom.proxy else True

    # 6. COST: not "winning" by burning more compute than the baseline
    cost_ok = t_c <= time_slack * t_b + 0.001 * n * len(dom.slices)

    report["checks"].update({
        "placebo_clean": placebo_ok,
        "goodhart_ok": goodhart_ok,
        "cost_parity": cost_ok,
    })
    report["GOLD"] = bool(all_slices_win and placebo_ok and goodhart_ok and cost_ok)
    return report


# ---------------- demo: forecasting (swap in ANY domain) ----------------

def _sample(rng, sl):
    slope = rng.uniform(0.5, 1.5) if sl == "trend" else 0.0
    xs = [slope * t + rng.gauss(0, 1.0) for t in range(20)]
    return xs, slope * 20 + rng.gauss(0, 1.0)  # (history, next value)


def _truth(pub, hid, out):
    return -abs(out - hid)


def baseline_ewma(xs, budget, rng):  # smoother with fixed alpha=0.5 (NOT tuned)
    s = xs[0]
    for x in xs[1:]:
        s = 0.5 * s + 0.5 * x
    return s


def candidate_trend(xs, budget, rng):  # adaptive: trend when significant else mean
    n = len(xs)
    mx = (n - 1) / 2
    my = sum(xs) / n
    sx = sum((i - mx) ** 2 for i in range(n))
    b = sum((i - mx) * (x - my) for i, x in enumerate(xs)) / sx
    res = sum((x - (my + b * (i - mx))) ** 2 for i, x in enumerate(xs)) / (n - 2)
    se = (res / sx) ** 0.5
    t = abs(b) / se if se > 0 else 0.0
    if t < 3.0:
        return my
    return my + b * (n - mx)


def seed_protocol(cand, base, dom, n_fresh=5, entropy=None, n_instances=2000,
                  receipt_path="~/gold_receipt.json"):
    """Run the full GOLD seed protocol: *n_fresh* independent fresh seeds
    plus one frozen holdout.  Returns (receipt_dict, gate_passed).

    The frozen holdout entropy is derived deterministically from a fixed
    label so that it is identical across every run — it is the "unseen"
    instance the procedure was never tuned against.
    """
    frozen_entropy = hashlib.sha256(
        b"algorithmic-gold-frozen-holdout-v1").digest()
    if entropy is not None:
        frozen_entropy = entropy  # allow override for testing

    seeds = []
    all_pass = True
    for i in range(n_fresh):
        r = judge(cand, base, dom, n=n_instances, entropy=None)  # fresh os.urandom
        entry = {
            "seed_index": i,
            "seed_type": "fresh",
            "timestamp": time.time(),
            "entropy_hex": r["entropy"],
            "commit_fingerprint": r["commit"],
            "GOLD": r["GOLD"],
            "checks": r["checks"],
            "method": "t-distribution CI (deterministic, no bootstrap)",
            "n": n_instances,
        }
        seeds.append(entry)
        if not r["GOLD"]:
            all_pass = False

    # frozen holdout
    r_holdout = judge(cand, base, dom, n=n_instances, entropy=frozen_entropy)
    holdout = {
        "seed_index": "holdout",
        "seed_type": "frozen",
        "timestamp": time.time(),
        "entropy_hex": r_holdout["entropy"],
        "commit_fingerprint": r_holdout["commit"],
        "GOLD": r_holdout["GOLD"],
        "checks": r_holdout["checks"],
        "method": "t-distribution CI (deterministic, no bootstrap)",
        "n": n_instances,
    }
    if not r_holdout["GOLD"]:
        all_pass = False

    receipt = {
        "domain": dom.name,
        "harness": "algorithmic_gold.py",
        "seed_protocol": f"{n_fresh} fresh seeds + 1 frozen holdout",
        "verification": "t-distribution one-sided lower CI (deterministic)",
        "commit_fingerprint": r_holdout["commit"],
        "judge_params": {
            "n": n_instances,
            "alpha": 0.05,
            "min_effect": 0.0,
            "time_slack": 3.0,
            "goodhart_tol": 0.25,
        },
        "python_version": sys.version.split()[0],
        "harness_sha256": hashlib.sha256(
            open(os.path.abspath(__file__), "rb").read()).hexdigest(),
        "cand_source": _fingerprint(cand),
        "base_source": _fingerprint(base),
        "seeds": seeds,
        "holdout": holdout,
        "GATE": all_pass,
    }

    path = os.path.expanduser(receipt_path)
    with open(path, "w") as f:
        json.dump(receipt, f, indent=2)
    print(f"Receipt written to {path}")
    return receipt, all_pass


if __name__ == "__main__":
    dom = Domain("forecast", _sample, _truth, slices=("trend", "flat"))
    receipt, gate = seed_protocol(candidate_trend, baseline_ewma, dom,
                                  receipt_path="~/gold_receipt.json")
    for s in receipt["seeds"]:
        print(f"seed {s['seed_index']} ({s['seed_type']}): GOLD={s['GOLD']}")
        for k, v in s["checks"].items():
            print(f"  {k}: {v}")
    print(f"holdout: GOLD={receipt['holdout']['GOLD']}")
    print(f"GATE: {gate}")
