---
name: uswds-code-review
description: Review USWDS PRs or branches using the core team's calibrated judgment. Enforces 16 specific gates (size, dependencies, DRY, sanitization, test regression, etc.), distinguishes personal preference from what all consumers inherit, and routes specialist decisions (accessibility, breaking changes, new API surface). Use when the user says "review this", "code review", "review the PR", asks for feedback on changes, or explicitly invokes /uswds-code-review.
args:
  pr_or_branch: (optional) PR number/URL, or omit for current branch vs develop
---

# USWDS Code Review

This skill is maintained in a harness-neutral location so every agent tool can share
one copy. Read `.agents/skills/uswds-code-review/SKILL.md` from the repo root and follow
it, along with the `references/` and `scripts/` files it points to.
