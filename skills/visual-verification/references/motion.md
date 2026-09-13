# Evidence for motion defects

Still images prove sampled instants. Frame sequences and automated gestures
can miss one-frame pops, reorderings, or late state propagation. Headless GPU
rendering and synthetic input can change the timing relative to the real app.

Repeat normal, rapid, and interrupted interactions. Capture relevant transition
phases and correlate them with resource readiness, presentation ownership,
render submission, and commit order. Match sampling to the suspected interval;
a poll beginning after the fault is blind to it.

Prefer observation on the affected app/device when available. A repeatable
user observation remains evidence when a probe passes. Report a non-reproduction
with its conditions rather than declaring that the defect cannot occur.
Claim a fix only to the extent supported by causal analysis and verification.
State any live-device verification that remains unavailable.
