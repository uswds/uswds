---
name: uswds-code-review
description: Review USWDS PRs or branches using the core team's calibrated judgment. Enforces 16 specific gates (size, dependencies, DRY, sanitization, test regression, etc.), distinguishes personal preference from what all consumers inherit, and routes specialist decisions (accessibility, breaking changes, new API surface). Use when the user says "review this", "code review", "review the PR", asks for feedback on changes, or explicitly invokes /uswds-code-review.
args:
  pr_or_branch: (optional) PR number/URL, or omit for current branch vs develop
---

# USWDS Code Review

Perform a judgment-based code review of USWDS changes, reproducing the calibration of the core review team (engineering leads and senior engineers who set technical direction, a product lead, and an accessibility specialist). This skill enforces 16 specific gates, distinguishes personal preference from what cascades to all downstream consumers, and explicitly routes calls that aren't a code reviewer's to make.

## Entry point

**Auto-detected:**
- **Given a PR number or URL** → fetch via `gh pr view --json body,title,additions,deletions,files,baseRefName,headRefOid` + `gh pr diff`. All gates apply, including PR-body hygiene and definition-of-done checks.
- **No argument (local branch)** → `git diff develop...HEAD`. PR-body and DoD gates are *skipped* and reported as such, not silently passed.

Example invocations:
- `/uswds-code-review 6767`
- `/uswds-code-review https://github.com/uswds/uswds/pull/6789`
- `/uswds-code-review` (reviews current branch)

## Review Cache

PR reviews are cached in an unversioned `.review-cache/` directory at the project root to prevent re-reviewing unchanged commits:

- **`.review-cache/cache.json`**: Index tracking reviewed PRs, commit hashes, recommendations, summaries, and each PR's `status` (`open` or `merged`).
- **`.review-cache/<commit-sha>.md`**: Full markdown review findings saved per commit ID.
- **Retention**: Nothing is deleted. When a PR merges, its entry is marked `status: "merged"` and both the metadata and the findings markdown are kept — the review of a merged PR is the record you want when a regression surfaces later.
- **Local branches are not cached.** A local branch's HEAD moves with every amend and there's no remote state to compare against, so `check` and `save` both require `--pr`. Reviewing the current branch always runs the full pass.

```bash
# Check if PR is already cached at current commit
node .agents/skills/uswds-code-review/scripts/review-cache.mjs check --pr <N>

# List all cached reviews
node .agents/skills/uswds-code-review/scripts/review-cache.mjs list

# Refresh open/merged status for every cached review
node .agents/skills/uswds-code-review/scripts/review-cache.mjs sync
```

## Process

### 1. Check cache and gather context

**Step 1a: Check cache**
Before pulling full diffs and re-evaluating gates on a PR, check if the PR has already been reviewed at its current commit:
```bash
node .agents/skills/uswds-code-review/scripts/review-cache.mjs check --pr <N> --json
```
- If status is `CACHED` (exit 0): Output the cached recommendation, summary, and the findings from `reportContent`. Skip redundant review work unless the user passes `--force`. If `reportExists` is `false`, the findings are gone — treat it as a `MISS` and re-review.
- If status is `MERGED` (exit 2): The PR is already merged. Report that, along with the retained prior review if `cached` is `true`. Don't review a merged PR unless the user explicitly asks.
- If status is `MISS` (exit 1): Proceed with review.
- If status is `ERROR` (exit 3): Report the failure. Don't silently proceed as if the cache were empty.

Skip this step entirely when reviewing a local branch — only PR reviews are cached.

**Step 1b: Gather context (in parallel):**

**If reviewing a PR:**
```bash
gh pr view <N> --repo uswds/uswds --json number,title,body,additions,deletions,changedFiles,files,baseRefName,headRefOid,url
gh pr diff <N> --repo uswds/uswds
gh api repos/uswds/uswds/pulls/<N>/files --paginate --jq '.[] | {filename, additions, deletions, status, patch}'
```

**If reviewing a branch:**
```bash
git status
git log develop..HEAD --oneline
git diff develop...HEAD --name-status
git diff develop...HEAD
git diff -M --numstat develop...HEAD
```

Also fetch the USWDS ADR list once (used by gate 4). Distinguish which repo they are intended to apply to. Some are for USWDS, and others are for the `uswds-elements` repo:
```bash
gh api repos/uswds/uswds-proposals/git/trees/HEAD?recursive=1 --jq '.tree[] | select(.path | startswith("decisions/")) | .path'
```

Identify:
- What files changed (runtime code vs tests vs config vs docs)
- Scope: feature, fix, refactor, dependency, tooling, docs
- If a PR: linked issue via `Closes #N` in body
- Base branch (should be `develop` for this repo)

### 2. Read changed files

**Never review the diff alone.** Read the actual changed files to understand:
- What the change does and why
- Whether it touches shared selectors, utilities, or public API
- Impact radius: isolated feature vs. core utility vs. component used by nav/banner/form
- Test coverage: are there tests, and what do they actually verify?

If a PR body exists, parse it for:
- Summary (must be release-note shaped: `**Brief statement.** Additional context.`)
- Breaking change declaration (must pick one of three options from template)
- Related issue (`Closes #N`)
- Related PRs (uswds-site companion for new settings/variants)
- Problem statement, Solution, Testing and review steps

If the linked issue exists, fetch it:
```bash
gh issue view <N> --repo uswds/uswds --json title,body,labels
```

### 3. Apply the 16 gates

Each gate is documented in `references/gates.md` with runnable checks and carve-outs. The critical ones:

1. **Size** (flag only) — counts authored runtime + test lines against 400, with carve-outs for generated churn
2. **Dependencies** — blocking unless called for; `lit` is the only runtime dep
3. **Definition of done** — issue acceptance criteria vs actual diff, both directions
4. **Existing pattern or ADR** — grep `uswds-core` utils; check uswds-proposals repo; distinguish Elements vs Core ADRs
5. **Test coverage** — must fail on base branch (the senior-engineer regression test)
6. **DRY tests / 3-location threshold** — cite the existing `events.js` triplicate
7. **Duplication** — blocking if a core utility already exists
8. **Simplification pass** — dispatch `code-simplification` skill subagent, filter to readability wins only
9. **Error handling** — guards, fallbacks, teardown symmetry, `@warn` on bad settings
10. **Sanitization** — `Sanitizer.escapeHTML` for any `innerHTML` with interpolation
11. **Modular code** — cited from engineering-values.md "Support repairability"
12. **Input validation** — at system boundaries, checked against the sanitizer precedents
13. **New API surface** — manual follow-up; flag $theme-* settings, new data-* attrs, breaking markup
14. **Breaking changes** — manual follow-up; carry the product lead's design-vs-code split
15. **New variants / default changes** — manual follow-up
16. **Accessibility** — two sub-gates: 16a (SR text content, flag-only, an accessibility specialist can judge without live AT); 16b (AT behavior verdict, manual follow-up — name the test matrix, don't conclude)

For each finding, apply **the cascade test** before including it: *Does this change what every downstream consumer gets, or is it how I would have written it?* If the latter, downgrade to non-blocking or drop entirely.

### 4. Classify findings into three dispositions

**Blocking** — must be fixed before merge:
- Correctness bugs (especially latent ones found by reading, not caught by CI)
- Security issues (unsanitized interpolation, supply-chain, unsigned commits in workflows)
- Missing regression test (test passes on base branch)
- Duplicated `uswds-core` utility
- De-themed token (literal replacing `color()`, `units()`)
- Undeclared semver impact (CSS order, specificity, markup, default flip)
- Scope creep (changes unrelated to the issue)
- Sass/token misuse
- Unmet definition of done

**Non-blocking** — improvements, style, or follow-up work:
- Readability refactors
- Optional chaining / concision opportunities
- Test DRYness (unless it's at the 3+ threshold)
- Naming improvements that don't affect clarity
- Architecture concerns that pre-date this PR (convert to issue)

State these with an explicit escape hatch: *"This is far from being a blocker, but worth considering"* or *"Not a blocker here though."* The dominant mode in the corpus is "I can approve once [this small thing is resolved]."

**Manual follow-up** — route to a specialist, don't conclude:
- Accessibility / AT behavior → name the test matrix, don't render a verdict (16b)
- A11y SR text content → an accessibility specialist can flag whether hint text is redundant with role or missing interaction guidance; non-blocking, does not need live AT testing (16a)
- Breaking-change classification → flag it, cite the repo definition, note the product lead's design-vs-code split
- New API surface ($theme-* settings, `data-*` attrs, CSS class names)
- New variants or default changes
- Anything that affects visual design intent

### 5. Structure the report

Use **the Conventional Comments labels**:
- `**issue**` — blocking
- `**polish**` — non-blocking improvement
- `**question**` — genuine uncertainty
- `**suggestion**` — optional
- `**thought**` — bigger-picture, often converted to an issue
- `**quibble**` — very minor
- `**praise**` — call out good work
- `(non-blocking)` — append to downgrade severity

**Summary structure** (the engineering-lead three-move template):
1. Specific, non-generic compliment
2. Census of what's below ("a few suggestions and one question")
3. What clearing them earns ("then we can get this merged")

**Report sections:**

```markdown
## PR Review: [Short title]

### Recommendation

[One of:]
- ✅ **Approve** — no blocking issues found. [Manual follow-up items to complete before merge.]
- ✅ **Approve with suggestions** — no blockers; suggestions above are optional improvements.
- ⏸️ **Hold** — pending [ADR / team decision / architectural discussion].
- 🔄 **Request changes** — blocking issues above must be addressed.

---

### Overview
[1-2 sentences: what this does, why it matters]

### Context
- **PR**: #N / branch `<name>`
- **Scope**: [feature|fix|refactor|dependency|tooling|docs]
- **Size**: +X/-Y across Z files ([flag if >400 authored lines, with reason])
- **Base**: `develop`
- **Linked issue**: #N (or "none found")

### Gate checklist
| Gate | Status | Notes |
|------|--------|-------|
| Size <400 authored lines | ✅/⚠️/❌ | [carve-out reason if flagged] |
| Dependencies justified | ✅/⚠️/❌/⏭️ | |
| Definition of done met | ✅/⚠️/❌/⏭️ | |
| [... all 16 gates ...] | | |

Legend: ✅ pass, ⚠️ flag (non-blocking), ❌ fail (blocking), ⏭️ skipped (local branch)

---

### ❌ Blocking issues

[If any. Each with `**issue**` label, file:line reference, code block or repro steps, and fix suggestion.]

---

### ⚠️ Non-blocking suggestions

[If any. Each with `**polish**`, `**suggestion**`, or `**thought**` label, and explicit escape hatch.]

---

### 🔍 Manual follow-up required

[If any. Name the specific test or specialist area, don't conclude.]

**Accessibility:**
- [ ] **16a — SR text content** (accessibility specialist, no live AT needed): is hint/label text redundant with role? Does it explain interaction? Flag as `**polish (non-blocking)**` with suggested text; note any uswds-site guidance follow-up separately.
- [ ] **16b — AT behavior** (hands-on testing required): Test with NVDA + [specific scenario]
- [ ] Test with VoiceOver + Safari [specific scenario]
- [ ] Test with VoiceOver + Chrome [specific scenario, if behavior differs]
- [ ] Verify in forced-colors mode
- [ ] Keyboard-only navigation

**Breaking change classification:**
- [ ] Review impact on [specific area]
- [ ] Note design vs. code distinction

**New API surface:**
- [ ] $theme-* setting needs SASSDoc + @warn + uswds-site docs PR
- [ ] [etc.]

---

### 📋 Not reviewed (per team practice)

- Formatting, indentation, quote style — delegated to Prettier/ESLint
- `dist/` contents — generated; verify byte-identical instead
- Naming in isolation
- Micro-performance
- Screen-reader verdicts — routed to accessibility specialist
- [any other items from silence list]
```

### 6. Save review to cache

After generating the review findings, save the review to the cache. Write the report to a file and pass `--report-file`; `--recommendation` must lead with one of the four enum values, since downstream tooling buckets on that prefix:
```bash
node .agents/skills/uswds-code-review/scripts/review-cache.mjs save \
  --pr <N> \
  --sha <commitSha> \
  --recommendation "<Approve|Approve with suggestions|Request changes|Hold>" \
  --summary "<1-2 sentence census of findings>" \
  --report-file /tmp/review-<N>.md
```

`--report-file -` reads the markdown from stdin. Use `--report-text "<markdown>"` only for a short inline report — a nonexistent `--report-file` path is an error rather than being silently stored as the report body.

This ensures:
1. The full review findings markdown is saved to `.review-cache/<commit-sha>.md`.
2. `.review-cache/cache.json` is updated with PR number, commit SHA, recommendation, summary, and `status: "open"`.
3. Subsequent runs with no new commits will immediately return the cached result.

Skip this step for local-branch reviews; only PR reviews are cached.

### 7. Evidence and voice

**Every substantive finding must include:**
- A code block showing the issue, OR
- A `file_path:line_number` reference (clickable), OR
- Numbered repro steps

Never "this is wrong" without showing the fix or the mechanism.

**Approval compliments escalate with effort:**
- Small fix: "LGTM. Thanks for the contribution."
- Solid work: "Thanks for addressing the feedback. This looks really good!"
- Complex PR: "Killer work! This is ready for prime time now." / "Thanks for the strong work on this and working through the issues."

**Hedging for non-blocking asks:**
- "Can we..." / "Would it be better to..." / "Should we..." (questions, not commands)
- "I think it would be good to..." (most-used construction in corpus)
- "My opinion: I'd prefer X, but I can also see a case for Y."

**When uncertain, admit it:**
- "Just double-checking that..."
- "Question about this."
- "I'm not sure..."

## The judgment doctrine

The skill applies judgment according to the **USWDS engineering values** (https://github.com/uswds/uswds-proposals/blob/main/docs/engineering-values.md) and the precedence order from uswds-proposals/README.md:

1. Product values
2. Design principles
3. **Engineering values** (the primary tiebreaker)
4. Established ADRs (scoped to Core vs. Elements)

Key principles that map directly to the gates:

- **"Our opinions cascade. ...choices made at the Design System level establish the floor for performance and accessibility."** → The personal-preference vs. all-consumers test.
- **"Avoid lock-in... keeping our reliance on dependencies as low as possible"** → The dependency gate.
- **"Embrace the idiom. Be cautious about how you introduce new abstractions, idiosyncrasies, or concepts."** → The existing-pattern-or-ADR gate.
- **"Write for reading."** / **"We use plain language so that others can follow along"** → The simplification pass.
- **"Use semantic versioning. Be clear when things change."** → The breaking-change flag.
- **"Make accessibility easier, not invisible."** → Flag for specialist review, don't conclude.
- **"Support repairability."** → Modularity gate.

## The silence list

The following are **never** reviewed, per observed team practice:

1. **Formatting, indentation, quote style, line length** — Prettier/ESLint/`.editorconfig` own these. Not one style nit exists in the 200+ PR corpus.
2. **Naming in isolation** — flagged only when genuinely confusing or inconsistent with repo convention (e.g. `data-errorMessage` vs. other `data-*` naming).
3. **Micro-performance** — performance comes up only as build-time or semver concerns, never as runtime micro-optimization.
4. **JSDoc/type coverage as a blanket ask** — SASSDoc is required for new Sass mixins/functions; JSDoc is not broadly enforced for historical code but should be for new additions.
5. **Diff size as a blocker** — "please split this up" reviews exist but should use deterministic measurements and judgment.
6. **`dist/` contents as source** — it's generated. The review path is byte-identical verification, not line-by-line diff.
7. **Any AT/screen-reader verdict** — routed explicitly: *"Code-wise this looks fine to me, but I'd like to defer to you on the screen reader behavior."* (#6595)
8. **Dependabot lockfile diffs** — bare APPROVED if the build and tests are passing.
9. **Variable/function naming disputes** — accepted after one round of discussion.
10. **Hypothetical future requirements** — not in scope.
11. **Refactoring opportunities unrelated to the change** — unless they block understanding, convert to an issue instead.

## Reference files

- `references/gates.md` — the 16 gates with runnable checks and carve-outs
- `references/calibration.md` — mined review patterns, verbatim quotes, severity anchors
- `references/uswds-anchors.md` — lookup tables (core utils, tokens, public API, CI, test idiom)

## Example: applying the cascade test

**Scenario:** A PR uses `body.innerHTML = ""` in teardown, but another spec in the same package uses `body.textContent = ""`.

**Question:** Block for inconsistency?

**Cascade test:** Does this inconsistency change what downstream consumers get?
- **No** — it's internal test code, not part of the public API or shipped artifact.
- **Judgment:** Non-blocking `**thought**`: "There's an inconsistency here (`innerHTML` vs `textContent` in teardown). Both work, but for clarity we might standardize on one. Not a blocker."

**Scenario:** A PR replaces `color("base")` with `#f0f0f0`.

**Question:** Block?

**Cascade test:** Does this change what downstream consumers get?
- **Yes** — consumers who override `$theme-color-base` will no longer see this element respect their theme.
- **Judgment:** Blocking `**issue**`: "This replaces a theme token with a literal. **The before diff uses a [theme color token](link), `color("base")`. Since the intent is to go darker for more contrast, my suggestion is to keep the color themeable as it was before.** You might try `color("base-darker")` as a replacement."

## Special cases

### Dependabot / version bumps

Stay near-silent. The review path:
1. Confirm it's lockfile-only or a controlled dep update
2. Note whether it's in `dependencies` (runtime, rare) or `devDependencies` (common)
3. If a large diff: verify `dist/` is byte-identical or note the delta
4. **Do not review the lockfile line-by-line**

Example approval (from #6783):
> **AI-assisted review**
>
> Verification:
> - Diff scope: lockfile-only. `undici` is a transitive test dependency; not in browser-distributed code.
> - `npm ci`: clean
> - `npm run lint`: ✅
> - `npx gulp test`: ✅
> - `dist/` sha256 comparison vs develop baseline: ✅ **byte-identical**
>
> Safe to merge.

### Releases and mechanical transforms

Size flag triggers, but report the carve-out immediately:
> **Size: +22,340/-31,152 across 202 files**
> ⚠️ Exceeds 400-line guideline, but this is **a release** (v3.14.0). The bulk is `dist/` regeneration, `package-lock.json`, and `COMMUNITY.md` contributor updates. Authored runtime changes: ~45 lines across 3 components. **Not flagging as oversized.**

### PRs held pending team decision

When a genuinely new architectural pattern appears (e.g. i18n strategy, tokens-as-CSS-custom-props), the right disposition is **Hold**, not **Request changes**:

> ⏸️ **Hold** — pending core team architectural decision
>
> This introduces [describe the pattern]. The proposals repo has no Core-scoped ADR covering this approach yet. Per team practice (#6738, #6650), a decision of this scope requires:
> 1. Core team discussion
> 2. A new `decisions/0012-*.md` ADR in uswds/uswds-proposals (Core-scoped)
> 3. Reopen this PR once the ADR is Approved
>
> The code implementation looks solid; the hold is purely on the architectural choice, not the execution.

## Notes

- **Read-only by design.** This skill never writes to GitHub. It produces a local markdown report; posting is the user's call.
- **ADR scope matters.** Most `decisions/` entries govern uswds-elements, not this repo. Never cite an Elements ADR as authority for a Core change. See `references/gates.md` gate 4 for the mapping.
- **The corpus is the regression suite.** PRs 6767, 6659, 6789, 6786, 6783, 6715, 6597 have known outcomes; the skill's findings on them can be checked against what the reviewers actually said.
- **Calibration, not perfection.** The goal is to match the *severity and scope* of the team's reviews, not word-match them. Blocking findings should be blocking; approved-cleanly PRs should stay quiet.
