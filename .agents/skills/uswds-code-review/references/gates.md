# The 16 Gates — Runnable Checks and Carve-outs

This is the concrete enforcement layer. Each gate has a check, a disposition (blocking / flag / manual follow-up), and its carve-outs grounded in observed practice.

---

## 1. Size: authored runtime + test code ≤400 lines

**Disposition:** Flag only (advisory, not blocking)

**Why advisory:** Zero "please split this up" reviews exist in the corpus, even on +12k/-14k PRs. The one precedent is a senior engineer on #5793: *"Smaller PR's. Breaking out the work helps us reliably and quickly test one thing at a time."* Sampling the 60 most recent merged PRs: substantive work lands at +28 to +351 lines; everything over 400 is generated churn.

**Check:**

Use the metrics script for a full breakdown:
```bash
# From a PR URL
node .agents/skills/uswds-code-review/scripts/pr-metrics.mjs --pr https://github.com/uswds/uswds/pull/6767

# From a local diff
git diff develop...HEAD > changes.patch
node .agents/skills/uswds-code-review/scripts/pr-metrics.mjs --diff changes.patch
```

Or manually count with:
```bash
git diff -M --numstat develop...HEAD -- \
  'packages/**/src/**' 'src/**' 'tasks/**' \
  ':(exclude)dist/**' ':(exclude)_site/**' ':(exclude)**/*.md' \
  ':(exclude)package-lock.json' ':(exclude)COMMUNITY.md' \
  ':(exclude)*.snap' ':(exclude)*.twig' \
  | awk '{runtime+=$1} END {print runtime}'
```

**Carve-outs (suppress the flag and state why):**
- **Releases** — `dist/` regeneration, `package-lock.json`, `COMMUNITY.md` contributor updates. Example: #6822 (+22340/-31152).
- **Dependency upgrades** — Example: #6790 gulp v5, #6791 devDeps, #6782 minor versions, #6778 simplify deps.
- **Mechanical transforms** — Single-transformation codemods applied across many files. Example: #6770 Sass `if()` syntax migration across 41 files (+423/-395).
- **Storybook/tooling migrations** — Framework upgrades that touch config + stories. Example: #6715 Storybook 9 + Webpack→Vite (+8239/-8433).

When flagging, always state the carve-out: "⚠️ Exceeds 400-line guideline, but this is **a release** (v3.14.0). Authored runtime changes: ~45 lines across 3 components."

---

## 2. Dependencies: new runtime dep must be explicitly called for

**Disposition:** Blocking unless justified in issue or PR body

**Context:** `dependencies` currently holds **exactly one** package: `lit@3.3.3` (for web components). 75 `devDependencies`. A new runtime dep is therefore glaring.

**Check:**
```bash
# Compare package.json dependencies field against develop
git show develop:package.json | jq -r '.dependencies | keys[]' | sort > /tmp/deps-base.txt
jq -r '.dependencies | keys[]' package.json | sort > /tmp/deps-head.txt
comm -13 /tmp/deps-base.txt /tmp/deps-head.txt  # new deps
comm -23 /tmp/deps-base.txt /tmp/deps-head.txt  # removed deps
```

**What to verify:**
1. **Is it in `dependencies` or `devDependencies`?** Only runtime-shipped code justifies `dependencies`.
2. **Is it declared in the PR body?** The template has a commented-out *Dependency updates* table. If a dep is added, that section must be uncommented and filled.
3. **Is the lockfile in sync?** CI runs `npm ci`, so `package-lock.json` must be committed and match.
4. **Is a new import relying on a transitive dep?** (#6715: *"I'd like it to make sure it's also added to `package.json` as a `devDependency` to make sure we're not relying on a transitive dependency from Storybook."*)
5. **Could an existing dep be reused?** (#6767: *"Sinon is already a project dependency."* Don't inline a new helper when one exists.)

**Cite against:** Engineering-values.md *"Avoid lock-in... By keeping our reliance on dependencies as low as possible"*

**Exception:** Dependabot PRs and bulk devDependency updates approved by core team.

---

## 3. Definition of done: issue acceptance criteria vs. actual diff

**Disposition:** Blocking when unmet or exceeded

**Check:**
```bash
# Extract issue number from PR body or commits
gh pr view <N> --json body --jq '.body' | grep -oP 'Closes #\K\d+'
# OR: git log develop..HEAD --oneline | grep -oP '#\K\d+' | head -1

# Fetch the issue
gh issue view <issue_number> --repo uswds/uswds --json title,body,labels
```

**Compare in both directions:**

1. **Unmet criteria** — issue asks for X, diff doesn't deliver it. Bug template supplies:
   - *Expected Behavior*
   - *Steps to reproduce*
   Feature template supplies:
   - *Describe the solution you'd like*

2. **Scope creep** — diff includes Y, which the issue never mentioned. This is a live blocking category (#6673: *"Would you mind rolling back the updates to package.json and package-lock.json that were included with this PR? They don't appear to be necessary for the accessibility improvement. If they are necessary, could you indicate why in the PR description?"*)

**Carve-outs:**
- Follow-up improvements explicitly marked as such in the PR body
- Dependency bumps needed to unblock the feature (if stated)
- Test refactors that don't change behavior

**Local branch mode:** Skip this gate and report `⏭️ skipped (no linked issue in local mode)`.

---

## 4. Existing pattern, or ADR justifying a new one

**Disposition:** Blocking if duplicating a `uswds-core` utility; Hold if a new architectural pattern needs team decision

**Check in three parts:**

### 4a. Grep the core utilities inventory

Before accepting any new JS helper, search:
```bash
find packages/uswds-core/src/js/utils -name '*.js' -exec basename {} .js \;
```

**The 15 core utils** (see `uswds-anchors.md` for full descriptions):
`select`, `select-or-matches`, `behavior`, `focus-trap`, `keymap`, `active-element`, `debounce`, `toggle`, `toggle-form-input`, `toggle-field-mask`, `validate-input`, `is-in-viewport`, `is-ios-device`, `scrollbar-width`, `sanitizer`

Plus `packages/uswds-core/src/js/events.js` (exports `CLICK`) and `config.js` (exports `prefix: "usa"`).

**Blocking precedent:** #6767 reintroduced a `debounce` function when `packages/uswds-core/src/js/utils/debounce.js` already exists. *"We have `packages/uswds-core/src/js/utils/debounce.js` in the repo already. It was removed in this PR. Would it be possible to refactor the existing debounce function so we don't inline it here and have to maintain multiple implementations?"*

Also: #6736 added a `box-sizing` line to `select` when it should have gone into the `%block-input-styles` mixin in `_forms.scss` — *"it might be better to put the line inside the `%block-input-styles` mixin directly... the `select` probably isn't the only place this is happening."*

**If a genuinely new utility is needed and no core util exists:** non-blocking suggestion to extract it to `uswds-core/src/js/utils/` for reuse.

### 4b. Check uswds-proposals ADRs — and resolve scope first

Fetch the decision list:
```bash
gh api repos/uswds/uswds-proposals/git/trees/HEAD?recursive=1 \
  --jq '.tree[] | select(.path | startswith("decisions/")) | .path'
```

**Critical:** Most ADRs govern **uswds-elements** (web components), not this repo (USWDS Core). The template has no *Applies to* field, so scope must be inferred from prose.

**Current mapping** (as of August 2026, 11 ADRs):

| Scope                                 | ADRs                                                                                                                                                                                    |
|---------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **uswds-elements** / web components   | 0001 (use web components), 0002 (use lit), 0003 (don't use a monorepo), 0004 (link as HTML web component), 0006 (use TypeScript), 0007 (author styles in CSS), 0009 (use Lightning CSS) |
| **USWDS Core** (this repo)            | 0005 (continue Core, move toward semver)                                                                                                                                                |
| **Ambiguous** — confirm, don't assume | 0008 (JSON design tokens — no scope signal), 0010 (use Playwright), 0011 (custom Vite plugins)                                                                                          |

**The Lightning CSS cautionary case:** `decisions/0009-use-lightning-css.md` is Approved *for Elements*; it never governed this repo. PR #6597 proposing Lightning CSS here was declined on Core-specific grounds: *"adopting Lightning CSS introduces some significant changes to how CSS properties are ordered in the built output... Shipping this safely would require a thorough audit and a major version bump."*

**Rule:** Never cite an Elements ADR as authority for a Core change, in either direction. It is neither a green light nor a precedent.

**If an ambiguous ADR (0008, 0010, 0011) seems relevant:** surface it as a `**question**` and ask for confirmation, don't assume.

### 4c. When a new architectural pattern appears

If the change introduces a pattern not covered by any Core-scoped ADR (e.g., a new build-tool abstraction, a module-loading convention, an i18n strategy), the disposition is **Hold**, not **Request changes**.

**Why:** The proposals repo restricts formal proposals to core team members. All 11 existing `decisions/` entries are team-authored. So the ADR ask lands on the **core team, not the contributor**.

**Response template:**

> ⏸️ **Hold** — pending core team architectural decision
>
> This introduces [describe the pattern: what it is, why it's new, what precedent it breaks or extends]. The proposals repo has no Core-scoped ADR covering this approach yet. Per team practice (#6738 i18n, #6681 range-slider layout), a decision of this scope requires:
> 1. Core team discussion (likely in a dev sync or Slack thread)
> 2. A new `decisions/0012-*.md` ADR in uswds/uswds-proposals, scoped to **USWDS Core**
> 3. Reopen this PR once the ADR moves to Approved status
>
> The code implementation looks solid; the hold is purely on the architectural choice, not the execution.

**Precedents:**
- #6738 (data-* i18n strings): *"I think we need to have some discussion about pros and cons of this approach and weigh its merits against other approaches like providing i18n hooks and a translation files... I'm going to close this PR for now... If this is the approach we end up deciding on, we'll reopen the PR and give this a full review."*
- #6650 (tokens as CSS custom props): *"We have some of the token work started in the `uswds/uswds-elements` repo... we're using style dictionary as the source of truth, and this is on our roadmap."* (redirected to Elements)
- #6681 (range-slider layout): *"I think we (the USWDS team) needs to revisit this overall layout... For the time being, I do want to hold off on any further review of this until we have the discussion internally."*

---

## 5. Test coverage: must fail on the base branch

**Disposition:** Blocking for new features and bug fixes

**The sharp test** (senior engineer #6713): *"I noticed this test passes even on the base branch before this fix, which means it doesn't capture potential regressions."*

**Executable check:**
```bash
# Apply only the test files onto develop
git switch --detach develop
git checkout <branch> -- packages/<pkg>/src/test/<name>.spec.js

# Run the test
npx mocha --require jsdom-global/register packages/<pkg>/src/test/<name>.spec.js

# Expected: FAIL. If it passes, it's not a regression test.
git switch -  # return to original branch
```

**What to verify:**
1. Do new tests actually test the change? Not just "is there a test file," but "does this test fail on base?"
2. Are edge cases covered? (Null, empty, boundary values, error paths)
3. Are tests clear about what they verify? (Test names describe the assertion)
4. Do tests avoid brittle coupling to implementation? (Don't assert internal state unless necessary)

**Sass tests:** Any `@if/@else` branching on a `$theme-*` setting needs `sass-true` coverage. Precedent: #6789 *"I added a good deal of test coverage for branching logic in `*.spec.js` files using the `sass-true` package, and I think it would be good to do the same here for the branching logic."*

**Carve-outs** (observed consistently):
- Docs-only changes
- Workflow / CI config changes
- Dependency bumps (unless they change API behavior)
- Storybook config / story additions (test the component itself, not the story metadata)

---

## 6. DRY tests: 3+ locations → extract a helper

**Disposition:** Non-blocking until threshold is met; then blocking

**The threshold:** If setup/helper code is duplicated in **3 or more** test files, extract it to a shared helper. Below that, leave it alone.

**Evidence from the repo:**

**At/over threshold (extract):**
- `packages/usa-combo-box/src/test/events.js`
- `packages/usa-date-picker/src/test/events.js`
- `packages/usa-date-range-picker/src/test/events.js`

All three are near-identical synthetic-event kits. Precedent: #6767 *"I think we can DRY them out some if you extract the timeout part to a helper."* #6168: *"This is repeated in several tests, why not move it to it's own function? Could be named `addFiles()`"*

**Under threshold (leave alone):**
- The `matchMedia` / `matchFinePointer` stub duplicated in `packages/usa-file-input/src/test/file-input.spec.js` and `file-input-accepts.spec.js` (2 locations only).

**Also cite:** The canonical `tests.forEach([document.body, componentRoot])` dual-initialization pattern is DRY-ish but not extracted — it's a table-driven idiom that works inline.

**Teardown inconsistency worth a rule:** some specs use `body.innerHTML = ""`, others `body.textContent = ""`. This is internal test code (doesn't affect consumers), so flag as a `**thought (non-blocking)**: "For clarity, we might standardize teardown on one (`textContent` is slightly more explicit). Not urgent."

---

## 7. Duplication: check if existing functionality is being reinvented

**Disposition:** Blocking

**Context:** Closely related to gate 4a (core utils), but broader — includes Sass mixins, helper functions, and patterns.

**Examples:**
- #6767: Inline `debounce` when `uswds-core` already has one
- #6736: Added `box-sizing` to `select` when it should go in the `%block-input-styles` placeholder (affects all inputs, not just select)
- #6592: Duplicate fix for `datalist` scenario when #6567 already handled it — an engineering lead kept the test, discarded the duplicate fix

**Check:**
1. Does this JS/Sass introduce a helper that smells like it might already exist?
2. Grep the repo for similar names or functionality
3. Read `uswds-anchors.md` section on "Reusable utilities" for the full inventory

**If duplication is found:** Blocking. Suggest using the existing one, or if the new one is better, suggest replacing the old one repo-wide (but that's a separate PR).

---

## 8. Simplification pass: dispatch a subagent

**Disposition:** Non-blocking by nature (this is a quality pass)

**Mechanism:** Dispatch the existing `code-simplification` skill as a subagent, with an explicit filter.

```
Agent({
  subagent_type: "code-simplification",
  description: "Readability simplification pass on changed files",
  prompt: `Run the code-simplification skill on the following files: [list]. Filter: report **only** rewrites a newcomer would understand faster. Discard anything clever, anything that changes behavior, and anything that's a pure style preference. Focus on: deeply nested conditionals, imperative loops that could be `map`/`filter`/`for...of`, unclear variable names, missing "why" comments on non-obvious logic.`
})
```

**Grounding precedents:**
- #6122: *"The nested logic can be confusing or hard to follow. Consider another approach that's a bit more readable... the general idea is isolating unique use cases, avoid nesting logic, and general improvements to readability."* (with a full rewrite using early returns)
- #6203: *"Can we avoid these types of loops? For clarity, we can improve it by using other methods, like `map()`, `every()`, or `for…of`, if appropriate."*
- #6203: *"A switch statement might be a better fit here."*
- #6122: *"Can you add a brief comment describing the use case? The function is named `inputValueMatches`, but only the select option is passed, not the input."*

**Voice for these findings:** Always `**polish**` or `**suggestion (non-blocking)**`, with the escape hatch that readable code is the goal, not fewer lines.

---

## 9. Error handling: guards, fallbacks, teardown symmetry

**Disposition:** Blocking when absent in brittle areas

**What to check:**

### Guard non-Event input
#6594: *"Would you mind adding an additional check for `!(event instanceof KeyboardEvent)` to the other two conditions?"*

### Fall back when a platform API is unavailable
#6660 (matchMedia): *"This means if `matchMedia` is unavailable for any reason, the component falls back to the simple 'Choose from folder' state rather than showing drag instructions that may never work. The baseline is always the safe mobile state, and drag text is added on top for fine-pointer devices."*

### Early return on falsy
#6703: *"Before, the code in the conditional beginning at L142 did not execute if the `openFocusEl` was falsy. Just doublechecking that the rest of the code should execute if `openFocusEl` does not exist. I'm wondering if there should be an early return statement here."*

### @warn on unrecognized Sass setting values
#6789: *"In the `@else` branches in this file, I think it would be good to add a `@warn` if the `$side` value is not `end` and that we're executing a fallback. That will help people catch typos in their config."*

### A setting must not break the build when overridden
#5624: Setting `$theme-header-min-width: "none"` → `CssSyntaxError`. Tests must exercise the settings with various values.

### Teardown symmetry
#6660: *"This event listener would also need to be removed when the component is unmounted (i.e. in the `teardown` function)."*

Every listener added in `init` or component lifecycle must be removed in `teardown`. Applies to `addEventListener`, `matchMedia` change listeners, mutation observers, etc.

**Voice:** These are blocking when the absence is a real correctness bug (throws on valid input, leaks listeners). Non-blocking when it's defensive hardening on an unlikely edge case.

---

## 10. Sanitization: `Sanitizer.escapeHTML` for innerHTML with interpolation

**Disposition:** Blocking (security)

**The rule:** Any `innerHTML` or `insertAdjacentHTML` call that interpolates user data or external content must use the `` Sanitizer.escapeHTML`...` `` tagged template from `packages/uswds-core/src/js/utils/sanitizer.js`.

**Why it's load-bearing:** ESLint has `no-unsanitized/method` and `no-unsanitized/property` set to `error`, **but both are disabled for `**/*.spec.js`**. So lint is not a safety net — the reviewer must read production `index.js` directly.

**Check:**
```bash
# Find innerHTML/insertAdjacentHTML in changed production files
git diff develop...HEAD -- 'packages/*/src/index.js' 'packages/*/src/*.js' ':(exclude)**/*.spec.js' \
  | grep -E 'innerHTML|insertAdjacentHTML'
```

**Precedents:**
- `packages/usa-file-input/src/index.js:397,400,463`
- `packages/usa-combo-box/src/index.js:236,245`
- `packages/usa-table/src/index.js:197`
- `packages/usa-in-page-navigation/src/index.js:273`
- `packages/usa-date-picker/src/index.js` (multiple uses)

**What `Sanitizer.escapeHTML` does:** It's a *tagged template* that escapes only interpolated values (`& < > " ' /` → entities), leaving static HTML intact. `null`/`undefined` → `""`. Contract is tested in `packages/uswds-core/src/js/utils/test/sanitizer.spec.js`.

**Voice:** Blocking. Cite the security rationale and the existing precedents. Offer a code block with the fix.

---

## 11. Code is modular: "Support repairability"

**Disposition:** Non-blocking (architectural quality)

**Cite:** Engineering-values.md *"Support repairability. We want teams to have the ability to repair and improve our work — first for their project, but hopefully also later for an improvement we can incorporate."*

**What to flag:**
- Functions/components that are >100 lines and do multiple unrelated things
- Deeply coupled code where changing one part requires changing three others
- Hard-coded values that should be extracted to settings or constants
- Logic that could be broken into smaller, testable pieces

**Voice:** `**suggestion (non-blocking)**: "This function handles both X and Y. Consider splitting into two so teams can override just the part they need."` or `**thought**: "This might be a candidate for extracting to a separate module if we see other components needing similar logic."`

---

## 12. Input is sanitized, validated, and escaped

**Disposition:** Blocking at system boundaries

**Context:** Overlaps with gate 10 (sanitization) but broader — covers validation and type guards.

**What to check:**
1. **At component boundaries:** Does the JS read `data-*` attributes or query params and trust them blindly?
2. **Type guards:** Are string inputs checked before being passed to functions that expect specific formats? (e.g., dates, numbers, enum values)
3. **Sass functions:** Do they return meaningful errors for invalid tokens via `error-not-token()`, or silently pass garbage through?

**Precedent:** The `validate-input.js` utility (data-attribute-driven validation against a checklist) is the established pattern for form-input validation. If a component introduces its own validation, it should follow similar conventions.

**Voice:** Blocking if absence allows incorrect or unsafe behavior. Non-blocking if it's defensive hardening on unlikely input.

---

## 13. New API surface: flag for manual follow-up

**Disposition:** Manual follow-up (not blocking, but must be completed before merge)

**What counts as API surface in this repo:**

From `package.json` `exports` and observed practice:
1. **Every component's `src/index.js`** is public (via `"./js/*"` → `./packages/*/src/index.js`)
2. **Every package's `_index.scss`** is public (via `"./scss/*"`)
3. **`$theme-*` settings** — names, defaults, accepted token vocabulary are all API
4. **Sass functions/mixins** forwarded through `packages/uswds-core/src/styles/functions/_index.scss` or `mixins/_index.scss`
5. **Twig template variable names** — consumed by webpack
6. **CSS class names** derived from `prefix: "usa"` (e.g., `.usa-accordion__button`)
7. **`data-*` attributes** defined as constants in `packages/*/src/index.js` (~30 exist)

**The 6-file ripple for a new `$theme-*` setting** (verified against #6789):
1. `packages/uswds-core/src/styles/settings/_settings-components.scss` — add the setting
2. `packages/usa-<component>/src/styles/_usa-<component>.scss` — consume it (often via a new mixin)
3. `packages/usa-<component>/src/content/usa-<component>~<variant>.json` — new story fixture
4. `packages/usa-<component>/src/content/index.js` — export the fixture
5. `packages/usa-<component>/src/usa-<component>.stories.js` — new named export
6. `packages/uswds-core/src/styles/_notifications.scss` — release note entry

**Plus:** SASSDoc (#5713, #6268 — this is a requirement, not optional), `@warn` fallback (#6789), and a **uswds-site docs PR** for settings/usage documentation.

**Check:** If the diff adds a `$theme-*` variable, a new `data-*` attribute, a new public mixin/function, or changes CSS class names / markup, flag it.

**Voice:**
> **Manual follow-up required: new API surface**
>
> This adds `$theme-<component>-<prop>` (or `data-<name>`, or `.usa-<class>`). Before merge:
> - [ ] SASSDoc annotations for any new mixins/functions (required, not optional)
> - [ ] `@warn` fallback for unrecognized setting values (helps consumers catch typos)
> - [ ] `_notifications.scss` entry for the release this ships in
> - [ ] Companion PR to uswds-site for settings docs (link once filed)
> - [ ] Storybook story showing usage (if a new variant)

---

## 14. Breaking changes: flag for classification, don't conclude

**Disposition:** Manual follow-up

**Repo definition** (from `.github/PULL_REQUEST_TEMPLATE.md`):
- Changes to the JavaScript API
- Changes to markup or content in components
- Significant changes to a component's display

**Corpus additions** (from observed reviews):
- Built-CSS source order (#6566)
- Specificity increases (#6691 — even with `:where()`, it's "arguably a breaking change")
- Default value flips (#6789)

**The product lead's design-vs-code split** — carry this, don't collapse it (#6037):
> "This one is probably technically a breaking change because of the UX and design implications — but it might be worth noting that I don't believe teams will have to make any changes _to their code_ to make this work, so **change does not introduce a breaking change on the code side**"

**Check:**
1. Does the PR body declare breaking-change status? (Template requires picking one of three options)
2. If it says "not breaking," does the diff actually change API, markup, CSS output, or defaults?
3. If it says "breaking," is remediation guidance included?

**Voice:**
> **Manual follow-up required: breaking-change classification**
>
> This changes [specificity / CSS output order / default value of `$theme-*` / markup structure / JS API]. Consider:
> - **Design impact:** Does this change what users see, even if code doesn't break?
> - **Code impact:** Do consuming teams need to update their implementation?
> - Per the product lead's distinction, these can differ.
>
> If breaking:
> - [ ] PR body must pick ":warning: This is a breaking change." (not "not breaking")
> - [ ] Remediation steps must be included (what actions are required to upgrade?)
> - [ ] `_notifications.scss` entry must describe the break
> - [ ] Major version bump on next release (per ADR 0005 move toward semver)

---

## 15. New variants or changes in defaults: flag for manual follow-up

**Disposition:** Manual follow-up

**Context:** Closely related to gates 13 (API surface) and 14 (breaking changes), but specifically about component variants and defaults.

**What to flag:**
- A new modifier class (e.g., `.usa-accordion--bordered` → `.usa-accordion--borderless`)
- A new `$theme-*` setting that changes component behavior by default
- A flip in what the unstyled / no-class state does

**Why manual follow-up:** These are design system decisions, not just code correctness. They need review for: naming consistency with other components, whether it fits the design system's principles, whether the default serves the common case.

**Voice:**
> **Manual follow-up required: new variant / default change**
>
> This introduces [describe the variant or default flip]. Before merge:
> - [ ] Naming consistent with other USWDS component variants?
> - [ ] Does the new default serve the common case, or should it be opt-in?
> - [ ] Storybook story demonstrating the variant?
> - [ ] uswds-site guidance on when to use / when not to use?

---

## 16. Accessibility

Gate 16 has two distinct sub-gates with different dispositions. Apply both when a PR touches interactive behavior, ARIA, SR text, focus, or keyboard nav.

---

### 16a. A11y content: SR text quality (flag-only, non-blocking)

**Disposition:** Flag / non-blocking. An accessibility specialist reviewer can make this judgment without live AT testing.

**What this covers:** Whether the *text* of screen reader hints, `aria-label`s, and status messages is actually useful — distinct from whether the AT *announces* them (which requires hands-on testing, see 16b).

**Flag when:**
- An `aria-label` or hint text restates the element's role, which AT users already receive from the semantic markup (e.g., a slider hint that says "slider")
- A status message or error text does not explain purpose, expected values, or how to interact — just describes what users already know
- Interaction guidance (how to operate the control: keys, gestures, value range) is missing from a non-obvious component
- Content that should inform *developer guidance* on uswds-site is baked directly into a component string rather than left to the implementer

**Precedent (#6673):** A range slider hint read "slider" — AT users already know the role. The reviewer flagged that a more useful hint would explain interaction ("use arrow keys to increase or decrease the value"), and noted that guidance on communicating `min`/`max`/`step` belongs in the uswds-site component docs — not as a code blocker but as a follow-up issue. The PR was approved once the immediate hint wording was improved.

**Voice:**
> **`**polish**` (non-blocking): SR text content**
>
> The current hint/label says `"[text]"`. AT users will already know [role / property] from the element's semantics. A more useful message would explain [purpose / interaction / range]. For example: `"[suggested text]"`.
>
> Separately, guidance on when developers should customize this (e.g., communicating `min`/`max`/`step` values for range inputs) may be worth a follow-up issue for the uswds-site component docs. That doesn't affect this approval.

**Carve-out:** Do not flag SR text that is a correct ARIA pattern even if brief (e.g., `aria-label="Close"` on an `×` button is correct — the verb is the guidance). The failure mode is redundancy with role or absence of interaction guidance on a non-obvious control, not brevity.

---

### 16b. AT behavior verdict: route to a specialist, don't conclude

**Disposition:** Manual follow-up — route to an accessibility specialist for hands-on AT verification. Never render a verdict on AT behavior from code review alone.

**The routing rule** (engineering lead, documented practice):
> "Code-wise this looks fine to me, but I'd like to defer to you on the screen reader behavior." (#6595)
>
> "It passes my review." (#6786, passing to role:accessibility-specialist)

**What to flag:**
- New interactive components or changes to focus behavior
- Changes to ARIA attributes (`aria-label`, `aria-describedby`, `aria-live`, etc.)
- Changes that affect keyboard navigation (tab order, focus trap, Escape handling)
- Visual-only cues (color, icon-only without text alternative)
- Form error messaging (must be programmatically associated)

**The bar for a thorough accessibility PR** (drawn from #6767, #6758, #6750): a well-scoped accessibility change includes a named AT × browser matrix (e.g., VoiceOver + Safari/Chrome/Firefox, NVDA + Chrome), an explicit Limitations / not-in-scope section, a citation to ARIA Authoring Practices or ARIA spec where the pattern is non-obvious, and a statement of what was verified vs. what was pre-existing behavior ("not a regression from develop"). Flag if any of these are absent on a PR that makes substantive accessibility claims.

**Voice:**
> **Manual follow-up required: AT behavior verification**
>
> This changes [focus behavior / ARIA wiring / SR announcements / keyboard nav]. Requires hands-on testing before merge:
> - [ ] Test with NVDA + Chrome — [describe scenario]
> - [ ] Test with VoiceOver + Safari — [describe scenario]
> - [ ] Test with VoiceOver + Chrome — [describe scenario, if behavior may differ]
> - [ ] Verify in forced-colors / Windows high-contrast mode
> - [ ] Keyboard-only navigation (tab, shift-tab, arrow keys, escape, enter)
>
> Code review: [note any code-level issues visible in the diff, e.g., missing `aria-describedby` wiring or an `aria-live` region that lacks a `role`. Explicitly state that the AT announcement behavior verdict is not within this review's scope.]

**Senior engineer's testing pattern** (for reference, not always required):
> ### Tested
> - [x] Dragging invalid file reads error message in VoiceOver (both Chrome & Safari)
> - [x] Code quality
>
> MacOS Sonoma 14.6.1 / Chromium 131 / Safari 17.6 / VoiceOver

**Engineering-values.md cite:** *"Make accessibility easier, not invisible."* The goal is to keep accessibility testing visible and in the critical path, not to declare it handled at the code level.

**Carve-out:** If the PR is docs-only, workflow-only, or dependency-only, skip this gate.
