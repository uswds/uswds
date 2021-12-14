/* eslint-disable arrow-body-style */
const buffer = require("vinyl-buffer");
const browserify = require("browserify");
const childProcess = require("child_process");
const gulp = require("gulp");
const log = require("fancy-log");
const rename = require("gulp-rename");
const source = require("vinyl-source-stream");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const merge = require("merge-stream");
const dutil = require("./doc-util");
const cFlags = require("./cflags");

const task = "javascript";

gulp.task(task, () => {
  dutil.logMessage(task, "Compiling JavaScript");

  const streams = Object.entries({
    [dutil.pkg.name]: browserify({
      entries: ["src/js/start.js"],
      debug: true,
    }).transform("babelify", {
      global: true,
      presets: ["@babel/preset-env"],
    })
      .bundle()
      .pipe(source(`${dutil.pkg.name}.js`))
      .pipe(buffer()),
    "uswds-init": gulp.src("src/js/uswds-init.js"),
  }).map(([basename, stream]) =>
    stream
      .pipe(rename({ basename }))
      .pipe(gulp.dest("dist/js"))
      .pipe(sourcemaps.init({ loadMaps: true }))
      .on("error", log)
      .pipe(uglify())
      .pipe(
        rename({
          suffix: ".min",
        })
      )
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest("dist/js"))
  );

  return merge(streams);
});

gulp.task(
  "typecheck",
  () =>
    new Promise((resolve, reject) => {
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
    })
);