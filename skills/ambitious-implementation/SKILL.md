---
name: ambitious-implementation
description: Write large, thorough implementations instead of minimal ones. Use for UI, animation, art/graphics, sound design, theming, and any craft-driven work where richness and detail are the point — and whenever output quality has been called cheap, flat, simple, or generic.
---

# Write the ambitious version

The default failure mode in craft work is **under-building**: one gradient where a painting needs twelve, three leaves where a vine needs forty, a linear tween where motion needs a spring with follow-through. The result compiles, matches the description, and looks cheap.

**Length is not a cost here. Thinness is.** For UI, animation, art and sound, a 2,000-line module that layers detail is usually *more correct* than a 200-line one that gestures at the idea. Do not ration effort to look efficient.

## What ambitious means concretely

**Layers, not a layer.** Real visual richness comes from stacking many low-opacity passes: base tone → large-scale variation → mid detail → fine grain → directional light → contact shadow → ambient occlusion → edge highlight → colour grade. Each pass may be a few lines; the beauty is in having all of them.

**Variation everywhere.** Anything repeated (leaves, books, bricks, particles, notes) needs per-instance variation in size, rotation, hue, opacity, spacing, and shape — ideally from a seeded PRNG so it is deterministic yet never uniform. Uniformity is the loudest signal of machine-made art.

**Hierarchy of scale.** Include large, medium, and small elements. Art that reads as amateur is usually missing one tier — all-medium leaves, all-same-width books, all-same-duration animations.

**Push the parameter past comfortable.** Thin lines, tiny details and subtle effects photograph as "nothing there". When unsure, make it bigger, bolder, more contrasty — then dial back after looking.

**Specify, do not abstract.** Twelve hand-authored theme definitions beat one parameterised theme with a colour input. Bespoke beats generic in craft work; save the abstraction for the plumbing.

## Sound

Same rule: layer. A convincing sound is 3–6 stacked elements (body, transient, texture, air, tail), each shaped by its own envelope and filter, then bussed through gentle compression, EQ and a short reverb. Give every one-shot several variants and randomise selection, pitch and level per play, or repetition becomes fatiguing. Prefer longer, softer envelopes for calm; harsh, clicky results usually mean missing fades, no lowpass, or peaks left unmastered.

## Animation

Layer here too: primary motion, secondary follow-through, overshoot/settle, anticipation, and a subtle idle so nothing is ever dead-still. Springs and custom cubic-beziers over linear. Stagger groups. Everything interruptible. Ambient life — a drifting particle, a swaying leaf, a slow breathing glow — costs little and transforms perceived quality.

Judge motion in time, not from a few attractive stills. Sampled screenshots and
headless playback can miss brief layer/order pops and use different scheduling
from the shipped app. Repeated real-time observation plus explicit transition
ownership and commit ordering are required before claiming a temporal defect is
gone; automation is supporting evidence only.

## Practice

- Budget generously up front: if a module could plausibly be 300 or 1,500 lines, plan for the 1,500-line version.
- Break it into many small well-named functions inside one coherent module rather than one giant function — long *and* readable.
- Build the full pipeline before tuning any single stage; a missing pass is more damaging than an imperfect one.
- Look at the result, then add another layer. Ask "what would a master have included that I skipped?" and add that.
- Study references concretely: name what is present (light direction, contrast, density, scale range, colour temperature shifts) and reproduce those specifics rather than an impression.

## When not to

This is for craft-driven surfaces. Business logic, data plumbing and glue code still want the smallest correct implementation — there, extra lines are liability, not richness.
