# Verification Suite for `uswds-code-review`

The corpus doubles as a regression suite — these PRs have known outcomes, so the skill's output can be checked against what the reviewers actually said.

## Test cases

### 1. `/uswds-code-review 6767` — Character count: over-limit SR announcements

**Size:** +308/-44, 5 files  
**Reviewer:** senior engineer (CHANGES_REQUESTED ×2 → APPROVED)  
**Expected findings (4 independent):**

1. **Duplicated `debounce` from core** (blocking) — #6767: *"We have `packages/uswds-core/src/js/utils/debounce.js` in the repo already. It was removed in this PR. Would it be possible to refactor the existing debounce function so we don't inline it here and have to maintain multiple implementations?"*

2. **Arrow function vs. `.apply()` `this` bug** (blocking, latent correctness) — #6767: *"I noticed the `apply` method uses `this`, and we're using an arrow function here. The arrow function was there in the code previously, but I think we should fix it now since it would be a one line change. **Using the arrow function is problematic because it would capture the module scope's `this` instead, silently dropping the call-site context passed to `.apply()`.** Changing this line to `const debounced = function debounced(...args) {` should be all we need to correct the bug."*

3. **Missing test coverage on the new cancel behavior** (blocking) — #6767: *"I think we should add unit tests for this given the new cancel behavior and bug fix I mentioned on line 16. If you can write test that covers the `debounced`, `.cancel`, and **a regression test for the arrow function**, we should be all set here."*

4. **DRY-able timeout setup** (non-blocking) — #6767: *"Thanks for adding these tests. I think we can DRY them out some if you extract the timeout part to a helper. Something along the lines of this might work..."* and *"I think `AT_DEFER_MS + 50` could be its own constant. It's used in this spec as well as the one for character count. Also, I'm wondering if for some of the timers in this PR, we might be able to use https://sinonjs.org/concepts/fake-timers/. **Sinon is already a project dependency.**"*

**Success criteria:** All four findings appear at the right severity (3 blocking, 1 non-blocking).

---

### 2. `/uswds-code-review 6659` — Range slider: improve border visibility

**Size:** +3/-3, 1 file  
**Reviewer:** engineering lead (CHANGES_REQUESTED → APPROVED)  
**Expected findings (2 independent):**

1. **De-themed token** (blocking) — #6659: *"**The before diff uses a [theme color token](link), `color("base")`. Since the intent is to go darker for more contrast, my suggestion is to keep the color themeable as it was before.** You might try `color("base-darker")` as a replacement."*

2. **Sass variable convention** (blocking) — #6659: *"Looking elsewhere in the codebase, **the convention we follow in [permalink to `_usa-nav.scss`] is to define only the value as a variable and to not assign the function result to the variable.** i.e. this would become `$-range-border-width: 2px;`, and then its usage below would be `units($-range-border-width)`. The same comment I left about the variable being private or sticking to direct usage applies to this as well."*

**Success criteria:** Both blocking. Proves a 3-line diff can still be blocking, and that the skill isn't keying on size.

---

### 3. `/uswds-code-review 6789` — Accordion: start/end icon alignment

**Size:** +285/-8, 10 files  
**Reviewer:** senior engineer (CHANGES_REQUESTED → COMMENTED → APPROVED)  
**Expected findings (4-5):**

1. **Shared-selector blast radius** (blocking) — #6789: *"**The nav and the banner both use `.usa-accordion__button` as well. Let's add a safeguard to prevent a change in icon position if someone tried:**"* (with two concrete HTML repros showing the misuse, resolved via `:not()` selectors)

2. **Undeclared breaking default flip** (manual follow-up) — #6789: *"can you update the PR body so it reflects that the new default is icon-start (left) in the 'Solution' heading and **indicate that this is a breaking change. It still has default right and non-breaking in the PR body.**"*

3. **Missing `sass-true` coverage** (blocking) — #6789: *"Since our last release, **I added a good deal of test coverage for branching logic in `*.spec.js` files using the `sass-true` package, and I think it would be good to do the same here for the branching logic.**"*

4. **Missing `@warn` fallback** (blocking or non-blocking) — #6789: *"In the `@else` branches in this file, I think it would be good to **add a `@warn` if the `$side` value is not `end` and that we're executing a fallback. That will help people catch typos in their config.**"*

5. **New API surface** (manual follow-up) — this adds `$theme-accordion-icon-position`, which triggers the 6-file ripple (settings → component Sass → fixture → story → `_notifications.scss` → uswds-site docs PR).

**Success criteria:** Blast radius and test coverage are blocking; breaking-change and API-surface are manual follow-up.

---

### 4. `/uswds-code-review 6786` — Modal: restore page content when opener has left

**Size:** +28/-6, 2 files  
**Reviewer:** engineering lead (APPROVED with AT hand-off)  
**Actual outcome:** *"This looks good to me. This touches modal code that was written previously. Passing off to role:accessibility-specialist to see if it makes sense for AT. If it looks good, go ahead and approve and merge. It passes my review."*

**Expected findings:** No blocking issues. One manual-follow-up flag for accessibility testing (16b — focus behavior when the opener is removed from the DOM). Gate 16a (SR text content) does not apply here — no hint text or aria-label copy changed.

**Success criteria:** Guards against false positives. The skill should stay quiet on code correctness and flag only the AT verification (16b).

---

### 4a. `/uswds-code-review 6673` — Range slider: add visual hint instruction

**Size:** +17/-1, 3 files  
**Reviewer:** accessibility specialist (COMMENTED → approved after wording update)  
**Actual outcome:** The code change (adding `aria-describedby` wiring between the hint and the input) was technically sound. The reviewer flagged that the hint text read *"slider"* — which AT users already know from the element's role announcement — and suggested it instead explain interaction ("use arrow keys to increase or decrease the value"). A follow-up uswds-site guidance issue was noted as a separate non-blocking concern. Approval proceeded once the hint wording was updated.

**Expected findings (gate 16a):**
1. **SR text content flag** (non-blocking `**polish**`) — the hint text is redundant with the element's role. Suggest interaction-guidance text instead. Note the uswds-site guidance angle as a separate issue, explicitly not a blocker.

**Expected non-findings:**
- No gate 16b (AT behavior) flag needed — the ARIA *wiring* is the fix; there's no AT behavior regression to route.
- No blocking issues.

**Success criteria:** Proves gate 16a fires on SR-text-redundant-with-role without triggering a blocking verdict or a false 16b routing. The skill should distinguish the code-level fix (ARIA wiring, already correct) from the content-level flag (hint text quality).

**Size:** lockfile-only (dependabot)  
**Reviewer:** engineering lead (APPROVED with verification transcript)  
**Actual outcome:** Verified lockfile-only, `npm ci` clean, `npm run lint` ✅, `gulp test` ✅, `dist/` byte-identical. *"Safe to merge."*

**Expected findings:** None blocking. The skill should stay near-silent, note it's lockfile-only, and take the byte-identical `dist/` verification route rather than reviewing the lockfile line-by-line.

**Success criteria:** Guards against noise. This is a dependabot PR; the skill must not flag spurious issues or review 3000 lines of JSON.

---

### 6. `/uswds-code-review 6715` — Storybook 9 + Webpack→Vite migration

**Size:** +8239/-8433, 11 files  
**Reviewer:** engineering lead (CHANGES_REQUESTED ×2 → COMMENTED → APPROVED)  
**Expected findings:**

1. **Size flag** (advisory) — but with a stated carve-out rationale: *"⚠️ Exceeds 400-line guideline, but this is **a Storybook 9 migration** (framework upgrade touching config + story files). Authored logic changes: ~120 lines across 3 files. Not flagging as oversized."*

2. **devDependency missing** (blocking) — #6715: *"Since this is being imported, I'd like it to make sure it's also **added to `package.json` as a `devDependency` to make sure we're not relying on a transitive dependency from Storybook.**"*

3. **Deployment-path issue** (blocking or question) — #6715: *"Question about this. When this is in dev mode, serving from the root directory is reliable. However, when this is built and deployed, it ends up on a preview URL like this: https://federalist-.../preview/uswds/uswds/develop/?path=... **When the storybook assets are going to be deployed to a non-root directory, can we expect the paths to resolve correctly or are there other changes that need to be made to support this?**"*

4. **HMR error** (blocking) — #6715: *"I see this comment, but there's an error with HMR currently. **Steps to reproduce:** 1) start storybook... 2) Navigate to a component... 3) Open the browser console. 4) Edit the corresponding `.twig` file... 5) See error below."* (with the `TwigException` payload)

**Success criteria:** Size is flagged but not blocking. The devDependency and HMR issues are blocking. The skill correctly distinguishes mechanical churn from authored logic.

---

### 7. `/uswds-code-review 6597` — Replace postcss/autoprefixer with Lightning CSS

**Size:** (not merged, closed)  
**Reviewer:** engineering lead (COMMENTED, closed)  
**Actual outcome:** Declined on Core-specific grounds — *"adopting Lightning CSS introduces some significant changes to how CSS properties are ordered in the built output... Shipping this safely would require a thorough audit and a major version bump."*

**Expected behavior:** The skill must reach the Core-specific objection (CSS property-order change → major bump) **without** citing `decisions/0009-use-lightning-css.md` as either authorization or precedent, since that ADR governs Elements, not Core.

**Success criteria:** The ADR-scoping test. If the skill treats an Elements ADR as authority for a Core change, this case catches it. The skill should either ignore 0009 entirely or flag it as "this ADR is Elements-scoped, does not apply here."

---

### 8. Local-branch mode (no PR)

**Setup:** Create a scratch branch with a small change (e.g., edit a comment), run `/uswds-code-review` with no argument.

**Expected behavior:** The skill reports PR-body and definition-of-done gates as `⏭️ skipped (no PR in local mode)`, not as passed. The gate table should show explicit skips, and the report should note that those checks are unavailable in local-branch mode.

**Success criteria:** Verifies that the skill doesn't silently pass gates when it can't actually run them.

---

### 9. Read-only verification

**Check:** After running any of the above, confirm:
- No `gh pr review` or `gh pr comment` calls were made
- No writes outside `/tmp` or the review report itself
- The skill produced a local markdown report only

**Success criteria:** The skill never touches GitHub without explicit user action. All output is local.

---

## Success definition

Success is **not** word-matching the original reviews. It's that:
1. Every blocking finding the reviewers made appears at blocking severity
2. Non-blocking suggestions are marked non-blocking
3. Manual-follow-up items (accessibility, breaking-change classification, API surface) are flagged for specialist review, not concluded
4. #6786 and #6783 (clean PRs) stay quiet — no spurious findings
5. The skill's voice matches the team's — specific compliments, escape hatches on non-blocking items, evidence (code blocks / permalinks / repro steps) for every substantive finding

## Running the suite

```bash
cd /home/egardner/devspace/uswds

# 1. Richest test (4 independent findings)
/uswds-code-review 6767

# 2. Tiny diff, still blocking (de-themed token + convention)
/uswds-code-review 6659

# 3. Blast radius + breaking-change + API surface
/uswds-code-review 6789

# 4. False-positive guard (clean PR with AT hand-off)
/uswds-code-review 6786

# 4a. Gate 16a (SR text quality, non-blocking flag, no AT routing)
/uswds-code-review 6673

# 5. Noise guard (dependabot, stay silent)
/uswds-code-review 6783

# 6. Size + carve-out + mechanical churn
/uswds-code-review 6715

# 7. ADR-scoping test (Elements ADR doesn't govern Core)
/uswds-code-review 6597

# 8. Local-branch mode (gates correctly skipped)
git checkout -b test-branch
echo "// test comment" >> packages/usa-accordion/src/index.js
/uswds-code-review
git checkout develop
git branch -D test-branch

# 9. Read-only check
# After any of the above: confirm no gh pr review/comment calls, no writes to the repo
```

## Reference: what the reviewers actually said

See `references/calibration.md` for verbatim quotes and the full context of each review. The verification suite compares the skill's findings against those anchors.
