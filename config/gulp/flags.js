var gulp = require('gulp');
var dutil = require('./doc-util');

global.cFlags = {

  test: true,
  cleanup: true,

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
