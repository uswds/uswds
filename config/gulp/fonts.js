const gulp = require("gulp");

gulp.task("fonts", (done) => {
  const stream = gulp.src("src/fonts/**/*").pipe(gulp.dest("dist/fonts"));
  done();
  return stream;
});
