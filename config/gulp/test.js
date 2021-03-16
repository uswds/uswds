const gulp = require("gulp");
const mocha = require("gulp-spawn-mocha");

const mochaConfig = {
  config: "src/patterns/utils/test/.mocharc.json",
};

// Export our tasks.
module.exports = {
  // run unit test.
  unitTests() {
    return gulp.src("src/**/*.spec.js").pipe(mocha(mochaConfig));
  },

  sassTests() {
    return gulp
      .src("src/patterns/stylesheets/test/sass-spec.js")
      .pipe(mocha());
  },

  // run accessiblity.
  a11y() {
    return gulp.src("src/patterns/utils/test/a11y.js").pipe(mocha(mochaConfig));
  },

  cover() {
    return gulp.src("src/**/*.spec.js").pipe(mocha(mochaConfig, { nyc: true }));
  },
};
