const { src } = require("gulp");
const { default: mocha } = require("gulp-mocha");

const mochaConfig = {
  config: "packages/uswds-core/src/js/utils/test/.mocharc.json",
};

// Export our tasks.
module.exports = {
  // run unit test.
  unitTests() {
    return src([
      // Component tests.
      "packages/usa-*/**/*.spec.js",
      // Core utils tests.
      "packages/uswds-*/**/*.spec.js",
      // SASS unit tests, run separately.
      "!packages/uswds-core/src/test/sass.spec.js",
    ]).pipe(mocha(mochaConfig));
  },

  sassTests() {
    return src("packages/uswds-core/src/test/sass.spec.js").pipe(mocha());
  },

  // Build-tooling tests (e.g. the Vite plugins under tasks/). These are ESM
  // specs that exercise pure functions and don't need the jsdom-global setup
  // the component tests use, so they run without the component mocha config.
  tasksTests() {
    return src("tasks/**/*.spec.mjs").pipe(mocha());
  },
};
