# Navigation landmark label evidence

Issue: https://github.com/uswds/uswds/issues/6301

Baseline: `eaef39533a0a0f78976d6888edf8ae56fe9334d6`.

The fix removes the redundant word "navigation" from default header, footer, side navigation, language-selector header, and documentation-template landmark names. The native nav role remains. Custom labels remain caller-controlled. Trailing commas in sample labels are removed with the redundant text.

## Verification

The repository HTML build ran before and after. Across 217 generated pages, 25 changed. Every difference is an intended aria-label value; other rendered markup is byte-identical. See rendered-results.json. Thirty-six footer and navigation component tests pass. Independent review rendered both footer templates with omitted and custom labels, confirming fallback names and preserved custom values. Thirteen edited JSON files parse successfully. Three JSON files have pre-existing Prettier differences on the baseline; this change preserves their formatting.

Browser snapshots confirm the native navigation landmarks and corrected names. Links and link text are identical before and after. No fresh screen-reader speech test is claimed; the original issue contains NVDA confirmation. The companion site issue uswds/uswds-site#3059 remains open for its separate templates.

## Screenshots

Both captures use the same Chromium viewport, 1717 by 1529, and the same baseline CSS. The fixture places rendered navigation excerpts side by side, hides dropdown/search controls, and prints a table derived from their actual aria-label values. The table is evidence presentation, not a product UI change. The component appearance is unchanged. Only default accessible names change.

Run `npm run build:html` at baseline and fixed revisions to reproduce generated markup. Run `gulp buildSass`, then serve these HTML fixtures with `assets` pointing to the checkout's dist directory. The generated assets and complete HTML output remain outside this evidence branch.
