var gulp = require('gulp');
var dutil = require('./doc-util');

global.cFlags = {

  test: true,
  cleanup: true,
  failFast: false,

};

gulp.task('no-test', function (done) {

  dutil.logMessage(
    'no-test',
    'Disabling linting and tests for all assets.'
  );
  cFlags.test = false;
  done();

});

gulp.task('no-cleanup', function (done) {

  dutil.logMessage(
    'no-cleanup',
    'Disabling cleanup of distribution directories.'
  );
  cFlags.cleanup = false;
  done();

});

gulp.task('fail-fast', function (done) {

  dutil.logMessage(
    'fail-fast',
    'Failing when encountering linter warnings & errors.'
  );
  cFlags.failFast = true;
  done();

});
