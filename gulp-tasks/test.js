const { src, series } = require("gulp");
const mocha = require("gulp-spawn-mocha");
const { serve, exitServer } = require("./serve");

const mochaConfig = {
  config: "src/utils/test/.mocharc.json",
};

function a11yTests() {
  return src("src/utils/test/a11y.js").pipe(mocha(mochaConfig));
}

// Export our tasks.
module.exports = {
  // run unit test.
  unitTests() {
    return src("src/**/*.spec.js").pipe(mocha(mochaConfig));
  },

  sassTests() {
    return src("src/stylesheets/test/sass-spec.js")
      .pipe(mocha());
  },

  /**
   * ! Browsersync instances should be closed before running this.
   * Starts up a browsersync instance at localhost:3333, runs tests, and closes server.
   */
  a11y: series(serve, a11yTests, exitServer),

  cover() {
    return src("src/**/*.spec.js")
      .pipe(mocha(mochaConfig, { nyc: true }));
  },
};
