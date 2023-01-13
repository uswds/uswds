const { src } = require("gulp");
const mocha = require("gulp-mocha");

const mochaConfig = {
  config: "packages/uswds-core/src/js/utils/test/.mocharc.json",
};

// Export our tasks.
module.exports = {
  // run unit test.
  unitTests() {
    //! @TODO Undo this after component conversion
    //! Should point to "packages/usa-*/**/*.spec.js"
    return src("packages/uswds-core/src/js/utils/**/*.spec.mjs").pipe(
      mocha(mochaConfig)
    );
  },

  sassTests() {
    return src("packages/uswds-core/src/test/sass.spec.mjs").pipe(mocha());
  },
};
