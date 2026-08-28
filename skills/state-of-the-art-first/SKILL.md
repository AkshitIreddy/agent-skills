---
name: state-of-the-art-first
description: Broadly research current best practice across dozens of credible online sources before building, then implement the most capable evidence-backed approach rather than the simplest one that works. Use at the start of craft, art, generation, rendering, animation, audio, or ML work, and whenever a default technique may be stale.
---

# Start at the state of the art

The default failure is **building from priors**. You reach for the technique you already know, the base model, the single-pass version — and produce something that works but is visibly a tier below what the field is doing. In fast-moving areas your priors are often a year or more stale.

**Research first, then build the most capable version you can.** Complexity is not a cost in craft work; it is usually the entire difference between "fine" and "beautiful".

## The order of operations

1. **Search before you build.** Find current guides, papers, documentation,
   implementations, comparisons, benchmarks and workflow write-ups. Search for
   the year, "best", "vs", "workflow", "pipeline", "production", "failure",
   and the exact task or medium.
2. **Build a broad evidence set.** For an ordinary state-of-the-art review,
   open and assess at least **24 genuinely relevant sources**; use 30 or more
   for fast-moving, consequential or contested topics. Do not count search
   snippets, mirrors, syndicated copies or several pages repeating one source
   as separate evidence.
3. **Diversify the evidence.** Include multiple independent authors/domains and
   draw from all applicable groups: official documentation/specifications and
   release notes; research papers/model cards; maintained implementations,
   repositories and issue discussions; production case studies and expert
   practitioner workflows; comparative benchmarks, postmortems and substantive
   community evaluations. Do not let vendor quickstarts dominate the result.
4. **Read the sources, not just their titles.** Capture the claim each source
   supports, its publication/update date, whether it is primary or secondary,
   and the conditions under which its result applies. Prefer recent evidence,
   but retain older foundational work when newer practice still depends on it.
5. **Synthesize rather than vote.** Identify convergence, disagreements,
   outliers, hidden workload assumptions, version differences and trade-offs.
   Weight direct measurements and primary evidence above popularity. Continue
   searching until the latest several credible sources add no material new
   technique, risk or disagreement.
6. **Find out what strong practitioners actually use.** The quickstart is
   designed to be simple; the production/community pipeline is designed to be
   good. Separate widespread practice from one impressive but unreplicated
   demo.
7. **Identify the multi-stage version.** Serious pipelines are usually
   multi-pass: generate then refine, draft then critique, block in then detail,
   act then verify. If the plan has one stage, check whether it is merely the
   tutorial version.
8. **Then implement the ambitious evidence-backed version.** Preserve the
   user's constraints and choose sophistication only where the research shows
   an observable benefit.
9. **Verify by comparison, not assertion.** Test representative cases and
   compare quality, correctness, latency, cost and failure behavior against the
   simpler baseline.

If a narrow or new topic genuinely has fewer than 24 credible sources, use all
available high-quality evidence, say that the evidence base is limited, and do
not pad the count with weak or duplicate material.

## Specific traps

- **Base models are the weakest option.** Foundation releases are starting points; fine-tunes tuned for your specific style routinely beat them outright. Check what the community rates for your exact use case.
- **Single-pass is leaving quality on the table.** Second passes (refiners, hires fix, upscale-and-redetail, polish passes) are usually the largest single quality gain available.
- **Default parameters are chosen for safety, not quality.** Steps, sampler, CFG, guidance, quality levels — look up recommended values for your case.
- **There is usually a control mechanism you have not used.** Conditioning, masks, guidance layers, structural control, style locks. If you are fighting randomness with prompt wording, you are missing a control technique.
- **Auxiliary models exist for the hard parts.** Segmentation, matting, upscaling, restoration, style adapters. Do not hand-roll what a purpose-built model does far better.

## Record what you learn

Write down the technique choice and *why*, with links, next to the code. Record
the source set or evidence ledger, major points of agreement/disagreement, and
the gotchas encountered—version mismatches, required extensions, workload
assumptions and parameter interactions. A future session should inherit the
research rather than repeat it.

## Judgement

This is for craft-quality work, where the visible ceiling is set by technique. It is not licence to over-engineer plumbing: business logic, data flow and glue code still want the simplest correct implementation.

The test is whether sophistication shows up in the *output*. If a more advanced technique makes the result visibly better, take it. If it only makes the code cleverer, skip it.
