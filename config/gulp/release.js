var gulp = require('gulp');
var dutil = require('./doc-util');
var task = /([\w\d-_]+)\.js$/.exec(__filename)[ 1 ];
var spawn = require('cross-spawn');
var runSequence = require('run-sequence');
var del = require('del');


gulp.task('make-tmp-directory', function (done) {
  var cp = spawn('cp', [
    '-rvf',
    'dist',
    dutil.dirName,
  ]);

  cp.stdout.on('data', function (data) {

    if (/[\w\d]+/.test(data)) {

      dutil.logData('make-tmp-directory', data);

    }

  });

  cp.stderr.on('data', function (data) {

    dutil.logError('make-tmp-directory', data);

  });

  cp.on('error', function (error) { done(error); });

  cp.on('close', function (code) { if (0 === code) { done(); } });

});

gulp.task('clean-tmp-directory', function (done) {
  return del(dutil.dirName);
});

gulp.task('zip-archives', function (done) {

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

  zip.on('error', function (error) { done(error); });

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
