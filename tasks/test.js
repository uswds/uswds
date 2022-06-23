const { src } = require("gulp");
const mocha = require("gulp-spawn-mocha");

const mochaConfig = {
  config: "packages/uswds-core/src/js/utils/test/.mocharc.json",
};

// Export our tasks.
module.exports = {
  // run unit test.
  unitTests() {
    return src("packages/usa-*/**/*.spec.js").pipe(mocha(mochaConfig));
  },
};
