const gulp = require('gulp');
const del = require('del');
const svgSprite = require('gulp-svg-sprite');
const rename = require('gulp-rename');
const svgPath = 'src/img';


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
   cb();
   return del.sync(`${svgPath}/symbol`);
 });
 
 gulp.task(
  "svg-sprite",
  gulp.series(
    "build-sprite",
    "rename-sprite",
    "clean-sprite"
  )
); 