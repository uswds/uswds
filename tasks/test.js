const { src } = require("gulp");
const mocha = require("gulp-mocha");

const mochaConfig = {
  config: "packages/uswds-core/src/js/utils/test/.mocharc.json",
};

// Export our tasks.
module.exports = {
  // run unit test.
  unitTests() {
    return src("packages/usa-*/**/*.spec.js").pipe(mocha(mochaConfig));
  },

  sassTests() {
    return src("packages/uswds-core/src/test/sass.spec.js")
      .pipe(mocha());
  },
};
