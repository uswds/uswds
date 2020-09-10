const gulp = require("gulp");
const dutil = require("./doc-util");

const task = "images";

gulp.task(task, (done) => {
  dutil.logMessage(task, "Copying Images");
  const stream = gulp.src("src/img/**/*").pipe(gulp.dest("dist/img"));

  done();
  return stream;
});
