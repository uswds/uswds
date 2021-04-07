/* eslint-disable arrow-body-style */

const buffer = require("vinyl-buffer");
const browserify = require("browserify");
const childProcess = require("child_process");
const eslint = require("gulp-eslint");
const gulp = require("gulp");
const log = require("fancy-log");
const rename = require("gulp-rename");
const source = require("vinyl-source-stream");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const dutil = require("./utils/doc-util");
const cFlags = require("./utils/cflags");

const entryPoints = ["src/patterns/start.js", "src/patterns/uswds-init.js"];

module.exports = {
  compileJS(done) {
    dutil.logMessage("javascript", "Compiling JavaScript");

    const defaultStreams = entryPoints.map((entry) => {
      return browserify({
        entries: [entry],
        debug: true,
      }).transform("babelify", {
        global: true,
        presets: ["@babel/preset-env"],
      });
    });

    const streams = defaultStreams.map((stream, i) => {
      const BASENAME = i === 0 ? dutil.pkg.name : "uswds-init";
      return stream
        .bundle()
        .pipe(source(`${BASENAME}.js`)) // XXX why is this necessary?
        .pipe(buffer())
        .pipe(rename({ basename: BASENAME }))
        .pipe(gulp.dest("dist/js"));
    });

    streams.map((stream) => {
      return stream
        .pipe(sourcemaps.init({ loadMaps: true }))
        .on("error", log)
        .pipe(uglify())
        .pipe(
          rename({
            suffix: ".min",
          })
        )
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist/js"));
    });

    done();
    return streams;
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

  eslint(done) {
    if (!cFlags.test) {
      dutil.logMessage("eslint", "Skipping linting of JavaScript files.");
      return done();
    }

    return gulp
      .src(["src/patterns/**/**/*.js"])
      .pipe(
        eslint({
          fix: true,
        })
      )
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
  },
};
