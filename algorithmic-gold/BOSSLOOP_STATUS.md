# BossLoop Benchmark Status

## What exists
- **File**: `~/the-agent/results.json` (110,908 bytes, 30 records)
- **Structure**: 30 prompt × spec pairs with keys: `prompt`, `spec`, `naive_text`, `naive_score`, `baseline_text`, `baseline_score`, `final_text`, `final_score`, `repetition`, `overlap`
- **Spec variants**: A, B, C (10 each)

## Summary numbers (computed from results.json)
| Metric             | Value   |
|--------------------|---------|
| naive_mean         | 0.6669  |
| specaware_mean     | 0.5715  |
| bossloop_mean      | 0.8743  |

These match the telemetry values displayed on the page exactly.

## What does NOT exist
No six-gate GOLD receipt exists for BossLoop.

The 30 BossLoop scores are raw benchmark output from a live LLM pipeline
(prompt to spec-aware refinement loop to scored by a frozen rubric). They have
never been run through the Algorithmic Gold judge() protocol because:

1. judge() requires cand(pub, budget, rng) and base(pub, budget, rng) procedural
   functions that generate outputs from public inputs on demand.
2. BossLoop candidate and baseline outputs are pre-computed text, not regenerable
   procedures. Re-running would require the full LLM inference pipeline (API keys,
   prompts, LLM calls), not the synthetic _sample/_truth harness that judge()
   uses on a forecasting domain.
3. judge() generates its own synthetic instances via dom.sample(rng, slice). The
   BossLoop data does not fit this model: no entropy_hex per seed, no
   commit_fingerprint, no per-slice lower bounds, no placebo check, no Goodhart
   check, no cost check, and no GATE field.

## Relationship to gold_receipt.json
- results.json (BossLoop benchmark) and gold_receipt.json (synthetic forecast
  domain receipt) are different files for different procedures.
- gold_receipt.json proves candidate_trend beats baseline_ewma on a synthetic
  forecasting task across 6 seeds + 1 frozen holdout (GATE: true).
- results.json is the raw benchmark evidence that motivated the BossLoop
  candidate. It is not a GOLD receipt.

## Page accuracy
The "streaming from results.json refreshed every 2s frozen benchmark, not
simulated" claim has been removed. The telemetry graph now renders as a static,
frozen benchmark display with no simulated live jitter.
