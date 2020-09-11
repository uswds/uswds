const gulp = require("gulp");
const dutil = require("./doc-util");
const cFlags = require("./cflags");

gulp.task("no-test", (done) => {
  dutil.logMessage("no-test", "Disabling linting and tests for all assets.");
  cFlags.test = false;
  done();
});

gulp.task("no-cleanup", (done) => {
  dutil.logMessage(
    "no-cleanup",
    "Disabling cleanup of distribution directories."
  );
  cFlags.cleanup = false;
  done();
});
