const gulp = require("gulp");
const dutil = require("./doc-util");

const task = "images";

gulp.task(task, () => {
  dutil.logMessage(task, "Copying Images");

  return gulp.src("src/img/**/*").pipe(gulp.dest("dist/img"));
});
