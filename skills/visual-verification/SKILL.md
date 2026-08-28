---
name: visual-verification
description: Verify UI work by actually looking at rendered screenshots before claiming it works. Use whenever building, changing, reviewing, or debugging anything visual — layout, styling, animation, theming, canvas/WebGL art, icons, or any "does this look right" question. Also use when a UI change is reported broken, or when judging design quality.
---

# Visual verification

Code that compiles is not UI that works. **You have not verified a visual change until you have looked at the rendered pixels.** Reading the diff, passing typecheck, and green unit tests prove none of: element visible, correctly positioned, unclipped, legible contrast, animation actually moving, art not black boxes.

## The rule

Before saying a visual change is done, working, fixed, or good:

1. Render it — dev server + headless browser, or the app itself.
2. Capture a screenshot of the specific surface and state you changed.
3. For a whole-screen visual audit, also capture 4–6 overlapping close-ups that cover the screen at readable scale.
4. **Read every image** with the Read tool and describe what you actually see.
5. Compare against intent. If it does not match, iterate — do not report success.

If you cannot render it, say so plainly instead of implying it was checked.

## Close-ups, then full frame

A full-frame screenshot proves composition but can hide small typography,
padding, clipping, texture, and control-state defects. Whenever the task is to
judge a complete screen rather than one isolated component, inspect detail
before letting the overall composition influence the review:

1. Divide the visible screen into 4–6 overlapping regions that collectively
   cover it. Prefer semantic regions such as masthead, primary copy, media,
   controls, and navigation over arbitrary equal tiles when the layout allows.
2. Capture each region as an element screenshot or lossless crop at a scale
   where its real text and edges are readable.
3. Inspect every close-up individually in a strict per-image loop: open one
   image, analyze what is visible, record any finding or a deliberate
   no-defect observation, and only then open the next image. A contact sheet is
   useful for routing, but it does not replace opening and analyzing each
   constituent close-up. Do not defer analysis until after a batch of images.
4. Only after every close-up has been inspected, inspect the full frame for
   hierarchy, balance, and relationships between regions.
5. After a material correction, recapture and inspect the affected close-ups
   first, then inspect the updated full frame so local craft and global
   composition are both rechecked.

This requirement applies to screen-level visual audits; it does not expand a
one-component change into an unrelated whole-application review.

## Keeping it cheap

Verification should be proportionate. Capture the one surface you changed, not a tour of the app. Batch many variants into a single specimen board rather than one screenshot per variant. Re-capture only after a change that could plausibly alter pixels. Two or three focused iterations beat ten aimless ones.

## Motion is a weaker surface

A screenshot proves only the sampled instant. Even a frame sequence can miss a
short flicker, sample before state propagation, alias a timing boundary, or run
under headless scheduling that differs from the desktop app. Do not treat one
good frame, a slow automated drag, or a settled screenshot as proof that a
motion bug is fixed.

For motion defects, use visual capture only as supporting evidence. Reproduce
slow and fast interactions repeatedly, inspect transition ownership and render
ordering in code, and prefer a real-time human observation from the affected
app/device when it conflicts with automation. State the limitation explicitly;
never overrule a user's repeatable live observation with a Playwright pass.

## Capturing

Prefer an existing harness in the project. Otherwise Playwright headless:

```js
import { chromium } from 'playwright';
const browser = await chromium.launch({
  headless: true,
  // needed when the page uses WebGL/canvas
  args: ['--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 });
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
page.on('console', (m) => { if (m.type() === 'error') console.log('[err]', m.text()); });
await page.goto(url, { waitUntil: 'networkidle' });
await page.screenshot({ path: 'shot.png' });                    // whole viewport
await page.locator('.thing').screenshot({ path: 'thing.png' }); // one element, for detail
```

Headless caveats worth knowing: software WebGL throttles `requestAnimationFrame`, so **poll for a state condition rather than sleeping a fixed time**; some engines' degrade paths disable effects headlessly, so provide a force flag; and canvas-source GPU uploads can be unreliable — prefer `ImageBitmap`.

For procedural/generated art (textures, icons, charts, sprites), render a **specimen board**: many variants in a grid, in one image, so you can judge variety and consistency at a glance.

## What to look for

Go through these deliberately — most visual bugs are one of them:

- **Presence**: is the element actually on screen, or `visibility: hidden` / zero-size / off-viewport / behind another layer?
- **Position & clipping**: inside its container, not cut off by `overflow: hidden`, not colliding or overlapping text.
- **Contrast & legibility**: can you read every label at its real size? Light *and* dark themes.
- **Fill defaults**: SVG without a fill rule renders solid black — a classic "black box" symptom of a missing stylesheet import.
- **Scale**: text too small, art too large, spacing inconsistent with neighbours.
- **State coverage**: empty, one item, many items, long text, error, loading, hover, focus, selected, disabled.
- **Motion**: capture several phases or record frames as supporting evidence;
  separately reason about ordering/timing, because sampled frames can miss the
  defect.
- **Responsive**: narrow and wide viewports; the page body must never scroll horizontally.

## Judging quality

When asked to improve or review design, look with a critical eye and name specifics rather than vibes: hierarchy (does the eye land on the right thing first?), spacing rhythm (is it on a consistent scale?), colour (harmonious, correctly weighted, accessible contrast?), typography (sensible scale, comfortable measure and leading), craft details (alignment, optical centering, edge quality), and motion (eased, interruptible, purposeful, never blocking).

Write findings as concrete changes: "the sidebar's 14px labels at 42% contrast fail against the cream paper — raise to 17px and use the sepia ink token" beats "the sidebar looks off".

## Reporting

State what you looked at and what you saw, e.g.:

> Captured the settings panel open at 1440×900. The sheet slides fully on-screen, all five sections render, but the backup-folder row's helper text is clipped by the section divider — fixed the padding and re-captured; it now sits clear.

Never claim a visual outcome you did not observe.
