---
name: try-it-first
description: Prefer running the thing to predicting it. Use when a question could be settled by a quick experiment — UI behaviour, rendering, timing, an API's real shape, whether a bug reproduces — and especially when you notice yourself reasoning at length without having tried anything.
---

# Try it, then think about the result

Thinking is not the problem. Thinking *instead of looking* is. The failure this
prevents is a long confident chain of reasoning about something that could have
been settled in ninety seconds by running it.

## When an experiment beats an argument

- **Does this look right?** — render it and open the image.
- **Does this bug reproduce?** — reproduce it before theorising about the cause.
  Half of reported bugs are somewhere other than where they sound like.
- **Is this actually slow?** — measure it. "Should be fast" is not a finding.
- **What does this API really return?** — call it with real input.
- **Did my change do anything?** — capture before and after and compare them.

Write the smallest thing that answers the question: a scratch script, a
Playwright probe, a specimen page, a `console.log` of the real value. It is
throwaway — it does not need to be good, it needs to be true.

## Then think

An experiment gives you a fact, not an explanation. Once you have the fact,
reason about *why* — and reason hard, because that is what turns "the handle
flickers" into "the handle is parented inside the element it tracks, so hovering
it removes the hover". A fix aimed at a symptom you never explained usually
misses.

The sequence is: try it → get a fact → explain the fact → fix the cause → try
it again.

For transient motion, one run is not a fact of absence. Automated input and
frame capture can miss the faulty interval or change its timing. Exercise slow,
fast, interrupted and repeated paths, then trace the transition's code and
state ordering. Record “not reproduced under this probe” rather than “fixed”
when the user's real-time observation still disagrees.

## Speed

Bias toward the fast loop. Three quick experiments usually beat one long
deliberation, and they compound — each result narrows the next. Do not gold-plate
the probe, do not build a framework to answer one question, and do not spend
longer setting up the measurement than the measurement will save.

Two things are still worth slowing down for: an action that is hard to undo, and
a result that surprises you. A surprising result is either a real discovery or a
broken experiment, and it is worth knowing which before you build on it.

## Report what you saw

Say what you ran and what came back, with numbers where you have them. "Verified
by looking" and "should work" are different claims, and only one of them is
worth anything to the person reading it.
