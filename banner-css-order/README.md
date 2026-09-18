# Banner CSS order regression evidence

Baseline: `eaef39533a0a0f78976d6888edf8ae56fe9334d6` from `origin/develop`.

Fixed commit: `4ebc116b0064079c8fc22a14d0d9b92db07697d0`.

The source fix is in `worktrees/fix-banner-css-order`. It raises specificity only where banner button/content elements also have their accordion classes. Existing single-class banner rules remain. Corresponding Lit stylesheet selectors preserve custom-property overrides.

## Browser coverage

The browser harness compares fixed output with the original correct import order across four loading patterns, two viewports (1280px and 320px), two themes, two open states, and three interaction states. It checks rendered geometry, text/background colors, typography, spacing, pseudo-elements, and a separate accordion control. `browser-assertions.json` records 96 passing fixed cases and 48 failing baseline cases. `measurements.json` preserves all before/after samples.

The four loading patterns are both orders of Sass module imports and both orders of separately compiled stylesheets. The latter covers consumer builds that split component CSS into chunks.

The Lit harness renders the actual Lit component with source styles and custom text, link, hover, background, chevron, and font properties. `shadow-assertions.json` records 12 matching before/after states, including mobile/desktop, collapsed/expanded, and hover/focus.

Browser comparisons use Headless Chromium 147.0.0.0. Screenshot captures use Google Chrome 153.0.8010.52 through the Browser plugin because the CLI screenshot command stalled. Screenshots use the same fixture, source revisions, and paired dimensions. No animations or transitions were modified. Material icons come from the installed official dependency. Computed style comparisons began before those visual assets were added; adding the SVG files does not change any computed CSS declarations. All final screenshots were captured with the complete visual assets.

## Screenshots and portable fixtures

The eight screenshots cover desktop/mobile and collapsed/expanded states. `screenshot-manifest.json` records their dimensions and checksums. Desktop frames are 1280 by 700 pixels; mobile frames are 320 by 700 pixels. Expanded frames retain the focus established by clicking the button.

`before.html` and `after.html` inline the CSS, JavaScript, image assets, and fonts needed to reproduce the banner-first case. They can be opened independently of the workspace server. The fixture also contains an independent accordion control.

## Validation

- `sass-tests.log`: 128 Sass tests passing.
- `component-tests.log`: 924 component and utility tests passing.
- `build-sass.log`: successful Sass build.
- Targeted Stylelint, Prettier, and `git diff --check` pass.
- No screen-reader or physical-device results are claimed.

## Reproduction

Open the self-contained before.html and after.html files in the same browser at 1280x700 or 320x700. Each includes baseline or fixed CSS, source JavaScript, images, and fonts. Activate the banner and compare its appearance and the separate accordion control. Full state measurements and aggregate browser assertions accompany these portable fixtures. Repository builds and test commands can be run at the baseline and fixed commit above.

The complete matrix automation scripts and raw test logs are retained in the review workspace. This public evidence bundle contains the portable fixtures, measurements, comparisons, and screenshots.

## Compatibility

No markup or JavaScript API changes are needed. Consumers using a single-class custom CSS rule to override elements carrying both banner and accordion classes may need to match the new specificity. The Lit component handles its own matching overrides in the source change.
