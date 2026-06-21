---
title: "Chasing factors: my run at the Artemis quant competition"
description: "What I built for Track 1 of the Artemis crypto quant competition: a weekly long/short factor strategy over ~113 coins, and a crash course in distrusting my own backtest."
date: 2026-06-22
tags: [quant, crypto, factor-investing, competition]
repo: https://github.com/shenron0101/Artemis-investing-challenge
---

# Chasing factors: my run at the Artemis quant competition

When I saw the brief for **Track 1 of the Artemis quant competition**, I knew
exactly the rabbit hole I wanted to fall into. The task was open-ended in the
best way: build a systematic crypto factor strategy. Define a tradable universe,
design signals with a real economic story, rebalance on a fixed weekly schedule,
and then evaluate it honestly, including everything that could go wrong.

That last requirement is the one that made me want to enter. Plenty of
competitions reward the biggest number. This one explicitly asked you to **explain
why your strategy might fail**. That's my kind of problem.

A few weeks of obsessing later I had **Artemis**: a weekly-rebalanced long/short
factor portfolio over ~113 crypto assets, an out-of-sample Sharpe of +0.84, and a
much healthier respect for how easy it is to fool yourself with a pretty
backtest.

> Everything (the data pipeline, the factor validation, the full competition
> report) lives here:
> **[github.com/shenron0101/Artemis-investing-challenge](https://github.com/shenron0101/Artemis-investing-challenge)**.

## Where I decided to look

Factor investing is one of those ideas that feels almost too clean: pick a
measurable characteristic of an asset, rank everything by it, go long the top and
short the bottom, repeat. In equities it's been studied to death. In crypto?
Messier, younger, noisier, which to me read as *more interesting*, not less.

My first real decision in the competition was **where** to point it. Everyone
benchmarks Bitcoin and the top-20 coins, but those names are picked over by ETFs,
arbitrage desks, and a thousand Twitter analysts. Whatever edge once lived there
has mostly been competed away. So I built my universe out of the **#20 to #120
market-cap tier** instead: coins with thinner coverage and weirder, more
behavioural investor bases. If mispricings survive anywhere, it's there. Betting
the whole entry on that hunch is what made it fun.

## The fun part: chasing factors

I'm not going to pretend this was a grind. It was a blast. There's a very
specific kind of joy in wiring up a data pipeline, dreaming up a signal at
midnight, and watching the information coefficient come back *just* high enough
to make you sit up.

I ended up building a little factor zoo: risk-adjusted momentum, a low-volatility
ranker, a lottery-reversal signal, a size factor, some DeFi fundamentals from
on-chain data, and a few network-structure ideas I'm embarrassingly proud of
(clustering coins by how their returns move together, then betting on a coin
relative to its cluster). On the behavioural side I got a bit carried away and
threw **182 candidate signals** at the wall: crash-depth rebounds, skewness,
beta, coin-age effects.

That's also where the competition taught me its first real lesson. Test 182
things and a handful will look brilliant by pure luck. So before I let myself
believe any of them, I made every survivor clear three completely different bars:

1. **Does it rank next week's winners?** (an information coefficient, with proper
   autocorrelation-aware error bars)
2. **Does it beat just holding Bitcoin, distributionally?** (a stochastic-dominance
   test, because crypto returns laugh at mean-and-variance)
3. **Is it a genuinely *priced* risk, not just a lucky signal?** (latent-factor
   asset pricing à la Giglio–Xiu)

Watching a beautiful-looking factor pass the first test and then get quietly
executed by the third was weirdly satisfying. It felt like the data telling me
the truth, which is exactly what you want before you stake a competition entry on
it.

## Pulling it together

The temptation at this point is to blend every good signal into one mega-score.
I tried it. It's worse: it smears together factors that are "real" in totally
different ways. So instead the final strategy runs **three small sub-books**: a
mispricing book, a core-ranking book, and a tightly capped "priced risk" tilt.
A rolling performance score plus an XGBoost regime model decides how much capital
each book gets each week, so the defensive stuff leans in during drawdowns and
the spicy stuff gets cut.

When I finally ran it out-of-sample over the 79-week holdout (Nov 2024 to May
2026), it held up:

| Strategy | Sharpe | Annual return | Max drawdown |
|---|---:|---:|---:|
| **My ensemble** | **+0.84** | **+29.9%** | **−24.7%** |
| Bitcoin | −0.33 | −12.3% | −46.7% |
| Equal-weight market | −0.51 | −34.4% | −68.3% |

It made money, with noticeably less pain, in a stretch where simply holding
crypto *lost* money. I'm not going to lie, seeing that table for the first time
felt great.

## The humbling part

And then I did the thing the competition was really asking for, and the thing I'm
actually proudest of: I tried to tear my own entry down.

- That +0.84 leans **heavily on one composite signal**. Honestly, it's closer to
  a single good idea wearing a volatility-control seatbelt than a truly
  diversified multi-factor book. Calling it "diversified" would be me flattering
  myself.
- One of the three books is a **net drag out-of-sample**. It's a real priced
  risk, but a lousy weekly trade, which is exactly why it's capped, not cut.
- **Costs bite.** My backtest assumed 10bps one-way. Be realistic about
  executing on mid-cap crypto (25 to 50bps round-trip, ~18 to 23× annual
  turnover) and that Sharpe slides to roughly **+0.58 to +0.72**. Still good! But
  you should know the number *after* friction, not before.
- It's **one out-of-sample window**. That reduces the chance I fooled myself. It
  doesn't eliminate it.

None of this ruined the result for me. If anything it made the entry stronger,
because the real game stopped being "how high can I push the Sharpe" and became
"how honest can I be about what this number actually is."

## What I took away

The competition was the excuse. The thing I actually kept was a habit: **state
the result, then immediately go looking for the reasons it might be fake.**
Multiple-testing corrections, three orthogonal tests, post-cost decomposition, a
sealed holdout: none of that is glamorous, but it's the difference between a
strategy you'd put real money behind and a chart you'd post for likes.

If you want to dig into the gory details (every factor, every t-stat, the full
critical evaluation I submitted), it's all reproducible from the repo:
**[github.com/shenron0101/Artemis-investing-challenge](https://github.com/shenron0101/Artemis-investing-challenge)**.
And if you've got a factor idea you think would survive all three tests, I'd
genuinely love to hear it.
