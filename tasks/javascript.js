import { dest, src } from "gulp";
import buffer from "vinyl-buffer";
import browserify from "browserify";
import childProcess from "child_process";
import rename from "gulp-rename";
import source from "vinyl-source-stream";
import sourcemaps from "gulp-sourcemaps";
import uglify from "gulp-uglify";
import merge from "merge-stream";
import dutil from "./utils/doc-util";

export default {
  compileJS() {
    dutil.logMessage("javascript", "Compiling JavaScript");
    const packageName = dutil.pkg.name.replace("@uswds/", "");
    const streams = Object.entries({
      [packageName]: browserify({
        entries: ["packages/uswds-core/src/js/start.js"],
        debug: true,
      })
        .transform("babelify", {
          global: true,
          presets: ["@babel/preset-env"],
        })
        .bundle()
        .pipe(source(`${packageName}.js`))
        .pipe(buffer()),
      "uswds-init": src("packages/uswds-core/src/js/uswds-init.js"),
    }).map(([basename, stream]) =>
      stream
        .pipe(rename({ basename }))
        .pipe(dest("dist/js"))
        .pipe(sourcemaps.init({ loadMaps: true }))
        .on("error", function handleError(error) {
          dutil.logError(error);
          this.emit('end');
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
