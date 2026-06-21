---
title: "MLOps for high-frequency trading: a model that knows when it isn't worth trading"
description: "What the model lifecycle actually looks like when your data is order books and your edge is smaller than the spread."
date: 2026-06-21
tags: [mlops, hft, market-microstructure, mlflow, quant]
repo: https://github.com/shenron0101/crypto-collector
---

# MLOps for high-frequency trading: a model that knows when it isn't worth trading

Most MLOps tutorials use the iris dataset or housing prices. The model gets 0.9
AUC, everyone claps, and nobody asks the only question that matters on a trading
desk: **does this actually make money after costs?**

High-frequency trading breaks the comfortable assumptions of normal MLOps. Your
data isn't a CSV; it's a firehose of order-book and trade events with two
different clocks. Your edge isn't 0.9 AUC; it's 0.63, and most of it is smaller
than the bid/ask spread. And "deploy the model" has to mean something a C++ hot
path can load without a Python interpreter in the loop.

To make all of this concrete (and runnable), I distilled two larger projects into
one small, legible repo:

> **[github.com/shenron0101/crypto-collector](https://github.com/shenron0101/crypto-collector)**:
> capture crypto order books, then run the full model lifecycle on them. It
> runs end-to-end *offline* on a synthetic order book: `pip install -e . &&
> cc-mlops demo`.

Here's how each MLOps stage changes when you move it into the HFT world.

## 1. Data collection: two clocks, raw-first

A trading model is only as trustworthy as its capture. Every order-book and trade
event gets recorded verbatim, with **both** an exchange timestamp and a local
receive timestamp, and landed as Parquet *before* any feature logic touches it.
That raw "bronze" layer is the source of truth; features and everything
downstream are disposable caches you can rebuild.

Why two timestamps? The exchange clock orders the market; the receive clock
measures *your* feed latency, and that gap (`recv − exchange`) is the first thing
you monitor and the number you hand a backtester's latency model. In the repo the
live Binance collector and a synthetic generator emit the *same* event records,
so nothing downstream knows or cares whether the data was real.

## 2. Features: the no-leakage starter kit

Order books reduce to a handful of microstructure features: book imbalance,
spread, microprice bias, short-horizon returns, and recent signed trade flow. The
target is the **sign of the mid-price move 20 book updates ahead**.

Two rules dominate everything else:

- **No leakage.** Every feature at time *t* uses only information at or before
  *t*; the label looks strictly forward. The scaler is fit on the *training slice
  only*.
- **Chronological splits, never shuffle.** Returns are autocorrelated and
  non-stationary. K-fold cross-validation quietly leaks the future into the past
  and hands you a beautiful, fictional backtest. The repo seals the last 30% of
  time as a future test window and never touches it during training.

## 3. Tracking: which data + code + params made this model?

I use MLflow for experiment tracking: params, metrics, artifacts, against a
SQLite backend you'd swap for a real tracking server on a team. But there's a
design choice worth calling out: in `crypto-collector`, **MLflow is optional**. If
it isn't installed, a tiny local tracker writes the same information as JSON, and
the training code never branches on which backend is active.

That isn't laziness; it's the point. The *interface* is the contract, not the
vendor. It's also the literal laptop-to-cluster portability story: the same
`train` command runs on my machine with no infra and on Databricks with a managed
tracking server.

## 4. Registry & promotion: "latest wins" is a liability

This is where HFT MLOps gets opinionated. A new model does **not** get promoted
just because it's newer. The champion/challenger gate scores the challenger and
the current champion on the **same sealed test window**, and only moves the
`@production` alias if the challenger improves PR-AUC by a margin *and* doesn't
regress calibration (Brier). Every decision, promoted or rejected, is recorded.

The deployable unit is also unusual. Instead of pickling an sklearn object, the
repo exports an immutable `ModelArtifact`: feature order, standardisation
mean/std, logistic coefficients, intercept, and training lineage. Serving is then
`sigmoid(((x − mean)/std) · coef + intercept)`: **a few lines of numpy, no
sklearn at serve time.** That's how you get Python/C++ parity: the C++ strategy
loads the exact same flat fields and computes identical numbers.

## 5. Serving + the question that actually matters

Here's the real demo output, on synthetic data:

```
[train]   roc_auc=0.630  pr_auc=0.606  brier=0.237
[evaluate] net-of-spread signal P&L by threshold:
   threshold 0.50 → 17968 signals, net -0.074 bps   (loses to the spread)
   threshold 0.60 →  7856 signals, net +0.004 bps
   threshold 0.70 →  1707 signals, net +0.110 bps   (fires 10× less, pays)
```

Look at what that says. The model has *real* edge: 0.63 AUC is meaningful for a
sub-second horizon. But at a 0.50 threshold, where it trades constantly, it
**loses money**, because most predicted up-moves are smaller than the half-spread
you pay to cross. Only when you demand `P(up) > 0.70`, firing ten times less
often, does it clear costs and turn net-positive.

AUC is spread-blind. P&L is not. An economic evaluation, realised forward move
*minus* the cost of crossing, is the quant check that separates a trading signal
from a Kaggle submission, and it's the one most ML pipelines never run.

(The flip side: as a *maker* you earn the spread instead of paying it, so the
same forecast turns profitable at far lower thresholds. That's why this kind of
signal is most useful for adaptive quoting, not aggressive crossing.)

## 6. Monitoring: catch the regime change before the P&L does

A model trained on last week's market rots when the regime shifts. The repo
computes **Population Stability Index (PSI)** per feature, the explainable drift
metric risk teams already trust, comparing the live feature distribution to the
training distribution. PSI > 0.2 on any feature raises an alert and exits
non-zero, so it can gate a pipeline. Feature drift (inputs moved) and concept
drift (the input/output relationship moved) are different beasts; you watch both:
PSI for the first, online performance eval for the second.

## The takeaway

MLOps in HFT isn't "the same pipeline with faster data." It's a pipeline built
around a few uncomfortable truths: your clocks disagree, your splits must respect
time, your deploy artifact must be interpreter-free, and your model can have real
statistical edge and still lose money. The tooling (MLflow, a registry, a
serving endpoint, drift jobs) is table stakes. The judgement is knowing that the
promotion gate should ask about *economics*, not just accuracy.

If you want to poke at it, the whole thing is one command away:
**[github.com/shenron0101/crypto-collector](https://github.com/shenron0101/crypto-collector)**.
