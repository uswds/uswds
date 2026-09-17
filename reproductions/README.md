# Confirmed USWDS issue observations

Baseline: `eaef39533a0a0f78976d6888edf8ae56fe9334d6`, September 17, 2026. These findings record reproduction scope and limitations. They do not imply a release has fixed the issues.

## Issue #6372

[Issue](https://github.com/uswds/uswds/issues/6372)

Attempt: Use the supplied radio-label tooltip markup on the baseline. Click both tooltip and control radio labels.

Result: reproducible. Both input.checked values become true in independent control groups. The tooltip radio remains visually empty: its pseudo-element stays white with a dark border, while the control gets the blue selected style. Tooltip initialization inserts a span between the input and its label.

Limit: The synthetic fixture uses independent groups so both selected appearances can be compared. This does not validate all tooltip or checkbox label combinations.

Next: Coordinate with existing tooltip label work #6035 and #5274 before opening a new implementation PR. Add radio selection and keyboard focus regressions.

## Issue #6329

[Issue](https://github.com/uswds/uswds/issues/6329)

Attempt: Install the issue-provided mutual clearing listeners before date-picker initialization, initialize four inputs, enter a system end date, and blur.

Result: reproducible. The listeners run on retained original input elements, now hidden internal inputs without IDs. Both internal user-date values are cleared, but the visible external inputs still display 09/01/2026 and 09/15/2026.

Limit: This reproduces the before-initialization reference path. It does not prove every framework lifecycle has the same sequence. Current code retains original inputs rather than removing their listeners.

Next: Consolidate the documented root cause with #6110 and #5691 only after preserving their distinct acceptance criteria. Define an initialization-safe date update/reset API or synchronization contract.

## Issue #5691

[Issue](https://github.com/uswds/uswds/issues/5691)

Attempt: Initialize a date range and a separate date with default values. Clear visible inputs with value="" without an input event, then open each calendar.

Result: reproducible. Visible inputs become empty while internal values retain 2026-09-01, 2026-09-15, and 2026-09-10. The standalone calendar still selects September 10. The range calendar still selects September 1 and highlights September 2 through 14, ending on September 15.

Limit: Direct .value assignment matches jQuery .val("") without an event. This finding does not imply that browser input events fire for programmatic assignments. API expectations still need a documented decision.

Next: Define a supported clear/reset method or synchronize when reopening. Preserve both selected-date and range-highlight acceptance criteria when linking #6329 and #6110.

## Issue #5463

[Issue](https://github.com/uswds/uswds/issues/5463)

Attempt: Render the current breadcrumb Twig at 320 by 768 CSS pixels. Start on a preceding button and press Tab four times.

Result: reproducible. Home and Federal Contracting receive focus with x=-16943.03 pixels, outside the viewport. The next parent breadcrumb and following button are visible. The focused hidden links retain an outline that is offscreen.

Limit: This directly confirms the 320-pixel branch. Desktop browser zoom and screen-reader behavior were not tested. Existing wrapping changes for #6689 do not remove this narrow-viewport focus problem.

Next: Implement and review a narrow-viewport focus treatment with keyboard regression coverage and accessibility review of whether hidden ancestry should remain available to screen readers.

## Issue #5981

[Issue](https://github.com/uswds/uswds/issues/5981)

Attempt: Rendered freshly generated default pagination with built CSS at a 320px viewport and measured navigation boundaries.

Result: reproduced. See the structured observation in results.json.

Limit: 320px CSS viewport verified; actual browser 400% zoom was not performed.

Next: Fix layout while preserving target sizes and verify true browser zoom.

## Issue #5827

[Issue](https://github.com/uswds/uswds/issues/5827)

Attempt: Typed a complete SSN, moved caret to offset 5, then pressed Backspace through the browser keyboard.

Result: reproduced. See the structured observation in results.json.

Limit: Chromium SSN variant only; other masks and browsers still need coverage.

Next: Preserve logical caret/selection during formatting, with delete/replace and punctuation tests.

## Issue #5646

[Issue](https://github.com/uswds/uswds/issues/5646)

Attempt: Rendered current extended header at desktop width; captured actual keyboard Tab sequence and visual group bounds.

Result: reproduced. See the structured observation in results.json.

Limit: Desktop keyboard order verified; mobile order and whether an alternate semantic reading sequence is appropriate still need review.

Next: Align focus and visual order while reviewing mobile navigation consequences.

## Issue #6485

[Issue](https://github.com/uswds/uswds/issues/6485)

Attempt: Initialized an icon-only tooltip button with title=Settings and an aria-hidden SVG, then inspected its accessible name and ran the axe button-name rule.

Result: reproduced. Initialization removes title and supplies aria-describedby, but no accessible name. The browser snapshot presents an unnamed button and axe reports a button-name violation.

Limit: This validates the icon-only trigger case, not every tooltip relationship. The source of a fallback name is a component contract decision.

Next: Keep as an accessibility bug. Define naming behavior for icon-only triggers while preserving existing names and descriptions, then add targeted regression coverage.

## Issue #6080

[Issue](https://github.com/uswds/uswds/issues/6080)

Attempt: Submitted a form with a required radio group and no selection, then recorded invalid events, active-element geometry, validationMessage, and screenshot.

Result: reproduced. The browser blocks submission, fires invalid events, and focuses a native radio positioned at x=-16943px. validationMessage contains Please select one of these options. No visible native validation message appears in the captured form.

Limit: A screenshot alone may omit browser-native UI, but the focused invalid control is independently measured offscreen. Cross-browser validation behavior still needs checking.

Next: Coordinate with #6068 and design one solution for custom radio and checkbox invalid targets. Do not close as a duplicate before scope is agreed.

## Issue #5858

[Issue](https://github.com/uswds/uswds/issues/5858)

Attempt: Opened a modal containing a required four-digit field, entered 12, and clicked its submit button carrying data-close-modal. Recorded validity, events and modal visibility.

Result: reproduced. The field is invalid and the browser emits invalid without submit. Nevertheless the modal closes, aria-hidden becomes true, and focus returns to the opener.

Limit: The fixture uses valid modal labels and current generated markup. This does not assess every application form integration.

Next: Check the existing modal refactor PR #6299, then prevent invalid form submission from closing the modal or establish a supported integration contract.

## Issue #5748

[Issue](https://github.com/uswds/uswds/issues/5748)

Attempt: Typed into the exact minimal input-mask markup without an id, then repeated with a unique id as the control.

Result: reproduced_related_failure. The no-id case throws Cannot set properties of null (setting textContent). The generated mask identifier and subsequent lookup disagree when getAttribute(id) returns null. The same control with an id does not throw.

Limit: The current error differs from the original undefined-placeholder Angular stack trace. This confirms a defect in the supplied minimal markup but does not prove the original Angular initialization path.

Next: Address or document the missing-id contract and obtain a minimal Angular initialization example to reproduce the original stack trace.

## Issue #5375

[Issue](https://github.com/uswds/uswds/issues/5375)

Attempt: Initialized an outer table, inserted a nested sortable table, initialized the nested table separately, and counted aria-sort mutations and row ordering across two clicks. Compared document-level initialization.

Result: reproduced. Per-table initialization invokes sorting twice per click, causing two aria-sort mutations and leaving descending order after both clicks. Document-level initialization changes direction once per click as expected.

Limit: This is an automated DOM/event reproduction in jsdom rather than a visual browser test. The table module is unchanged from baseline.

Next: Add event ownership or idempotent delegation without breaking supported document-level and per-table initialization; preserve the control cases in regression tests.

