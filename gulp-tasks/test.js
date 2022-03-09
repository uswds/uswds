const { src } = require("gulp");
const mocha = require("gulp-spawn-mocha");

const mochaConfig = {
  config: "packages/utils/test/.mocharc.json",
};

// Export our tasks.
module.exports = {
  // run unit test.
  unitTests() {
    return src("packages/**/[!sass]*.spec.js").pipe(mocha(mochaConfig));
  },

  sassTests() {
    return src("packages/uswds-core/src/test/sass.spec.js")
      .pipe(mocha());
  },

  cover() {
    return src("packages/**/*.spec.js")
      .pipe(mocha(mochaConfig, { nyc: true }));
  },
};
