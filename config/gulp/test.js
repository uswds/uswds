var gulp = require('gulp');
var mocha = require('gulp-spawn-mocha');

var mochaOpts = {
  opts: 'spec/mocha.opts',
};

gulp.task('test', function () {
  return gulp.src('spec/**/*.spec.js')
    .pipe(mocha(mochaOpts));
});

gulp.task('regression', () => {
  return gulp.src('spec/headless-chrome.js')
    .pipe(mocha(mochaOpts));
});

gulp.task('cover', function () {
  return gulp.src('spec/unit/**/*.spec.js')
    .pipe(mocha(Object.assign(mochaOpts, {
      istanbul: true
    })));
});

gulp.task('test:watch', () => {
  gulp.watch([
    'spec/**/*.spec.js',
    'src/js/**/*.js',
  ],
  gulp.series('test'),
  );
});
