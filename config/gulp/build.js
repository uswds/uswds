var gulp = require('gulp');
var dutil = require('./doc-util');
var clean = require('gulp-clean');
var runSequence = require( 'run-sequence' );

gulp.task('clean-dist', function (done) {

  if (!cFlags.cleanup) {
    dutil.logMessage(
      'clean-dist',
      'Skipping cleaning up the distribution directories.'
    );
    return done();
  }

  dutil.logMessage('clean-dist', 'Removing distribution directories.');

  return gulp.src([ 'dist' ], { read: false }).pipe(clean());

});

gulp.task('docs', function (done) {
   
  dutil.logMessage('docs', 'Copying documentation dist dir');

  var stream = gulp.src([
    'README.md',
    'LICENSE.md',
    'CONTRIBUTING.md'
    ])
    .pipe(gulp.dest('dist'));

  return stream;

});

gulp.task('build', function (done) {

  dutil.logIntroduction();
  dutil.logMessage(
    'build',
    'Creating distribution directories.'
  );

  runSequence(
    'clean-dist',
    'docs',
    [
      'sass',
      'javascript',
      'images',
      'fonts',
    ],
    // We need to copy the SASS to dist *after* the sass task, to ensure
    // that vendor libraries have been copied to the SASS directory first.
    'copy-dist-sass',
    done
  );

});
