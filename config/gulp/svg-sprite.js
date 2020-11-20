const gulp = require('gulp');
const clean = require('gulp-clean');
const svgSprite = require('gulp-svg-sprite');
const rename = require('gulp-rename');
const { Stream } = require('stream');
const srcPath = './src/img/usa-icons/',
      staticPath = './src/img';

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
    symbol: true, // Activate the «symbol» mode
    dest: "foo"
  }
};

gulp.task("build-sprite", function (done) {
  gulp.src(`${srcPath}**/*.svg`)
    .pipe(svgSprite(config))
    .on('error', function(error) {
      console.log("There was an error");
    })
    .pipe(gulp.dest(`${staticPath}`))
    .on('end', function () { done(); });
 });

 gulp.task("rename-sprite", function (done) {
  gulp.src(`${staticPath}/symbol/svg/sprite.symbol.svg`)
    .pipe(rename(`${staticPath}/sprite.svg`))
    .pipe(gulp.dest(`./`))
    .on('end', function () { done(); });
  gulp.src(`${staticPath}/symbol`, {allowEmpty: true})
    .pipe(clean());
 });
 gulp.task(
  "svg-sprite",
  gulp.series(
    "build-sprite",
    "rename-sprite"
  )
); 