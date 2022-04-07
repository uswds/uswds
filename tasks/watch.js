const { watch, series, parallel } = require("gulp");
const { unitTests, sassTests } = require("./test");
const { lintSass, typecheck } = require("./lint");
const { compileSass } = require("./sass");
const { compileJS } = require("./javascript");
const { build } = require("./build");

/**
 * Watch Sass and JS files.
 */
function watchFiles() {
  // Watch all my sass files and compile sass if a file changes.
  watch(
    "./src/**/**/*.scss",
    parallel(lintSass, compileSass),
  );

  // Watch all my JS files and compile if a file changes.
  watch(
    "./src/**/**/*.js",
    series(
      parallel(typecheck, compileJS),
    )
  );

  // Watch all my unit tests and run if a file changes.
  watch(
    "./src/**/*.spec.js",
    series(
      series(unitTests, sassTests),
      (done) => done())
  );
}

exports.watch = series(
  build,
  watchFiles
);
