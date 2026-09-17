# Shadow function regression evidence

Issue: https://github.com/uswds/uswds/issues/5755

Baseline: `eaef39533a0a0f78976d6888edf8ae56fe9334d6`.
Fix: `ff608ffe` on `fix/shadow-function-5755`.

The before and after HTML files have identical markup and settings. Only CSS compiled from USWDS differs. The left column uses the documented `shadow()` function; the right column uses the existing `u-shadow()` mixin. Tokens 2 and 5 demonstrate the defect and fix. Screenshots were captured at 1280 by 800 in Chromium through `@vercel/before-and-after`.

`generate-fixture.cjs <repository-path> <output.html>` compiles a fixture against a repository checkout. `check-browsers.cjs <repository-path> [chromium-executable]` verifies the checked-in before and after fixtures in Chromium. Eight computed-style assertions passed; results and browser version are recorded in `browser-results.json`.

The full compressed USWDS stylesheet was compared separately and remained byte-identical at 557,897 bytes. It is not necessary to publish that generated stylesheet with the evidence.

Fourteen new public Sass compilation tests fail against the baseline and pass after the fix. Full validation passed: `npm run build`, `npm test` (128 Sass, 938 component/core, 28 task tests), changed-file Prettier, and `git diff --check`.

No Firefox, WebKit, physical-device, screen-reader, or manual assistive-technology verification is claimed. This change restores a Sass function without changing component markup or interaction.
