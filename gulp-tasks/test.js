const { src, series } = require("gulp");
const mocha = require("gulp-spawn-mocha");
const { serve } = require("./serve");

const mochaConfig = {
  config: "src/patterns/utils/test/.mocharc.json",
};

function a11yTests() {
  return src("src/patterns/utils/test/a11y.js").pipe(mocha(mochaConfig));
}

// Export our tasks.
module.exports = {
  // run unit test.
  unitTests() {
    return src("src/patterns/**/*.spec.js").pipe(mocha(mochaConfig));
  },

  sassTests() {
    return src("src/patterns/stylesheets/test/sass-spec.js")
      .pipe(mocha());
  },

  // Run tests if server instance exists. If not: start one, run test, and exit.
  a11y: series(serve, a11yTests),

  cover() {
    return src("src/patterns/**/*.spec.js")
      .pipe(mocha(mochaConfig, { nyc: true }));
  },
};
