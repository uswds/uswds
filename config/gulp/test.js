"use strict";

const gulp = require("gulp");
const mocha = require("gulp-spawn-mocha");

const mochaConfig = {
  config: "spec/.mocharc.json",
};

// Export our tasks.
module.exports = {
  // run unit test.
  unitTests() {
    return gulp.src("src/**/**/*.spec.js").pipe(mocha(mochaConfig));
  },

  // run accessiblity.
  a11y() {
    return gulp.src("spec/a11y.js").pipe(mocha(mochaConfig));
  },

  cover() {
  return gulp
    .src("src/patterns/components/**/*.spec.js")
    .pipe(mocha(mochaConfig, { nyc: true }));
  },
};
