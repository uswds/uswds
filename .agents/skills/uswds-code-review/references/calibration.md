# Calibration Data — Mined Patterns and Verbatim Quotes

This file anchors severity decisions and voice so the skill's output matches the team's actual practice, not generic review templates. Sources: 200+ merged PRs and their inline review comments across the project's review history.

The team includes at least an engineering lead who sets technical direction and oversees code contributions, a senior engineer who contributes to design system development, a product lead who owns design system guidance decisions, and an accessibility specialist who handles accessibility-content review and hands-on AT verification. Patterns below represent durable team judgment, not individual voices.

---

## Approval patterns

### What qualifies for outright approval

**Senior engineer / engineering lead:**
- One-line, single-token fixes using the right token (#6669: `+1/-1`, file input error border → error token): *"LGTM! Thanks for the contribution."*
- A fix where the mechanism is obviously right (#6713): *"The runtime code change itself looks good. Replacing that stale callback with the existing dropdown close path makes sense."*
- Security hardening (#6674): *"Nice catch. Thanks for this improvement and contribution!"*
- Docs/meta/typo fixes — essentially always waved through: #6762, #6720, #6580
- **Verifies by running it.** #6811: *"I tested this in Storybook and compared it to how we handle other components."* #6673: *"I tested it with NVDA, and the readout I got made more sense with the id and aria than it did without it."*

**Senior engineer:**
- Arrives with a **checked list** as the approval body (#6168):
  > ### Tested
  > - [x] Dragging invalid file reads error message in VoiceOver (both Chrome & Safari)
  > - [x] Code quality
- Names the **browser + OS matrix** (#5919): "No issues found. Tested in Safari, Firefox, and Chromium." (#5885): "Looks good. I tested in Chromium 125, Firefox 127, and Safari 17.4.1."
- **Before/after preview links** or screenshots (#6165 video of loader icon), (#6037 Federalist preview URL table)
- **Builds a test harness before approving** (#6048): "I've created a branch on uswds-sandbox `test-uswds-breakpoints-6048`, so others can test as well."

**Product lead:**
- Bare approvals are the norm, with a one-line human note. Verbatim: "Thank you!" (#6165, #5885, #6013), "Nice work." (#5713), "Very nice. Both features work together as expected" (#5919), "A lot of work here! It will be nice to move this gnarly little issue off your plate!" (#5636), "🎉" (#5624)
- Asks an engineer for a second opinion rather than deciding alone (#5908): "LGTM. Passing it over to an engineer for a take."

### Approve-with-nits: the "I can approve once..." contract

**Senior engineer** (most characteristic mode):
- #5999: "Just a minor question and non-blocking issue. **I can approve PR once resolved.**"
- #6013: "Otherwise LGTM and **I can approve once we have clarity on question above** and changes have been addressed."
- #6038: "Added a few non-blocking suggestions. **I can approve once comments are resolved.**"

**Engineering lead** (approve now, name the follow-up explicitly):
- #6725: *"This looks good. ... If you wanted to do a follow-up enhancement PR, you might want to consider... **That's not a blocker here though.**"*
- #6715: *"Looking at the cjs plugin you wrote, I'm going to suggest a follow-up PR once and issue so we can remove the UMD-related checks... **I'll create the issue for it and hold off on doing it so you're not dealing with conflicts** or things changing while this work is in progress."*
- #6703: *"This keeps the defensive focus handling more concise and readable in my opinion. **This is far from being a blocker**, but it's worth considering if you're touching this code again."*

**Engineering lead** (weighs the impact of accepting technical debt on purpose if it moves the project forward):
- #6173: *"**Approving as-is so help move the other related PRs (#6174, #6175) along** rather than chasing down anywhere else `ignore` may have been used historically."*
- #6308: *"for something we're trying to get in ASAP **I'd prefer to leave the current behavior for now**. This feature also doesn't have adequate test coverage. So what I'd prefer to do is to make an issue for your suggested improvements and write some tests such that next time something comes up here we can make changes more confidently."*

**There should be relevant ADRs** with an escape hatch to indicate when the technical debt can be paid down. This most likely requires explicit documentation and insight into the thought process, alternatives considered, and context of the decision.

### Approval escalation (effort-proportional sign-offs)

**Engineering lead sign-off scale:**
- Small: "LGTM"
- Medium: "LGTM! Thanks for the contribution."
- Solid: *"Thanks for addressing the feedback. This looks really good! You did great on the handling of the `rtl` treatment as well."* (#6789)
- Complex: *"**Killer work!** Thanks for addressing the suggestions I made. **This is ready for prime time now.**"* (#6767)
- Very complex: *"Thanks for the strong work on this and working through the issues. Thanks for your patience waiting for me to get this reviewed."* (#6715)

Also: apologies for latency (#6385: *"Sorry for the looooooong delay"*) and for own mistakes (#6611: *"Apologies, @contributor. I had previously approved this, but..."*).

---

## Changes-requested: the 17 blocking categories

### 1. Functional bug found by hands-on testing

**Senior engineer** (the dominant practitioner of this):
- #6302: *"Multiple range sliders cause the value for span to render in the wrong place. ... The value is also updated incorrectly. It happens even when you wrap the label and input with `.usa-form-group`."* (with repro steps + GIF)
- #6203: *"running into an issue on **Alphanumeric** where _sometimes_ it'll show an incorrect error on &lt;kbd&gt;SHIFT+A&lt;/kbd&gt;... If I don't let go of &lt;kbd&gt;SHIFT&lt;/kbd&gt; fast enough it'll tell me to enter a letter."*
- #6203: *"**Steps to reproduce** / 1. Open SSN / 2. Paste the string `The quick brown fox jumps over the lazy dog` / 3. Confirm that incorrect input is accepted"*
- #5624: *"I still see invalid CSS and an error on latest... **Steps to reproduce** 1. Set `$theme-header-min-width: 'none'` 2. Run `npx gulp buildSass` 3. Confirm error at the end."* (with full `CssSyntaxError` stack)

**Engineering lead:**
- #6715: *"I see this comment, but there's an error with HMR currently. **Steps to reproduce:** 1) start storybook... 2) Navigate to a component... 3) Open the browser console. 4) Edit the corresponding `.twig` file... 5) See error below in the browser's console."* (with the `TwigException` payload)
- #6715 follow-up: *"I'm still seeing the error with the new changes. **Interestingly, the problem didn't happen with playwright mcp but it did happen when I tested it manually.** ... if you keep the changes you made from this round and add back in the `Twig.cache(false)` you had on line 30, that fixes the problem."*

**Voice:** Blocking. Always include repro steps or a GIF/video. Number the steps.

### 2. Missing test coverage (the #1 code-level blocker)

**The sharp form** (senior engineer #6713, this becomes gate 5):
> *"Thanks for adding a test, however, **I noticed this test passes even on the base branch before this fix, which means it doesn't capture potential regressions.** Could you update the test so it exercises the FocusTrap Escape callback or captures that the FocusTrap path no longer throws and closes the dropdown? Something like this would work:"* [followed by a ~25-line drop-in test using `window.onerror`]

**Also:**
- #6767: *"I think we should add unit tests for this given the new cancel behavior and bug fix I mentioned on line 16. If you can write test that covers the `debounced`, `.cancel`, and **a regression test for the arrow function**, we should be all set here."*
- #6703: *"I see a test for the 2nd condition of this assignment... I think it would be good to add test cases for: - Custom data-focus element taking priority over default (condition 1) - Fallback to any button when no footer button exists (condition 3)"*
- #6789: *"I added a good deal of test coverage for branching logic in `*.spec.js` files using the `sass-true` package, and I think it would be good to do the same here for the branching logic."*

**Senior engineer:**
- #6302: *"Can you add a unit test to ensure this component initializes and updates correctly?"*
- #6203: *"Overall this is looking good! I've only tested the functionality so far. **Please don't forget to create unit tests.**"*
- #6168: *"Since we've added a new feature to support the custom text, could we create a small unit test to ensure it works as we'd expect? **It should cover the customization and the fallback.**"*

**Sub-pattern — test quality, not just presence:**
- #6767: *"Thanks for adding these tests. I think **we can DRY them out some** if you extract the timeout part to a helper."* / *"I think `AT_DEFER_MS + 50` could be its own constant. It's used in this spec as well as the one for character count. Also, I'm wondering if for some of the timers in this PR, we might be able to use https://sinonjs.org/concepts/fake-timers/. **Sinon is already a project dependency.**"*
- #6673: *"Can we remove these comments? I think the description in the `it` function argument sufficiently captures it."* and *"Can you restore this comment please? I think it's helpful to understand the intent of the test assertion and desired behavior."*

**Voice:** Blocking. Show what's missing and either sketch the test or point to an existing one as a template.

### 3. Duplicated existing utility (this is gate 4a / 7)

- #6767: *"**We have `packages/uswds-core/src/js/utils/debounce.js` in the repo already. It was removed in this PR.** Would it be possible to refactor the existing debounce function so we don't inline it here and **have to maintain multiple implementations of a debounce function**?"*
- #6736: *"This works, but **it might be better to put the line inside the `%block-input-styles` mixin directly** (in `_forms.scss`). I think the `select` probably isn't the only place this is happening."*
- #6592: *"There was a similar change from #6567 that also addressed the `datalist` scenario in the library code. If you can accept the version from the `develop` branch with the change I approved and merged, that should resolve the conflict in `keymap.js`. I think the test you wrote for it is great, and I'd like to get that part merged once the conflict is resolved."* (Keeps the test, discards the duplicate fix.)

**Voice:** Blocking. Name the existing util with a full path.

### 4. Sass token misuse / de-themeing

- #6659: *"**The before diff uses a [theme color token](link), `color("base")`. Since the intent is to go darker for more contrast, my suggestion is to keep the color themeable as it was before.** You might try `color("base-darker")` as a replacement. Also, I would suggest making this variable private by using the leading dash (`-`) convention or simply by using `color("base-darker")` directly where it appears below. I have a personal preference for the latter."*
- #6650 (declined PR): *"I agree there's a need to provide the tokens as CSS custom properties. ... We have some of the token work started in the `uswds/uswds-elements` repo in the `tokens` directory. ... we're using style dictionary as the source of truth, and this is on our roadmap."*

**Voice:** Blocking. Cite the token function that was replaced, suggest the right token alternative, and link to the design-tokens docs.

### 5. Established codebase convention (cited with permalink)

- #6659: *"Looking elsewhere in the codebase, **the convention we follow in [permalink to `_usa-nav.scss`] is to define only the value as a variable and to not assign the function result to the variable.** i.e. this would become `$-range-border-width: 2px;`, and then its usage below would be `units($-range-border-width)`. The same comment I left about the variable being private or sticking to direct usage applies to this as well."*
- #6691: *"I think this might need a `:where(.usa-button-group)` **to keep the specificity pattern established elsewhere**?"*
- #6660: *"The current logic defaults to showing drag text and removes it for touch devices, which is desktop-first. A small inversion makes this mobile-first **which aligns with how USWDS handles responsive CSS and our progressive enhancement philosophy.**"*

**Voice:** Blocking or non-blocking depending on impact. Always cite the exemplar with a permalink.

### 6. Breaking change / semver risk (usually a hard decline unless declared)

- #6566: *"This does speed up the build time, but there is also a small in the source order of a small amount of the built CSS that **could potentially be a breaking change for people and require a major version update per the semver convention** and makes it more complex for us to maintain right now."*
- #6597: *"adopting Lightning CSS introduces some significant changes to how CSS properties are ordered in the built output. **Shipping this safely would require a thorough audit and a major version bump to USWDS, which is more than our team has the bandwidth to take on at the moment.**"* (then four linked upstream Lightning CSS issues)
- #6691: *"This also increases the specificity so it might have unintended consequences for users who have made their own tweaks to this (admittedly probably a small group, but **it's arguably a breaking change**)."*
- #6789: *"can you update the PR body so it reflects that the new default is icon-start (left) in the 'Solution' heading and **indicate that this is a breaking change. It still has default right and non-breaking in the PR body.**"*

**Voice:** Blocking if undeclared. Explain *why* it's breaking (CSS order / specificity / default flip / markup), cite semver, and either request declaration or decline.

### 7. Blast radius / shared-selector collateral damage

- #6789: *"**The nav and the banner both use `.usa-accordion__button` as well. Let's add a safeguard to prevent a change in icon position if someone tried:**"* (with two concrete HTML repros showing the misuse, then) *"The concern I had about it was sufficiently addressed with the `:not` selectors you added."*
- #6691: *"Unless I misunderstand, I think this does a little more than it's intended to do. **The `:has` will apply to the whole form, so once that rule applies it'll hit any `.usa-button`s in that form whether or not that particular button is in a group or not.**"*
- #6703: *"I'm also curious what your thoughts are about **adding test coverage for the Language Selector component that also relies on the `focus-trap` utility.** I think it would be good to have a test to verify backward compatibility on it since the focus trap could have an impact there now or in the future."*

**Voice:** Blocking. Show the collateral case with an HTML snippet or a component name, then suggest the guard (`:not()`, scoping selector).

### 8. Latent correctness bug found by reading (not caught by CI)

- #6767 (the sharpest example): *"I noticed the `apply` method uses `this`, and we're using an arrow function here. The arrow function was there in the code previously, but I think we should fix it now since it would be a one line change. **Using the arrow function is problematic because it would capture the module scope's `this` instead, silently dropping the call-site context passed to `.apply()`.** Changing this line to `const debounced = function debounced(...args) {` should be all we need to correct the bug."*
- #6703: *"**Before, the code in the conditional beginning at L142 did not executed if the `openFocusEl` was falsy. Just doublechecking that the rest of the code should execute if `openFocusEl` did does not exist.** I'm wondering if there should be an early return statement here."*
- #6594: *"There's one small addition I think would be good here. Would you mind adding an additional check for `!(event instanceof KeyboardEvent)` to the other two conditions so we're left with `!(event instanceof KeyboardEvent) || typeof event.key === "undefined" || typeof event.getModifierState !== "function"`"*

**Voice:** Blocking. Explain the mechanism (what would go wrong), cite the specific line, suggest the fix as a code block.

### 9. Supply-chain / CI security (always blocking, always specific)

- #6611: *"**Our repo (uswds) has a security requirement on the repository that enforces that GitHub actions are pinned to a specific commit hash as opposed to the version number.** I find that a comment after the SHA is also helpful so the installed version is more readily identified. This would look like: `- uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # pin v6.0.2`. This also applies to the markdown link check action below."*
- #6612: *"Would you mind pinning the actions to a specific commit hash **to prevent potential supply chain risks and ensure consistent builds**? Our repo has this configured as a requirement in the settings."*
- #6611 (re-requested changes after approving): *"**Apologies, @contributor. I had previously approved this, but I notice** when I go to the `gaurav-nelson/github-action-markdown-link-check` repository. It indicates this action has been deprecated. ... Would you be able to swap these out?"*
- #6715: *"Since this is being imported, I'd like it to make sure it's also **added to `package.json` as a `devDependency` to make sure we're not relying on a transitive dependency from Storybook.**"*

**Voice:** Blocking. Cite the repo requirement, show the format (`# pin vX.Y.Z`), check whether the action is deprecated.

### 10. Unrelated changes in the diff (scope creep)

- #6673: *"**Would you mind rolling back the updates to package.json and package-lock.json that were included with this PR? They don't appear to be necessary for the accessibility improvement. If they are necessary, could you indicate why in the PR description?**"*
- #6767: *"I think this should be removed so we can **stick to NPM as our package manager. Switching to something else would require a larger discussion.**"* (a stray `packageManager` field)

**Voice:** Blocking. Ask for rollback, and explicitly ask "if they are necessary, explain why."

### 11. Dead legacy code / browser support policy

- #6660: *"Would you mind dropping this legacy check? **It applies to IE11 and the original versions of Edge before they were based on Chromium, and both of those fall outside our [browser support policy](link)**"*

**Voice:** Blocking. Cite the browser support policy doc.

### 12. Real-device / progressive-enhancement edge cases

- #6660: *"`shouldShowDragText()` runs when the component first renders and the DOM is built from that result. **On convertible/hybrid devices (Surface tablets, iPads with keyboards, etc.) the pointer type can change mid-session** when the user detaches or attaches a keyboard. If you add a `change` listener on the `matchMedia`... **This event listener would also need to be removed when the component is unmounted (i.e. in the `teardown` function).**"*
- #6660: *"This means **if `matchMedia` is unavailable for any reason, the component falls back to the simple 'Choose from folder' state rather than showing drag instructions that may never work.** ... The baseline is always the safe mobile state, and drag text is added on top for fine-pointer devices."*

**Voice:** Blocking or non-blocking depending on severity. Explain the edge case (convertible device, API absent), show the guard code, cite progressive enhancement.

### 13. Developer-experience guardrails for consumers

- #6789: *"In the `@else` branches in this file, I think it would be good to **add a `@warn` if the `$side` value is not `end` and that we're executing a fallback. That will help people catch typos in their config.**"*
- #6789: *"Since users can set a global default to make the icon appear on the right, **I think it would be good to also add a story here for IconStart to show how they would execute the per-instance override in that case.**"*

**Voice:** Non-blocking but strongly suggested. Frame as "help consumers catch mistakes."

### 14. Storybook story metadata correctness

- #6697: *"Let's add `disabled_state: "none"`"* / *"Should this property be updated to `indeterminate_state`?"*

**Voice:** Varies — blocking if metadata mismatch breaks the story, non-blocking if it's just naming.

### 15. Deployment-context correctness (not just localhost)

- #6715: *"Question about this. When this is in dev mode, serving from the root directory is reliable. However, when this is built and deployed, it ends up on a preview URL like this: https://federalist-.../preview/uswds/uswds/develop/?path=... **When the storybook assets are going to be deployed to a non-root directory, can we expect the paths to resolve correctly or are there other changes that need to be made to support this?**"*

**Voice:** Blocking. Name the deployment environment (Federalist preview), describe the path issue.

### 16. Wrong solution shape (right problem, wrong fix)

- #6679: *"There's a **non-obvious wrinkle with twig and how it's used. The site in the `uswds/uswds-site` repo consumes the code produced by Twig to make the example code that's live on designsystem.digital.gov, which is also why these are formatted with Prettier.** What you pointed out is a bug where prettier is run against a non-existent directory. **If you wanted to fix that part, think a node script that does a quick check before the `prettier:html` task would be a good addition that wouldn't have as big of an impact on the example code that's on the site.**"*

**Voice:** Non-blocking to block, depending on impact. Explain the system constraint, then hand back a viable narrower fix.

### 17. Needs an architecture decision before any code review

- #6738: *"I agree with the need to provide translations for the strings that are baked into some of our interactive components... However, I think the direction we take with USWDS some planning from our team... **While the `data` attribute might work in some cases, I think we need to have some discussion about pros and cons of this approach and weigh its merits against other approaches like providing i18n hooks and a translation files** ... I'm going to close this PR for now... **If this is the approach we end up deciding on, we'll reopen the PR and give this a full review.**"*
- #6681: *"I feel like this is a step in the right direction, but I think we (the USWDS team) needs to revisit this overall layout. ... **For the time being, I do want to hold off on any further review of this until we have the discussion internally.**"*

**Voice:** Hold, not Request changes. State the scope of the decision, point to the proposals repo ADR process, say the code looks solid but the architectural choice needs team buy-in first.

---

## Voice and tone

### Senior engineer / engineering lead voice

**Structure of every CHANGES_REQUESTED:** Three moves, fixed template:
1. Thanks + specific compliment
2. Census of what's below
3. What clearing them earns

Verbatim:
- *"Overall, nice work. I have a few suggestions to help with test setup and one question about the new debounce function that was added to the runtime."* (#6767)
- *"Thanks for these changes. There was a minor bug I spotted and some test coverage to add on the `debounce` function. **After that, we can get this merged.**"* (#6767)
- *"Thank you so much for this contribution! I appreciated your notes about the diagnosis and how to reproduce the issue, as well as the comments you added to the file. **I have one small change request, but this looks good otherwise.**"* (#6594)

**No `nit:` / `blocking:` prefixes.** Severity is carried by modal verbs:

| Register                 | Phrasing                                                                                                                                      |
|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| Blocking, non-negotiable | *"Would you mind rolling back..."*, *"Let's add a safeguard..."*, *"I think we should fix it now"*, *"I'd like to see a small, focused test"* |
| Blocking but negotiable  | *"I think it would be good to..."* (10+ uses), *"my suggestion is to..."*, *"Could you update the test so..."*                                |
| Explicitly non-blocking  | *"This is far from being a blocker"*, *"That's not a blocker here though."*, *"I have a personal preference for the latter."*                 |
| Genuine question         | *"Question about this."*, *"Should this property be updated to...?"*, *"Just doublechecking that..."*                                         |
| Invitation to push back  | *"**Don't take any of this for absolute. It's all open for discussion if you disagree with any of it or have feedback.**"* (#6703)            |

**Approval sign-offs scale with effort** — see approval escalation section above.

**Almost every substantive comment ships a code block, a permalink, or repro steps.** Rarely "this is wrong" without showing the replacement.

**Also uses Conventional Comments labels in bold:**
`**issue**`, `**polish**`, `**question**`, `**suggestion**`, `**thought**`, `**quibble**`, `**praise**`, with `(non-blocking)` to downgrade.

Examples:
- `**issue**: The `hidden` attribute would save you some CSS.` (#6203)
- `**issue (non-blocking)**: This should be a component, instead of hardcoded.` (#6165)
- `**polish**: You can avoid this CSS by making the error message a block element.` (#6203)
- `**question**: We're hiding this because the error is now in the label, right?` (#6168)
- `**suggestion**: You could improve readability by saving this separately.` (#6168)
- `**thought**: We need to clearly communicate this change to users. The PR summary would be a good place.` (#6205)
- `**quibble**: Minor, but we can set the text before appending it to the DOM. You can swap 516 and 517.` (#6168)
- `**praise**: Thanks for updating and adding unit tests!` (#6122)

**Also uses GitHub alert callouts:**
- `> [!NOTE] Need to convert this comment into an issue.` (#6165)
- `> [!TIP] Not new; just matching work done in [commit].` (#6297)
- `> [!CAUTION] Inspect **all** compiled HTML templates for table to ensure there aren't regressions on site.` (#5783)
- `> [!WARNING] Adding responsive variants has an impact on CSS compile size.` (#6048)

**Structural habits:** Bold `**Steps to reproduce**`, `**Before**`, `**After**`; `<details><summary>` for logs; `| Before | After |` screenshot tables; footnotes `[^1]` for MDN links; ` ```suggestion ` blocks (one-click apply); `<kbd>` for keys; `~strikethrough~` when retracting, plus "Resolved in `<sha>`" to close threads.

**Opening lines are gratitude-first, even on CR:**
- *"@contributor **a tricky issue, thanks for taking this on.** The PR description and additional draft PR are helpful."* (#6168)
- *"@contributor **thanks for all your work on this so far.**"* (#6203)
- *"**Thanks for the update and such thorough documentation** @contributor!"* (#5774)

**Hedges requests as questions:** "Can we...?", "Would it be better to...?", "Should we...?" States own position separately: "**My opinion** I'd prefer to rely on guidance, but I can also see a case for throwing an error." (#5908)

**Short, hedged, first-person, sometimes emoji:**
- "I'm comfortable releasing this as-is" (#6035)
- "I _think_ this sounds reasonable" (#5286)
- "This change feels less intuitive, but 🤷‍♀️" (#6257)
- "I don't understand this formatting rule" (#5782, three times)
- "ooh docs ❤️" (#6161) / "✨" (#5310) / "🎉" (#5624)

**Posts ` ```suggestion ` blocks with final wording, no preamble** (#6038 ×4). Copy-edits with precision: "`Ellipsis` is the correct singular here" (#5197).

---

### Product lead voice

**Shortest, most colloquial:**
- "Unless I misunderstand, I think this does a little more than it's intended to do." (#6691)
- "I think this might need a `:where(.usa-button-group)` to keep the specificity pattern established elsewhere?" (#6691) — question mark on a change request
- "and I recognize I'm probably being overly conservative!" (#6308)
- "WDYT?" (#6736) — asks another engineer for a second opinion rather than deciding alone
- "Ship it!" / "Woohoo!" / "Thank you 🫡"

**Distinguishes "good practice" from "design system guidance":** *"everyone should always set the `lang` attribute if for no other reason than it's important for performance and accessibility—**I just don't necessarily want to bake assumptions about best practices into a component without making adoption of those practices an explicit part of the design system.**"* (#6460)

---

## The silence list — evidence

These are **never** reviewed, backed by corpus facts:

1. **Formatting, indentation, quote style, line length** — Zero style nits exist across 200+ PRs.
2. **Naming in isolation** — Flagged only when confusing or convention-breaking (e.g., `data-errorMessage` vs. repo's dash-case).
3. **Micro-performance** — Perf comes up as build-time or breaking-change concerns, never as runtime micro-optimization.
4. **JSDoc/type coverage as a blanket ask** — SASSDoc required for Sass; JSDoc not broadly enforced.
5. **Diff size as a blocker** — Zero "split this up" comments exist. +12k/-14k Storybook PR approved without size comment.
6. **`dist/` contents as source** — Never reviewed line-by-line. #6783 did byte-identical sha256 verification.
7. **Any AT/screen-reader verdict** — Explicitly routed: *"Code-wise this looks fine to me, but I'd like to defer to you on the screen reader behavior."* (#6595)
8. **Dependabot lockfile diffs** — Bare APPROVED, no review.
9. **Variable/function naming disputes** — Accepted after one discussion round.
10. **Hypothetical future requirements** — Not in scope.
11. **Refactoring opportunities unrelated to the change** — Converted to issues (#6165: "Created #6183.")

---

## Linked issue, definition of done, and review routing

**The PR body is a reviewable artifact** and can trigger CHANGES_REQUESTED:
- #6789: *"**For documentation purposes**, can you update the PR body so it reflects that the new default is icon-start (left) in the 'Solution' heading and indicate that this is a breaking change."*
- #6673: *"They don't appear to be necessary. **If they are necessary, could you indicate why in the PR description?**"*

**Duplicate-issue enforcement:** Cross-link PRs, close the newer/duplicate with credit. #6591 → *"There was a PR that was just merged #6659 that covers this change, so I am closing this as a duplicate."*

**Follow-up work converted to tracked issues by the reviewer:**
- #6715: *"I'm going to suggest a follow-up PR once and issue so we can remove the UMD-related checks. **I'll create the issue for it**."*
- #6700: *"it would probably be helpful to add a description to populate the comment body. **I'll create an issue for it.**"*
- #6308: *"what I'd prefer to do is to make an issue for your suggested improvements and write some tests."*

**Explicit two-key routing** (code review ≠ accessibility approval):
- #6595: *"Code-wise this looks fine to me, but I'd like to defer to role:accessibility-specialist on the screen reader behavior."*
- #6703: *"LGTM! role:accessibility-specialist do you want to take a look at this for final approval?"*
- #6725: *"role:accessibility-specialist — you're up for a final accessibility review."*
- #6786: *"This looks good to me. **This touches modal code that was written previously.** ... Passing off to role:accessibility-specialist to see if it makes sense for AT. If it looks good, go ahead and approve and merge. **It passes my review.**"*

**A11y-content critique (code-reviewable, does not route):**

An accessibility specialist can judge whether the *text* of a screen reader hint is useful — distinct from judging AT *behavior*, which requires hands-on device testing. The distinction:

- **AT behavior** (route, don't conclude): does the AT announce it, in what order, with what voice mode? Needs real devices and a named test matrix.
- **SR text content** (reviewable by an accessibility specialist): is the text redundant with the element's role? Does it explain purpose or interaction, or just restate what AT already derives from markup semantics?

Example (#6673): a range slider hint read *"slider"* — which AT users already know from the element's role announcement. The reviewer flagged that a more useful hint would explain *how to interact* (e.g., "use arrow keys to increase or decrease the value"), and noted that guidance on communicating `min`/`max`/`step` context belongs in the uswds-site component guidance — not as a code blocker, but as a follow-up issue. The approval went through once the immediate hint wording was addressed.

**Voice for accessibility-content findings:** Non-blocking flag. State what the current text says, why it's redundant or insufficient, suggest more useful text, and explicitly separate guidance-site follow-up from the approval gate: *"That recommendation doesn't interfere with this approval."*

**Unblocks stale review states:**
- #6611: *"role:product-lead — You had a change request, so this will need an approval from them as well if it looks good."*
- #6660: *"If this is ready for review, please let me know or **click the 're-request' review button**."*

---

## Dependabot / version-bump handling

A passing build is *REQUIRED*. Almost always bare APPROVED for dev-only dependencies with a patch or minor version update.

**The one exception — the reusable artifact** (#6783, engineering lead):
> **AI-assisted review — OpenCode Agent**
>
> Verification transcript for Bump undici 7.28.0 → 7.29.0 (#6783):
>
> - Diff scope: lockfile-only (package-lock.json, 3 lines changed). undici is a transitive test dependency; not used in browser-distributed code.
> - `npm ci`: clean
> - `npm run lint` (ESLint + Sass): ✅ exit 0
> - `npx gulp test` (unit + Sass + tasks): ✅ all passing
> - `npx gulp` build: ✅ exit 0
> - `dist/` sha256 comparison vs develop baseline (2679 files): ✅ **byte-identical**
>
> All safety criteria met. Safe to merge.

---

## Notes for the skill

- **Match severity, not wording.** The corpus is anchors for *what gets blocked* and *what doesn't*, not templates to copy.
- **The engineering-lead three-move structure** is the canonical shape for a CHANGES_REQUESTED summary.
- **The team's Conventional Comments labels** are the right taxonomy for inline findings, because they're already in use.
- **The "I can approve once..." precondition** is the dominant mode for non-blocking findings — use it.
