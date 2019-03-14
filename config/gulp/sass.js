var gulp = require('gulp');
var dutil = require('./doc-util');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var cssnano = require('cssnano');
var packCSS = require('css-mqpacker');
var autoprefixer = require('autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var gulpStylelint = require('gulp-stylelint');
const { formatters } = require('stylelint');
var pkg = require('../../package.json');
var path = require('path');
var filter = require('gulp-filter');
var replace = require('gulp-replace');
var stripCssComments = require('gulp-strip-css-comments');
var del = require('del');
var task = 'sass';
var autoprefixerOptions = require('./browsers');
var path = require('path');

var entryFileFilter = filter('uswds.scss', { restore: true });
var normalizeCssFilter = filter('**/normalize.css', { restore: true });

const IGNORE_STRING = 'This file is ignored';
const ignoreStylelintIgnoreWarnings = lintResults =>
  formatters.string(
    lintResults.reduce((memo, result) => {
      const { warnings } = result;
      const fileIsIgnored = warnings.some((warning) => {
        return RegExp(IGNORE_STRING, 'i').test(warning.text);
      });

      if (!fileIsIgnored) {
        memo.push(result);
      }

      return memo;
    }, [])
  );

gulp.task('stylelint', () => {
  return gulp
    .src('./src/stylesheets/**/*.scss')
    .pipe(gulpStylelint({
      failAfterError: true,
      reporters: [{
        formatter: ignoreStylelintIgnoreWarnings, console: true,
      }],
      syntax: 'scss',
    }))
    .on('error', dutil.logError);
});

gulp.task('copy-vendor-sass', function () {

  dutil.logMessage('copy-vendor-sass', 'Compiling vendor CSS');

  var stream = gulp.src([
    './node_modules/normalize.css/normalize.css',
  ])
    .pipe(normalizeCssFilter)
    .pipe(rename('_normalize.scss'))
    .on('error', function (error) {
      dutil.logError('copy-vendor-sass', error);
    })
    .pipe(gulp.dest('src/stylesheets/lib'));

  return stream;
});

gulp.task('copy-dist-sass', function () {
  dutil.logMessage('copy-dist-sass', 'Copying all Sass to dist dir');

  var stream = gulp.src('src/stylesheets/**/*.scss')
    .pipe(gulp.dest('dist/scss'));

  return stream;
});

gulp.task('sass', gulp.series('copy-vendor-sass', 
  function () {
      dutil.logMessage(task, 'Compiling Sass');
      var plugins = [
        autoprefixer(autoprefixerOptions),
        packCSS({ sort: true }),
        cssnano(({ autoprefixer: { browsers: autoprefixerOptions }}))
      ];

      var stream = gulp.src('src/stylesheets/*.scss')
        .pipe(replace(
          /\buswds @version\b/g,
          'uswds v' + pkg.version
        ))
        .pipe(sourcemaps.init({ largeFile: true }))
        .pipe(
          sass({
            outputStyle: 'expanded',
          })
            .on('error', sass.logError)
        )
        .pipe(postcss(plugins))
        .pipe(gulp.dest('dist/css'))
        .pipe(rename({
          suffix: '.min',
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css'));

      return stream;
  }
)
);
