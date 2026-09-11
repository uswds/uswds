# USWDS Agent Tools

This directory contains AI agent tools and skills for working with the USWDS repository.

`.agents/` is the harness-neutral home for this content, so every agent tool shares one
copy rather than each vendoring its own. Harness-specific directories hold thin pointers
back here — see Discovery below.

## Skills

Skills are task-specific workflows that can be invoked by AI coding assistants. They encode USWDS-specific knowledge, conventions, and judgment.

### `skills/uswds-accessibility/`

Accessibility standards and verification for agents changing USWDS components (ARIA, focus, keyboard, AT announcements, a11y tests). Complements `uswds-code-review` gate 16: review routes AT behavior here instead of concluding it from the diff.

**Usage:**
```bash
/uswds-accessibility
```

See `skills/uswds-accessibility/SKILL.md`.

### `skills/uswds-code-review/`

A judgment-based code review skill that reproduces the calibration of the USWDS core review team. It:

- Enforces 16 specific gates (size, dependencies, test coverage, sanitization, etc.)
- Distinguishes personal preference from what all downstream consumers inherit
- Routes decisions to specialists (accessibility, breaking changes, new API surface)
- Stays silent on formatting, naming, and other tooling-owned concerns
- Uses the team's actual review voice and severity levels

**Usage:**
```bash
# Review a PR
/uswds-code-review 6767
/uswds-code-review https://github.com/uswds/uswds/pull/6789

# Review current branch
/uswds-code-review
```

See `skills/uswds-code-review/SKILL.md` for full documentation and `VERIFICATION.md` for test cases.

## Discovery

No agent tool auto-loads `.agents/`, so each skill also has a pointer file that the
tool *does* auto-load. Claude Code reads `.claude/skills/<name>/SKILL.md`; those files
carry the skill's frontmatter and a one-line instruction to read the real skill here.
Nothing is duplicated, and no symlink is required, so the checkout works on Windows.

Adding a skill therefore means two files:

1. `.agents/skills/<name>/SKILL.md` — the skill itself, with `name: <name>` in its
   frontmatter.
2. `.claude/skills/<name>/SKILL.md` — same `name` and `description`, with a body that
   points at the file above.

`npm run agents:check` fails if step 2 is missing, so a skill cannot land invisible.

Agents that read `AGENTS.md` instead of loading skills (Codex, Cursor, Copilot) get the
skill list from the Skills section of the root `AGENTS.md`.

## Doc drift checks

`.agents/scripts/check-agent-docs.mjs` verifies that the agent docs still describe the
repo. It checks that every `npm run <script>` and `gulp <task>` the docs mention really
exists, that every repo path they mention is on disk, that the Node version in
`AGENTS.md` matches `.nvmrc`, and that every skill has its discovery pointer.

```bash
npm run agents:check   # verify the docs
npm run test:agents    # unit tests for the scripts in this directory
```

CI runs both on every pull request via `.github/workflows/verify-agent-docs.yml`.

## Background

These tools are designed for use with AI coding assistants that support the skill/agent pattern. They assume:

- Node is installed. See `.nvmrc`
- `gh` CLI authenticated to `uswds/uswds`
- Working directory is the USWDS repo root

See `AGENTS.md` in the repo root for general agent guidance.
