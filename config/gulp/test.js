var gulp = require('gulp');
var mocha = require('gulp-mocha');
var runSequence = require('run-sequence');

var mochaOpts = {
  require: [
    'jsdom-global/register'
  ]
};

gulp.task('test', function () {
  return gulp.src('spec/**/*.spec.js')
    .pipe(mocha(mochaOpts));
});

gulp.task('cover', function () {
  return gulp.src('spec/unit/**/*.spec.js')
    .pipe(mocha(mochaOpts));
});

gulp.task('test:watch', function () {
  gulp.watch([
    'spec/**/*.spec.js',
    'src/js/**/*.js',
  ], function (event) {
    runSequence(
      'test'
    );
  });
});
