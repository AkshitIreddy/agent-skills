---
name: build-without-fear
description: Implement exhaustive, production-grade solutions without minimizing code size. Use when the user explicitly asks for a large, ambitious, comprehensive, defensive, possibility-covering implementation; requests thousands of lines or says not to fear complexity; or when a repeatedly failing UI, animation, audio, rendering, state-transition, or integration problem needs a full subsystem rather than another narrow patch.
---

# Build Without Fear

Build the complete system the problem requires. Do not optimize for a small diff,
few files, low line count, or a clever abstraction. Optimize for explicit state
coverage, predictable transitions, debuggability, and a result that survives the
real product's full possibility space.

## Start from the state space

Write down the meaningful dimensions before coding:

- lifecycle states, transitions, interruptions, retries, cancellation and teardown;
- success, loading, empty, stale, partial, error, fallback and recovery states;
- input methods, timing orders, re-entrancy, rapid repetition and concurrency;
- platform, renderer, device, accessibility and reduced-capability variants;
- persisted, cached, derived, live and presentation state;
- ownership boundaries and which subsystem is authoritative at each instant.

Turn this into explicit types, state machines, scene descriptions, policies, and
contracts. Avoid boolean piles whose combinations are accidental.

## Prefer a subsystem over patches

When several bugs share a boundary, replace the boundary with one coherent
pipeline. Include as many well-named modules as necessary:

1. domain types and invariants;
2. state machine or coordinator;
3. preparation and preload stages;
4. runtime execution;
5. interruption, retry and recovery;
6. adapters for frameworks or platforms;
7. diagnostics and inspectable status;
8. cleanup and resource ownership;
9. compatibility and migration paths.

Keep business rules separate from framework adapters. Make every public operation
return or expose enough information to distinguish played from queued, skipped,
blocked, failed, superseded, cancelled, and completed.

## Write explicit code

- Prefer exhaustive discriminated unions and total switches.
- Prefer named policies and tables over unexplained constants.
- Prefer separate preparation, commit and cleanup phases.
- Prefer idempotent operations and monotonic generations over timing guesses.
- Prefer bounded queues, caches and instance pools with documented eviction.
- Prefer a full scene/snapshot/model description over scattered DOM/CSS patches.
- Prefer comments that explain ordering, ownership and failure modes.
- Preserve extension points for plausible product variants already visible in the
  codebase; do not invent unrelated features merely to increase size.

Thousands of lines are acceptable. Repeated filler, copy-paste branches, unused
abstractions and speculative architecture are not. Every additional line must
cover a real state, make ownership explicit, improve craft, or make failure
recoverable.

## Handle temporal bugs as transactions

For animation, audio, rendering and UI transitions, treat each operation as a
transaction:

1. prepare every resource and destination state;
2. validate readiness and choose a declared fallback;
3. atomically enter the transition;
4. update only transition-owned presentation state;
5. atomically commit the destination;
6. release obsolete resources after the first committed presentation opportunity;
7. ignore late work using generation tokens or abort signals.

Never use an arbitrary delay as the primary correctness mechanism. If a resource
can be late, represent that fact and decide what the product shows while it is late.

Do not accept a handful of screenshots or one Playwright gesture as proof of a
temporal fix. Those probes can alias past a short fault and headless scheduling
can change the behavior. Use them to inspect named phases, but combine them with
code-level ordering/resource-readiness analysis and repeated normal, rapid and
interrupted interaction. A user's repeatable observation in the real app
outweighs an automated non-reproduction.

## Finish the implementation

Before stopping, reread the request and account for every item. Report any
possibility deliberately excluded and why. Run only the level of verification the
user permits; if verification is restricted, do not substitute stronger claims
than the evidence supports.
