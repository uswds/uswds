import gulp from "gulp";
import { createGulpEsbuild } from "gulp-esbuild";
import childProcess from "child_process";
import rename from "gulp-rename";
import uglify from "gulp-uglify";
import merge from "merge-stream";
import sourcemaps from "gulp-sourcemaps";
import dutil from "./utils/doc-util.js";

const { src, dest } = gulp;
const gulpEsbuild = createGulpEsbuild({
  piping: true,
});

/**
 * Builds minified and unminified versions of uswds-init.js and uswds.js with sourcemaps
 */
function compileJS() {
  const packageName = dutil.pkg.name.replace("@uswds/", "");

  dutil.logMessage("javascript", "Compiling JavaScript");

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
}

function typeCheck() {
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
}

export { compileJS, typeCheck };
