---
name: build-and-look
description: Prefer building and looking at variations over prolonged reasoning. Use when work is visual, aesthetic, or hard to predict from first principles — UI, art, animation, sound, layout, colour — and whenever you notice yourself planning at length without producing anything to look at.
---

# Build it, look at it, try another

For anything you can *see* or *hear*, judgement beats prediction. You cannot reason your way to "does this look good" — you can only look. Long deliberation before the first render is usually wasted: the answer only appears once something exists.

**If you have been thinking for a while without producing an artifact, stop and build the crudest version now.**

## The loop

1. **Build the smallest real thing** — not a plan, an artifact you can render.
2. **Look at it.** Screenshot it, read the image, play the sound, watch the animation.
3. **Name what is wrong** in concrete terms ("values are all mid-tone", "the easing lands too abruptly").
4. **Change one thing** and look again.

Three rounds of this beat an hour of reasoning, every time.

## Try variations in parallel, not in sequence

When a choice is aesthetic, do not agonise over which option is best — **make several and compare them side by side.** Render 4–8 variants into a single contact sheet: different palettes, spacings, easing curves, densities, light angles. Looking at them together makes the answer obvious in seconds, and often reveals a better option you would not have reasoned your way to.

This is cheap. A variant is usually a parameter change and a re-render. Generate generously.

## Do not reduce motion to stills

Still frames are excellent for composition and poor proof of temporal
correctness. A transition can look perfect at every chosen checkpoint and
still flicker between them, reorder layers for one frame, or pop on commit.
For motion, watch the real interaction repeatedly at normal and rapid input,
then inspect the code's preparation/ownership/commit order. Treat automated
captures as aids; a repeatable human observation on the real app wins over a
headless non-reproduction.

## Bias to action

- Prototype before specifying. A rough render answers questions a document cannot.
- When stuck between two approaches, build both crudely rather than debating.
- When a change is reversible and quick, just try it.
- Keep the feedback loop short: one harness you can re-run in seconds beats an elaborate pipeline.
- Do not polish an approach you have not yet validated visually.

## When thinking *is* the right move

Reason first when mistakes are expensive or hard to reverse: data migrations, destructive operations, security decisions, architecture that is costly to unwind, or anything touching real user data. There, think it through, then act.

The distinction is reversibility. Cheap and reversible → try it. Expensive or irreversible → reason first.

## Reporting

Say what you tried and what you saw: "rendered five light angles; the 35° key read best — the 60° lost the shelf edges in shadow." Comparative evidence is far more convincing than an assertion that something looks good.
