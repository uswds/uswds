# USWDS Anchors — Lookup Tables for Gate Checks

This file is the concrete data layer: inventories, conventions, and verifiable facts about the repo that gates 4–16 reference.

---

## Reusable utilities (`uswds-core`) — gate 4a / 7

**Location:** `packages/uswds-core/src/js/utils/`

All are CommonJS `module.exports`. Before accepting any new helper, grep this list.

| File                   | What it does                                                                                                                                                                                                                                     |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `select.js`            | `select(selector, context)` → real Array of matches; returns `[]` for non-string. **The only file under repo-wide typecheck** (`tsconfig.json` `include`).                                                                                       |
| `select-or-matches.js` | Same as `select` but also includes `context` itself if it matches.                                                                                                                                                                               |
| `behavior.js`          | The component lifecycle/event-delegation factory. Returns `{ on, add, off, remove, ...props }` with `init`/`teardown` hooks. Custom implementation that replaced `receptor`.                                                                     |
| `focus-trap.js`        | Tab/Shift-Tab wrapping inside a container; owns the `FOCUSABLE` selector constant. Built on `keymap` + `behavior` + `select` + `active-element`.                                                                                                 |
| `keymap.js`            | Maps key-combo strings → handlers, returns one keydown handler; guards non-`KeyboardEvent` input.                                                                                                                                                |
| `active-element.js`    | One-liner `(htmlDocument = document) => htmlDocument.activeElement` (indirection for testability).                                                                                                                                               |
| `debounce.js`          | `debounce(cb, delay = 500)`; returned fn has `.cancel()`.                                                                                                                                                                                        |
| `toggle.js`            | Flips `aria-expanded` on a button and `hidden` on its `aria-controls` target; shadow-DOM aware via `getRootNode()`; throws if target missing.                                                                                                    |
| `toggle-form-input.js` | "Show/Hide" password-style toggling; `aria-pressed`, `data-show-text`/`data-hide-text`, `resolveIdRefs`.                                                                                                                                         |
| `toggle-field-mask.js` | Swaps input `type` password↔text plus `autocapitalize`/`autocorrect` off.                                                                                                                                                                        |
| `validate-input.js`    | Data-attribute-driven validation (`data-validation-element`, `data-validate*`, `data-validation-status`) against a `usa-checklist`.                                                                                                              |
| `is-in-viewport.js`    | `getBoundingClientRect` viewport containment test.                                                                                                                                                                                               |
| `is-ios-device.js`     | UA/`maxTouchPoints` iOS detection.                                                                                                                                                                                                               |
| `scrollbar-width.js`   | Measures scrollbar width by transient offscreen divs.                                                                                                                                                                                            |
| `sanitizer.js`         | **The HTML-escaping helper.** `Sanitizer.escapeHTML` is a *tagged template* that escapes only interpolated values (`& < > " ' /` → entities), leaving static parts intact; `null`/`undefined` → `""`. Derived from Mozilla Gaia's SafeInnerHTML. |

**Also core:**
- `packages/uswds-core/src/js/events.js` — Exports `{ CLICK: "click" }`. Components import `CLICK` from here, never hardcode.
- `packages/uswds-core/src/js/config.js` — Exports `{ prefix: "usa" }`. All class-name constants must be built from `PREFIX`, e.g. `` `.${PREFIX}-accordion__button` ``.

---

## Sass token functions and settings — gates 4a, 9, 10, 13

### Token functions

All in `packages/uswds-core/src/styles/functions/` (barrel: `_index.scss`):

| Function               | What it does                                                                                                                                                                                               | Location                         |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------|
| `units()`              | Spacing token → rem; returns `error-not-token()` for invalid input.                                                                                                                                        | `functions/units/units.scss`     |
| `color()`              | Color token → hex; the main themeable-color interface.                                                                                                                                                     | `functions/utilities/color.scss` |
| `next-token()`         | Move within a color scale (e.g., `"darker"`, `"lighter"`).                                                                                                                                                 | `functions/color/`               |
| `font()`               | Font-family token → stack.                                                                                                                                                                                 | `functions/font/`                |
| `get-font-stack()`     | Lower-level font helper.                                                                                                                                                                                   | `functions/font/`                |
| `get-typeface-token()` | Validates typeface tokens.                                                                                                                                                                                 | `functions/font/`                |
| Plus ~20 more          | `cap-height`, `normalize-type-scale`, `is-color-token`, `magic-number`, `wcag-magic-number`, `set-theme-color`, `get-link-tokens-from-bg`, `calculate-grade`, `px-to-rem`, `rem-to-px`, `spacing-multiple` | `functions/` subdirs             |

**Error convention:** Invalid tokens go through `functions/general/error-not-token.scss` / `error.scss`, which return an error *string* under `$error-output-override` so Sass-True can assert them.

### Settings files

**Location:** `packages/uswds-core/src/styles/settings/` (barrel: `_index.scss`)

| File                        | Lines | Covers                                                                                                           |
|-----------------------------|-------|------------------------------------------------------------------------------------------------------------------|
| `_settings-general.scss`    | 120   | Project-wide (`$theme-show-compile-warnings`, `$theme-namespace`, `$theme-image-path`)                           |
| `_settings-typography.scss` | 433   | Fonts, type scale, measure, leading (`$theme-font-*`, `$theme-typeface-tokens`, `$theme-type-scale-*`)           |
| `_settings-color.scss`      | 149   | Theme colors, state colors, grade assignments (`$theme-color-*`, `$theme-link-*`)                                |
| `_settings-components.scss` | 226   | **All `$theme-<component>-*` settings, alphabetical by component.** This is where new component settings go.     |
| `_settings-spacing.scss`    | 90    | Vertical rhythm, grid gaps (`$theme-column-gap`, `$theme-grid-container-max-width`, `$theme-site-margins-width`) |
| `_settings-utilities.scss`  | 1102  | Utility-class generation control (`$*-settings`, `$*-palettes`)                                                  |

**Naming:** All settings are `$theme-*` or `$output-*`, declared with `!default`. Values are **token strings or spacing numbers**, not CSS values: `"base-lightest"`, `"body"`, `0.5`, `"start"`, or the literal `default`.

**Example component block** (`_settings-components.scss:20-26`, accordion):
```scss
$theme-accordion-background-color:       default !default;
$theme-accordion-border-color:           "base-lighter" !default;
$theme-accordion-border-width:           0.5 !default;
$theme-accordion-button-background-color: default !default;
$theme-accordion-font-family:            "body" !default;
$theme-accordion-icon-position:          "start" !default;
```

### Consumption pattern

Every component stylesheet opens with `@use "uswds-core" as *;` then uses token functions, never raw values. Canonical from `packages/usa-accordion/src/styles/_usa-accordion.scss`:
```scss
$accordion-border: units($theme-accordion-border-width) solid color($theme-accordion-border-color);
$accordion-button-background-active-color: next-token($theme-accordion-button-background-color, "darker");
```

**Convention** (observed, #6659):
- Store the **raw value** in a variable: `$-range-border-width: 2px;`
- Apply the function at **usage**: `border-width: units($-range-border-width);`
- Do **not** store the result: ~~`$-range-border: units(2px);`~~
- Private variables use a leading dash: `$-range-border-width`
- Or skip the variable and use the function directly with the theme token

---

## Public API surface — gate 13

From `package.json` `exports` and observed conventions:

### 1. JS component API

**Entry:** `packages/uswds-core/src/js/index.js` exports 22 named behaviors: `accordion`, `banner`, `button`, `characterCount`, `comboBox`, `datePicker`, `dateRangePicker`, `fileInput`, `footer`, `inPageNavigation`, `inputMask`, `languageSelector`, `modal`, `navigation`, `password`, `rangeSlider`, `search`, `skipnav`, `table`, `timePicker`, `tooltip`, `validator`.

Each is a `behavior()` return value, so the public shape is:
- `on(context)` / `off(context)` — mount/unmount
- `add(el)` / `remove(el)` — instance add/remove
- **Plus** whatever component-specific `props` the component spreads (e.g., accordion's `show`/`hide`/`toggle`)

**Global side effects** (`packages/uswds-core/src/js/start.js`):
- `window.uswdsPresent = "USWDS present"`
- `window.uswds = { components }`
- `exports.initComponents()`

### 2. Shared JS utils

Reachable via `"./uswds-core/*"` export, so `packages/uswds-core/src/js/utils/*` is effectively public too.

### 3. Sass settings

`packages/uswds-core/src/styles/settings/_settings-*.scss` — every `$theme-*` name, default value, and accepted token vocabulary is public API.

### 4. Sass functions/mixins/placeholders

- `packages/uswds-core/src/styles/functions/**` (forwarded through `functions/_index.scss`)
- `packages/uswds-core/src/styles/mixins/**` (forwarded through `mixins/_index.scss`)
- `packages/uswds-core/src/styles/placeholders/**`
- Component-level mixins forwarded through `packages/<pkg>/src/styles/_index.scss`
- Top-level barrel: `packages/uswds/_index.scss`

### 5. Twig templates

`packages/<pkg>/src/usa-<pkg>.twig` + `packages/templates/**` page templates. Their **variable names** are API for consumers using `webpack.twig.config.js`.

Example variable names (seen in corpus): `items`, `modifier`, `id_prefix`, `multiselectable`, `data`, `label`, `classes`, `heading`, `content`.

### 6. CSS class names

Derived from `prefix: "usa"` (in `config.js`) and asserted in both JS and Sass. Changing class names or markup is explicitly a breaking change per the PR template.

Examples: `.usa-accordion__button`, `.usa-banner__header`, `.usa-button`, `.usa-input`, `.usa-sr-only`.

### 7. `data-*` attributes

The JS-facing config API, defined as constants in each `packages/*/src/index.js`. Full inventory (~30):

`data-allow-multiple`, `data-classes`, `data-close-modal`, `data-day`, `data-focus`, `data-force-action`, `data-heading-elements`, `data-label`, `data-mask`, `data-maxlength`, `data-modal-hidden`, `data-month`, `data-nav-hidden`, `data-open-modal`, `data-opener`, `data-original-*`, `data-placeholder`, `data-placeholder-for`, `data-position`, `data-sort-active`, `data-sort-value`, `data-sortable`, `data-tag`, `data-text-preposition`, `data-text-unit`, `data-validation-element`, `data-validation-incomplete`, `data-validation-status`, `data-value`, `data-year`.

### 8. Deprecation / notification channel

`packages/uswds-core/src/styles/_notifications.scss` — per-version "Teams should…" entries printed at compile time.

---

## Test conventions — gates 5, 6

### Test runner / config

- **Mocha**, not Jest/Vitest.
- **Config:** `packages/uswds-core/src/js/utils/test/.mocharc.json` (the real path; `package.json` `"mocha": {"config": "src/utils/test/.mocharc.json"}` is stale and points to a non-existent location).
- **Environment:** `jsdom-global/register` (browser-ish).
- **Discovery globs** (from `tasks/test.js`): `packages/usa-*/**/*.spec.js` + `packages/uswds-*/**/*.spec.js`, explicitly excluding the two Sass-True entry specs.

### File naming

- **JS specs:** `<feature>.spec.js` colocated in `packages/<pkg>/src/test/`.
- **Fixtures:** Either `template.html` (single-fixture components: accordion, modal, file-input) or `<spec-name>.template.html` 1:1 with the spec (combo-box, date-picker, character-count).
- **Negative paths:** `invalid-template-*` prefix. Examples: `invalid-template-no-select.spec.js`, `invalid-template-no-wrapper.spec.js`, `invalid-template-no-input.spec.js`.
- **Storybook visual test patterns:** `packages/<pkg>/src/test/test-patterns/*.twig` (16 packages have these).

### Fixture loading idiom

Two spellings, both current:
```js
const TEMPLATE = fs.readFileSync(`${__dirname}/template.html`);
// OR
fs.readFileSync(path.join(__dirname, "/combo-box.template.html"))
```

### The canonical setup/teardown (from `usa-accordion/src/test/accordion.spec.js`)

```js
const tests = [
  { name: "document.body", selector: () => document.body },
  { name: "accordion",     selector: accordionSelector },
];
tests.forEach(({ name, selector: containerSelector }) => {
  describe(`... initialized at ${name}`, () => {
    const { body } = document;
    let root; /* ...let per element... */
    beforeEach(() => {
      body.innerHTML = TEMPLATE;
      Component.on(containerSelector());
      /* query refs */
    });
    afterEach(() => {
      Component.off(containerSelector());
      body.innerHTML = "";  // or body.textContent = ""
    });
    // tests...
  });
});
```

**Teardown inconsistency:** Some specs use `body.innerHTML = ""`, others `body.textContent = ""`. Worth a non-blocking note.

### Sass tests (`sass-true`)

**Driver pattern** (9 lines, verbatim from `packages/usa-accordion/src/test/accordion-icon.spec.js`):
```js
const path = require("path");
const sassTrue = require("sass-true");
const sass = require("sass-embedded");

const SASS = path.join(__dirname, "accordion-icon.spec.scss");

describe("Accordion icon mixin", () => {
  sassTrue.runSass({ describe, it, sass }, SASS, { loadPaths: ["./packages", "."] });
});
```

**Spec file** (`accordion-icon.spec.scss`):
```scss
@use "uswds-core" with ($theme-show-notifications: false);
@import "node_modules/sass-true/sass/true";

@include describe("u-icon-position()") {
  @include it("outputs icon-start styles when passed 'start'") {
    @include assert {
      @include output {
        @include u-icon-position("start");
      }
      @include expect {
        /* expected CSS */
      }
    }
  }
}
```

**Error-path tests** assert on the **string** returned by `error-not-token()`, gated by `$error-output-override`.

---

## CI gates — gate verification, gate 10 context

**Primary gate:** `.circleci/config.yml` → single `build` job on `cimg/node:24.16.0-browsers`:

```
npm install
→ npx playwright install
→ Snyk scan (snyk/snyk@1.1.2 orb, org `uswds`)
→ npm run test:ci
→ npm run prettier:check
```

**`test:ci` is:**
```
npm run lint (eslint packages/ + gulp lintSass/stylelint)
→ gulp test (series: typeCheck, lintSass, sassTests, unitTests, tasksTests)
→ npm run test:a11y (Storybook build to _site, http-server :6006, test-storybook = Playwright + axe)
→ npm run build:html (webpack twig → prettier)
```

**So the gates are:** eslint (incl. `no-unsanitized`), stylelint/Sass lint, tsc typecheck, sass-true tests, mocha unit tests, tasks tests, Storybook a11y/axe, twig HTML build, prettier formatting, Snyk.

**Typecheck caveat:** `tsconfig.json` `include` is **only** `packages/uswds-core/src/js/utils/select.js`. `gulp typecheck` is essentially a no-op for new code. Good thing to flag.

**Other workflows:**
- `.github/workflows/codeql-analysis.yml` — CodeQL on push to main/develop, PRs, weekly cron
- `.github/workflows/verify-commit-signatures.yml` — rejects unsigned commits
- `.github/workflows/build-diff.yml` — `workflow_dispatch` only; diffs `dist/` of PR vs develop
- `.github/workflows/release-prep.yml` — manual, release-branch only; builds tarball, records vuln counts
- `.github/workflows/release.yml` — on `v*.*.*` tag; OIDC npm publish; gates on critical vulns and SHA-256 tarball match
- `.github/workflows/contributors.yml` — nightly, rewrites `COMMUNITY.md`
- `.github/workflows/verify-documentation-links.yml` — weekly markdown link check

**Note:** `COMMUNITY.md` is bot-maintained; `AGENTS.md` says don't edit it unless asked.

---

## ESLint rules — gate 10 context

From `eslint.config.mjs`:

**Security rules (always `error`):**
- `no-unsanitized/method` — ❌ **but disabled for `**/*.spec.js`** ❌
- `no-unsanitized/property` — ❌ **but disabled for `**/*.spec.js`** ❌
- `no-implied-eval`
- `no-new-func`
- `no-extend-native`
- `no-new-wrappers`

**Style/bug rules to cite:**
- `no-var` — ban `var`
- `prefer-const`
- `eqeqeq` (null-ignored)
- `no-param-reassign` (`props: false`)
- `no-shadow`
- `no-plusplus` (loop afterthought allowed)
- `no-underscore-dangle` (warn)
- `import/no-extraneous-dependencies` (devDeps allowed)
- `import/no-unresolved`

`eslint-config-prettier` is last (no formatting rules). `lit` flat/recommended is first (web components).

---

## Dependencies — gate 2 context

**`dependencies` (runtime): exactly one.**
- `lit@3.3.3` (web components)

**`devDependencies` (75):** See `package.json` for full list. Notable:
- `sinon@22.1.0` — already a project dependency (cite when someone hand-rolls timing helpers)
- `sass-true@10.1.0` — for Sass testing
- `playwright` / `axe-playwright` — a11y testing
- `prettier`, `eslint`, `stylelint`
- `gulp@5.0.1`, `vite@^6.4.3`, `webpack@5.109.2`

**Version-pinning:** Mixed. Most build/test tooling is exactly pinned; newer additions use `^`. `overrides: { "nwsapi": "2.2.13" }`.

**`.snyk`** exists at `/home/egardner/devspace/uswds/.snyk` but every `ignore:` entry references packages no longer in `package.json` with `expires` dates in March 2021 (all expired). Dead config.

**Files that change when a dependency is added:**
1. `package.json` (`dependencies` vs `devDependencies`)
2. `package-lock.json` (CI runs `npm ci`, must be in sync)
3. PR body's *Dependency updates* table (uncomment the section)
4. `.snyk` (if a Snyk finding must be waived — rare)

---

## PR template — gate 3, 13, 14 context

**Location:** `.github/PULL_REQUEST_TEMPLATE.md`

**Required sections:**

### Title format
`USWDS - [Package]: [Brief statement]`

### Body sections

1. **Summary** — One or two sentences, past tense, benefit statement. *"A successful summary is written in the past tense and includes: **A benefit statement.** A description of the update."*
2. **Breaking change** — must pick **exactly one**:
   - "This is not a breaking change."
   - ":warning: This is potentially a breaking change."
   - ":warning: This is a breaking change."

   Definition given: **changes to the JavaScript API, changes to markup or content in components, significant changes to a component's display**. If breaking, explain remediation.

3. **Related issue** — `Closes #[issue_no]`. *"Every pull request should resolve an open issue."*
4. **Related pull requests** — Note companion `uswds-site` PRs for component/settings docs and changelog entries.
5. **Preview link**
6. **Problem statement** — must convey *desired state, actual state, consequences of inaction*.
7. **Solution** — what, why this approach, how, limitations/alternatives.
8. **Major changes** — list for complex PRs.
9. **Testing and review** — tests run, repro instructions, type of feedback wanted.
10. **Dependency updates** (commented out) — `| Dependency name | Previous version | New version |` table; uncomment when deps change.

**Commented-out definition-of-done checklist:**
- Follows 18F Front End Coding Style Guide + 18F Accessibility Guide checklist
- `git pull origin [base branch]` (usually `develop`) and resolve conflicts
- `npm run prettier:sass` for Sass changes
- `npm test` passes
- Run through HTML_CodeSniffer, error free

**Also states:** All commits must have a **verified signature** (GPG or SSH).

---

## Issue templates — gate 3 context

### Bug report (`.github/ISSUE_TEMPLATE/bug_report.yaml`)

**Title:** `USWDS - Bug: [YOUR TITLE]`

**Fields (required unless noted):**
- *Describe the bug* (req)
- *Steps to reproduce* (req)
- *Expected Behavior* (req)
- *Related code* (opt)
- *Screenshots* (opt)
- *System setup* (opt; USWDS version/device/OS/browser+version)
- *Additional context* (opt)
- Code-of-Conduct checkboxes (both req: agree to CoC, checked existing issues for duplicates)

### Feature request (`.github/ISSUE_TEMPLATE/feature_request.yaml`)

**Title:** `USWDS - Feature: [YOUR TITLE]`

**Fields (required unless noted):**
- *Is your feature request related to a problem?* (req)
- *Describe the solution you'd like* (req)
- *Describe alternatives you've considered* (opt)
- *Additional context* (opt)
- Same two CoC checkboxes (req)

---

## Notes

- **Browser support policy:** Node 24 (`.nvmrc`, CI). Browsers: see `npx browserslist` output; IE11 / pre-Chromium Edge are explicitly out of support (#6660).
- **Base branch:** `develop` (not `main`). PRs target `develop`. `main`/`library--main` trigger npm publish; don't push there.
- **Commit signatures:** All commits must be GPG/SSH verified; unsigned are rejected by `verify-commit-signatures.yml`. Sign before committing.
- **Prettier:** `{}` (defaults), `.prettierignore`. 2-space indent, LF line endings (`.editorconfig`).
- **`dist/` is generated:** Never edit. `gulp cleanDist` clears. Review path is byte-identical verification, not line-by-line diff.
- **Storybook:** Lives at `:6006` locally (`npm start`). Built to `_site/` for a11y testing and deployed to Federalist previews at non-root paths (affects asset resolution).
