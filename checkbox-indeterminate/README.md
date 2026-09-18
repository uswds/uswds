# Checkbox indeterminate state evidence

Issue: https://github.com/uswds/uswds/issues/6381

Baseline: `eaef39533a0a0f78976d6888edf8ae56fe9334d6` from `develop`.

The fixture markup, viewport (1280 by 1250), and assets are identical before and after. Only compiled checkbox CSS changes. The four columns compare native `input.indeterminate` and `data-indeterminate` with both checked values. Rows cover default and tile inputs, enabled, disabled, and aria-disabled states, in default and dark colors. Ordinary checked checkbox and radio controls remain visible beneath the matrix.

## Results

| Browser | Baseline normal rendering | Fixed normal rendering | State restoration | Fixed forced colors |
| --- | --- | --- | --- | --- |
| Chromium 147.0.7727.15 | 12 of 48 fail | 48 pass | 48 pass | 48 pass |
| Firefox 151.0 | 24 of 48 fail | 48 pass | 48 pass | Existing limitation below |
| WebKit 26.5 | 24 of 48 fail | 48 pass | 48 pass | 48 pass |

In Firefox forced-color emulation, all 48 cases return `background-image: none` both before and after. This is an existing limitation, not a passing check. WebKit is an automated browser engine test, not a physical Safari or iOS test.

Six new Storybook regression plays failed on baseline and passed with the fix. All nine checkbox stories, including the existing Axe checks, passed after the change. `npm test` passed 128 Sass tests, 924 component/core tests, and 28 task tests. Build, changed-file formatting, lint, and whitespace checks passed.

The existing print-specific checked indicator remains outside this screen and forced-color styling change. No screen reader speech or physical device testing was performed. The change does not alter native checked state, form submission, keyboard behavior, or accessibility attributes. The data attribute remains a visual hook only.

## Reproduce

Run `generate-fixture.cjs <repo> <output.html>` from Node to compile a checkout and copy the four SVG assets. Then run `check-matrix.cjs <repo> <chromium-executable> <fixture.html> <result.json>`. Set `TEST_BROWSER=firefox` or `webkit` and pass `-` for the executable argument to use Playwright's installed browser. Set `CAPTURE_SCREENSHOT=true` to capture the matched viewport. The checked-in JSON files preserve all measured states, including failures.

For repository regression coverage, run the Checkbox stories through the existing Storybook test runner. The temporary configuration here narrows the local run to those stories and uses the installed Chromium executable. It is evidence tooling, not part of the fix PR.

## Behavior basis

- [Current USWDS checkbox documentation](https://designsystem.digital.gov/components/checkbox/) describes both native and data attribute indeterminate styling without requiring `checked=false`.
- [HTML checkbox definition](https://html.spec.whatwg.org/multipage/input.html#checkbox-state-(type=checkbox)) says indeterminateness obscures selection.
- [Original implementation discussion](https://github.com/uswds/uswds/pull/5713#discussion_r1504766405) treated checked and indeterminate as exclusive. Issue #6381 supplies the valid combined-state use case.

Screenshots were captured directly by the verified Playwright matrix after the before-and-after CLI stalled. Assets remain separate from the code PR.

Fixed revision: `33cd8c3147dc873cc966b7aefc2d2defe95ce57f`. Absolute local fixture URLs in measured JSON are normalized to `fixture:`; image filenames and measured styles are preserved.
