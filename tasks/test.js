const { src } = require("gulp");
const { default: mocha } = require("gulp-mocha");
const fs = require("fs");
const path = require("path");

const mochaConfig = {
  config: "packages/uswds-core/src/js/utils/test/.mocharc.json",
};

const SPEC_FLOOR = 74;

// Recursively find spec files matching .spec.{js,mjs,cjs} under a directory.
function findSpecFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findSpecFiles(fullPath));
    } else if (/\.spec\.(js|mjs|cjs)$/.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

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
    const usaSpecs = findSpecFiles(path.resolve("packages")).filter(
      (f) =>
        /packages[/\\]usa-/.test(f) || /packages[/\\]uswds-/.test(f)
    );
    if (usaSpecs.length < SPEC_FLOOR) {
      done(
        new Error(
          `Spec count (${usaSpecs.length}) dropped below the floor of ${SPEC_FLOOR}. ` +
            `If specs were intentionally removed, update SPEC_FLOOR in tasks/test.js.`
        )
      );
      return;
    }
    console.log(`Spec count: ${usaSpecs.length} (floor: ${SPEC_FLOOR}) ✓`);
    done();
  },
};