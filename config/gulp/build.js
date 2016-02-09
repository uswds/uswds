var gulp = require('gulp');
var dutil = require('./doc-util');
var clean = require('gulp-clean');
var runSequence = require( 'run-sequence' );

gulp.task('clean-dist', function (done) {

  if (!cFlags.cleanup) {
    dutil.logMessage(
      'clean-dist',
      'Skipping cleaning up the distrubtion directories.'
    );
    return done();
  }

  dutil.logMessage('clean-dist', 'Removing distrubtion directories.');

  return gulp.src([ 'dist', 'dist-gem/*' ], { read: false })
    .pipe(clean());

});

gulp.task('build', function (done) {

  dutil.logIntroduction();
  dutil.logMessage(
    'build',
    'The build task has created distrubtion directories.'
  );

  runSequence(
    'clean-dist',
    [
      'sass',
      'javascript',
      'images',
      'fonts',
    ],
    done
  );

});
