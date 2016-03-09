var gulp = require('gulp');
var gutil = require('gulp-util');
var dutil = require('./doc-util');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var merge = require('merge-stream');
var rename = require('gulp-rename');
var assert = require('gulp-if');
var linter = require('gulp-eslint');
var task = /([\w\d-_]+)\.js$/.exec(__filename)[ 1 ];

gulp.task('eslint', function (done) {

  if (!cFlags.test) {
    dutil.logMessage('eslint', 'Skipping linting of JavaScript files.');
    return done();
  }

  return gulp.src([ 'src/js/**/*.js', '!src/js/vendor/**/*.js' ])
    .pipe(linter('.eslintrc'))
    .pipe(linter.format());

});

gulp.task(task, [ 'eslint' ], function (done) {

  dutil.logMessage(task, 'Compiling JavaScript');

  var defaultStream = browserify({
    entries: 'src/js/start.js',
    debug: true,
  });

  defaultStream = defaultStream.bundle()
    .pipe(source('components.js'))
    .pipe(buffer())
    .pipe(rename({ basename: dutil.fileName }))
    .pipe(gulp.dest('dist/js'));

  var minifiedStream = browserify({
    entries: 'src/js/start.js',
    debug: true,
  });

  minifiedStream = minifiedStream.bundle()
    .pipe(source('components.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(uglify())
      .on('error', gutil.log)
      .pipe(rename({
        basename: dutil.fileName,
        suffix: '.min',
      }))
    .pipe(sourcemaps.write('.', { addComment: false }))
    .pipe(gulp.dest('dist/js'));


  if (cFlags.gem) {
    dutil.logMessage(task, 'Creating gem directories');
    defaultStream = defaultStream.pipe(gulp.dest('dist-gem/assets/js'));
    defaultStream = defaultStream.pipe(gulp.dest('dist-gem/app/assets/javascript'));
  }

  return merge(defaultStream, minifiedStream);

});
