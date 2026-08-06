/* eslint-disable arrow-body-style */

const { dest, src, parallel, series } = require("gulp");
const buffer = require("vinyl-buffer");
const browserify = require("browserify");
const childProcess = require("child_process");
const rename = require("gulp-rename");
const source = require("vinyl-source-stream");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const dutil = require("./utils/doc-util");

/**
 * Shared JS processing pipeline.
 * @param {Stream} stream - The input stream.
 * @param {string} basename - The base name for the output file.
 * @returns {Stream} The processed stream.
 */
function jsPipeline(stream, basename) {
  return stream
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
    .pipe(dest("dist/js"));
}

function bundleMain() {
  const packageName = dutil.pkg.name.replace("@uswds/", "");
  return jsPipeline(
    browserify({
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
    packageName
  );
}

function copyInit() {
  return jsPipeline(
    src("packages/uswds-core/src/js/uswds-init.js"),
    "uswds-init"
  );
}

module.exports = {
  compileJS: series(
    function logCompileJS(done) {
      dutil.logMessage("javascript", "Compiling JavaScript");
      done();
    },
    parallel(bundleMain, copyInit)
  ),
  typeCheck: series(
    function spawnTsc() {
      return childProcess.spawn("./node_modules/.bin/tsc", { stdio: "inherit" });
    },
    function logTscSuccess(done) {
      dutil.logMessage("typecheck", "TypeScript likes our code!");
      done();
    }
  ),
};
