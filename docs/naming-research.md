# Repository naming research

Research date: 2026-08-28

## Decision

This collection uses the repository name **`agent-skills`**.

That name is clearer than a bare `skills`: it identifies both the format and
the intended consumer in search results, package listings, clone directories,
and links. It is also the dominant generic name used by official, vendor, and
large community collections. Domain-specific libraries commonly extend the
same pattern as `<domain>-agent-skills`.

## Evidence

The decision was based on the open
[Agent Skills specification](https://agentskills.io/specification), official
collections and documentation from
[OpenAI](https://github.com/openai/skills),
[Anthropic](https://github.com/anthropics/skills),
[Vercel](https://github.com/vercel-labs/agent-skills),
[GitHub](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills),
and a GitHub repository-name search ordered by stars.

The first 50 relevant results contained a strong concentration of either
`agent-skills` or a descriptive specialization of it. Representative examples
included:

- [`addyosmani/agent-skills`](https://github.com/addyosmani/agent-skills)
- [`K-Dense-AI/scientific-agent-skills`](https://github.com/K-Dense-AI/scientific-agent-skills)
- [`VoltAgent/awesome-agent-skills`](https://github.com/VoltAgent/awesome-agent-skills)
- [`vercel-labs/agent-skills`](https://github.com/vercel-labs/agent-skills)
- [`tech-leads-club/agent-skills`](https://github.com/tech-leads-club/agent-skills)
- [`supabase/agent-skills`](https://github.com/supabase/agent-skills)
- [`twostraws/Swift-Agent-Skills`](https://github.com/twostraws/Swift-Agent-Skills)
- [`apify/agent-skills`](https://github.com/apify/agent-skills)
- [`WordPress/agent-skills`](https://github.com/WordPress/agent-skills)
- [`Kotlin/kotlin-agent-skills`](https://github.com/Kotlin/kotlin-agent-skills)
- [`hashicorp/agent-skills`](https://github.com/hashicorp/agent-skills)
- [`MicrosoftDocs/Agent-Skills`](https://github.com/MicrosoftDocs/Agent-Skills)
- [`laravel/agent-skills`](https://github.com/laravel/agent-skills)
- [`dbt-labs/dbt-agent-skills`](https://github.com/dbt-labs/dbt-agent-skills)
- [`elastic/agent-skills`](https://github.com/elastic/agent-skills)
- [`ClickHouse/agent-skills`](https://github.com/ClickHouse/agent-skills)
- [`firebase/agent-skills`](https://github.com/firebase/agent-skills)
- [`TheQtCompanyRnD/agent-skills`](https://github.com/TheQtCompanyRnD/agent-skills)
- [`LambdaTest/agent-skills`](https://github.com/LambdaTest/agent-skills)
- [`arpitg1304/robotics-agent-skills`](https://github.com/arpitg1304/robotics-agent-skills)

The repository layout follows the same ecosystem convention: one self-contained
folder per skill under `skills/`, with `SKILL.md` as the required entry point.
