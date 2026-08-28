---
name: atomic-commits
description: Commit discipline for every repository — small atomic commits, Conventional Commits messages, only commit working states. Use whenever creating git commits, splitting work into commits, or writing commit messages, in any project.
---

# Atomic commits with Conventional Commits

Rules for every commit in every repository, regardless of project or language.

## Scope: one concern per commit

- Each commit contains exactly one logical change: one feature, one fix, one refactor, one doc update. If the summary line needs "and", split the commit.
- Never bundle unrelated changes (e.g. a bug fix plus a rename plus a dependency bump) — stage selectively (`git add -p`, per-file staging) so each commit stays scoped.
- Prefer many small commits over one large one, but each commit must stand on its own: it should make sense in `git log` without the neighbors.

## Only commit working states

- Every commit should build/parse and leave the project in a coherent, non-broken state. Run the relevant build/tests before committing when practical.
- Don't commit half-finished work as a checkpoint on shared branches. If a change can't work alone, fold it into the commit that completes it.
- Never commit generated artifacts, secrets, or local-only config; keep `.gitignore` current as part of the change that introduces new artifact types.

## Message format: Conventional Commits

```
<type>(<optional scope>): <imperative summary, lowercase, no trailing period>

<optional body: what and why, wrapped ~72 cols>
```

- Types: `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `build`, `ci`, `chore`, `style`, `revert`.
- Scope is the area touched (`feat(engine): …`, `fix(ui): …`) — use it when the repo has distinct areas.
- Summary ≤ 72 chars, imperative mood ("add", not "added"/"adds"), specific: `fix(parser): handle empty CSV cells` not `fix stuff`.
- Body only when the diff doesn't explain itself — state the why, constraints, or tradeoffs, not a restatement of the diff.
- Breaking changes: `!` after type/scope (`feat(api)!: …`) plus a `BREAKING CHANGE:` footer describing the migration.

## Ordering

- Commit infrastructure/scaffolding before the code that depends on it, so history replays cleanly.
- Refactors that enable a feature go in their own `refactor:` commit before the `feat:` commit.
