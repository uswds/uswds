var child_process = require('child_process');
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

gulp.task(task, function (done) {

  dutil.logMessage(task, 'Compiling JavaScript');

  var defaultStream = browserify({
    entries: 'src/js/start.js',
    debug: true,
  })
  .transform('babelify', {
    global: true,
    presets: ['es2015'],
  });

  var stream = defaultStream.bundle()
    .pipe(source('uswds.js')) // XXX why is this necessary?
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

gulp.task('typecheck', function () {
  return new Promise((resolve, reject) => {
    child_process.spawn(
      './node_modules/.bin/tsc',
      { stdio: 'inherit' }
    )
    .on('error', reject)
    .on('exit', code => {
      if (code === 0) {
        dutil.logMessage('typecheck', 'TypeScript likes our code!');
        resolve();
      } else {
        reject(new Error('TypeScript failed, see output for details!'));
      }
     });
  });
});

gulp.task('eslint', function (done) {
  if (!cFlags.test) {
    dutil.logMessage('eslint', 'Skipping linting of JavaScript files.');
    return done();
  }

  return gulp.src([
      'src/js/**/*.js',
      'spec/**/*.js'
    ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
