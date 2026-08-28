---
name: parallelize-independent-work
description: Proactively split work into subagent lanes whenever a request has two or more independently verifiable outcomes, or combines implementation with research, documentation, platform work, audit, or visual/testing verification. Re-run this routing check when the user adds an independent item mid-turn. Keep only simple one-step or tightly coupled work local.
---

# Parallelize Independent Work

Use subagents to reduce elapsed time, not to multiply narration or duplicate the
same work.

## Delegate early

At the start of every request, and again whenever the user adds work mid-turn,
do a routing check before substantial local work: are there at least two
concrete outcomes that can be investigated, implemented, documented, audited,
or verified independently right now? If yes and delegation is available and
authorized, default to spawning at least one lane immediately. Do not wait
until the main agent has nearly finished.

Treat combined requests as likely candidates even when the user does not name
subagents. Common separable lanes include a focused implementation, a read-only
adversarial audit, a separate platform or documentation investigation,
documentation updates, and visual verification on an already stable build.
Keep tightly coupled design and edits in one lane.

Implementation plus independent verification counts as two outcomes when the
verifier can work from a stable baseline, fixture, deployed build, or explicitly
reserved files. A late-added research question, documentation request, or
platform task should trigger a fresh lane instead of silently joining the main
critical path.

Spawn those lanes early while keeping the critical integration path active in
the main agent. Give each subagent:

- one concrete outcome and a clear stopping condition;
- the minimum context and exact files or systems in scope;
- explicit edit ownership, or a read-only instruction when files overlap;
- relevant verification expectations and external-action limits.

Do not delegate vague “help with the task” work, duplicate another lane, or
spawn merely to appear busy.

## Coordinate shared state

Assume subagents share the workspace unless the environment says otherwise.
Avoid concurrent edits to the same files. Reserve single-instance resources
such as a dev server, browser fixture, device, database, or release operation
for one owner at a time.

The main agent remains responsible for:

- tracking which lanes are running and redirecting obsolete work;
- reviewing every returned diff or finding rather than accepting it blindly;
- resolving cross-lane design decisions and integrating in dependency order;
- running the final combined tests after the shared tree is stable;
- ensuring no required work remains before reporting completion.

Subagents do not broaden authorization. Destructive actions, external messages,
publishing, releases, purchases, and other consequential mutations still need
the same user authority they would require in the main agent.

## Finish cleanly

Collect all active results before the final answer. If a lane becomes irrelevant
or conflicts with a newer request, stop it explicitly. Report the integrated
outcome and evidence, not a list of delegated activity.
