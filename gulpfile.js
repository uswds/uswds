// Include gulp helpers.
const { series, parallel } = require("gulp");

// Include Our tasks.
//
// Each task is broken apart to it's own node module.
// Check out the ./gulp-tasks directory for more.
const { noCleanup, noTest } = require("./gulp-tasks/flags");
const { buildSprite } = require("./gulp-tasks/svg-sprite");
const { compileJS, typeCheck } = require("./gulp-tasks/javascript");
const { unitTests, sassTests, a11y, cover } = require("./gulp-tasks/test");
const { lintSass, lintJS } = require("./gulp-tasks/lint");
const { build } = require("./gulp-tasks/build");
const { release } = require("./gulp-tasks/release");
const { watch } = require("./gulp-tasks/watch");
const { serve, buildPL, exitServer } = require("./gulp-tasks/serve");
const { compileSass } = require("./gulp-tasks/sass");
const { copyVendor, copySass, copyImages } = require("./gulp-tasks/copy");
const { cleanDist } = require("./gulp-tasks/clean");

/**
 * Declare our exports
 */

// flags
exports.noTest = noTest;
exports.noCleanup = noCleanup;

// Clean all directories.
exports.cleanDist = cleanDist;

// Lint Sass
exports.lintSass = lintSass;

// Lint JavaScript
exports.lintJS = lintJS;

// Lint Sass and JavaScript
exports.lint = parallel(lintSass, lintJS);

// tests
exports.a11y = series(serve, a11y, exitServer);

exports.cover = cover;

exports.sassTests = sassTests;

exports.unitTests = unitTests;

// run all our required tests
exports.test = series(
  typeCheck,
  lintJS,
  lintSass,
  sassTests,
  unitTests,
  serve,
  a11y,
  exitServer
);

// building
exports.buildSprite = buildSprite;
exports.sass = series(lintSass, copyVendor, compileSass);
exports.buildJS = compileJS;
exports.release = release;

// Build task for Pattern Lab.
exports.styleguide = buildPL;

// Watch task that runs a browsersync server.
exports.watch = watch;

// Default Task
exports.default = build;
