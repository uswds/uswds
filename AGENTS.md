# AGENTS.md

Guidance for USWDS repo agents. See `README.md` and `CONTRIBUTING.md` for user docs.

## Fast path

Most changes here are one component. Do not reach for `npm test` to check them — it
takes minutes and re-runs typecheck and Sass lint twice (see Testing Quirks). Use the
narrowest loop that covers the change, then run the full suite once before pushing.

| Loop | Command | Time |
| --- | --- | --- |
| One JS spec | `npx mocha --require jsdom-global/register packages/<pkg>/src/test/<name>.spec.js` | ~1s |
| Typecheck | `npx gulp typecheck` | ~1s |
| All Sass tests | `npm run test:sass` | ~3s |
| All JS specs | `npm run test:unit` | ~9s |
| Lint | `npm run lint` | ~9s |
| Everything | `npm test` | minutes |

Timings are from a warm local install on Node 24; treat them as orders of magnitude.

## Skills

Task-specific workflows live in `.agents/skills/`, with Claude Code pointers in
`.claude/skills/`. Load the skill rather than re-deriving its judgment:

- **`uswds-code-review`** — reviewing a PR or the current branch. Encodes the core
  team's 16 gates and severity calibration.
- **`uswds-accessibility`** — any change touching ARIA, focus, keyboard behavior,
  screen-reader announcements, or a11y tests.

`npm run agents:check` verifies these docs still match the repo. See `.agents/README.md`.

## Runtime

- **Node**: v24 (`.nvmrc`, `.tool-versions`). CI: `cimg/node:24.16.0-browsers`. Note
  `package.json` `engines` allows `>=20`, but develop against 24.
- **Install**: `npm install` also runs a full `gulp` build, because `prepare` is wired
  to `npm run build`. Expect minutes and a populated `dist/` on a fresh clone. Use
  `npm install --ignore-scripts` when you only need `node_modules` to run tests or lint.
- **Build**: Gulp 4 (`gulpfile.js`, `tasks/*.js`). Not direct npm scripts. Vite is only for web-components CDN banner (`vite.config.banner.cdn.js`); main lib uses Gulp/Browserify/Uglify. Do not assume Vite builds the whole project.
- **SCSS**: `sass-embedded` (modern API). `@uswds/compile` is consumer-side.

## Architecture

- **Monorepo**: `packages/` (not npm workspace). Root `package.json`. Component pkgs (`packages/<component>/`): `src/`, `_index.scss`, `src/index.js`, `src/*.twig`, `src/*.stories.js`, `src/test/*.spec.js`.
- **`uswds-core`**: `packages/uswds-core/` for shared JS (`src/js/`), Sass (`src/styles/`), settings, tokens, mixins, fonts, images. JS entry: `packages/uswds-core/src/js/start.js`. Bundled dist: `dist/js/uswds.min.js`.
- **Sass Entry**: `packages/uswds/_index.scss` (top-level barrel). Component `_index.scss` files import `uswds-core`.
- **Root `src/`**: Only `src/stylesheets/uswds.scss` for compiled entry and root specs. Component sources under `packages/`.
- **`dist/`**: Generated; do not edit. `gulp cleanDist` clears.
- **Project Focus**: US federal (GSA/TTS) open source project. Accessibility, performance, and security are critical. All updates must align with these requirements.

## Where to change what

A component's concerns are split across sibling files, and changing one usually
obligates another. Anatomy, using `packages/usa-accordion/` as the reference:

| File | Holds |
| --- | --- |
| `_index.scss` | Package barrel: `@forward`s its Sass dependencies, then `src/styles` |
| `src/styles/_index.scss` | `@forward`s the component partial |
| `src/styles/_usa-accordion.scss` | The actual styles |
| `src/index.js` | Behavior, exported as a `receptor` behavior object |
| `src/usa-accordion.twig` | Markup template |
| `src/content/*.json` | Story fixture data, re-exported from `src/content/index.js` |
| `src/usa-accordion.stories.js` | Storybook stories; imports the Twig template and content |
| `src/test/template.html` | Markup fixture loaded into jsdom by the specs |
| `src/test/*.spec.js` | Mocha specs |

Common tasks and the files they touch:

- **Change component styles** — edit `src/styles/_usa-<component>.scss`. Run
  `npm run prettier:sass`. If you add a Sass dependency, `@forward` it in the package
  `_index.scss`.
- **Change component markup** — `src/usa-<component>.twig` *and*
  `src/test/template.html`, which is a separate copy that jsdom loads. They drift
  easily, and a spec passing against a stale fixture is the usual cause of a green
  local run and a broken component. Markup changes are potentially breaking; say so
  in the PR.
- **Change component behavior** — `src/index.js` plus its `src/test/*.spec.js`.
- **Add a story or variant** — add `src/content/usa-<component>~<variant>.json`,
  re-export it from `src/content/index.js`, then consume it in
  `src/usa-<component>.stories.js`.
- **Add a new component package** — create the package with the anatomy above, then
  register it in both barrels or it ships as dead code: `@forward "usa-<component>/src/styles"`
  in `packages/uswds/_index.scss`, and, if it has behavior, `require` it in
  `packages/uswds-core/src/js/index.js` and add it to that module's exports.
- **Change a token, setting, mixin, or function** — `packages/uswds-core/src/styles/`.
  This cascades to every consumer; treat it as a breaking change until proven otherwise.
- **Change icons** — edit under `packages/usa-icon/src/img/`, then run
  `npm run fix:icons` before committing.

## Common Commands

- **Install**: `npm install` (CI also `npx playwright install` for a11y). Runs a full build; see Runtime.
- **Full Test (Local)**: `npm test` (lint, `gulp typecheck`, `gulp test`).
- **CI Equivalent**: `npm run test:ci` (lint, gulp test, a11y, HTML build).
- **Lint**: `npm run lint` (`lint:js` + `lint:sass`).
- **Typecheck**: `gulp typecheck` (uses `./node_modules/.bin/tsc`). `tsconfig.json` only checks `packages/uswds-core/src/js/utils/select.js` (no repo-wide TS coverage).
- **Unit Tests**: `npm run test:unit` (`gulp unitTests`). Sass tests: `npm run test:sass` (`gulp sassTests`, uses `sass-true`). Build-tooling tests: `npm run test:tasks` (`gulp tasksTests`).
- **Single JS Test**: `npx mocha --require jsdom-global/register packages/<pkg>/src/test/<name>.spec.js` (mocharc in `packages/uswds-core/src/js/utils/test/.mocharc.json`).
- **Agent Tooling Tests**: `npm run test:agents` (specs under `.agents/`). Doc drift: `npm run agents:check`.
- **Build**: `npm run build` (runs `gulp` [default `buildUSWDS`] then Vite web-components bundle). Requires internet.
- **Dev Server**: `npm start` (Storybook on `:6006`). `npm run watch` (Gulp watch).
- **Formatting**: `npm run prettier` (writes) or `npm run prettier:check` (CI checks).
- **Icon SVGO**: `npm run fix:icons` (before committing `packages/usa-icon/src/img/` changes).

## Testing Quirks

- **JS Unit Tests**: Mocha with `jsdom-global/register` (browser-ish env); not Jest/Vitest. `sinon` available.
- **Test Discovery**: `gulp unitTests` globs `packages/usa-*/**/*.spec.js` and `packages/uswds-*/**/*.spec.js`, excluding two specs that `gulp sassTests` owns instead: `packages/uswds-core/src/test/sass.spec.js` and `packages/usa-accordion/src/test/accordion-icon.spec.js`. A `*.spec.scss` sibling means the spec is a Sass test and belongs in that exclusion list.
- **Sass tests run under a different mocharc**: `gulp sassTests` runs without `jsdom-global`, so a Sass spec must not touch `document`.
- **`npm test` is redundant**: it is `npm run lint && gulp typecheck && gulp test`, and `gulp test` is `series(typeCheck, lintSass, sassTests, unitTests, tasksTests)`. Typecheck and Sass lint therefore run twice. `npx gulp test` alone covers everything except `lint:js`.
- **Component Tests**: Load sibling `template.html` into jsdom. Follow `packages/usa-accordion/src/test/` pattern.
- **a11y Tests**: `npm run test:a11y` requires built Storybook (`_site/`) on `:6006`, Playwright + Axe. `test:ci` handles E2E; local is slow, needs `npx playwright install`.
- **Storybook is the only real browser check.** jsdom specs do not catch layout, focus
  order, or paint bugs. Run `npm start` and exercise the component before claiming a
  visual or interaction fix works.

## Style / Lint

- **Prettier**: `{}` (defaults), `.prettierignore`. 2 spaces indent, LF endings (`.editorconfig`).
- **ESLint**: Bans `var`, requires `===`, forbids `new Function`, enforces `no-unsanitized/*` (relaxed in `*.spec.js`). Prefer `const`.

## Git / PR Workflow

- **Default Branch**: `develop` (not `main`); PRs target `develop`. `main`/`library--main` trigger npm publish; do not push.
- **Branch Names**: `<type>/<issue-no>-<short-slug>`, e.g. `bug/6212-pagination-button-reset`, `feature/6749-add-accessibility-skill`, `task/pr-template`.
- **Commit Signatures**: All commits *must* be verified (GPG/SSH); unsigned rejected by `verify-commit-signatures.yml`. Verify signing is configured *before* committing — `git config --get commit.gpgsign` must be `true` and `user.signingkey` must be set, or the whole branch needs rewriting. Confirm after committing with `git log --show-signature -1`.
- **PR Title**: `USWDS - [Package]: [what this solves]`, e.g. `USWDS - Button: Increase font size`.
- **PR Body**: fill in `.github/PULL_REQUEST_TEMPLATE.md`, including the AI disclosure checkboxes. Every PR should reference an open issue.
- **`COMMUNITY.md`**: Do not edit unless requested.

## Gotchas

- **Sass Exports**: `package.json` exports `./scss/*` -> `./packages/*/_index.scss`, `./functions/*` -> `packages/uswds-core/src/styles/functions/*`. New pkgs need `_index.scss`.
- **Web Components**: `lit`-using pkgs bundled by `vite.config.banner.cdn.js`, additive to `uswds.min.js`.
- **Twig templates are duplicated for tests.** `src/*.twig` renders in Storybook and the
  HTML build; `src/test/template.html` is a hand-maintained copy for jsdom. Update both.
