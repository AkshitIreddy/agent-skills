# Agent Skills

Reusable, opinionated workflows for AI coding agents that care about craft,
evidence, safety, and actually finishing the work.

[![License: MIT](https://img.shields.io/badge/license-MIT-16a34a.svg)](LICENSE)

This repository is a public collection of portable
`SKILL.md` packages. Each skill teaches
an agent a focused way of working: how to verify visual changes from rendered
pixels, diagnose hard bugs through falsifiable experiments, build richer
interfaces, keep commits atomic, or pause before communicating externally.

The collection is designed first for Codex and follows the open Agent Skills
format used by Claude Code, Cursor, Gemini CLI, GitHub Copilot, and other
compatible agents. A compatible format does not guarantee identical tools:
skills that mention browser automation, image inspection, subagents, or web
fetching require equivalent capabilities in the host agent.

## What is an agent skill?

An agent skill is a self-contained directory with a required `SKILL.md` file
and optional scripts, references, assets, or UI metadata:

```text
skill-name/
├── SKILL.md          # Discovery metadata and agent instructions
├── scripts/          # Optional deterministic helpers
├── references/       # Optional on-demand documentation
├── assets/           # Optional templates or resources
└── agents/           # Optional host-specific metadata
```

Agents initially see the skill's name and description. When the task matches,
they load the full instructions and only then reach for supporting resources.
This progressive disclosure keeps specialized workflows available without
placing every instruction in every conversation.

## Skill catalog

| Skill | Description |
| --- | --- |
| [`adversarial-refinement-loop`](skills/adversarial-refinement-loop) | Runs an open-ended, evidence-led cycle of research, adversarial critique, implementation, behavioral verification, and independent re-review until the user stops it. |
| [`ambitious-implementation`](skills/ambitious-implementation) | Pushes craft-heavy UI, animation, graphics, theming, and sound work toward richer results through layered detail, bespoke treatment, and iterative refinement. |
| [`atomic-commits`](skills/atomic-commits) | Keeps each commit to one logical concern, requires coherent working states, and applies clear Conventional Commits messages. |
| [`audio-verification`](skills/audio-verification) | Verifies synthesized Web Audio by rendering it offline and measuring loudness, clipping, noise, onset, brightness, and tail behavior instead of guessing from code. |
| [`build-and-look`](skills/build-and-look) | Shortens visual and audio feedback loops by building real artifacts early, comparing variations, and inspecting rendered evidence before polishing. |
| [`build-without-fear`](skills/build-without-fear) | Structures ambitious production-grade implementations around explicit state spaces, coherent subsystems, recovery paths, diagnostics, and exhaustive verification. |
| [`comfyui-assets`](skills/comfyui-assets) | Generates game and app art through local ComfyUI workflows, including seamless textures, flat-lit cutouts, alpha cleanup, style consistency, and visual quality gates. |
| [`diagnosing-bugs`](skills/diagnosing-bugs) | Builds a fast deterministic reproduction loop, minimizes failures, tests ranked hypotheses, instruments one variable at a time, and seals fixes with regression coverage. |
| [`finish-the-list`](skills/finish-the-list) | Keeps multi-item work moving until every item is finished or explicitly accounted for, with real verification and honest reporting of remaining gaps. |
| [`frontend-design`](skills/frontend-design) | Guides distinctive, brief-specific frontend work through intentional color, typography, layout, motion, signature interactions, accessibility, and self-critique. |
| [`parallelize-independent-work`](skills/parallelize-independent-work) | Finds independent outcomes early, assigns clearly owned subagent lanes, coordinates shared state, and requires reviewed integration and combined verification. |
| [`playwright-qa`](skills/playwright-qa) | Uses an act-capture-inspect-decide loop for UI verification, including screenshots and measurable probes for flicker, state changes, settling, and performance. |
| [`require-external-communication-approval`](skills/require-external-communication-approval) | Requires explicit approval immediately before human-facing messages while allowing otherwise-authorized repository and infrastructure work to continue. |
| [`state-of-the-art-first`](skills/state-of-the-art-first) | Researches a broad, diverse evidence base before craft or fast-moving technical work, selects capable multi-stage techniques, and compares them with simpler baselines. |
| [`try-it-first`](skills/try-it-first) | Prefers quick real-world experiments over speculation, then uses the observed result to explain and fix the underlying cause. |
| [`visual-verification`](skills/visual-verification) | Requires rendered screenshots and actual pixel inspection for visual claims, with close-up coverage, motion caveats, and concrete design-quality checks. |
| [`web-design-guidelines`](skills/web-design-guidelines) | Fetches Vercel's current Web Interface Guidelines and reports accessibility, performance, and UX findings in concise `file:line` form. |
| [`writing-for-agents`](skills/writing-for-agents) | Makes agent-consumed documents more predictable through precise context pointers, progressive disclosure, completion criteria, invocation design, and disciplined pruning. |

## Installation

Clone the collection once:

```bash
git clone https://github.com/AkshitIreddy/agent-skills.git
cd agent-skills
```

### Codex

For a user-level installation, copy one skill—or all of them—to the shared
Agent Skills directory that current Codex versions scan:

```bash
mkdir -p "$HOME/.agents/skills"
cp -R skills/visual-verification "$HOME/.agents/skills/"

# Or install the full collection
cp -R skills/* "$HOME/.agents/skills/"
```

For one repository, copy the selected folders to `.agents/skills/` at the
repository root. You can also ask Codex's built-in installer to fetch a folder
directly:

```text
$skill-installer install https://github.com/AkshitIreddy/agent-skills/tree/main/skills/visual-verification
```

Codex detects skill changes automatically; restart it if a new skill does not
appear.

### Claude Code

Copy selected folders to `~/.claude/skills/` for personal use or
`.claude/skills/` inside a project:

```bash
mkdir -p "$HOME/.claude/skills"
cp -R skills/visual-verification "$HOME/.claude/skills/"
```

### Cursor, Gemini CLI, and GitHub Copilot

All three support the cross-agent `.agents/skills/` location. Put selected
folders in `~/.agents/skills/` for personal use or `.agents/skills/` in a
project. Their native locations are also supported:

| Agent | Personal | Project |
| --- | --- | --- |
| Cursor | `~/.cursor/skills/` | `.cursor/skills/` |
| Gemini CLI | `~/.gemini/skills/` | `.gemini/skills/` |
| GitHub Copilot | `~/.copilot/skills/` | `.github/skills/` |

### Windows PowerShell

```powershell
New-Item -ItemType Directory -Force "$HOME/.agents/skills" | Out-Null
Copy-Item -Recurse "skills/visual-verification" "$HOME/.agents/skills/"
```

After installation, ask for a matching task naturally or invoke the skill by
name using the syntax supported by your agent.

## Repository structure

```text
agent-skills/
├── skills/                 # One portable package per skill
├── docs/                   # Repository decisions and research
├── CONTRIBUTING.md         # Contribution and privacy requirements
├── THIRD_PARTY_NOTICES.md  # Upstream attribution and licenses
├── LICENSE                 # MIT terms for original repository content
└── README.md
```

## Safety and privacy

Skills are executable guidance. Read every `SKILL.md` and supporting script
before installing it, understand the tools it may call, and preserve your
agent's normal approval and sandbox boundaries.

This public collection is deliberately curated. It excludes private company
infrastructure, secrets, credentials, private URLs and repositories, customer
or personal data, machine-specific sensitive paths, and private conversation
history. New contributions must pass the same file-by-file review.

Some workflows can trigger consequential actions. In particular,
`require-external-communication-approval` is intended to keep human-facing
messages behind an immediate approval gate; no skill grants authority the user
did not provide.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Keep additions focused, portable,
verifiable, privacy-safe, and correctly attributed. Please open one coherent
change per pull request.

## Naming

The repository is called `agent-skills` because that is the clearest and most
widely used public convention for a general collection. See the
[naming research](docs/naming-research.md) for the evidence and alternatives
considered.

## License

Original repository content is available under the [MIT License](LICENSE).
Some redistributed skills retain different or separately attributed upstream
terms; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and any license file
inside an individual skill directory.
