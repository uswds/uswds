const gulp = require('gulp');
const clean = require('gulp-clean');
const svgSprite = require('gulp-svg-sprite');
const rename = require('gulp-rename');
const { Stream } = require('stream');
const svgPath = 'src/img';

const task = "svg-sprite";


// More complex configuration example
config = {
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

gulp.task("build-sprite", function (done) {
  gulp.src(`${svgPath}/usa-icons/**/*.svg`)
    .pipe(svgSprite(config))
    .on('error', function(error) {
      console.log("There was an error");
    })
    .pipe(gulp.dest(`${svgPath}`))
    .on('end', function () { done(); });
 });

 gulp.task("rename-sprite", function (done) {
  gulp.src(`${svgPath}/symbol/svg/sprite.symbol.svg`)
    .pipe(rename(`${svgPath}/sprite.svg`))
    .pipe(gulp.dest(`./`))
    .on('end', function () { done(); });
 });

 gulp.task("clean-sprite", function(cb) {
  const stream = gulp.src(`dist/img/symbol`, {allowEmpty: true}).pipe(clean());
  cb();
  return stream;
 });
 
 gulp.task(
  "svg-sprite",
  gulp.series(
    "build-sprite",
    "rename-sprite"
  )
); 