---
name: audio-verification
description: Verify and debug synthesized audio (Web Audio API) by rendering it offline and measuring the samples, instead of guessing from code or claiming it works untested. Use whenever building, changing, or reviewing UI sound effects, tones, synths, or any AudioContext graph — and especially when sound is reported as "static", "noisy", "harsh", "crackly", "clicking", "popping", "too quiet", "distorted", or "not playing". Also use whenever you cannot hear the audio yourself, which is almost always.
---

# Audio verification

Code that compiles is not sound that works. **You cannot hear anything, so an unmeasured audio change is an unverified one.** Reading the graph, passing typecheck, and "the node is connected" prove none of: it makes sound at all, it isn't a burst of noise, it doesn't click on attack, it isn't clipping, it isn't inaudibly quiet.

The good news: audio is just numbers. Render the graph offline and every perceptual complaint becomes a measurement.

## The rule

Before saying a sound change is done, fixed, or good:

1. **Render it offline** — `OfflineAudioContext` gives you the exact samples, deterministically, far faster than real time.
2. **Measure it** — peak, spectral flatness, onset, tail (see below).
3. **A/B against the version you changed** — almost every judgement here is relative, not absolute.
4. If it doesn't match intent, iterate. If you genuinely can't measure it, say so plainly instead of implying you checked.

## Running the probe

`scripts/audio-probe.js` is a classic script (no imports) so it pastes straight into `page.evaluate()`, a browser-MCP `javascript_tool` call, or a devtools console. Evaluating it defines `globalThis.AudioProbe`.

```js
// build(ctx, destination) wires and starts your nodes — anything you'd build live
const m = await AudioProbe.measure((ctx, dest) => {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, 0);
  g.gain.linearRampToValueAtTime(0.3, 0.02);
  g.gain.exponentialRampToValueAtTime(0.0004, 0.4);
  osc.connect(g).connect(dest);
  osc.start(0); osc.stop(0.5);
}, { seconds: 0.6 });

// compare variants under identical conditions
const table = await AudioProbe.compare({ before: buildOld, after: buildNew }, { seconds: 0.6 });
```

Any page will do — **`about:blank` is enough**, you don't need the real app to measure a graph. To measure the *real* code path, either import the module under test, or copy its graph verbatim into `build` (and say which you did; a hand-copied graph can drift from the source).

`OfflineAudioContext` is a browser API, so you need something that runs JS in a browser. In rough order of preference, use whichever the environment already has: a **browser/preview tool you can call directly** (open a blank page, then evaluate the probe plus your `build`); an existing **Playwright or Puppeteer** install (`page.evaluate`); or, if the project already depends on it, a Node Web Audio implementation. Prefer what's installed over installing a browser engine just to measure a sound — and if none is available, say so rather than reporting an unmeasured guess as verified.

Design tip worth suggesting: a sound module that accepts an injected `AudioContext` can be rendered offline directly, with no copying and no drift.

## Reading the numbers

| Metric | Reads as | Reference points |
|---|---|---|
| `flatness` | noisy vs tonal — **the static detector** | 0.00 pure sine · 0.07 filtered swish (fine) · **0.28 reported as "static"** · 0.56 raw white noise |
| `peak` | clipping headroom | ≥1.0 will clip and distort. Offline render does **not** clamp, so a peak of 5.5 means 5.5 |
| `clippedSamples` | how much is clipping | any non-zero is audible crunch |
| `onsetRatio` | fraction of full level inside the first 1 ms — **the click detector** | 1.0 hard start (clicks) · 0.32 3 ms fade · 0.05 20 ms fade |
| `attackMs` | time to reach 90% level | under ~1 ms clicks on almost any material |
| `tailRms` | energy still present when the cue ends | high = chopped off mid-sound, which clicks on release |
| `hissShare` | energy above 5 kHz | high = brittle/hissy character |
| `centroidHz` | brightness | rises = brighter/harsher, falls = duller |
| `rms` | perceived loudness, better than peak | match this when comparing versions |
| `silent` | nothing came out | see the silence checklist below |

**Flatness depends on the band settings**, so the absolute value only means something relative to another measurement from the same run. Always A/B rather than trusting a lone number.

## Symptom to metric

Start from what was reported — it narrows the search enormously.

- **"It sounds like static / noise / a hiss"** → `flatness`. Noise pushed through a too-wide filter is still noise. A bandpass at `Q ≈ 1` barely filters; a sweeping band at `Q ≈ 4–8` reads as an airy swish. Check `hissShare` too.
- **"It clicks / pops / ticks"** → `onsetRatio` and `attackMs` for the attack, `tailRms` for the release. Fix with a short fade-in (5–30 ms) and a decay that actually reaches near-zero before the source stops.
- **"It crackles when several play at once"** → render the overlap and check `peak` / `clippedSamples`. Measure before assuming: cues are often so quiet that clipping is impossible and the real cause is elsewhere.
- **"Too quiet / too loud after your change"** → compare `rms` and `peak` against the old build. Narrowing a filter throws away energy, so a "cleaner" version usually needs a gain bump to land at the same level.
- **"No sound at all"** → `silent: true`. Check: the chain reaches `destination`; gain isn't 0; `start()` was called; the source didn't already end; an `exponentialRampToValueAtTime` didn't touch 0 (it can't — it silently breaks the envelope); the context isn't `suspended`.
- **"It got worse but I can't say how"** → run `compare` on both and diff every field; something moved.

## Tuning by sweep

When a fix trades one quality against another (narrower filter = less noise but quieter), don't guess — sweep the parameters and pick by numbers, holding perceived level constant:

```js
const grid = [[3, 0.10], [4, 0.13], [5, 0.15], [7, 0.18]]; // [Q, gain]
const variants = Object.fromEntries(grid.map(([q, gain]) => [`Q${q}_g${gain}`, buildWith(q, gain)]));
const results = await AudioProbe.compare(variants, { seconds: 0.6 });
// choose the lowest flatness whose peak/rms still matches the original
```

Matching the original level matters as much as fixing the defect: a fix that also makes the cue 4× quieter reads as a new bug.

## Web Audio traps that cause these bugs

Most "bad sound" bugs are one of these, and each has a measurable signature:

- **`exponentialRampToValueAtTime` can never reach or start from 0.** Ramp to a small value like `0.0004`, and use `setValueAtTime(0, t)` + `linearRampToValueAtTime(peak, t + fade)` for the attack.
- **Low-Q filters don't filter.** A bandpass exists to *remove* things; at `Q ≈ 1` it passes nearly everything, which is why noise-based cues end up sounding like raw static.
- **Don't add a "safety limiter" reflexively.** Measure whether clipping is even possible first. Chromium's `DynamicsCompressorNode` is not transparent at low levels — measured on a quiet cue it cut the peak ~40%, quietening the sound while protecting against nothing.
- **Writing `gain.value` mid-cue steps discontinuously** (an audible tick). Prefer `setTargetAtTime`. A non-finite value (`NaN` from an undefined setting) makes the output garbage — clamp and guard.
- **Nodes that are never disconnected** accumulate in the graph. Count active voices and confirm the count returns to zero after cues finish.
- **A long-lived `AudioContext` goes stale** when the output device changes or the machine sleeps — in Chromium it keeps reporting `running` while rendering garbage. Rebuild on `devicechange`, on `state === "closed"`, or when `currentTime` stops advancing.

## Checking the live app, not just the graph

Offline rendering proves the *sound*; it doesn't prove the app plays it correctly. In the running page, also confirm:

- `ctx.state` is `running` (not `suspended`) at the moment cues fire.
- The active-voice count returns to 0 after cues end — otherwise nodes are leaking.
- Rapid interaction doesn't spawn unbounded voices — throttle high-frequency cues (hover) and cap concurrent ones.

The same temporal limitation applies here as in motion QA: an offline waveform
or one automated click cannot disprove an intermittent scheduling/device bug.
Exercise slow and rapid sequences in the actual app and inspect context/voice
lifecycle ordering. If the user still hears a repeatable glitch, report the
probe as a non-reproduction rather than declaring the sound fixed.

Two practical browser gotchas: an `AudioContext` needs a **real user gesture**, so click with an input-driving tool rather than dispatching a synthetic click; and under Vite, `import('/src/sound.ts')` resolves to a version-queried URL, giving you a **separate module instance** from the app's singleton — fine for exercising the class, misleading if you expect shared state.

## Reporting

Give the numbers, not adjectives — "flatness 0.283 → 0.073, peak held at 0.0035" is checkable; "sounds much better now" is not. When a metric can't settle a question (is this cue *pleasant*?), say that it needs a human ear rather than implying measurement covered it. If the person reports a sound bug you can't reproduce, ask **when** it happens — which interaction, which surface — since that usually identifies the one cue involved far faster than auditing every call site.
