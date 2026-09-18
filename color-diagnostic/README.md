# Invalid color token diagnostic evidence

Related issue: https://github.com/uswds/uswds/issues/5913

Baseline: `develop` at `eaef39533a0a0f78976d6888edf8ae56fe9334d6`.

The fixture compiles the exact reported call using the modern public Sass entry point, captures the actual compiler exception, and renders that message in a browser. It also compiles and renders a valid primary-color control and the default table styles. The same 1280 by 1080 viewport and markup are used before and after. Both screenshot files are verified PNG images.

Before, invalid tokens reach a redundant lookup of `$project-color-shortcodes`, which is unavailable in the function's module scope. After, they reach the existing invalid-token diagnostic. The default table setting remains a component sentinel, not a usable color token. No fallback color is introduced.

## Validation

- Four invalid-token compilation regressions fail on baseline and pass with the change, including the original legacy import path. All 12 focused tests pass.
- System colors, theme colors, state colors, custom theme colors, explicit custom overrides, disabled-token errors, and the existing unflagged-literal error remain covered.
- `npm run build` and `npm test` pass: 128 Sass tests, 936 component/core tests, and 28 task tests.
- Changed-file Prettier and whitespace checks pass. Full test includes JavaScript and Sass lint and the configured type check.
- Default table CSS is byte-identical before and after: 29,647 bytes, SHA-256 `1a1f482c2680035206d1892b9cd4a52198b9846d6f85a91823a6112a7e3d7e1b`.
- Chromium 147.0.7727.15 confirms displayed compiler messages exactly match the captured exceptions. The valid control color and table header computed color, background, and border are identical.

This is compiler diagnostic coverage. No component markup, focus behavior, ARIA attributes, keyboard interaction, or physical assistive technology behavior changes.

## Reproduce

Run `generate-fixture.cjs <repo> <output.html>` for each checkout. It writes the HTML, captured compiler JSON, and compiled table CSS. Run `capture.cjs <repo> <chromium-executable>` after generating `before.html` and `after.html` to verify messages and controls, then capture screenshots. The scripts use the checkout's `sass-embedded` and Playwright dependencies.

The screenshots and fixtures belong on the separate evidence branch, outside the code fix PR.

Fixed revision: `968bacb743ae8b6feb4e972e08246f01856c5ee8`.
