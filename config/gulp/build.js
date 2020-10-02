const gulp = require("gulp");
const del = require("del");

gulp.task("clean-dist", () => {
  return del("dist");
});

gulp.task("build", gulp.series(
    "clean-dist",
    gulp.parallel("sass", "javascript", "images", "fonts"),
    // We need to copy the Sass to dist *after* the sass task, to ensure
    // that vendor libraries have been copied to the Sass directory first.
    "copy-dist-sass"
  )
);
