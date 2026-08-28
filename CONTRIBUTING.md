# Contributing

Contributions that make a skill clearer, safer, more portable, or easier to
verify are welcome.

## Before opening a pull request

1. Keep each skill focused on one repeatable job.
2. Put the skill in `skills/<skill-name>/` and use lowercase kebab-case.
3. Include a `SKILL.md` with valid YAML frontmatter containing `name` and
   `description`. The directory name and frontmatter name must match.
4. Keep the description concise and explicit about when the skill should run.
5. Add scripts, references, assets, or agent metadata only when the workflow
   actually uses them.
6. Test every executable helper and describe any required runtime or external
   service in the skill.
7. Remove secrets, credentials, internal hostnames, private repository names,
   customer data, personal conversation history, and machine-specific paths.
8. Preserve upstream licenses and attribution for adapted work.

## Pull request scope

Prefer one skill or one coherent repository-level improvement per pull request.
Explain what changed, why it improves agent behavior, and how you verified it.

By contributing, you agree that your original contribution is licensed under
the repository's MIT License. Third-party material must remain under compatible
terms with its original notices intact.
