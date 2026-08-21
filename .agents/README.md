# USWDS Agent Tools

This directory contains AI agent tools and skills for working with the USWDS repository.

## Skills

Skills are task-specific workflows that can be invoked by AI coding assistants. They encode USWDS-specific knowledge, conventions, and judgment.

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

**Installation:**

The skill is automatically available if you have this repo cloned and your AI assistant is configured to use repo-local skills. For manual installation:

```bash
ln -s /path/to/uswds/.agents/skills/uswds-code-review ~/.claude/skills/uswds-code-review
```

## Background

These tools are designed for use with AI coding assistants that support the skill/agent pattern. They assume:

- Node is installed. See `.nvmrc`
- `gh` CLI authenticated to `uswds/uswds`
- Working directory is the USWDS repo root

See `AGENTS.md` in the repo root for general agent guidance.
