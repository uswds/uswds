# USWDS backlog reproduction evidence

This branch holds review evidence for focused bug fixes. It is separate from the code branches and is not intended to merge into `develop`.

## Shadow-root selection, issue #6808

- Base: `05cc4e65` on `develop`.
- Fix: `84fd82921dde4cb157fe4dededfc70ea8df8aa60`.
- Identical synthetic accordion fixtures, Chromium, 1280 × 900 viewport.
- `before.png`: both panels are visible although the second button has `aria-expanded="false"`.
- `after.png`: the second panel is hidden as authored.
- The fixture bundles only the accordion module. This confirms selection and accordion initialization, not full shadow DOM support for every USWDS component.
- Six new regression checks fail on the base. All 932 component/unit tests pass after the fix. Typecheck, focused ESLint, and Prettier pass.
- Independent review passed 27 focused tests and 28 additional edge assertions.
- No physical-device or screen-reader result is claimed.

Serve this directory with a static HTTP server to inspect the matched fixtures.
