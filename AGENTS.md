# AGENTS.md

Guidance for USWDS repo agents. See `README.md` and `CONTRIBUTING.md` for user docs.

## Runtime

- **Node**: v24 (`.nvmrc`). CI: GitHub Actions with npm 11.18.0.
- **Build**: Gulp 4 (`gulpfile.js`, `tasks/*.js`). Not direct npm scripts. Vite is only for web-components CDN banner (`vite.config.banner.cdn.js`); main lib uses Gulp/Browserify/Uglify. Do not assume Vite builds the whole project.
- **SCSS**: `sass-embedded` (modern API). `@uswds/compile` is consumer-side.

## Architecture

- **Monorepo**: `packages/` (not npm workspace). Root `package.json`. Component pkgs (`packages/<component>/`): `src/`, `_index.scss`, `src/index.js`, `src/*.twig`, `src/*.stories.js`, `src/test/*.spec.js`.
- **`uswds-core`**: `packages/uswds-core/` for shared JS (`src/js/`), Sass (`src/styles/`), settings, tokens, mixins, fonts, images. JS entry: `packages/uswds-core/src/js/start.js`. Bundled dist: `dist/js/uswds.min.js`.
- **Sass Entry**: `packages/uswds/_index.scss` (top-level barrel). Component `_index.scss` files import `uswds-core`.
- **Root `src/`**: Only `src/stylesheets/uswds.scss` for compiled entry and root specs. Component sources under `packages/`.
- **`dist/`**: Generated; do not edit. `gulp cleanDist` clears.
- **Project Focus**: US federal (GSA/TTS) open source project. Accessibility, performance, and security are critical. All updates must align with these requirements.

## Common Commands

- **Install**: `npm install` (CI also `npx playwright install` for a11y).
- **Full Test (Local)**: `npm test` (lint, `gulp typecheck`, `gulp test`).
- **CI Equivalent**: `npm run test:ci` (lint, gulp test, a11y, HTML build).
- **Lint**: `npm run lint` (`lint:js` + `lint:sass`).
- **Typecheck**: `gulp typecheck` (uses `./node_modules/.bin/tsc`). `tsconfig.json` only checks `packages/uswds-core/src/js/utils/select.js` (no repo-wide TS coverage).
- **Unit Tests**: `npm run test:unit` (`gulp unitTests`). Sass tests: `npm run test:sass` (`gulp sassTests`, uses `sass-true`).
- **Single JS Test**: `npx mocha --require jsdom-global/register packages/<pkg>/src/test/<name>.spec.js` (mocharc in `packages/uswds-core/src/js/utils/test/.mocharc.json`).
- **Build**: `npm run build` (runs `gulp` [default `buildUSWDS`] then Vite web-components bundle). Requires internet.
- **Dev Server**: `npm start` (Storybook on `:6006`). `npm run watch` (Gulp watch).
- **Formatting**: `npm run prettier` (writes) or `npm run prettier:check` (CI checks).
- **Icon SVGO**: `npm run fix:icons` (before committing `packages/usa-icon/src/img/` changes).

## Testing Quirks

- **JS Unit Tests**: Mocha with `jsdom-global/register` (browser-ish env); not Jest/Vitest. `sinon` available.
- **Test Discovery**: Globs `packages/usa-*/**/*.spec.js`, `packages/uswds-*/**/*.spec.js` (excludes `packages/uswds-core/src/test/sass.spec.js`).
- **Component Tests**: Load sibling `template.html` into jsdom. Follow `packages/usa-accordion/src/test/` pattern.
- **a11y Tests**: `npm run test:a11y` requires built Storybook (`_site/`) on `:6006`, Playwright + Axe. `test:ci` handles E2E; local is slow, needs `npx playwright install`.

## Style / Lint

- **Prettier**: `{}` (defaults), `.prettierignore`. 2 spaces indent, LF endings (`.editorconfig`).
- **ESLint**: Bans `var`, requires `===`, forbids `new Function`, enforces `no-unsanitized/*` (relaxed in `*.spec.js`). Prefer `const`.

## Issue and discussion routing

- Follow [CONTRIBUTING.md](CONTRIBUTING.md#choose-the-right-place) and [.github/ISSUE_TRIAGE.md](.github/ISSUE_TRIAGE.md) when triaging.
- Route support and implementation questions to Discussions Q&A. Keep reproducible bugs, concrete enhancements, documentation fixes, and tracked maintenance in Issues. New components and patterns start in Proposals; exploratory ideas start in Ideas.
- Read the full conversation and linked work before converting. Preserve the original conversation with GitHub's conversion action. Do not bulk-convert by title, label, age, or missing reproduction alone.

## Git / PR Workflow

Follow the [merge procedure in CONTRIBUTING.md](CONTRIBUTING.md#merging-pull-requests) for all PR merges, including squash-only merging, CodeRabbit follow-up, final requester review, and explicit authorization for any protection bypass.

- **Default Branch**: `develop` (not `main`); PRs target `develop`. Publication requires an authorized manual run of `release.yml` from develop. See `docs/releasing.md`.
- **PR titles**: Follow [Conventional Commits for PR titles](CONTRIBUTING.md#pull-request-titles); the title becomes the squash commit title. Do not add `USWDS -`. Working commit messages need not follow this format. Run `node --test .github/scripts/check-pr-title.test.mjs` when changing title validation.
- **Commit Signatures**: All commits *must* be verified (GPG/SSH); unsigned rejected by `verify-commit-signatures.yml`. Sign before commit.
- **`COMMUNITY.md`**: Do not edit unless requested.
- **Automated review**: CodeRabbit reviews non-draft PRs into `develop`, including Dependabot updates, lockfiles, and SVG sources. It reviews new pushes without a commit-count pause, subject to provider rate limits. Behavior is version-controlled in `.coderabbit.yaml`, so change it in a PR. Repository YAML outranks ordinary repository and organization dashboard settings; organization or workspace Global Overrides still take precedence. Advisory only — never a required check, and it does not push commits. Drafts and GitHub Actions PRs are reviewed on demand with `@coderabbitai review`.

## Gotchas

- **Sass Exports**: `package.json` exports `./scss/*` -> `./packages/*/_index.scss`, `./functions/*` -> `packages/uswds-core/src/styles/functions/*`. New pkgs need `_index.scss`.
- **Web Components**: `lit`-using pkgs bundled by `vite.config.banner.cdn.js`, additive to `uswds.min.js`.
