# USWDS reproduction record

All 63 bug-bucket issues have an attempt or explicitly scoped environment limitation. These records do not imply that open PRs have merged, that a release shipped, or that Chromium output substitutes for screen-reader speech.

| Issue | Result | Next step |
| --- | --- | --- |
| [#6830](https://github.com/uswds/uswds/issues/6830) | Reproduced; fix remains open | Validate and merge existing PR #6831 after required accessibility verification. |
| [#6815](https://github.com/uswds/uswds/issues/6815) | Named platform or environment needed | Test the official no-label variant with current Safari and VoiceOver; assess the progress heading and list together before changing aria-hidden. |
| [#6808](https://github.com/uswds/uswds/issues/6808) | Fix proposed: [#6941](https://github.com/uswds/uswds/pull/6941) | Review PR #6941, including the expanded context contract. Verify other components separately before claiming general shadow DOM support. |
| [#6794](https://github.com/uswds/uswds/issues/6794) | Narrow claim not reproduced | Keep the accessibility/design request actionable. Evaluate the proposed consistent Error prefix with accessibility review; do not close as invalid based on this narrow check. |
| [#6717](https://github.com/uswds/uswds/issues/6717) | Named platform or environment needed | Verify #6781 on actual iOS Safari before merging, including background scrolling, forced-action nondismissal, explicit close, and focus restoration. Avoid a duplicate implementation. |
| [#6694](https://github.com/uswds/uswds/issues/6694) | Reproduced; fix remains open | Validate existing PR #6695 and its dependency order. |
| [#6525](https://github.com/uswds/uswds/issues/6525) | Named platform or environment needed | Retain the issue. Test label versus description announcement with current JAWS and NVDA before choosing and validating a markup change. |
| [#6523](https://github.com/uswds/uswds/issues/6523) | Named platform or environment needed | Perform VoiceOver comparisons in Safari, Firefox, and Chrome; test proposed single-string alternative. |
| [#6505](https://github.com/uswds/uswds/issues/6505) | Exact fixture needed | Obtain the smallest table example and browser, then measure the actual label hit area and assess target spacing as well as dimensions. |
| [#6501](https://github.com/uswds/uswds/issues/6501) | Named platform or environment needed | Request the affected site HTML and exact SiteImprove rule, then compare against the current named section template. Keep open until the reported environment is understood. |
| [#6485](https://github.com/uswds/uswds/issues/6485) | Reproduced; fix remains open | Keep as an accessibility bug. Define naming behavior for icon-only triggers while preserving existing names and descriptions, then add targeted regression coverage. |
| [#6474](https://github.com/uswds/uswds/issues/6474) | Reproduced; fix remains open | Prioritize review of #6475 and verify the focused target keeps a visible indicator. Its patch applies cleanly to the tested baseline. |
| [#6464](https://github.com/uswds/uswds/issues/6464) | Reproduced; fix remains open | Assess desktop hit-area expansion and relevant spacing exceptions with accessibility review. Preserve the compact banner appearance while increasing the interactive box where needed. |
| [#6459](https://github.com/uswds/uswds/issues/6459) | Named platform or environment needed | Retest actual assistive technology with visible native-input prototype; keep distinct regression scenarios. |
| [#6449](https://github.com/uswds/uswds/issues/6449) | Named platform or environment needed | Retest the second toggle click in current Safari and on physical iOS. Reassess PR #6450 against current baseline instead of opening competing work. |
| [#6426](https://github.com/uswds/uswds/issues/6426) | Reproduced; fix remains open | Validate existing PR #6431, including repeated updates and teardown. |
| [#6424](https://github.com/uswds/uswds/issues/6424) | Fix proposed: [#6944](https://github.com/uswds/uswds/pull/6944) | Review PR #6944. Custom themes should verify their chosen focus and background colors. |
| [#6414](https://github.com/uswds/uswds/issues/6414) | Reproduced; fix remains open | Refresh #6418 against current Gulp/Sass tooling, retain effective failing-path regression coverage, and document the output-path migration before release. |
| [#6412](https://github.com/uswds/uswds/issues/6412) | Reproduced; fix remains open | Review and finish existing PR #6610. Preserve its documented compatibility warning for consumers compensating for the current order. |
| [#6386](https://github.com/uswds/uswds/issues/6386) | Partial reproduction | Update the issue with partial mitigation and validate existing teardown PR #6387 against current guards. |
| [#6381](https://github.com/uswds/uswds/issues/6381) | Fix proposed: [#6945](https://github.com/uswds/uswds/pull/6945) | Review PR #6945 with its cross-browser state matrix and documented print/forced-color limits. |
| [#6372](https://github.com/uswds/uswds/issues/6372) | Reproduced; fix remains open | Coordinate with existing tooltip label work #6035 and #5274 before opening a new implementation PR. Add radio selection and keyboard focus regressions. |
| [#6329](https://github.com/uswds/uswds/issues/6329) | Reproduced; fix remains open | Consolidate the documented root cause with #6110 and #5691 only after preserving their distinct acceptance criteria. Define an initialization-safe date update/reset API or synchronization contract. |
| [#6315](https://github.com/uswds/uswds/issues/6315) | Reproduced; fix remains open | Validate existing PR #6411, which updates both time picker and combo box. |
| [#6314](https://github.com/uswds/uswds/issues/6314) | Partial reproduction | Verify native menu paste on supported browsers; handle input/paste consistently with keyboard formatting. |
| [#6301](https://github.com/uswds/uswds/issues/6301) | Fix proposed: [#6946](https://github.com/uswds/uswds/pull/6946) | Review PR #6946. Separate site-template work remains in uswds/uswds-site#3059. |
| [#6294](https://github.com/uswds/uswds/issues/6294) | Reproduced; fix remains open | Keep parent and remaining children open. Coordinate PR #6901 discovery cleanup with consumer coverage in #6418. |
| [#6260](https://github.com/uswds/uswds/issues/6260) | Reproduced in simulation | Refresh #6306 and verify both hidden wrapping and visible focused behavior at large text sizes. Confirm the original iOS Chrome workflow before claiming device coverage. |
| [#6258](https://github.com/uswds/uswds/issues/6258) | Reproduced; fix remains open | Review and finish PR #6290 with link/native-button contrast and state coverage. |
| [#6238](https://github.com/uswds/uswds/issues/6238) | Named platform or environment needed | Validate #6289 in current Safari below 480px and compare expanded/collapsed states with Chromium and Firefox. The existing patch applies cleanly. |
| [#6231](https://github.com/uswds/uswds/issues/6231) | Reproduced; fix remains open | Keep as an enhancement with a concrete fixture. Evaluate a supported top-layer or portal strategy with focus, positioning, and browser compatibility coverage. |
| [#6176](https://github.com/uswds/uswds/issues/6176) | Reproduced; fix remains open | Finish PR #6662 and its documentation follow-up; verify default and hover theme values without opening a duplicate. |
| [#6110](https://github.com/uswds/uswds/issues/6110) | Partial reproduction | Add focused Angular reproduction and agree event contract before modifying input replacement. |
| [#6091](https://github.com/uswds/uswds/issues/6091) | Reproduced; fix remains open | Retain the component/design task. Specify standalone versus inline behavior and test hit-area expansion plus layout compatibility. |
| [#6080](https://github.com/uswds/uswds/issues/6080) | Reproduced; fix remains open | Coordinate with #6068 and design one solution for custom radio and checkbox invalid targets. Do not close as a duplicate before scope is agreed. |
| [#6075](https://github.com/uswds/uswds/issues/6075) | Partial reproduction | Test action wording with a real language transition and compare concise visible and accessible labels. |
| [#6072](https://github.com/uswds/uswds/issues/6072) | Named platform or environment needed | Test popup positioning and default button colors separately on current real iOS Safari near both viewport edges. |
| [#6069](https://github.com/uswds/uswds/issues/6069) | Reproduced; fix remains open | Continue #6388 review. Resolve the repeatedly added resize listener and the existing CSS-container-query question before merging; do not start competing work. |
| [#6068](https://github.com/uswds/uswds/issues/6068) | Named platform or environment needed | Retest actual assistive technology with visible native-input prototype; keep distinct regression scenarios. |
| [#6056](https://github.com/uswds/uswds/issues/6056) | Reproduced; fix remains open | Validate and merge existing combined focus PR #6796 after required accessibility verification. |
| [#5981](https://github.com/uswds/uswds/issues/5981) | Reproduced; fix remains open | Fix layout while preserving target sizes and verify true browser zoom. |
| [#5976](https://github.com/uswds/uswds/issues/5976) | Named platform or environment needed | Test current Safari on macOS with keyboard navigation through identifier links at the reported widths, capturing element positions before and after focus. |
| [#5936](https://github.com/uswds/uswds/issues/5936) | Fix proposed: [#6942](https://github.com/uswds/uswds/pull/6942) (partial scope) | Review PR #6942 for initial error and success styling. Decide broader custom-class propagation before closing #5936. |
| [#5934](https://github.com/uswds/uswds/issues/5934) | Reproduced; fix remains open | Finish PR #5699 with utility-output coverage for default, empty, included, and excluded settings. |
| [#5931](https://github.com/uswds/uswds/issues/5931) | Failure path reproduced by injection | Use current GitHub header authentication and make release-data failure visible or use a validated cache; test recovery and missing-cache cases in the site repository. |
| [#5913](https://github.com/uswds/uswds/issues/5913) | Fix proposed: [#6948](https://github.com/uswds/uswds/pull/6948) (partial scope) | Review PR #6948 for the compiler diagnostic. The broader table-token usage question remains; default is not a standalone color token. |
| [#5905](https://github.com/uswds/uswds/issues/5905) | Partial reproduction | Retain the remaining #6151/#6528 work and assess #6389 with the requested usability review. Do not close the whole report based only on the already removed verbose hint. |
| [#5883](https://github.com/uswds/uswds/issues/5883) | Reproduced; fix remains open | Review #6691 using mixed grouped/standalone and narrow-width controls. Its patch applies cleanly; avoid duplicating the submitted fix. |
| [#5873](https://github.com/uswds/uswds/issues/5873) | Partial reproduction | Keep visible instruction requirement open; merged PR #6767 improves announcements but does not satisfy that requirement. |
| [#5858](https://github.com/uswds/uswds/issues/5858) | Reproduced; fix remains open | Check the existing modal refactor PR #6299, then prevent invalid form submission from closing the modal or establish a supported integration contract. |
| [#5834](https://github.com/uswds/uswds/issues/5834) | Partial reproduction | Review with #5277 and test Chromium, Firefox, Safari before choosing a browser workaround. |
| [#5830](https://github.com/uswds/uswds/issues/5830) | Reproduced; fix remains open | Continue consolidated PR #6796, which preserves contributor work from 6262. Keep both linked issues open until the combined change passes its remaining review and merges. |
| [#5828](https://github.com/uswds/uswds/issues/5828) | Named platform or environment needed | Retest current JAWS with scrollable tables, compare native scrolling and upstream FreedomScientific/standards-support#607, and preserve the issue until that evidence is recorded. |
| [#5827](https://github.com/uswds/uswds/issues/5827) | Reproduced; fix remains open | Preserve logical caret/selection during formatting, with delete/replace and punctuation tests. |
| [#5816](https://github.com/uswds/uswds/issues/5816) | Closed: fixed | Closed as completed using merged PR #6798 and current-baseline typography evidence. Verify release inclusion through the normal release process. |
| [#5787](https://github.com/uswds/uswds/issues/5787) | Named platform or environment needed | Verify selection and software keyboard behavior on current real iOS and Android devices, including screen-reader use, before changing focus policy. |
| [#5755](https://github.com/uswds/uswds/issues/5755) | Fix proposed: [#6943](https://github.com/uswds/uswds/pull/6943) | Review PR #6943 and include the restored documented helper in release notes. |
| [#5748](https://github.com/uswds/uswds/issues/5748) | Related failure reproduced | Address or document the missing-id contract and obtain a minimal Angular initialization example to reproduce the original stack trace. |
| [#5691](https://github.com/uswds/uswds/issues/5691) | Reproduced; fix remains open | Define a supported clear/reset method or synchronize when reopening. Preserve both selected-date and range-highlight acceptance criteria when linking #6329 and #6110. |
| [#5646](https://github.com/uswds/uswds/issues/5646) | Reproduced; fix remains open | Align focus and visual order while reviewing mobile navigation consequences. |
| [#5503](https://github.com/uswds/uswds/issues/5503) | Named platform or environment needed | Test #6758 on real iOS VoiceOver. Track remaining header navigation, rotor expectations and keypad requests separately from its touch-hint and weekday-readout scope. |
| [#5463](https://github.com/uswds/uswds/issues/5463) | Reproduced; fix remains open | Implement and review a narrow-viewport focus treatment with keyboard regression coverage and accessibility review of whether hidden ancestry should remain available to screen readers. |
| [#5375](https://github.com/uswds/uswds/issues/5375) | Reproduced; fix remains open | Add event ownership or idempotent delegation without breaking supported document-level and per-table initialization; preserve the control cases in regression tests. |
| [#5294](https://github.com/uswds/uswds/issues/5294) | Named platform or environment needed | Perform named screen-reader/browser verification on PR #5345 for list semantics and heading/step reading order before merge. |
| [#5291](https://github.com/uswds/uswds/issues/5291) | Named platform or environment needed | Retest on Windows with current JAWS and Chrome, recording browser UI focus and exact key sequence over multiple trials. Do not dismiss as not a bug without this environment. |
| [#5194](https://github.com/uswds/uswds/issues/5194) | Fix proposed: [#6947](https://github.com/uswds/uswds/pull/6947) | Review PR #6947, including the specificity impact on downstream custom CSS. |

## Issue 6830

[Original issue](https://github.com/uswds/uswds/issues/6830)

Result: Reproduced; fix remains open.

Attempt: Run the issue header open/close control, then call off while open. Repeat using the repository modal fixture.

Environment: develop eaef39533a0a0f78976d6888edf8ae56fe9334d6; macOS; Node v24.19.0. Tested source files are unchanged from baseline. Unrelated checkbox styles and story tests are present in the isolated worktree. jsdom 22.1.0.

Observed: Normal header close clears aria-hidden. Header and modal off while open retain aria-hidden=true; modal also retains data-modal-hidden.

Limit: No physical screen reader was exercised.

Next: Validate and merge existing PR #6831 after required accessibility verification.

## Issue 6815

[Original issue](https://github.com/uswds/uswds/issues/6815)

Result: Named platform or environment needed.

Attempt: Rendered the current no-label step-indicator Twig structure and inspected its accessible DOM representation.

Environment: Current develop baseline eaef39533a0a0f78976d6888edf8ae56fe9334d6; compiled USWDS CSS and JavaScript; Codex in-app Chromium on macOS; 1280x720 viewport.

Observed: The list receives aria-hidden=true in the current template. The accessible snapshot omits its steps and retains the separate Step 2 of 3 heading.

Limit: The reported Safari and VoiceOver combination was not exercised. Chromium DOM inspection cannot establish the spoken output or whether the equivalent heading meets the intended interaction model.

Next: Test the official no-label variant with current Safari and VoiceOver; assess the progress heading and list together before changing aria-hidden.

## Issue 6808

[Original issue](https://github.com/uswds/uswds/issues/6808)

Result: Fix proposed: [#6941](https://github.com/uswds/uswds/pull/6941).

Attempt: Initialize accordion in isolated shadow root on baseline; run six baseline-failing regression tests and independent edge cases.

Environment: Baseline05cc4e65, Chromium and jsdom.

Observed: Original selector ignored supplied root; corrected query boundary initializes expected accordion.

Limit: No claim that every USWDS component supports shadow DOM. Real screen-reader matrix not run.

Next: Review PR #6941, including the expanded context contract. Verify other components separately before claiming general shadow DOM support.

## Issue 6794

[Original issue](https://github.com/uswds/uswds/issues/6794)

Result: Narrow claim not reproduced.

Attempt: Enter 43 characters into the current character-count component with a 20-character limit and inspect visible error output.

Environment: Isolated export of origin/develop at eaef39533a0a0f78976d6888edf8ae56fe9334d6; macOS 26.6.2 arm64; Headless Chromium 147.0.0.0 through isolated agent-browser session uswds-shard0-repro; source-built Sass and JavaScript; bundled Source Sans Pro fonts loaded.

Observed: The red border and message appear. Visible text says "23 characters over limit", which conveys the condition without color. The requested explicit "Error" prefix and icon are absent.

Limit: This tests the character-count example, not every form error or the file-input branch. It does not establish whether users recognize the error clearly enough. The report explicitly asks for a clearer error cue even when message text appears.

Next: Keep the accessibility/design request actionable. Evaluate the proposed consistent Error prefix with accessibility review; do not close as invalid based on this narrow check.

## Issue 6717

[Original issue](https://github.com/uswds/uswds/issues/6717)

Result: Named platform or environment needed.

Attempt: Opened a valid long force-action modal and inspected the live overlay dimensions, pointer-event inheritance and background hit testing. Read the open PR mechanism, regression coverage and real-iOS testing limitation.

Environment: Baseline eaef39533a0a0f78976d6888edf8ae56fe9334d6; compiled baseline JavaScript and CSS; Codex in-app Chromium on macOS at 1280x720 unless otherwise specified.

Observed: The visible overlay has scrollHeight 2136 versus clientHeight 720 but inherits pointer-events:none from body. The modal content itself has pointer-events:auto, and a background coordinate hits HTML instead of the overlay. data-force-action is on the wrapper, not the overlay.

Limit: The current desktop test confirms the mechanism, not the reported inability to scroll on physical iOS. PR #6781 also explicitly lacks real-iOS confirmation.

Next: Verify #6781 on actual iOS Safari before merging, including background scrolling, forced-action nondismissal, explicit close, and focus restoration. Avoid a duplicate implementation.

## Issue 6694

[Original issue](https://github.com/uswds/uswds/issues/6694)

Result: Reproduced; fix remains open.

Attempt: Open current Documentation Page and Restricted Date Range Storybook stories. Inspect panel visibility and calendar dates outside configured limits.

Environment: develop eaef39533a0a0f78976d6888edf8ae56fe9334d6; macOS; Node v24.19.0. Tested source files are unchanged from baseline. Unrelated checkbox styles and story tests are present in the isolated worktree. Chromium 147.0.7727.15.

Observed: Banner and navigation panels have aria-expanded=false but remain display:block without hidden attributes. The restricted March 6 through 15 range allows March 1 and February dates.

Limit: Only the two issue examples were rerun; other page, footer, mask and validation stories in PR #6695 were not exhaustively retested.

Next: Validate existing PR #6695 and its dependency order.

## Issue 6525

[Original issue](https://github.com/uswds/uswds/issues/6525)

Result: Named platform or environment needed.

Attempt: Render the current radio tile Twig template and inspect the browser accessibility snapshot and label markup.

Environment: Isolated export of origin/develop at eaef39533a0a0f78976d6888edf8ae56fe9334d6; macOS 26.6.2 arm64; Headless Chromium 147.0.0.0 through isolated agent-browser session uswds-shard0-repro; source-built Sass and JavaScript; bundled Source Sans Pro fonts loaded.

Observed: Chromium exposes "Frederick Douglass This is optional text that can be used to describe the label in more detail." as one radio name. Hint text remains inside the label.

Limit: The long accessible name is confirmed. JAWS/NVDA announcement order requires Windows screen readers, unavailable on this macOS host. Browser accessibility output is not a spoken screen-reader test.

Next: Retain the issue. Test label versus description announcement with current JAWS and NVDA before choosing and validating a markup change.

## Issue 6523

[Original issue](https://github.com/uswds/uswds/issues/6523)

Result: Named platform or environment needed.

Attempt: Rendered current Step Indicator and inspected heading markup and Chromium accessibility snapshot.

Environment: {"os": "darwin", "browser": "Chromium", "browserVersion": "147.0.7727.15", "baseline": "eaef39533a0a0f78976d6888edf8ae56fe9334d6", "sourceNote": "Clean baseline worktree with unrelated shadow() Sass fix; compiled library CSS byte-identical to baseline."}

Observed: Structured observations:

```json
{
  "headingMarkup": "<h4 class=\"usa-step-indicator__heading\">\n      <span class=\"usa-step-indicator__heading-counter\"><span class=\"usa-sr-only\">Step</span>\n        <span class=\"usa-step-indicator__current-step\">3</span>\n        <span class=\"usa-step-indicator__total-steps\">of 5</span> </span><span class=\"usa-step-indicator__heading-text\">Supporting documents</span>\n    </h4>",
  "accessibilitySnapshot": "- heading \"Step 3 of 5 Supporting documents\" [level=4]"
}
```

Limit: The report concerns actual VoiceOver speech/virtual-cursor segmentation. An automated Chromium accessibility snapshot does not reproduce VoiceOver announcements, and no VoiceOver speech session was run.

Next: Perform VoiceOver comparisons in Safari, Firefox, and Chrome; test proposed single-string alternative.

## Issue 6505

[Original issue](https://github.com/uswds/uswds/issues/6505)

Result: Exact fixture needed.

Attempt: Compared normal checkbox labels, visually hidden text inside the label, and a visually hidden entire label. Measured native input, label and pseudo-element rectangles.

Environment: Current develop baseline eaef39533a0a0f78976d6888edf8ae56fe9334d6; compiled USWDS CSS and JavaScript; Codex in-app Chromium on macOS; 1280x720 viewport.

Observed: The normal and hidden-text custom checkboxes are 20x20 px. Hiding the whole label moves its custom checkbox offscreen. The original report does not include enough table markup to determine which pattern produced the claimed 13px target.

Limit: The reported table and exact usa-sr-only placement were not supplied. A pseudo-element dimension alone does not establish the complete clickable target.

Next: Obtain the smallest table example and browser, then measure the actual label hit area and assess target spacing as well as dimensions.

## Issue 6501

[Original issue](https://github.com/uswds/uswds/issues/6501)

Result: Named platform or environment needed.

Attempt: Render the standard current banner Twig template and inspect its accessibility tree. Run scoped axe-core 4.12.1.

Environment: Isolated export of origin/develop at eaef39533a0a0f78976d6888edf8ae56fe9334d6; macOS 26.6.2 arm64; Headless Chromium 147.0.0.0 through isolated agent-browser session uswds-shard0-repro; source-built Sass and JavaScript; bundled Source Sans Pro fonts loaded.

Observed: The button is inside a named region "Official website of the United States government". Scoped axe reports zero violations, 13 passes, 75 inapplicable rules.

Limit: The actual reported site markup and SiteImprove scan are unavailable. Passing axe cannot verify a SiteImprove-specific result.

Next: Request the affected site HTML and exact SiteImprove rule, then compare against the current named section template. Keep open until the reported environment is understood.

## Issue 6485

[Original issue](https://github.com/uswds/uswds/issues/6485)

Result: Reproduced; fix remains open.

Attempt: Initialized an icon-only tooltip button with title=Settings and an aria-hidden SVG, then inspected its accessible name and ran the axe button-name rule.

Environment: Current develop baseline eaef39533a0a0f78976d6888edf8ae56fe9334d6; compiled USWDS CSS and JavaScript; Codex in-app Chromium on macOS; 1280x720 viewport.

Observed: Initialization removes title and supplies aria-describedby, but no accessible name. The browser snapshot presents an unnamed button and axe reports a button-name violation.

Limit: This validates the icon-only trigger case, not every tooltip relationship. The source of a fallback name is a component contract decision.

Next: Keep as an accessibility bug. Define naming behavior for icon-only triggers while preserving existing names and descriptions, then add targeted regression coverage.

## Issue 6474

[Original issue](https://github.com/uswds/uswds/issues/6474)

Result: Reproduced; fix remains open.

Attempt: Activated the actual USWDS skip link using Enter and measured the main-content target after focus moved. Reviewed the one-line removal in existing PR.

Environment: Baseline eaef39533a0a0f78976d6888edf8ae56fe9334d6; compiled baseline JavaScript and CSS; Codex in-app Chromium on macOS at 1280x720 unless otherwise specified.

Observed: Focus moves to main-content with tabindex=0, but the component writes inline outline:0px. Computed outline-style is none and width is 0px.

Limit: Chromium verified; a second browser and persistent-focus control remain useful before merging the existing PR.

Next: Prioritize review of #6475 and verify the focused target keeps a visible indicator. Its patch applies cleanly to the tested baseline.

## Issue 6464

[Original issue](https://github.com/uswds/uswds/issues/6464)

Result: Reproduced; fix remains open.

Attempt: Measure the current default banner button at a 1280-pixel viewport with loaded source fonts.

Environment: Isolated export of origin/develop at eaef39533a0a0f78976d6888edf8ae56fe9334d6; macOS 26.6.2 arm64; Headless Chromium 147.0.0.0 through isolated agent-browser session uswds-shard0-repro; source-built Sass and JavaScript; bundled Source Sans Pro fonts loaded.

Observed: The clickable button is 113.125 by 14.0625 CSS pixels with zero padding, below both the reported 44-pixel height and the 24-pixel minimum size in isolation.

Limit: SiteImprove was not run. Target size alone does not evaluate WCAG exceptions, spacing, or overall conformance. Mobile target behavior was not inferred from the desktop measurement.

Next: Assess desktop hit-area expansion and relevant spacing exceptions with accessibility review. Preserve the compact banner appearance while increasing the interactive box where needed.

## Issue 6459

[Original issue](https://github.com/uswds/uswds/issues/6459)

Result: Named platform or environment needed.

Attempt: Rendered current checkbox component and inspected native input placement relative to its visible label.

Environment: {"os": "darwin", "browser": "Chromium", "browserVersion": "147.0.7727.15", "baseline": "eaef39533a0a0f78976d6888edf8ae56fe9334d6", "sourceNote": "Clean baseline worktree with unrelated shadow() Sass fix; compiled library CSS byte-identical to baseline."}

Observed: Structured observations:

```json
[
  {
    "id": "check-historical-truth",
    "left": "-16943px",
    "opacity": "1",
    "bounds": {
      "x": -16943.03125,
      "y": 22.03125,
      "width": 13,
      "height": 13,
      "top": 22.03125,
      "right": -16930.03125,
      "bottom": 35.03125,
      "left": -16943.03125
    },
    "labelBounds": {
      "x": 0,
      "y": 34.03125,
      "width": 144.03125,
      "height": 22.03125,
      "top": 34.03125,
      "right": 144.03125,
      "bottom": 56.0625,
      "left": 0
    }
  },
  {
    "id": "check-historical-douglass",
    "left": "-16943px",
    "opacity": "1",
    "bounds": {
      "x": -16943.03125,
      "y": 56.0625,
      "width": 13,
      "height": 13,
      "top": 56.0625,
      "right": -16930.03125,
      "bottom": 69.0625,
      "left": -16943.03125
    },
    "labelBounds": {
      "x": 0,
      "y": 68.0625,
      "width": 165.984375,
      "height": 22.03125,
      "top": 68.0625,
      "right": 165.984375,
      "bottom": 90.09375,
      "left": 0
    }
  },
  {
    "id": "check-historical-washington",
    "left": "-16943px",
    "opacity": "1",
    "bounds": {
      "x": -16943.03125,
      "y": 90.09375,
      "width": 13,
      "height": 13,
      "top": 90.09375,
      "right": -16930.03125,
      "bottom": 103.09375,
      "left": -16943.03125
    },
    "labelBounds": {
      "x": 0,
      "y": 102.09375,
      "width": 184.859375,
      "height": 22.03125,
      "top": 102.09375,
      "right": 184.859375,
      "bottom": 124.125,
      "left": 0
    }
  },
  {
    "id": "check-historical-carver",
    "left": "-16943px",
    "opacity": "1",
    "bounds": {
      "x": -16943.03125,
      "y": 124.125,
      "width": 13,
      "height": 13,
      "top": 124.125,
      "right": -16930.03125,
      "bottom": 137.125,
      "left": -16943.03125
    },
    "labelBounds": {
      "x": 0,
      "y": 136.125,
      "width": 219.78125,
      "height": 22.03125,
      "top": 136.125,
      "right": 219.78125,
      "bottom": 158.15625,
      "left": 0
    }
  }
]
```

Limit: The reported NVDA forms-navigation focus defect requires Windows/NVDA or ChromeOS/ChromeVox; this host is macOS with headless Chromium. DOM placement alone is not the screen-reader result.

Next: Retest actual assistive technology with visible native-input prototype; keep distinct regression scenarios.

## Issue 6449

[Original issue](https://github.com/uswds/uswds/issues/6449)

Result: Named platform or environment needed.

Attempt: Read current implementation and open PR #6450; simulate mousedown, focusout with relatedTarget:null, and click on an open date picker.

Environment: Baseline eaef39533a0a0f78976d6888edf8ae56fe9334d6; macOS 26.6.2; source Sass compilation with sass-embedded; browser cases run in desktop Chrome through the Browser plugin at 1280x700.

Observed: The synthetic focusout no longer closes the calendar on this baseline; the subsequent toggle click closes it. Current code dismisses on deliberate outside pointerdown, and no longer uses the historical date-picker focusout dismissal handler.

Limit: Actual Safari/macOS and physical iOS were not tested. The historical implementation has changed, so an actual target-platform retest is required before closing the report or treating PR #6450 as obsolete.

Next: Retest the second toggle click in current Safari and on physical iOS. Reassess PR #6450 against current baseline instead of opening competing work.

## Issue 6426

[Original issue](https://github.com/uswds/uswds/issues/6426)

Result: Reproduced; fix remains open.

Attempt: Initialize a tooltip, change its title, and initialize twice more. Count tooltip nodes and inspect descriptions.

Environment: develop eaef39533a0a0f78976d6888edf8ae56fe9334d6; macOS; Node v24.19.0. Tested source files are unchanged from baseline. Unrelated checkbox styles and story tests are present in the isolated worktree. jsdom 22.1.0.

Observed: Tooltip nodes grow from 1 to 2 to 3. The original description remains referenced; extra nodes have empty text in this lifecycle.

Limit: Fresh DOM reproduction confirms node lifecycle. This run does not replace physical screen reader testing or every hover sequence.

Next: Validate existing PR #6431, including repeated updates and teardown.

## Issue 6424

[Original issue](https://github.com/uswds/uswds/issues/6424)

Result: Fix proposed: [#6944](https://github.com/uswds/uswds/pull/6944).

Attempt: Selected Apple, reached the clear button with Tab, and inspected the rendered outline and element opacity.

Environment: Current develop baseline eaef39533a0a0f78976d6888edf8ae56fe9334d6; compiled USWDS CSS and JavaScript; Codex in-app Chromium on macOS; 1280x720 viewport.

Observed: The focused button has opacity 0.6 and a 4px outline specified as rgb(36,145,255). Element opacity composites the ring over white to approximately rgb(124,189,255), reducing its contrast.

Limit: The default theme and a white background were tested. Other theme focus colors remain the theme author responsibility.

Next: Review PR #6944. Custom themes should verify their chosen focus and background colors.

## Issue 6414

[Original issue](https://github.com/uswds/uswds/issues/6414)

Result: Reproduced; fix remains open.

Attempt: Compiled dist/scss/stylesheets/uswds.scss with the packages load path and compiled src/stylesheets/uswds.scss as a control after a successful baseline build. Read the existing output-structure and test changes.

Environment: Node 24 and sass-embedded; current build from baseline eaef39533a0a0f78976d6888edf8ae56fe9334d6, with an unrelated one-line combo focus CSS change in the worktree.

Observed: Distributed Sass fails with Cannot find stylesheet to import at @forward "../../packages/uswds". The equivalent source entry compiles successfully to 749450 CSS characters.

Limit: The local build reproduces the distributed directory layout; a downloaded release archive was not separately fetched. The existing PR no longer applies cleanly to current tooling files.

Next: Refresh #6418 against current Gulp/Sass tooling, retain effective failing-path regression coverage, and document the output-path migration before release.

## Issue 6412

[Original issue](https://github.com/uswds/uswds/issues/6412)

Result: Reproduced; fix remains open.

Attempt: Compile a custom medium-screen breakpoint at 768px alongside default desktop; render medium-screen:grid-col-12 desktop:grid-col-4 at 1280px.

Environment: Baseline eaef39533a0a0f78976d6888edf8ae56fe9334d6; macOS 26.6.2; source Sass compilation with sass-embedded; browser cases run in desktop Chrome through the Browser plugin at 1280x700.

Observed: The 768px custom rule is emitted after the larger desktop rule. A 1200px grid child remains1200px wide instead of 400px at desktop.

Limit: Uses standard USWDS class names rather than the reporter custom VA prefix; both exercise the same breakpoint ordering.

Next: Review and finish existing PR #6610. Preserve its documented compatibility warning for consumers compensating for the current order.

## Issue 6386

[Original issue](https://github.com/uswds/uswds/issues/6386)

Result: Partial reproduction.

Attempt: Initialize character count, call off, initialize again, and count visible and screen-reader status elements.

Environment: develop eaef39533a0a0f78976d6888edf8ae56fe9334d6; macOS; Node v24.19.0. Tested source files are unchanged from baseline. Unrelated checkbox styles and story tests are present in the isolated worktree. jsdom 22.1.0.

Observed: off leaves both generated status elements and data-enhanced=true. Reinitialization retains one pair, so current idempotency guards prevent the historical duplication symptom.

Limit: React StrictMode runtime was not exercised. The teardown leak is reproduced; duplicate creation is already mitigated by merged PR #6767.

Next: Update the issue with partial mitigation and validate existing teardown PR #6387 against current guards.

## Issue 6381

[Original issue](https://github.com/uswds/uswds/issues/6381)

Result: Fix proposed: [#6945](https://github.com/uswds/uswds/pull/6945).

Attempt: Render checked checkboxes with data-indeterminate="true" and with element.indeterminate=true. Inspect pseudo-element image and screenshot.

Environment: Isolated export of origin/develop at eaef39533a0a0f78976d6888edf8ae56fe9334d6; macOS 26.6.2 arm64; Headless Chromium 147.0.0.0 through isolated agent-browser session uswds-shard0-repro; source-built Sass and JavaScript; bundled Source Sans Pro fonts loaded.

Observed: The checked data-attribute variant uses correct8.svg, while the checked JavaScript variant uses checkbox-indeterminate.svg. The visible check and dash differ for the two representations.

Limit: This confirms the Chrome branch only. Actual Safari and Firefox precedence claims remain untested. The data attribute alone does not set the native mixed accessibility state.

Next: Review PR #6945 with its cross-browser state matrix and documented print/forced-color limits.

## Issue 6372

[Original issue](https://github.com/uswds/uswds/issues/6372)

Result: Reproduced; fix remains open.

Attempt: Use the supplied radio-label tooltip markup on the baseline. Click both tooltip and control radio labels.

Environment: Isolated export of origin/develop at eaef39533a0a0f78976d6888edf8ae56fe9334d6; macOS 26.6.2 arm64; Headless Chromium 147.0.0.0 through isolated agent-browser session uswds-shard0-repro; source-built Sass and JavaScript; bundled Source Sans Pro fonts loaded.

Observed: Both input.checked values become true in independent control groups. The tooltip radio remains visually empty: its pseudo-element stays white with a dark border, while the control gets the blue selected style. Tooltip initialization inserts a span between the input and its label.

Limit: The synthetic fixture uses independent groups so both selected appearances can be compared. This does not validate all tooltip or checkbox label combinations.

Next: Coordinate with existing tooltip label work #6035 and #5274 before opening a new implementation PR. Add radio selection and keyboard focus regressions.

## Issue 6329

[Original issue](https://github.com/uswds/uswds/issues/6329)

Result: Reproduced; fix remains open.

Attempt: Install the issue-provided mutual clearing listeners before date-picker initialization, initialize four inputs, enter a system end date, and blur.

Environment: Isolated export of origin/develop at eaef39533a0a0f78976d6888edf8ae56fe9334d6; macOS 26.6.2 arm64; Headless Chromium 147.0.0.0 through isolated agent-browser session uswds-shard0-repro; source-built Sass and JavaScript; bundled Source Sans Pro fonts loaded.

Observed: The listeners run on retained original input elements, now hidden internal inputs without IDs. Both internal user-date values are cleared, but the visible external inputs still display 09/01/2026 and 09/15/2026.

Limit: This reproduces the before-initialization reference path. It does not prove every framework lifecycle has the same sequence. Current code retains original inputs rather than removing their listeners.

Next: Consolidate the documented root cause with #6110 and #5691 only after preserving their distinct acceptance criteria. Define an initialization-safe date update/reset API or synchronization contract.

## Issue 6315

[Original issue](https://github.com/uswds/uswds/issues/6315)

Result: Reproduced; fix remains open.

Attempt: Initialize a time picker input with authored aria-describedby, then initialize its combo box. Inspect the generated select and input.

Environment: develop eaef39533a0a0f78976d6888edf8ae56fe9334d6; macOS; Node v24.19.0. Tested source files are unchanged from baseline. Unrelated checkbox styles and story tests are present in the isolated worktree. jsdom 22.1.0.

Observed: The authored hint association is lost during time-picker enhancement. Generated combobox input has no aria-describedby and no element retains the hint association.

Limit: DOM association was tested, not physical screen reader speech.

Next: Validate existing PR #6411, which updates both time picker and combo box.

## Issue 6314

[Original issue](https://github.com/uswds/uswds/issues/6314)

Result: Partial reproduction.

Attempt: Dispatched synthetic paste/input events with fixed test data to model the event difference, then used actual ArrowRight keyup as a control. No system clipboard access occurred.

Environment: {"os": "darwin", "browser": "Chromium", "browserVersion": "147.0.7727.15", "baseline": "eaef39533a0a0f78976d6888edf8ae56fe9334d6", "sourceNote": "Clean baseline worktree with unrelated shadow() Sass fix; compiled library CSS byte-identical to baseline."}

Observed: Structured observations:

```json
{
  "simulation": {
    "value": "123456789",
    "mask": "___ __ ____"
  },
  "afterKeyup": {
    "value": "123 45 6789",
    "mask": "123 45 6789"
  }
}
```

Limit: Automatic approval review rejected clipboard permission because it could expose sensitive clipboard contents. Native right-click paste was not run. Synthetic input does not prove a physical clipboard interaction; error-feedback PR #6203 is still unmerged.

Next: Verify native menu paste on supported browsers; handle input/paste consistently with keyboard formatting.

## Issue 6301

[Original issue](https://github.com/uswds/uswds/issues/6301)

Result: Fix proposed: [#6946](https://github.com/uswds/uswds/pull/6946).

Attempt: Build all217HTML pages before and after, inspect actual browser navigation names, preserve custom template names.

Environment: Baselineeaef3953, Chromium on macOS.

Observed: Default names repeat navigation role;25 rendered pages change only intended aria-label values.36 component tests pass.

Limit: No fresh screen-reader speech test. Separate site3059 remains open.

Next: Review PR #6946. Separate site-template work remains in uswds/uswds-site#3059.

## Issue 6294

[Original issue](https://github.com/uswds/uswds/issues/6294)

Result: Reproduced; fix remains open.

Attempt: Build baseline distribution, compile dist/scss/stylesheets/uswds.scss with packages load path, and inspect test runner discovery.

Environment: develop eaef39533a0a0f78976d6888edf8ae56fe9334d6; macOS; Node v24.19.0. Tested source files are unchanged from baseline. Unrelated checkbox styles and story tests are present in the isolated worktree. sass-embedded 1.100.0.

Observed: Distributed Sass compilation throws Cannot find stylesheet for ../../packages/uswds. Root build/include specs exist but tasks/test.js excludes their directory.

Limit: This reproduces the consumer Sass failure and verifies discovery configuration; it is not a full validation of every proposed replacement test.

Next: Keep parent and remaining children open. Coordinate PR #6901 discovery cleanup with consumer coverage in #6418.

## Issue 6260

[Original issue](https://github.com/uswds/uswds/issues/6260)

Result: Reproduced in simulation.

Attempt: Placed the normal Skip to main content text in a 320px iframe and simulated larger text with a 48px skip-link font. Read the existing geometric fix and ran git apply --check.

Environment: Baseline eaef39533a0a0f78976d6888edf8ae56fe9334d6; compiled baseline JavaScript and CSS; Codex in-app Chromium on macOS at 1280x720 unless otherwise specified. The same-origin iframe has a measured 320px layout width.

Observed: The unfocused link is 160px tall, starts at -60.8px, and extends 99.2px into the visible viewport. It visibly overlays the header. The existing PR patch currently conflicts with the stylesheet transition rule.

Limit: This is a desktop constrained-layout/text-size reproduction of the wrapping mechanism, not Chrome iOS Zoom text or a physical mobile test.

Next: Refresh #6306 and verify both hidden wrapping and visible focused behavior at large text sizes. Confirm the original iOS Chrome workflow before claiming device coverage.

## Issue 6258

[Original issue](https://github.com/uswds/uswds/issues/6258)

Result: Reproduced; fix remains open.

Attempt: Render equivalent accent-cool anchor and button elements in a usa-dark-background container.

Environment: Baseline eaef39533a0a0f78976d6888edf8ae56fe9334d6; macOS 26.6.2; source Sass compilation with sass-embedded; browser cases run in desktop Chrome through the Browser plugin at 1280x700.

Observed: Both backgrounds are rgb(0,189,227). The anchor text becomes rgb(223,225,226), while the native button text remains rgb(27,27,27).

Limit: Confirms the default accent-cool branch; all custom variants, hover, visited, and focus combinations need review on the existing PR.

Next: Review and finish PR #6290 with link/native-button contrast and state coverage.

## Issue 6238

[Original issue](https://github.com/uswds/uswds/issues/6238)

Result: Named platform or environment needed.

Attempt: Rendered the repository big-footer test fixture in a narrow iframe so headings became collapse buttons. Recorded computed button and parent colors, and reviewed the existing explicit-background PR.

Environment: Baseline eaef39533a0a0f78976d6888edf8ae56fe9334d6; compiled baseline JavaScript and CSS; Codex in-app Chromium on macOS at 1280x720 unless otherwise specified.

Observed: Chromium computes the collapsed button background as rgb(239,239,239), while its section uses rgb(240,240,240). This demonstrates dependence on the browser button background; the dark Safari appearance was not reproduced in Chromium.

Limit: Safari was not exercised. A Chromium iframe is a control, not confirmation of the reported Safari color. The iframe is 375px wide externally and 360px internally after its scrollbar.

Next: Validate #6289 in current Safari below 480px and compare expanded/collapsed states with Chromium and Firefox. The existing patch applies cleanly.

## Issue 6231

[Original issue](https://github.com/uswds/uswds/issues/6231)

Result: Reproduced; fix remains open.

Attempt: Place a baseline tooltip trigger inside an overflow:hidden container with limited spacing, then hover it.

Environment: Isolated export of origin/develop at eaef39533a0a0f78976d6888edf8ae56fe9334d6; macOS 26.6.2 arm64; Headless Chromium 147.0.0.0 through isolated agent-browser session uswds-shard0-repro; source-built Sass and JavaScript; bundled Source Sans Pro fonts loaded.

Observed: The visible tooltip uses absolute positioning within the clipped ancestor. Its top is 938.17 versus parent top 955.17, and its left is 38.33 versus parent left 114, so part of the content is clipped.

Limit: This is an explicit overflow:hidden reproduction. The original Angular application and its ancestor styles were not supplied. No claim is made that every tooltip clips.

Next: Keep as an enhancement with a concrete fixture. Evaluate a supported top-layer or portal strategy with focus, positioning, and browser compatibility coverage.

## Issue 6176

[Original issue](https://github.com/uswds/uswds/issues/6176)

Result: Reproduced; fix remains open.

Attempt: Inspect baseline nav Sass and attempt to configure the proposed navigation link theme setting.

Environment: Baseline eaef39533a0a0f78976d6888edf8ae56fe9334d6; macOS 26.6.2; source Sass compilation with sass-embedded; browser cases run in desktop Chrome through the Browser plugin at 1280x700.

Observed: Nav link color remains hard-coded to base-dark. Compiling with theme-navigation-link-color fails because the setting is not declared as configurable.

Limit: This is a confirmed missing configuration capability, not a claim that the default navigation color is inaccessible.

Next: Finish PR #6662 and its documentation follow-up; verify default and hover theme values without opening a duplicate.

## Issue 6110

[Original issue](https://github.com/uswds/uswds/issues/6110)

Result: Partial reproduction.

Attempt: Attached native input/change/blur listeners before USWDS date-picker enhancement, then filled and blurred the visible cloned input.

Environment: {"os": "darwin", "browser": "Chromium", "browserVersion": "147.0.7727.15", "baseline": "eaef39533a0a0f78976d6888edf8ae56fe9334d6", "sourceNote": "Clean baseline worktree with unrelated shadow() Sass fix; compiled library CSS byte-identical to baseline."}

Observed: Structured observations:

```json
{
  "originalHidden": "true",
  "sameNode": false,
  "originalValue": "2026-03-02",
  "visibleValue": "03/02/2026",
  "originalEvents": [
    {
      "type": "change",
      "value": "2026-03-02"
    }
  ]
}
```

Limit: Confirmed underlying native DOM event behavior; Angular reactive-form runtime was not installed or executed.

Next: Add focused Angular reproduction and agree event contract before modifying input replacement.

## Issue 6091

[Original issue](https://github.com/uswds/uswds/issues/6091)

Result: Reproduced; fix remains open.

Attempt: Measure a standalone default usa-button--unstyled at a 1280-pixel viewport with loaded source fonts.

Environment: Isolated export of origin/develop at eaef39533a0a0f78976d6888edf8ae56fe9334d6; macOS 26.6.2 arm64; Headless Chromium 147.0.0.0 through isolated agent-browser session uswds-shard0-repro; source-built Sass and JavaScript; bundled Source Sans Pro fonts loaded.

Observed: The clickable button measures 112.65625 by 15.25 CSS pixels with zero padding, confirming the reported approximately 15-pixel height.

Limit: The issue asks for a target-size assessment. This box measurement does not evaluate surrounding target spacing or inline exceptions and does not independently establish conformance failure.

Next: Retain the component/design task. Specify standalone versus inline behavior and test hit-area expansion plus layout compatibility.

## Issue 6080

[Original issue](https://github.com/uswds/uswds/issues/6080)

Result: Reproduced; fix remains open.

Attempt: Submitted a form with a required radio group and no selection, then recorded invalid events, active-element geometry, validationMessage, and screenshot.

Environment: Current develop baseline eaef39533a0a0f78976d6888edf8ae56fe9334d6; compiled USWDS CSS and JavaScript; Codex in-app Chromium on macOS; 1280x720 viewport.

Observed: The browser blocks submission, fires invalid events, and focuses a native radio positioned at x=-16943px. validationMessage contains Please select one of these options. No visible native validation message appears in the captured form.

Limit: A screenshot alone may omit browser-native UI, but the focused invalid control is independently measured offscreen. Cross-browser validation behavior still needs checking.

Next: Coordinate with #6068 and design one solution for custom radio and checkbox invalid targets. Do not close as a duplicate before scope is agreed.

## Issue 6075

[Original issue](https://github.com/uswds/uswds/issues/6075)

Result: Partial reproduction.

Attempt: Rendered two-language selector and inspected the exposed button name.

Environment: {"os": "darwin", "browser": "Chromium", "browserVersion": "147.0.7727.15", "baseline": "eaef39533a0a0f78976d6888edf8ae56fe9334d6", "sourceNote": "Clean baseline worktree with unrelated shadow() Sass fix; compiled library CSS byte-identical to baseline."}

Observed: Structured observations:

```json
{
  "buttonMarkup": "<button type=\"button\" class=\"usa-button\" role=\"button\">\n    <span lang=\"es\" xml:lang=\"es\">Espa\u00f1ol</span>\n  </button>",
  "accessibilitySnapshot": "- button \"Espa\u00f1ol\""
}
```

Limit: Accessible name is measurable; confusion after a real language change requires a working multilingual site and screen-reader/user testing.

Next: Test action wording with a real language transition and compare concise visible and accessible labels.

## Issue 6072

[Original issue](https://github.com/uswds/uswds/issues/6072)

Result: Named platform or environment needed.

Attempt: Opened a date picker placed low on a long page and recorded popup geometry, focus and day/header button colors using current desktop Chromium.

Environment: Current develop baseline eaef39533a0a0f78976d6888edf8ae56fe9334d6; compiled USWDS CSS and JavaScript; Codex in-app Chromium on macOS; 1280x720 viewport.

Observed: The desktop browser scrolls the selected day into view. The popup fits inside the viewport and normal header buttons compute to black. This control does not reproduce the two reported iOS symptoms.

Limit: A real iOS Safari device, mobile browser chrome and software keyboard were not available in this harness. Desktop behavior is not evidence that the iOS report is fixed.

Next: Test popup positioning and default button colors separately on current real iOS Safari near both viewport edges.

## Issue 6069

[Original issue](https://github.com/uswds/uswds/issues/6069)

Result: Reproduced; fix remains open.

Attempt: Opened the date picker inside the reported 3/9 grid with grid-gap-4 in an 800px content container at a wide viewport. Measured month/year and weekday-row rectangles, then read existing PR feedback and its resize-listener code.

Environment: Baseline eaef39533a0a0f78976d6888edf8ae56fe9334d6; compiled baseline JavaScript and CSS; Codex in-app Chromium on macOS at 1280x720 unless otherwise specified.

Observed: The calendar is only 164px wide despite the 1280px viewport. The year button wraps below the month and extends to y=335.27, overlapping the weekday row beginning at y=306.48. The screenshot also shows the malformed header.

Limit: One representative narrow parent was tested, not the complete container-width matrix. The existing proposed fix was reviewed but not applied.

Next: Continue #6388 review. Resolve the repeatedly added resize listener and the existing CSS-container-query question before merging; do not start competing work.

## Issue 6068

[Original issue](https://github.com/uswds/uswds/issues/6068)

Result: Named platform or environment needed.

Attempt: Rendered current checkbox component and inspected native input placement relative to its visible label.

Environment: {"os": "darwin", "browser": "Chromium", "browserVersion": "147.0.7727.15", "baseline": "eaef39533a0a0f78976d6888edf8ae56fe9334d6", "sourceNote": "Clean baseline worktree with unrelated shadow() Sass fix; compiled library CSS byte-identical to baseline."}

Observed: Structured observations:

```json
[
  {
    "id": "check-historical-truth",
    "left": "-16943px",
    "opacity": "1",
    "bounds": {
      "x": -16943.03125,
      "y": 22.03125,
      "width": 13,
      "height": 13,
      "top": 22.03125,
      "right": -16930.03125,
      "bottom": 35.03125,
      "left": -16943.03125
    },
    "labelBounds": {
      "x": 0,
      "y": 34.03125,
      "width": 144.03125,
      "height": 22.03125,
      "top": 34.03125,
      "right": 144.03125,
      "bottom": 56.0625,
      "left": 0
    }
  },
  {
    "id": "check-historical-douglass",
    "left": "-16943px",
    "opacity": "1",
    "bounds": {
      "x": -16943.03125,
      "y": 56.0625,
      "width": 13,
      "height": 13,
      "top": 56.0625,
      "right": -16930.03125,
      "bottom": 69.0625,
      "left": -16943.03125
    },
    "labelBounds": {
      "x": 0,
      "y": 68.0625,
      "width": 165.984375,
      "height": 22.03125,
      "top": 68.0625,
      "right": 165.984375,
      "bottom": 90.09375,
      "left": 0
    }
  },
  {
    "id": "check-historical-washington",
    "left": "-16943px",
    "opacity": "1",
    "bounds": {
      "x": -16943.03125,
      "y": 90.09375,
      "width": 13,
      "height": 13,
      "top": 90.09375,
      "right": -16930.03125,
      "bottom": 103.09375,
      "left": -16943.03125
    },
    "labelBounds": {
      "x": 0,
      "y": 102.09375,
      "width": 184.859375,
      "height": 22.03125,
      "top": 102.09375,
      "right": 184.859375,
      "bottom": 124.125,
      "left": 0
    }
  },
  {
    "id": "check-historical-carver",
    "left": "-16943px",
    "opacity": "1",
    "bounds": {
      "x": -16943.03125,
      "y": 124.125,
      "width": 13,
      "height": 13,
      "top": 124.125,
      "right": -16930.03125,
      "bottom": 137.125,
      "left": -16943.03125
    },
    "labelBounds": {
      "x": 0,
      "y": 136.125,
      "width": 219.78125,
      "height": 22.03125,
      "top": 136.125,
      "right": 219.78125,
      "bottom": 158.15625,
      "left": 0
    }
  }
]
```

Limit: Dragon on Windows and physical Voice Control command input are unavailable in this headless browser environment. DOM placement alone does not prove speech interaction failure.

Next: Retest actual assistive technology with visible native-input prototype; keep distinct regression scenarios.

## Issue 6056

[Original issue](https://github.com/uswds/uswds/issues/6056)

Result: Reproduced; fix remains open.

Attempt: Open matched modal fixtures with no hidden control, type=hidden before the first visible input, or a hidden-attribute input. Focus Close and press a real Tab.

Environment: develop eaef39533a0a0f78976d6888edf8ae56fe9334d6; macOS; Node v24.19.0. Tested source files are unchanged from baseline. Unrelated checkbox styles and story tests are present in the isolated worktree. Chromium 147.0.7727.15.

Observed: Control wraps from Close to feedback. Both hidden-input variants remain stuck on Close.

Limit: Physical screen reader testing and the broader dynamic-control matrix were not repeated here.

Next: Validate and merge existing combined focus PR #6796 after required accessibility verification.

## Issue 5981

[Original issue](https://github.com/uswds/uswds/issues/5981)

Result: Reproduced; fix remains open.

Attempt: Rendered freshly generated default pagination with built CSS at a 320px viewport and measured navigation boundaries.

Environment: {"os": "darwin", "browser": "Chromium", "browserVersion": "147.0.7727.15", "baseline": "eaef39533a0a0f78976d6888edf8ae56fe9334d6", "sourceNote": "Clean baseline worktree with unrelated shadow() Sass fix; compiled library CSS byte-identical to baseline."}

Observed: Structured observations:

```json
{
  "viewport": 320,
  "documentWidth": 328,
  "list": {
    "x": -8,
    "y": 16,
    "width": 336,
    "height": 40,
    "top": 16,
    "right": 328,
    "bottom": 56,
    "left": -8
  },
  "arrows": [
    {
      "text": "\n      \n          \n        \n        Previous\n    ",
      "rect": {
        "x": 0,
        "y": 0,
        "width": 0,
        "height": 0,
        "top": 0,
        "right": 0,
        "bottom": 0,
        "left": 0
      }
    },
    {
      "text": "\n      Next \n          \n    ",
      "rect": {
        "x": 0,
        "y": 0,
        "width": 0,
        "height": 0,
        "top": 0,
        "right": 0,
        "bottom": 0,
        "left": 0
      }
    }
  ],
  "finding": "Pagination list extends from -8px to 328px in a 320px viewport. The screenshot confirms the first and last numbered buttons lose their outer edges. Previous/Next arrow items are intentionally hidden at this width."
}
```

Limit: 320px CSS viewport verified; actual browser 400% zoom was not performed.

Next: Fix layout while preserving target sizes and verify true browser zoom.

## Issue 5976

[Original issue](https://github.com/uswds/uswds/issues/5976)

Result: Named platform or environment needed.

Attempt: Inspect available platform and browser automation capabilities for the Safari-only identifier focus report.

Environment: Isolated export of origin/develop at eaef39533a0a0f78976d6888edf8ae56fe9334d6; macOS 26.6.2 arm64; Headless Chromium 147.0.0.0 through isolated agent-browser session uswds-shard0-repro; source-built Sass and JavaScript; bundled Source Sans Pro fonts loaded.

Observed: Safari 26.6.2 is installed. The isolated tested browser automation route provides Chromium; no supported live Safari automation session was available for this sweep.

Limit: No actual Safari focus/reflow test was performed. Chromium results would not answer a Safari-only report, and system remote automation settings were not changed.

Next: Test current Safari on macOS with keyboard navigation through identifier links at the reported widths, capturing element positions before and after focus.

## Issue 5936

[Original issue](https://github.com/uswds/uswds/issues/5936)

Result: Fix proposed: [#6942](https://github.com/uswds/uswds/pull/6942) (partial scope).

Attempt: Added regression cases for error and success classes at document-level and component-level initialization, ran them on unchanged baseline, then tested the focused fix.

Environment: Current develop baseline eaef39533a0a0f78976d6888edf8ae56fe9334d6; compiled USWDS CSS and JavaScript; Codex in-app Chromium on macOS; 1280x720 viewport.

Observed: Four new assertions fail on baseline because the generated input drops the validation-state classes. The focused change preserves usa-input--error and usa-input--success. Six new tests pass after the fix; custom/select classes remain unchanged.

Limit: This change handles initial validation classes only. The broader request to transfer arbitrary caller classes remains open.

Next: Review PR #6942 for initial error and success styling. Decide broader custom-class propagation before closing #5936.

## Issue 5934

[Original issue](https://github.com/uswds/uswds/issues/5934)

Result: Reproduced; fix remains open.

Attempt: Compile uswds-utilities with output-these-utilities set to an empty list and parse emitted CSS rules.

Environment: Baseline eaef39533a0a0f78976d6888edf8ae56fe9334d6; macOS 26.6.2; source Sass compilation with sass-embedded; browser cases run in desktop Chrome through the Browser plugin at 1280x700.

Observed: Twenty aspect-ratio rule selectors are still generated even though no utilities were requested.

Limit: The total CSS byte count includes comments, so the reproduction uses actual parsed selectors as its evidence.

Next: Finish PR #5699 with utility-output coverage for default, empty, included, and excluded settings.

## Issue 5931

[Original issue](https://github.com/uswds/uswds/issues/5931)

Result: Failure path reproduced by injection.

Attempt: Loaded the current public site plugin and injected a local HTTP 403 exception into its fetch step. No GitHub API rate-limit exhaustion or external writes occurred.

Environment: {"runtime": "ruby 3.3.12 (2026-07-16 revision 0581089df9) [arm64-darwin23]", "source": "https://github.com/uswds/uswds-site/blob/main/_plugins/jekyll_get.rb", "source_sha256": "fa2c60788a738725f81a9671dba23762feda6d8d769a851c2f04fc3ea88e4b7d"}

Observed: Structured observations:

```json
{
  "request_url_with_fake_token": "https://api.github.com/repos/uswds/uswds/releases?access_token=fixture-token-not-a-secret",
  "returned_without_error": true,
  "releases_data_present": false,
  "log": "jekyll_get: error fetching https://api.github.com/repos/uswds/uswds/releases: 403 rate limit exceeded (injected fixture)\n"
}
```

Limit: The missing-data error path is reproduced with an injected 403. An intermittent failure in a live Pages build was not triggered; current production health alone is not proof of resolution.

Next: Use current GitHub header authentication and make release-data failure visible or use a validated cache; test recovery and missing-cache cases in the site repository.

## Issue 5913

[Original issue](https://github.com/uswds/uswds/issues/5913)

Result: Fix proposed: [#6948](https://github.com/uswds/uswds/pull/6948) (partial scope).

Attempt: Root agent independently compiled the reported table-header text-token expression with both import and use syntax, plus explicit-token and normal-table controls.

Environment: Current baseline eaef39533a0a0f78976d6888edf8ae56fe9334d6; root-agent Sass compilation in backlog-select-shadow-root worktree.

Observed: Both reported expressions fail with Undefined variable at $project-color-shortcodes in color(). An explicit ink token and normal table component compile successfully.

Limit: This row incorporates the independent root-agent evidence rather than rerunning its test. The default false token and helper error path need separate assessment.

Next: Review PR #6948 for the compiler diagnostic. The broader table-token usage question remains; default is not a standalone color token.

## Issue 5905

[Original issue](https://github.com/uswds/uswds/issues/5905)

Result: Partial reproduction.

Attempt: Inspected an initialized current time picker and the generated clear-button accessible label. Read the merged verbose-instruction removal, its JAWS/NVDA review, and the remaining wording PR.

Environment: Baseline eaef39533a0a0f78976d6888edf8ae56fe9334d6; compiled baseline JavaScript and CSS; Codex in-app Chromium on macOS at 1280x720 unless otherwise specified.

Observed: The old When autocomplete results are available hint is absent. The time picker still uses the clear-button label Clear the select contents. Thus the original broad report is partially resolved but the wording part persists.

Limit: Current live JAWS/NVDA speech and usability testing were not performed. The merged PR includes historical screen-reader review evidence, which is distinct from this current DOM check.

Next: Retain the remaining #6151/#6528 work and assess #6389 with the requested usability review. Do not close the whole report based only on the already removed verbose hint.

## Issue 5883

[Original issue](https://github.com/uswds/uswds/issues/5883)

Result: Reproduced; fix remains open.

Attempt: Rendered the exact reported form/button-group structure beside an equivalent group outside the form and compared browser geometry. Read the existing form-spacing PR and tests.

Environment: Baseline eaef39533a0a0f78976d6888edf8ae56fe9334d6; compiled baseline JavaScript and CSS; Codex in-app Chromium on macOS at 1280x720 unless otherwise specified.

Observed: Inside usa-form both buttons are 63.25px tall with 24px top margin; the outside-form control is 39.25px tall with zero top margin. Text line-height and vertical padding are identical, confirming stretching from the form/group combination.

Limit: Desktop width tested. The existing PR needs review of mixed forms containing both grouped and standalone buttons, because its :not(:has(.usa-button-group)) condition is at form level.

Next: Review #6691 using mixed grouped/standalone and narrow-width controls. Its patch applies cleanly; avoid duplicating the submitted fix.

## Issue 5873

[Original issue](https://github.com/uswds/uswds/issues/5873)

Result: Partial reproduction.

Attempt: Open current Character Count story. Enter three characters, then 26 for a 25-character maximum. Inspect visible counts, hidden original instructions and live-region text.

Environment: develop eaef39533a0a0f78976d6888edf8ae56fe9334d6; macOS; Node v24.19.0. Tested source files are unchanged from baseline. Unrelated checkbox styles and story tests are present in the isolated worktree. Chromium 147.0.7727.15.

Observed: Visible maximum becomes 22 characters left, then 1 character over limit. Original 25-character instruction remains offscreen and aria-describedby still references it. The new live region says Character limit exceeded plus the overage, not the maximum.

Limit: Persistent visible-limit requirement reproduced. No physical screen reader announcement or WCAG conformance conclusion is claimed.

Next: Keep visible instruction requirement open; merged PR #6767 improves announcements but does not satisfy that requirement.

## Issue 5858

[Original issue](https://github.com/uswds/uswds/issues/5858)

Result: Reproduced; fix remains open.

Attempt: Opened a modal containing a required four-digit field, entered 12, and clicked its submit button carrying data-close-modal. Recorded validity, events and modal visibility.

Environment: Current develop baseline eaef39533a0a0f78976d6888edf8ae56fe9334d6; compiled USWDS CSS and JavaScript; Codex in-app Chromium on macOS; 1280x720 viewport.

Observed: The field is invalid and the browser emits invalid without submit. Nevertheless the modal closes, aria-hidden becomes true, and focus returns to the opener.

Limit: The fixture uses valid modal labels and current generated markup. This does not assess every application form integration.

Next: Check the existing modal refactor PR #6299, then prevent invalid form submission from closing the modal or establish a supported integration contract.

## Issue 5834

[Original issue](https://github.com/uswds/uswds/issues/5834)

Result: Partial reproduction.

Attempt: Filled current native search input, inspected accessible controls, tabbed forward, and tested Escape clearing.

Environment: {"os": "darwin", "browser": "Chromium", "browserVersion": "147.0.7727.15", "baseline": "eaef39533a0a0f78976d6888edf8ae56fe9334d6", "sourceNote": "Clean baseline worktree with unrelated shadow() Sass fix; compiled library CSS byte-identical to baseline."}

Observed: Structured observations:

```json
{
  "accessibilitySnapshot": "- search:\n  - text: Search\n  - searchbox \"Search\": example search\n  - button \"Search\"",
  "nextFocus": {
    "tag": "BUTTON",
    "type": "submit",
    "text": "\n      Search \n    "
  },
  "afterEscape": ""
}
```

Limit: Only Chromium was exercised; Firefox absence and other native-browser behavior remain unverified. Equivalent clearing exists; this does not independently establish a WCAG violation.

Next: Review with #5277 and test Chromium, Firefox, Safari before choosing a browser workaround.

## Issue 5830

[Original issue](https://github.com/uswds/uswds/issues/5830)

Result: Reproduced; fix remains open.

Attempt: Activate the current focus trap around one Add button, add another button after initialization, then press real Tab in Chrome.

Environment: Baseline eaef39533a0a0f78976d6888edf8ae56fe9334d6; macOS 26.6.2; source Sass compilation with sass-embedded; browser cases run in desktop Chrome through the Browser plugin at 1280x700.

Observed: Focus stays on Add button and skips Added button 1. A separate jsdom event check confirms Tab is prevented using the cached original tab stop.

Limit: The browser fixture isolates the shared focus-trap utility; existing PR #6796 already has broader modal/Storybook cases and requires its named assistive technology verification.

Next: Continue consolidated PR #6796, which preserves contributor work from 6262. Keep both linked issues open until the combined change passes its remaining review and merges.

## Issue 5828

[Original issue](https://github.com/uswds/uswds/issues/5828)

Result: Named platform or environment needed.

Attempt: Review the full report, later NVDA retest comments, and local screen-reader environment.

Environment: Isolated export of origin/develop at eaef39533a0a0f78976d6888edf8ae56fe9334d6; macOS 26.6.2 arm64; Headless Chromium 147.0.0.0 through isolated agent-browser session uswds-shard0-repro; source-built Sass and JavaScript; bundled Source Sans Pro fonts loaded.

Observed: The report now points to JAWS-specific behavior after maintainers found NVDA working. JAWS and NVDA are unavailable on the macOS host.

Limit: No Windows screen-reader keyboard navigation test was possible. Standard browser scrolling cannot reproduce JAWS virtual-cursor behavior.

Next: Retest current JAWS with scrollable tables, compare native scrolling and upstream FreedomScientific/standards-support#607, and preserve the issue until that evidence is recorded.

## Issue 5827

[Original issue](https://github.com/uswds/uswds/issues/5827)

Result: Reproduced; fix remains open.

Attempt: Typed a complete SSN, moved caret to offset 5, then pressed Backspace through the browser keyboard.

Environment: {"os": "darwin", "browser": "Chromium", "browserVersion": "147.0.7727.15", "baseline": "eaef39533a0a0f78976d6888edf8ae56fe9334d6", "sourceNote": "Clean baseline worktree with unrelated shadow() Sass fix; compiled library CSS byte-identical to baseline."}

Observed: Structured observations:

```json
{
  "before": {
    "value": "123 45 6789",
    "start": 5,
    "end": 5
  },
  "after": {
    "value": "123 56 789",
    "start": 10,
    "end": 10
  }
}
```

Limit: Chromium SSN variant only; other masks and browsers still need coverage.

Next: Preserve logical caret/selection during formatting, with delete/replace and punctuation tests.

## Issue 5816

[Original issue](https://github.com/uswds/uswds/issues/5816)

Result: Closed: fixed.

Attempt: Compile the baseline source and render a default table with caption, header, and data cell. Compare computed typography.

Environment: Isolated export of origin/develop at eaef39533a0a0f78976d6888edf8ae56fe9334d6; macOS 26.6.2 arm64; Headless Chromium 147.0.0.0 through isolated agent-browser session uswds-shard0-repro; source-built Sass and JavaScript; bundled Source Sans Pro fonts loaded.

Observed: Caption, table, and data cell all use 16.96px font size and 25.44px line height. The historical smaller-caption mismatch is absent.

Limit: This verifies the default theme path, not every custom typography setting. Prior linked-work review confirmed merged PR #6798 added caption normalization.

Next: Closed as completed using merged PR #6798 and current-baseline typography evidence. Verify release inclusion through the normal release process.

## Issue 5787

[Original issue](https://github.com/uswds/uswds/issues/5787)

Result: Named platform or environment needed.

Attempt: Selected Apple in the combo box and 12:30am in the time picker, then recorded the active element after pointer selection.

Environment: Current develop baseline eaef39533a0a0f78976d6888edf8ae56fe9334d6; compiled USWDS CSS and JavaScript; Codex in-app Chromium on macOS; 1280x720 viewport.

Observed: Both controls return focus to their generated text input after selection, consistent with a mechanism that could keep a mobile keyboard open. Desktop values update correctly.

Limit: The reported real mobile software keyboard was not exercised. Desktop focus alone does not reproduce keyboard persistence or establish the correct mobile accessibility behavior.

Next: Verify selection and software keyboard behavior on current real iOS and Android devices, including screen-reader use, before changing focus policy.

## Issue 5755

[Original issue](https://github.com/uswds/uswds/issues/5755)

Result: Fix proposed: [#6943](https://github.com/uswds/uswds/pull/6943).

Attempt: Compile documented public shadow() helper for valid and invalid token cases.

Environment: Baselineeaef3953, Node24 and sass-embedded.

Observed: Helper absent before fix;14 baseline-failing cases pass after addition; generated USWDS CSS byte-identical.

Limit: Public API restoration does not change generated default styles.

Next: Review PR #6943 and include the restored documented helper in release notes.

## Issue 5748

[Original issue](https://github.com/uswds/uswds/issues/5748)

Result: Related failure reproduced.

Attempt: Typed into the exact minimal input-mask markup without an id, then repeated with a unique id as the control.

Environment: Current develop baseline eaef39533a0a0f78976d6888edf8ae56fe9334d6; compiled USWDS CSS and JavaScript; Codex in-app Chromium on macOS; 1280x720 viewport.

Observed: The no-id case throws Cannot set properties of null (setting textContent). The generated mask identifier and subsequent lookup disagree when getAttribute(id) returns null. The same control with an id does not throw.

Limit: The current error differs from the original undefined-placeholder Angular stack trace. This confirms a defect in the supplied minimal markup but does not prove the original Angular initialization path.

Next: Address or document the missing-id contract and obtain a minimal Angular initialization example to reproduce the original stack trace.

## Issue 5691

[Original issue](https://github.com/uswds/uswds/issues/5691)

Result: Reproduced; fix remains open.

Attempt: Initialize a date range and a separate date with default values. Clear visible inputs with value="" without an input event, then open each calendar.

Environment: Isolated export of origin/develop at eaef39533a0a0f78976d6888edf8ae56fe9334d6; macOS 26.6.2 arm64; Headless Chromium 147.0.0.0 through isolated agent-browser session uswds-shard0-repro; source-built Sass and JavaScript; bundled Source Sans Pro fonts loaded.

Observed: Visible inputs become empty while internal values retain 2026-09-01, 2026-09-15, and 2026-09-10. The standalone calendar still selects September 10. The range calendar still selects September 1 and highlights September 2 through 14, ending on September 15.

Limit: Direct .value assignment matches jQuery .val("") without an event. This finding does not imply that browser input events fire for programmatic assignments. API expectations still need a documented decision.

Next: Define a supported clear/reset method or synchronize when reopening. Preserve both selected-date and range-highlight acceptance criteria when linking #6329 and #6110.

## Issue 5646

[Original issue](https://github.com/uswds/uswds/issues/5646)

Result: Reproduced; fix remains open.

Attempt: Rendered current extended header at desktop width; captured actual keyboard Tab sequence and visual group bounds.

Environment: {"os": "darwin", "browser": "Chromium", "browserVersion": "147.0.7727.15", "baseline": "eaef39533a0a0f78976d6888edf8ae56fe9334d6", "sourceNote": "Clean baseline worktree with unrelated shadow() Sass fix; compiled library CSS byte-identical to baseline."}

Observed: Structured observations:

```json
{
  "focus": [
    {
      "tag": "A",
      "text": "<Project title>",
      "group": "other",
      "rect": {
        "x": 160,
        "y": 29,
        "width": 213.921875,
        "height": 43,
        "top": 29,
        "right": 373.921875,
        "bottom": 72,
        "left": 160
      }
    },
    {
      "tag": "BUTTON",
      "text": "<Current section>",
      "group": "primary",
      "rect": {
        "x": 144,
        "y": 94.484375,
        "width": 164.953125,
        "height": 45.375,
        "top": 94.484375,
        "right": 308.953125,
        "bottom": 139.859375,
        "left": 144
      }
    },
    {
      "tag": "BUTTON",
      "text": "<Section>",
      "group": "primary",
      "rect": {
        "x": 308.953125,
        "y": 94.484375,
        "width": 113.078125,
        "height": 45.375,
        "top": 94.484375,
        "right": 422.03125,
        "bottom": 139.859375,
        "left": 308.953125
      }
    },
    {
      "tag": "A",
      "text": "<Simple link>",
      "group": "primary",
      "rect": {
        "x": 422.03125,
        "y": 94.484375,
        "width": 121.34375,
        "height": 45.375,
        "top": 94.484375,
        "right": 543.375,
        "bottom": 139.859375,
        "left": 422.03125
      }
    },
    {
      "tag": "INPUT",
      "text": "",
      "group": "secondary",
      "rect": {
        "x": 903,
        "y": 43.859375,
        "width": 169,
        "height": 32,
        "top": 43.859375,
        "right": 1072,
        "bottom": 75.859375,
        "left": 903
      }
    },
    {
      "tag": "BUTTON",
      "text": "",
      "group": "secondary",
      "rect": {
        "x": 1072,
        "y": 43.859375,
        "width": 48,
        "height": 32,
        "top": 43.859375,
        "right": 1120,
        "bottom": 75.859375,
        "left": 1072
      }
    },
    {
      "tag": "BODY",
      "text": "<Project title>\n    \n    Menu\n  \n  \n    \n      \n        \n      \n      \n        \n          \n            <Current section>\n          \n          \n            \n              <Navigation link>\n            \n            \n              <Navigation link>\n            \n            \n              <Navigation link>\n            \n            \n              <Navigation link>\n            \n          \n        \n        \n          \n            <Section>\n          \n          \n            \n              <Navigation link>\n            \n            \n              <Navigation link>\n            \n            \n              <Navigation link>\n            \n          \n        \n        \n          <Simple link>\n        \n      \n      \n        \n        \n          \n            Search",
      "group": "other",
      "rect": {
        "x": 0,
        "y": 0,
        "width": 1280,
        "height": 139.859375,
        "top": 0,
        "right": 1280,
        "bottom": 139.859375,
        "left": 0
      }
    },
    {
      "tag": "A",
      "text": "<Project title>",
      "group": "other",
      "rect": {
        "x": 160,
        "y": 29,
        "width": 213.921875,
        "height": 43,
        "top": 29,
        "right": 373.921875,
        "bottom": 72,
        "left": 160
      }
    },
    {
      "tag": "BUTTON",
      "text": "<Current section>",
      "group": "primary",
      "rect": {
        "x": 144,
        "y": 94.484375,
        "width": 164.953125,
        "height": 45.375,
        "top": 94.484375,
        "right": 308.953125,
        "bottom": 139.859375,
        "left": 144
      }
    },
    {
      "tag": "BUTTON",
      "text": "<Section>",
      "group": "primary",
      "rect": {
        "x": 308.953125,
        "y": 94.484375,
        "width": 113.078125,
        "height": 45.375,
        "top": 94.484375,
        "right": 422.03125,
        "bottom": 139.859375,
        "left": 308.953125
      }
    },
    {
      "tag": "A",
      "text": "<Simple link>",
      "group": "primary",
      "rect": {
        "x": 422.03125,
        "y": 94.484375,
        "width": 121.34375,
        "height": 45.375,
        "top": 94.484375,
        "right": 543.375,
        "bottom": 139.859375,
        "left": 422.03125
      }
    },
    {
      "tag": "INPUT",
      "text": "",
      "group": "secondary",
      "rect": {
        "x": 903,
        "y": 43.859375,
        "width": 169,
        "height": 32,
        "top": 43.859375,
        "right": 1072,
        "bottom": 75.859375,
        "left": 903
      }
    }
  ],
  "groups": {
    "primary": {
      "x": 144,
      "y": 94.484375,
      "width": 960,
      "height": 45.375,
      "top": 94.484375,
      "right": 1104,
      "bottom": 139.859375,
      "left": 144
    },
    "secondary": {
      "x": 872.328125,
      "y": 31.859375,
      "width": 247.671875,
      "height": 44,
      "top": 31.859375,
      "right": 1120,
      "bottom": 75.859375,
      "left": 872.328125
    }
  }
}
```

Limit: Desktop keyboard order verified; mobile order and whether an alternate semantic reading sequence is appropriate still need review.

Next: Align focus and visual order while reviewing mobile navigation consequences.

## Issue 5503

[Original issue](https://github.com/uswds/uswds/issues/5503)

Result: Named platform or environment needed.

Attempt: Opened the current date picker and recorded its status instructions, weekday-header accessible markup and date-button labels. Read all five reported touch-navigation concerns and the existing PR limitations.

Environment: Baseline eaef39533a0a0f78976d6888edf8ae56fe9334d6; compiled baseline JavaScript and CSS; Codex in-app Chromium on macOS at 1280x720 unless otherwise specified.

Observed: The open status still contains keyboard arrow/Page Up/Page Down instructions. Headers visibly show one-letter weekdays with full aria-labels, and date button labels repeat the weekday. These are the current DOM inputs to the reported VoiceOver behavior.

Limit: Actual iOS Safari VoiceOver swipe, rotor, speech and keypad behavior were not exercised. Markup observations cannot prove the specific spoken output. Existing PR checklist still contains device checks, although a review thanks its author for VoiceOver testing.

Next: Test #6758 on real iOS VoiceOver. Track remaining header navigation, rotor expectations and keypad requests separately from its touch-hint and weekday-readout scope.

## Issue 5463

[Original issue](https://github.com/uswds/uswds/issues/5463)

Result: Reproduced; fix remains open.

Attempt: Render the current breadcrumb Twig at 320 by 768 CSS pixels. Start on a preceding button and press Tab four times.

Environment: Isolated export of origin/develop at eaef39533a0a0f78976d6888edf8ae56fe9334d6; macOS 26.6.2 arm64; Headless Chromium 147.0.0.0 through isolated agent-browser session uswds-shard0-repro; source-built Sass and JavaScript; bundled Source Sans Pro fonts loaded.

Observed: Home and Federal Contracting receive focus with x=-16943.03 pixels, outside the viewport. The next parent breadcrumb and following button are visible. The focused hidden links retain an outline that is offscreen.

Limit: This directly confirms the 320-pixel branch. Desktop browser zoom and screen-reader behavior were not tested. Existing wrapping changes for #6689 do not remove this narrow-viewport focus problem.

Next: Implement and review a narrow-viewport focus treatment with keyboard regression coverage and accessibility review of whether hidden ancestry should remain available to screen readers.

## Issue 5375

[Original issue](https://github.com/uswds/uswds/issues/5375)

Result: Reproduced; fix remains open.

Attempt: Initialized an outer table, inserted a nested sortable table, initialized the nested table separately, and counted aria-sort mutations and row ordering across two clicks. Compared document-level initialization.

Environment: Node 24 with jsdom; table module at baseline eaef39533a0a0f78976d6888edf8ae56fe9334d6, loaded from fix-combo-box-error-state worktree (only unrelated combo-box code differs).

Observed: Per-table initialization invokes sorting twice per click, causing two aria-sort mutations and leaving descending order after both clicks. Document-level initialization changes direction once per click as expected.

Limit: This is an automated DOM/event reproduction in jsdom rather than a visual browser test. The table module is unchanged from baseline.

Next: Add event ownership or idempotent delegation without breaking supported document-level and per-table initialization; preserve the control cases in regression tests.

## Issue 5294

[Original issue](https://github.com/uswds/uswds/issues/5294)

Result: Named platform or environment needed.

Attempt: Read current step-indicator template/styles and existing PR #5345 plus the full issue conversation.

Environment: Baseline eaef39533a0a0f78976d6888edf8ae56fe9334d6; macOS 26.6.2; source Sass compilation with sass-embedded; browser cases run in desktop Chrome through the Browser plugin at 1280x700.

Observed: The baseline ordered list omits an explicit list role and styles use list-style:none. PR #5345 adds explicit roles and associates the progress heading for reading order.

Limit: No live VoiceOver+Safari or JAWS speech test was performed. DOM source alone cannot establish the actual announcement failure or validate the fix.

Next: Perform named screen-reader/browser verification on PR #5345 for list semantics and heading/step reading order before merge.

## Issue 5291

[Original issue](https://github.com/uswds/uswds/issues/5291)

Result: Named platform or environment needed.

Attempt: Review the complete intermittent JAWS/Chrome focus report and inspect available test environment.

Environment: Isolated export of origin/develop at eaef39533a0a0f78976d6888edf8ae56fe9334d6; macOS 26.6.2 arm64; Headless Chromium 147.0.0.0 through isolated agent-browser session uswds-shard0-repro; source-built Sass and JavaScript; bundled Source Sans Pro fonts loaded.

Observed: The required Windows JAWS plus Chrome browser-chrome interaction is unavailable on this macOS Chromium automation host.

Limit: Headless Chromium cannot validate focus moving to the desktop Chrome Update menu or JAWS interception of Alt+Arrow keys.

Next: Retest on Windows with current JAWS and Chrome, recording browser UI focus and exact key sequence over multiple trials. Do not dismiss as not a bug without this environment.

## Issue 5194

[Original issue](https://github.com/uswds/uswds/issues/5194)

Result: Fix proposed: [#6947](https://github.com/uswds/uswds/pull/6947).

Attempt: Compile two source stylesheets differing only in @use order of usa-banner and usa-accordion. Compare collapsed and expanded banners at 1280 by 900.

Environment: Isolated export of origin/develop at eaef39533a0a0f78976d6888edf8ae56fe9334d6; macOS 26.6.2 arm64; Headless Chromium 147.0.0.0 through isolated agent-browser session uswds-shard0-repro; source-built Sass and JavaScript; bundled Source Sans Pro fonts loaded.

Observed: Banner-first produces a 992px-wide button with add.svg, 16px 20px 16px 56px padding, and 46.0625px height. Accordion-first produces the expected 113.125px-wide button with no background image, no padding, and 14.0625px height. Expanded content padding also differs.

Limit: This tests the two supported Sass entrypoints in a single compile, matching the minimal issue reproduction. Separately compiled CSS chunks may need additional coverage for a fix.

Next: Review PR #6947, including the specificity impact on downstream custom CSS.
