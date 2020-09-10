const gulp = require("gulp");
const mocha = require("gulp-spawn-mocha");

const mochaConfig = {
  config: "spec/.mocharc.json",
};

gulp.task("test", () => gulp.src("spec/**/*.spec.js").pipe(mocha(mochaConfig)));

gulp.task("regression", () =>
  gulp.src("spec/headless-chrome.js").pipe(mocha(mochaConfig))
);

gulp.task("cover", () =>
  gulp.src("spec/unit/**/*.spec.js").pipe(
    mocha(
      mochaConfig,
      Object.assign({
        nyc: true,
      })
    )
  )
);

gulp.task("test:watch", () => {
  gulp.watch(["spec/**/*.spec.js", "src/js/**/*.js"], gulp.series("test"));
});
