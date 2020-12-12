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
const dutil = require("./doc-util");
const cFlags = require("./cflags");

const task = "javascript";

const entryPoints = ["src/js/start.js", "src/js/uswds-init.js"];

gulp.task(task, (done) => {
  dutil.logMessage(task, "Compiling JavaScript");

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

gulp.task("eslint", (done) => {
  if (!cFlags.test) {
    dutil.logMessage("eslint", "Skipping linting of JavaScript files.");
    return done();
  }

  return gulp
    .src(["src/js/**/*.js", "spec/**/*.js"])
    .pipe(
      eslint({
        fix: true,
      })
    )
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
