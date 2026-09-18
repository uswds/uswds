# Combo-box validation-state evidence

Issue: https://github.com/uswds/uswds/issues/5936

Baseline: `eaef39533a0a0f78976d6888edf8ae56fe9334d6`

Fix: `e862ac2e16043951210f1e0ab69d99fb0df56af5`

## Screenshots

- `before.jpg`: baseline bundle, 1280 by 720 Chromium viewport.
- `after.jpg`: fixed bundle, same fixture and viewport.
- `after-320.jpg`: fixed bundle at 320 by 720 after keyboard selection and clearing. The error input has focus. No horizontal overflow occurred.

The error and success selects carry `usa-input--error` and `usa-input--success`. Baseline enhancement drops both classes. The fixed bundle preserves them on the visible inputs. The default input remains unchanged.

Computed borders:

| State | Before | After |
| --- | --- | --- |
| Error | 1px solid rgb(86, 92, 101) | 4px solid rgb(181, 9, 9) |
| Success | 1px solid rgb(86, 92, 101) | 4px solid rgb(0, 169, 28) |
| Default | 1px solid rgb(86, 92, 101) | 1px solid rgb(86, 92, 101) |

## Reproducing the fixture

Build the baseline and fixed revisions in separate clean worktrees with Node 24 and the repository lockfile. Run `npm run build` in each. Place the baseline `dist/js/uswds.js` beside the HTML fixtures as `before.js`, and the fixed bundle as `after.js`. Copy a generated `dist` directory beside the HTML files for shared CSS, fonts, and icons. The patch changes no CSS.

Serve the fixture directory over localhost. Open `before.html` and `after.html` in Chromium at the same viewport. The screenshots use a real compiled USWDS bundle, without mocked component behavior.

Keyboard check on the fixed fixture: enter `App` in the error-state field, press ArrowDown then Enter to select Apple, then activate Clear. Selection updates the original select; clearing empties both values. The error class remains present throughout.

## Tests

The six new tests initialize through both `document.body` and the component element. Baseline: two pass, four fail because validation classes are absent. Fixed: all six pass, including explicit checks that select-specific, arbitrary custom, and hidden-select classes are not propagated.

Full local suite: 128 Sass, 930 component, 28 tooling tests. Combo-box plus time-picker: 126 tests. Build and 37 built-bundle characterization tests pass. No screen-reader or physical-device result is claimed.
