var gulp = require('gulp');
var mocha = require('gulp-spawn-mocha');
var runSequence = require('run-sequence');

var mochaOpts = {
  opts: 'spec/mocha.opts',
};

gulp.task('test', function () {
  return gulp.src('spec/**/*.spec.js')
    .pipe(mocha(mochaOpts));
});

gulp.task('cover', function () {
  return gulp.src('spec/unit/**/*.spec.js')
    .pipe(mocha(Object.assign(mochaOpts, {
      istanbul: true
    })));
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
