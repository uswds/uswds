var gulp = require('gulp');
var dutil = require('./doc-util');
var spawn = require('cross-spawn');
var runSequence = require('run-sequence');
var del = require('del');
var task = 'release';

gulp.task('make-tmp-directory', function (done) {

  dutil.logMessage('make-tmp-directory', 'Creating temporary release directory.');

  return gulp.src('dist/**/*')
    .pipe(gulp.dest(dutil.dirName));

});

gulp.task('clean-tmp-directory', function (done) {

  dutil.logMessage('clean-tmp-directory', 'Deleting temporary release directory.');

  return del(dutil.dirName);
});

gulp.task('zip-archives', function (done) {

  dutil.logMessage('zip-archives', 'Creating a zip archive in dist/' + dutil.dirName + '.zip');

  var zip = spawn('zip', [
    '--log-info',
    '-r',
    './dist/' + dutil.dirName + '.zip',
    dutil.dirName,
    '-x "*.DS_Store"',
  ]);

  zip.stdout.on('data', function (data) {

    if (/[\w\d]+/.test(data)) {

      dutil.logData('zip-archives', data);

    }

  });

  zip.stderr.on('data', function (data) {

    dutil.logError('zip-archives', data);

  });

  zip.on('error', function (error) {

     dutil.logError('zip-archives', 'Failed to create a zip archive');

     done(error);
  });

  zip.on('close', function (code) { if (0 === code) { done(); } });

});

gulp.task(task, [ 'build' ], function (done) {

  dutil.logMessage(task, 'Creating a zip archive at dist/' + dutil.dirName + '.zip');

  runSequence(
    'make-tmp-directory',
    'zip-archives',
    'clean-tmp-directory',
    done
  );
});
