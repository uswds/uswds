const { watch, series, parallel } = require("gulp");
const { unitTests, sassTests } = require("./test");
const { lintSass, lintJS } = require("./lint");
const { compileSass } = require("./sass");
const { compileJS } = require("./javascript");
const { build } = require("./build");
const  { copyCSSToPL } = require("./copy");
const dutil = require('./utils/doc-util');
const { serve, server, buildPL, rebuildPL } = require("./serve");


/**
 * Watch Sass and JS files.
 */
function watchFiles() {
  // Watch all my sass files and compile sass if a file changes.
  watch(
    "./src/**/**/*.scss",
    series(
      parallel(lintSass, compileSass),
      copyCSSToPL,
      (done) => {
        dutil.logMessage("Reloading browser.");
        server.reload("*.css");
        done();
      }
    )
  );

  // Watch all my JS files and compile if a file changes.
  watch(
    "./src/**/**/*.js",
    series(
      parallel(lintJS, compileJS),
      (done) => {
        dutil.logMessage("Reloading browser.");
        server.reload("*.js");
        done();
      }
    )
  );

  // Watch all my and compile if a file changes.
  watch(
    "./src/**/**/*{.twig,.yml}",
    series(
      rebuildPL,
      (done) => {
        dutil.logMessage("Reloading browser.");
        server.reload("*.html");
        done();
      }
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
  buildPL,
  serve,
  watchFiles
);
