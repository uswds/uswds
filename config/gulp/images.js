const gulp = require("gulp");

gulp.task("images", () => {
  return gulp.src("src/patterns/img/**/*").pipe(gulp.dest("dist/img"));
});
