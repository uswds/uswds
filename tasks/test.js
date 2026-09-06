const { src } = require("gulp");
const { default: mocha } = require("gulp-mocha");
const glob = require("glob");

const mochaConfig = {
  config: "packages/uswds-core/src/js/utils/test/.mocharc.json",
};

const SPEC_GLOBS = [
  "packages/usa-*/**/*.spec.{js,mjs,cjs}",
  "packages/uswds-*/**/*.spec.{js,mjs,cjs}",
];

// The minimum number of spec files that must match the glob.
// Fail the build if this count drops — a silently-shrinking glob
// is the most likely way a future migration hides a regression.
const SPEC_FLOOR = 74;

// Export our tasks.
module.exports = {
  // run unit test.
  unitTests() {
    return src([
      // Component tests.
      "packages/usa-*/**/*.spec.{js,mjs,cjs}",
      // Core utils tests.
      "packages/uswds-*/**/*.spec.{js,mjs,cjs}",
      // SASS unit tests, run separately.
      "!packages/uswds-core/src/test/sass.spec.js",
      "!packages/usa-accordion/src/test/accordion-icon.spec.js",
    ]).pipe(mocha(mochaConfig));
  },

  sassTests() {
    return src([
      "packages/uswds-core/src/test/sass.spec.js",
      "packages/usa-accordion/src/test/accordion-icon.spec.js",
    ]).pipe(mocha());
  },

  // Build-tooling tests (e.g. the Vite plugins under tasks/). These are ESM
  // specs that exercise pure functions and don't need the jsdom-global setup
  // the component tests use, so they run without the component mocha config.
  tasksTests() {
    return src("tasks/**/*.spec.mjs").pipe(mocha());
  },

  // Fail the build if the number of spec files drops below the floor.
  // This catches a silently-shrinking test glob before it hides regressions.
  checkSpecCount(done) {
    const specFiles = glob.sync("{" + SPEC_GLOBS.join(",") + "}");
    if (specFiles.length < SPEC_FLOOR) {
      done(
        new Error(
          `Spec count (${specFiles.length}) dropped below the floor of ${SPEC_FLOOR}. ` +
            `If specs were intentionally removed, update SPEC_FLOOR in tasks/test.js.`
        )
      );
      return;
    }
    console.log(`Spec count: ${specFiles.length} (floor: ${SPEC_FLOOR}) ✓`);
    done();
  },
};