var gulp = require('gulp');
var gutil = require('gulp-util');
var dutil = require('./doc-util');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var eslint = require('gulp-eslint');
var task = 'javascript';

gulp.task('eslint', function (done) {

  if (!cFlags.test) {
    dutil.logMessage('eslint', 'Skipping linting of JavaScript files.');
    return done();
  }

  return gulp.src([
      'src/js/**/*.js',
      '!src/js/vendor/**/*.js',
      'spec/**/*.js'
    ])
    .pipe(eslint())
    .pipe(eslint.format());

});

gulp.task(task, [ 'eslint' ], function (done) {

  dutil.logMessage(task, 'Compiling JavaScript');

  var defaultStream = browserify({
    entries: 'src/js/start.js',
    debug: true,
  });

  var stream = defaultStream.bundle()
    .pipe(source('components.js'))
    .pipe(buffer())
    .pipe(rename({ basename: dutil.pkg.name }))
    .pipe(gulp.dest('dist/js'));

  stream
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(rename({
      suffix: '.min',
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'));

  return stream;

});
