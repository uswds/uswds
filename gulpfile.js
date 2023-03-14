// Include gulp helpers.
const { series, parallel } = require("gulp");

// Include Our tasks.
//
// Each task is broken apart to it's own node module.
// Check out the ./tasks directory for more.
const { noCleanup, noTest } = require("./tasks/flags");
const { buildSprite, buildSpriteStandalone } = require("./tasks/svg-sprite");
const { compileJS, typeCheck } = require("./tasks/javascript");
const { unitTests, sassTests } = require("./tasks/test");
const { lintSass, typecheck } = require("./tasks/lint");
const { build } = require("./tasks/build");
const { release } = require("./tasks/release");
const { watch } = require("./tasks/watch");
const { compileSass } = require("./tasks/sass");
const { cleanDist } = require("./tasks/clean");

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
exports.typecheck = typecheck;
exports.lint = parallel(lintSass, typecheck);

/**
 * *Test tasks*
 * sassTests: Sass unit tests.
 * unitTests: Component unit tests.
 * test: Run all tests.
 */


exports.sassTests = sassTests;
exports.unitTests = unitTests;
exports.test = series(
  typeCheck,
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
exports.buildSpriteStandalone = buildSpriteStandalone;
exports.buildSprite = buildSprite;
exports.compileSass = compileSass;
exports.buildSass = series(lintSass, compileSass);
exports.buildJS = series(typeCheck, compileJS);
exports.buildUSWDS = build;
exports.release = release;

/**
 * *Watch task*
 * Builds USWDS and component library, and watches
 * for changes in scss, js, twig, yml, and unit tests.
 */
exports.watch = watch;

// Default Task
exports.default = this.buildUSWDS;
