import { watch, series, parallel } from "gulp";
import { unitTests, sassTests } from "./test";
import { lintSass, typecheck } from "./lint";
import { compileSass } from "./sass";
import { compileJS } from "./javascript";
import { build } from "./build";

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

export const watch = series(
  build,
  watchFiles
);
