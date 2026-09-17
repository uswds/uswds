# Combo-box clear-button focus contrast

Issue: https://github.com/uswds/uswds/issues/6424

Baseline: `eaef39533a0a0f78976d6888edf8ae56fe9334d6` from `origin/develop`.

The existing button opacity also reduces the opacity of its focus outline. On the default white input, the configured `rgb(36, 145, 255)` outline is composited to approximately `rgb(124, 189, 255)` and has 1.99:1 contrast. Applying `opacity: 1` while the button has focus restores the configured outline at 3.20:1 contrast. Its existing 4px width and -4px offset are unchanged.

## Visual evidence

`before.png` and `after.png` capture the same synthetic fixture at 1280x720 in the Chromium browser on macOS. Both screenshots follow a keyboard Tab from the fruit input to its clear button. The unfocused alternate-fruit, time-picker and disabled-fruit controls are present for comparison.

The matching HTML files differ only in their stylesheet URL. `css/before.css` was copied from the baseline build before the source edit. `css/after.css` was copied after the change. Their only CSS difference is the added `opacity: 1` declaration in the existing focused combo-box button rule. Both use the same JavaScript. The `dist`, `fonts` and `img` symlinks point to the local worktree build and are local preview dependencies, not PR contents.

## Verification

- `before.json` and `after.json` record actual browser focus, outline styles, opacity, geometry and background for the four controls.
- `check-contrast.cjs` computes alpha compositing and relative luminance from these measured values. It requires at least 3:1 focus-ring contrast and preserves the unfocused controls at their existing opacity.
- The contrast assertion fails against `before.json` and passes against `after.json`. Logs are retained alongside the script.
- `keyboard-checks.json` confirms that Enter on the focused clear button empties both the input and underlying select, hides the clear button, and returns focus to the input. It also confirms that the time-picker clear button receives the same full-opacity outline through keyboard Tab.
- `npm test` passes: 128 Sass tests, 924 component tests and 28 task tests, plus lint and typecheck.
- `npm run build` and `npm run test:dist` pass.

Recalculate the measured contrast with:

```sh
node check-contrast.cjs before.json
node check-contrast.cjs after.json
```

The first command is expected to fail. The second is expected to pass. No real mobile, forced-colors, or screen-reader test is claimed for this CSS-only change. Theme authors remain responsible for choosing a focus color that contrasts with their backgrounds.

Build CSS and assets at the baseline commit and fix commit `a26e8305ba3018c999481a7ef844c979935b274a` with `npm run build`, then serve these HTML fixtures with their matching CSS and asset paths. Generated CSS and local symlinks are intentionally excluded from this evidence branch.
