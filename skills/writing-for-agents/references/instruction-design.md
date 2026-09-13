# Instruction design

## Useful context pointers

A pointer names a reference and the condition for reading it. Its wording
controls discovery before the body is loaded. State the actual decision or
workflow it supports, including a boundary only when it prevents likely
misrouting. Merge synonyms that describe the same trigger.

Keep common steps and constraints together in the entrypoint. Move branch-only
schemas, examples, or procedures to references, with links where needed. Avoid
both giant mandatory pre-reads and so many tiny files that navigation dominates.

## Completion and scope

Define outcomes in observable terms. Explain the evidence needed to establish
the result, and distinguish completion from a documented limitation. Preserve
the user's ability to stop, steer, and authorize side effects. Phrase routine
steps as actions, not repeated approval checkpoints.

Use precise mechanisms when deviation would cause a concrete failure: ordering,
resource ownership, a fragile API contract, or data safety. Else give criteria
that leave the agent room to choose the approach.

## Prune without losing requirements

Keep each meaning in one authoritative location. Remove stale claims and generic
encouragement that do not change behavior. Preserve non-obvious project facts,
user preferences, and past failure lessons that remain applicable.

Avoid caching easily discoverable commands or configuration in instructions
unless the lookup is expensive or a specific gotcha justifies the copy. When
guidance depends on model or host behavior, label the boundary and recheck it
after upgrades. A compact definition can replace repeated prose; invented
jargon that needs extensive explanation usually adds load.

Check realistic trigger examples and an out-of-scope example. Confirm that a
small change does not acquire a large workflow and that a requested complete
delivery does not stop at a draft. Test complex instructions independently
when doing so provides useful behavioral evidence.
