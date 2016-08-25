var gulp = require('gulp');
var mocha = require('gulp-mocha');
var runSequence = require('run-sequence');

gulp.task('test', function () {
  return gulp.src('spec/**/*.spec.js')
    .pipe(mocha());
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
