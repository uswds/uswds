var gulp = require('gulp');
var dutil = require('./doc-util');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var linter = require('gulp-scss-lint');
var merge = require('merge-stream');
var filter = require('gulp-filter');
var task = /([\w\d-_]+)\.js$/.exec(__filename)[ 1 ];

var entryFileFilter = filter('all.scss', { restore: true });
var normalizeCssFilter = filter('normalize.css', { restore: true });

gulp.task('scss-lint', function (done) {

  if (!cFlags.test) {
    dutil.logMessage('scss-lint', 'Skipping linting of Sass files.');
    return done();
  }

  return gulp.src('src/stylesheets/**/*.scss')
    .pipe(linter({
      config: '.scss-lint.yml',
    }));

});

gulp.task('copy-vendor-sass', function (done) {

  dutil.logMessage('copy-vendor-sass', 'Compiling vendor CSS');

  var stream = gulp.src([
    './node_modules/normalize.css/normalize.css',
    './node_modules/bourbon/app/assets/stylesheets/**/*.scss',
    './node_modules/bourbon-neat/app/assets/stylesheets/**/*.scss'])
  .pipe(normalizeCssFilter)
    .pipe(rename('_normalize.scss'))
  .pipe(normalizeCssFilter.restore)
  .pipe(gulp.dest('src/stylesheets/lib'));

  return stream;
});

gulp.task(task, [ 'scss-lint', 'copy-vendor-sass' ], function (done) {

  dutil.logMessage(task, 'Compiling Sass');

  var entryFile = 'src/stylesheets/all.scss';

  var defaultStream = gulp.src(entryFile)
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(rename({
      basename: dutil.pkg.name,
    }))
    .pipe(gulp.dest('dist/css'));

  var minifiedStream = gulp.src(entryFile)
    .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
      .pipe(rename({
        basename: dutil.pkg.name,
        suffix: '.min',
      }))
    .pipe(sourcemaps.write('.', { addComment: false }))
    .pipe(gulp.dest('dist/css'));

  var streams = merge(defaultStream, minifiedStream);

  return streams;

});
