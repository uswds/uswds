const gulp = require("gulp");
const del = require("del");
const dutil = require("./doc-util");
const cFlags = require("./cflags");

gulp.task("clean-dist", (done) => {
  if (!cFlags.cleanup) {
    dutil.logMessage(
      "clean-dist",
      "Skipping cleaning up the distribution directories."
    );
    return done();
  }
  dutil.logMessage("clean-dist", "Removing distribution directories.");

  return del("dist");
});

gulp.task("docs", (done) => {
  dutil.logMessage("docs", "Copying documentation dist dir");

  const stream = gulp
    .src(["README.md", "LICENSE.md", "CONTRIBUTING.md"])
    .pipe(gulp.dest("dist"));

  done();
  return stream;
});

gulp.task(
  "build",
  gulp.series(
    (done) => {
      dutil.logIntroduction();
      dutil.logMessage("build", "Creating distribution directories.");
      done();
    },
    "clean-dist",
    "svg-sprite",
    "docs",
    gulp.parallel("sass", "javascript", "images", "fonts"),
    // We need to copy the Sass to dist *after* the sass task, to ensure
    // that vendor libraries have been copied to the Sass directory first.
    "copy-dist-sass"
  )
);
