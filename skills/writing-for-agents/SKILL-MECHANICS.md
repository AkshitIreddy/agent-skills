# Skill packaging and invocation

Keep a skill's name and description concise and specific to its real trigger.
Keep common constraints in SKILL.md and conditional workflows in references.
Link each reference with the condition for reading it. A short single-purpose
skill needs no router.

For Codex, automatic selection is allowed by default. Preserve the existing
policy unless the user asks to change it. For an explicitly requested manual-only
skill, use agents/openai.yaml:

```yaml
policy:
  allow_implicit_invocation: false
```

The skill remains explicitly invocable by name. Other agent hosts may use
different metadata; verify that host's schema instead of copying its flags into
Codex frontmatter. Use the installed skill-creator validator when available.

Preserve existing interface and dependency fields when changing invocation
metadata. Put optional shared mechanics in a reference and state any dependency
on companion skills, especially when individual packages can be installed.

Combine workflows when they have the same trigger and completion criteria.
Keep distinct skills when users need to invoke them independently. After a
merge, update references and document retired names so future installation
does not keep duplicate discovery entries.
