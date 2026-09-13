# Browser interaction QA

Drive the relevant path through the running interface's real controls using
Playwright or an equivalent available browser tool. Check observable effects:
persisted state, navigation, control behavior, requests, and responses. Open
captures when making visual claims.

Wait for observable readiness rather than fixed delays. Handle first-run
overlays when they appear. Investigate actionability failures through
hit-testing, focus, visibility, and overlays before bypassing them. A forced
click or direct handler call may isolate logic but cannot prove that a user can
operate the control. Verify the actual input path separately.

Match the probe to the claim: compare equivalent operation timings for a
performance issue, before/after output for a state change, and transition events
for a short-lived fault. Legitimate animation can change geometry; continuous
rendering alone does not prove wasted work. Investigate screenshot timeouts as
possible harness, resource, or rendering failures rather than a diagnosis.

For a transient problem, use [motion evidence](motion.md). Report the path,
observed result, and limitations. Rerun after a material correction; repeated
successful checks need a new reason.
