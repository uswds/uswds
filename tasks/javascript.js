/* eslint-disable arrow-body-style */

const { dest, src } = require("gulp");
const { createGulpEsbuild } = require("gulp-esbuild");
const childProcess = require("child_process");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const merge = require("merge-stream");
const dutil = require("./utils/doc-util");

const gulpEsbuild = createGulpEsbuild({
  piping: true,
});

module.exports = {
  /**
   * Builds minified and unminified versions of uswds-init.js and uswds.js with sourcemaps
   */
  compileJS() {
    dutil.logMessage("javascript", "Compiling JavaScript");
    const packageName = dutil.pkg.name.replace("@uswds/", "");
    const streams = Object.entries({
      [packageName]: src("./packages/uswds-core/src/js/start.js").pipe(
        gulpEsbuild({
          bundle: true,
          target: "es6",
        })
      ),
      "uswds-init": src("packages/uswds-core/src/js/uswds-init.js"),
    }).map(([basename, stream]) =>
      stream
        .pipe(rename({ basename }))
        .pipe(dest("dist/js"))
        .pipe(sourcemaps.init({ loadMaps: true }))
        .on("error", function handleError(error) {
          dutil.logError(error);
          this.emit("end");
        })
        .pipe(uglify())
        .pipe(
          rename({
            suffix: ".min",
          })
        )
        .pipe(sourcemaps.write("."))
        .pipe(dest("dist/js"))
    );

    return merge(streams);
  },
  typeCheck() {
    return new Promise((resolve, reject) => {
      childProcess
        .spawn("./node_modules/.bin/tsc", { stdio: "inherit" })
        .on("error", reject)
        .on("exit", (code) => {
          if (code === 0) {
            dutil.logMessage("typecheck", "TypeScript likes our code!");
            resolve();
          } else {
            reject(new Error("TypeScript failed, see output for details!"));
          }
        });
    });
  },
};
