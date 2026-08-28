---
name: playwright-qa
description: Drive the running app with Playwright to verify UI work — act, screenshot, read the screenshot, decide. Use whenever a change is visible or interactive, whenever a UI bug is reported, and instead of reasoning about what the UI probably does.
---

# Verify UI by driving it

Reasoning about a UI tells you what the code intends. Driving it tells you what
it does. When those differ, only one of them is a bug report.

## The loop

1. **Act** — click, drag, type, hover, resize, with Playwright against the
   running dev server.
2. **Capture** — screenshot, and where the question is not visual, capture the
   thing that actually answers it: console errors, a bounding box over N
   frames, a network log, a pixel sample.
3. **LOOK** — actually Read the PNG. A screenshot you saved and did not open is
   not evidence, and claiming a fix on one is how a good specimen gets mistaken
   for a working app.
4. **Decide** — fixed, or not, and what the next probe is.

## Make the question measurable

Screenshots answer "does this look right". They do not answer "does it
flicker", "did that actually change", or "is it still animating". Measure those:

- **Flicker / instability** — sample the element's bounding box or a pixel
  across 30 frames and assert one distinct value. "Looks stable" is not a
  result.
- **Did it change?** — sample the same pixels before and after and diff them.
  Two warm browns can look identical and differ, and a surface that did not
  change can look plausible next to three that did.
- **Settled or spinning?** — count animation frames over a second. An app at
  rest ticks a handful of times; one that keeps pace with vsync is looping.
- **Cost** — `performance.getEntriesByType('paint')`, long tasks, or wrap the
  suspect call and time it. Report the number, not an adjective.

## Motion evidence has limits

Playwright is not an oracle for transient motion. Headless scheduling, software
GPU timing, synthetic input cadence, screenshot synchronization and sampling
rate can all hide a one-frame pop or capture the state before/after the faulty
boundary. A green trace means “not observed in this run,” not “cannot happen.”

For motion bugs, repeat slow and fast paths, vary the sampling phase, and pair
the probe with code analysis of state ownership, preload, render submission and
commit order. If a user repeatedly sees the defect in the real app, treat that
as stronger evidence than a Playwright non-reproduction. Use automation to
narrow the cause and reject gross regressions, not to dismiss the report.

## Practical notes

- Dismiss first-run overlays **before** the first navigation. A tutorial scrim
  that intercepts pointer events makes every later click time out, and
  dismissing it afterwards races its mount.
- Prefer `force: true` on controls the app deliberately covers with its own
  pointer-capture layer; Playwright's actionability check will otherwise refuse
  a control a human can plainly click.
- Poll for state instead of sleeping. Headless GPU renderers throttle
  `requestAnimationFrame`, so fixed waits are both slow and flaky.
- A poll that starts after the bad frame is also blind. Instrument transition
  events/order when the disputed behavior is shorter than the polling period.
- If `page.screenshot` hangs, the page is probably never compositing a stable
  frame — that is itself the finding.

## What this is not

It is not a substitute for thinking about the cause. Use it to find out what is
true, then reason about why. The failure mode it prevents is the opposite one:
long confident reasoning about a UI nobody has looked at.
