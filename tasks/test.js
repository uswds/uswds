const { src } = require("gulp");
const { default: mocha } = require("gulp-mocha");
const mochaConfig = {
  config: "packages/uswds-core/src/js/utils/test/.mocharc.json",
};

const SPEC_FLOOR = 78;
const SASS_SPECS = [
  "packages/uswds-core/src/test/sass.spec.js",
  "packages/usa-accordion/src/test/accordion-icon.spec.js",
];
const DIST_SPECS = ["packages/uswds-core/src/test/dist-bundle.spec.js"];
const UNIT_SPECS = [
  "packages/usa-*/**/*.spec.{js,mjs,cjs}",
  "packages/uswds-*/**/*.spec.{js,mjs,cjs}",
  // Sass and built-bundle tests run separately with their own Mocha setup.
  ...[...SASS_SPECS, ...DIST_SPECS].map((file) => `!${file}`),
];

// Count exactly the files selected by the runners, including exclusions.
async function verifySpecCount(runnerGlobs, floor = SPEC_FLOOR, options = {}) {
  const files = new Set();
  await Promise.all(
    runnerGlobs.map(
      (globs) =>
        new Promise((resolve, reject) => {
          src(globs, { ...options, read: false, allowEmpty: true })
            .on("data", (file) => files.add(file.path))
            .on("error", reject)
            .on("end", resolve);
        }),
    ),
  );
  if (files.size < floor) {
    throw new Error(
      `Spec count (${files.size}) dropped below the floor of ${floor}. ` +
        "If specs were intentionally removed, update SPEC_FLOOR in tasks/test.js.",
    );
  }
  return files.size;
}

// Export our tasks.
module.exports = {
  // run unit test.
  unitTests() {
    return src(UNIT_SPECS).pipe(mocha(mochaConfig));
  },

  sassTests() {
    return src(SASS_SPECS).pipe(mocha());
  },

  // Build-tooling tests (e.g. the Vite plugins under tasks/). These are ESM
  // specs that exercise pure functions and don't need the jsdom-global setup
  // the component tests use, so they run without the component mocha config.
  tasksTests() {
    return src("tasks/**/*.spec.mjs").pipe(mocha());
  },

  distTests() {
    return src(DIST_SPECS).pipe(mocha({ timeout: 30000 }));
  },

  verifySpecCount,
  async checkSpecCount() {
    // Guard package unit and Sass specs. Tooling and separately built bundle
    // specs must not mask a missing file in these runners.
    const count = await verifySpecCount([UNIT_SPECS, SASS_SPECS]);
    console.log(`Spec count: ${count} (floor: ${SPEC_FLOOR})`);
  },
};
