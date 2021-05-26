const { watch, series, parallel } = require("gulp");
const { unitTests, sassTests } = require("./test");
const { lintSass, lintJS } = require("./lint");
const { compileSass } = require("./sass");
const { compileJS } = require("./javascript");
const { build } = require("./build");
const  { copyCSSToPL } = require("./copy");
const { serve, server, buildPL, rebuildPL } = require("./serve");


/**
 * Watch Sass and JS files.
 */
function watchFiles() {
  // Watch all my sass files and compile sass if a file changes.
  watch(
    "./src/patterns/**/**/*.scss",
    series(
      parallel(lintSass, compileSass),
      copyCSSToPL,
      (done) => {
        server.reload("*.css");
        done();
      }
    )
  );

  // Watch all my JS files and compile if a file changes.
  watch(
    "./src/patterns/**/**/*.js",
    series(
      parallel(lintJS, compileJS),
      (done) => {
        server.reload("*.js");
        done();
      }
    )
  );

  // Watch all my patterns and compile if a file changes.
  watch(
    "./src/patterns/**/**/*{.twig,.yml}",
    series(rebuildPL, (done) => {
      server.reload("*.html");
      done();
    })
  );

  // Watch all my unit tests and run if a file changes.
  watch(
    "./src/patterns/**/*.spec.js",
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
