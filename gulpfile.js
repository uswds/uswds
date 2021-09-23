// Include gulp helpers.
const { series, parallel } = require("gulp");

// Include Our tasks.
//
// Each task is broken apart to it's own node module.
// Check out the ./gulp-tasks directory for more.
const { noCleanup, noTest } = require("./gulp-tasks/flags");
const { buildSprite } = require("./gulp-tasks/svg-sprite");
const { compileJS, typeCheck } = require("./gulp-tasks/javascript");
const { unitTests, sassTests, cover } = require("./gulp-tasks/test");
const { lintSass, lintJS } = require("./gulp-tasks/lint");
const { build } = require("./gulp-tasks/build");
const { release } = require("./gulp-tasks/release");
const { watch } = require("./gulp-tasks/watch");
const { buildPL } = require("./gulp-tasks/serve");
const { compileSass } = require("./gulp-tasks/sass");
const { copyVendor } = require("./gulp-tasks/copy");
const { cleanDist } = require("./gulp-tasks/clean");

/**
 * *Flags*
 */
exports.noTest = noTest;
exports.noCleanup = noCleanup;

/**
 * *Clean tasks*
 */
exports.cleanDist = cleanDist;

/**
 * *Lint tasks*
 */
exports.lintSass = lintSass;
exports.lintJS = lintJS;
exports.lint = parallel(lintSass, lintJS);

/**
 * *Test tasks*
 * cover: Similar to unit tests.
 * sassTests: Sass unit tests.
 * unitTests: Component unit tests.
 * test: Run all tests.
 */


exports.cover = cover;
exports.sassTests = sassTests;
exports.unitTests = unitTests;
exports.test = series(
  typeCheck,
  lintJS,
  lintSass,
  sassTests,
  unitTests,
);

/**
 * *Build tasks*
 * buildSprite: Generate new spritesheet based on SVGs in `src/img/usa-icons/`.
 * buildSass: Lint, copy normalize, and compile sass.
 * buildJS: Lint, copy normalize, and compile sass.
 * release: Builds USWDS and returns a zip with sha256 hash and filesize.
 */
exports.buildSprite = buildSprite;
exports.buildSass = series(lintSass, copyVendor, compileSass);
exports.buildJS = series(typeCheck, lintJS, compileJS);
exports.buildUSWDS = build;
exports.buildComponents = buildPL;
exports.release = release;

// Build task for Pattern Lab.
exports.styleguide = buildPL;

/**
 * *Watch task*
 * Builds USWDS and component library, creates local server, and watches
 * for changes in scss, js, twig, yml, and unit tests.
 */
exports.watch = watch;

// Default Task
exports.default = this.buildUSWDS;
