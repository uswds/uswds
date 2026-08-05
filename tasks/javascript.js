/* eslint-disable arrow-body-style */

const { dest, src } = require("gulp");
const buffer = require("vinyl-buffer");
const browserify = require("browserify");
const childProcess = require("child_process");
const rename = require("gulp-rename");
const source = require("vinyl-source-stream");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const dutil = require("./utils/doc-util");

// Helper: resolve when a stream emits 'finish' or 'end', reject on 'error'.
// Replaces merge-stream, which uses Node-streams PassThrough that is
// incompatible with gulp 5's streamx-based vinyl streams: the fast
// uswds-init stream would end the PassThrough before the slower browserify
// bundle finished, causing a "write after end" error.
function streamFinished(stream) {
  return new Promise((resolve, reject) => {
    stream.once("finish", resolve).once("end", resolve).once("error", reject);
  });
}

module.exports = {
  compileJS() {
    dutil.logMessage("javascript", "Compiling JavaScript");
    let packageName = dutil.pkg.name.replace("@uswds/", "");
    const promises = Object.entries({
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
    }).map(([basename, stream]) => {
      const out = stream
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
        .pipe(dest("dist/js"));
      return streamFinished(out);
    });

    return Promise.all(promises);
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
