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
| [adversarial-refinement-loop](skills/adversarial-refinement-loop) | Run an indefinite critique, improvement, and verification loop when the user explicitly requests this mode. |
| [atomic-commits](skills/atomic-commits) | Create focused, working Git commits with Conventional Commits messages. |
| [audio-verification](skills/audio-verification) | Measure synthesized Web Audio when implementing sound effects or diagnosing playback and sound-quality defects. |
| [build-without-fear](skills/build-without-fear) | Design a complete subsystem when requested or when recurring defects require explicit state, ownership, and recovery. |
| [comfyui-assets](skills/comfyui-assets) | Generate textures, cutouts, or coordinated bitmap assets when the task calls for local ComfyUI generation. |
| [diagnosing-bugs](skills/diagnosing-bugs) | Diagnose a reported defect or performance regression through reproduction, targeted probes, and causal verification. |
| [finish-the-list](skills/finish-the-list) | Complete a requested backlog or multi-part deliverable without stopping after an intermediate milestone. |
| [frontend-design](skills/frontend-design) | Design an interface or develop bespoke visual, motion, and audio craft when the brief requests a new direction or richer polish. |
| [headless-terminal-workflow](skills/headless-terminal-workflow) | Keep Windows commands and helper processes hidden during local execution and application testing. |
| [parallelize-independent-work](skills/parallelize-independent-work) | Delegate independently verifiable work when subagents can improve completion time or review quality. |
| [prefer-second-monitor](skills/prefer-second-monitor) | Place task-owned Windows application windows on a secondary display when available and practical. |
| [require-external-communication-approval](skills/require-external-communication-approval) | Check authorization before sending a direct message, review, comment, or other human-facing communication. |
| [state-of-the-art-first](skills/state-of-the-art-first) | Research current techniques when selecting an unfamiliar or fast-changing approach for craft, rendering, audio, or ML. |
| [try-it-first](skills/try-it-first) | Use a quick experiment or rendered prototype to resolve uncertain behavior or compare design alternatives. |
| [visual-verification](skills/visual-verification) | Inspect rendered UI or graphics and verify affected interactions when implementing a visual change or auditing an interface. |
| [web-design-guidelines](skills/web-design-guidelines) | Audit specified UI code against current Web Interface Guidelines for accessibility, performance, and UX. |
| [writing-for-agents](skills/writing-for-agents) | Write or revise skills and agent instruction files with precise scope, useful references, and clear completion criteria. |

## Installation

Clone the collection once:

```bash
git clone https://github.com/AkshitIreddy/agent-skills.git
cd agent-skills
```

### Codex

For a user-level Codex installation, copy one skill or the full collection
to the personal skill directory:

```bash
mkdir -p "$HOME/.codex/skills"
cp -R skills/visual-verification "$HOME/.codex/skills/"

# Or install the full collection
cp -R skills/* "$HOME/.codex/skills/"
```

For one repository, copy the selected folders to `.agents/skills/` at the
repository root. You can also ask Codex's built-in installer to fetch a folder
directly:

```text
$skill-installer install https://github.com/AkshitIreddy/agent-skills/tree/main/skills/visual-verification
```

Start a fresh task or reload Codex if its skill catalog still shows the old
entries after installation.

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
New-Item -ItemType Directory -Force "$HOME/.codex/skills" | Out-Null
Copy-Item -Recurse "skills/visual-verification" "$HOME/.codex/skills/"
```

After installation, ask for a matching task naturally or invoke the skill by
name using the syntax supported by your agent.

## Consolidation and upgrades

The September 2026 update merges overlapping skills and narrows discovery
descriptions. See [the migration notes](docs/astra-skill-consolidation.md).
After backing up an existing installation, replace the public packages and
remove the retired entries listed there. A copy-only installation leaves old
skill folders discoverable. Preserve unrelated private skills and built-in or
plugin-managed packages; they are outside this repository's installation scope.

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
