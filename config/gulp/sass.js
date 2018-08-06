var gulp = require('gulp');
var dutil = require('./doc-util');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var cssnano = require('cssnano');
var packCSS = require('css-mqpacker');
var autoprefixer = require('autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var linter = require('@18f/stylelint-rules');
var pkg = require('../../package.json');
var path = require('path');
var filter = require('gulp-filter');
var replace = require('gulp-replace');
var runSequence = require('run-sequence');
var stripCssComments = require('gulp-strip-css-comments');
var del = require('del');
var task = 'sass';
var autoprefixerOptions = require('./browsers');

var entryFileFilter = filter('uswds.scss', { restore: true });
var normalizeCssFilter = filter('normalize.css', { restore: true });

gulp.task('stylelint',
  linter('./src/stylesheets/{,core/,components/,elements/}*.scss',
  {
    ignore: './src/stylesheets/lib/**/*.scss'
  })
);

gulp.task('copy-vendor-sass', function () {

  dutil.logMessage('copy-vendor-sass', 'Compiling vendor CSS');

  var stream = gulp.src([
    './node_modules/normalize.css/normalize.css',
    './node_modules/bourbon/app/assets/stylesheets/**/*.scss',
    './node_modules/bourbon-neat/app/assets/stylesheets/**/*.scss',
  ])
    .pipe(normalizeCssFilter)
    .pipe(rename('_normalize.scss'))
    .pipe(normalizeCssFilter.restore)
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

gulp.task(task, [ 'copy-vendor-sass' ], function () {
  dutil.logMessage(task, 'Compiling Sass');
  var plugins = [
    autoprefixer(autoprefixerOptions),
    packCSS({ sort: true }),
    cssnano()
  ];

  var stream = gulp.src('src/stylesheets/*.scss')
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(
      sass({
        outputStyle: 'expanded',
      })
        .on('error', sass.logError)
    )
    .pipe(stripCssComments())
    .pipe(postcss(plugins))
    .pipe(replace(
      /\buswds @version\b/g,
      'uswds v' + pkg.version
    ))
    .pipe(gulp.dest('dist/css'))
    .pipe(rename({
      suffix: '.min',
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'));

  return stream;
});
