var gulp = require('gulp');
var dutil = require('./doc-util');

global.cFlags = {

  production: false,
  test: true,
  gem: true,
  cleanup: true,

};

gulp.task('production', function (done) {

  dutil.logMessage('production', 'Assets will be production ready.');
  cFlags.production = true;
  done();

});

gulp.task('no-gem', function (done) {

  dutil.logMessage('no-gem', 'Disabling gem support for all tasks.');
  cFlags.gem = false;
  done();

});

gulp.task('no-test', function (done) {

  dutil.logMessage(
    'test',
    'Disabling linting and tests for all assets.'
  );
  cFlags.test = false;
  done();

});

gulp.task('no-cleanup', function (done) {

  dutil.logMessage(
    'cleanup',
    'Disabling cleanup of distribution directories.'
  );
  cFlags.cleanup = false;
  done();

});
