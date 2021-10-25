/* eslint-disable arrow-body-style */
const gulp = require('gulp');
const del = require('del');
const svgSprite = require('gulp-svg-sprite');
const rename = require('gulp-rename');

const svgPath = 'src/img';

// More complex configuration example
const config = {
  shape: {
    dimension: { // Set maximum dimensions
      maxWidth: 24,
      maxHeight: 24
    },
    id: {
      separator: "-"
    },
    spacing: { // Add padding
      padding: 0
    }
  },
  mode: {
    symbol: true
  }
};

gulp.task("build-sprite", (done) => {
  return gulp.src(`${svgPath}/usa-icons/**/*.svg`)
    .pipe(svgSprite(config))
    // eslint-disable-next-line no-console
    .on('error', (error) => console.error("There was an error", error))
    .pipe(gulp.dest(`${svgPath}`))
    .on('end', () => done())
});

gulp.task("rename-sprite", () => {
  return gulp.src(`${svgPath}/symbol/svg/sprite.symbol.svg`)
      .pipe(rename(`${svgPath}/sprite.svg`))
      .pipe(gulp.dest(`./`));
});

gulp.task("clean-sprite", () => del(`${svgPath}/symbol`));

gulp.task(
  "svg-sprite",
  gulp.series(
    "build-sprite",
    "rename-sprite",
    "clean-sprite"
  )
);
