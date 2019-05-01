const gulp = require('gulp');
const mocha = require('gulp-spawn-mocha');

const mochaOpts = {
  opts: 'spec/mocha.opts',
};

gulp.task('test', () => gulp.src('spec/**/*.spec.js')
  .pipe(mocha(mochaOpts)));

gulp.task('regression', () => gulp.src('spec/headless-chrome.js')
  .pipe(mocha(mochaOpts)));

gulp.task('cover', () => gulp.src('spec/unit/**/*.spec.js')
  .pipe(mocha(Object.assign(mochaOpts, {
    istanbul: true,
  }))));

gulp.task('test:watch', () => {
  gulp.watch([
    'spec/**/*.spec.js',
    'src/js/**/*.js',
  ],
  gulp.series('test'));
});
