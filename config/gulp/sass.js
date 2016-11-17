var gulp = require('gulp');
var dutil = require('./doc-util');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var linter = require('@18f/stylelint-rules');
var merge = require('merge-stream');
var pkg = require('../../package.json');
var filter = require('gulp-filter');
var replace = require('gulp-replace');
var runSequence = require('run-sequence');
var del = require('del');
var task = 'sass';

var entryFileFilter = filter('uswds.scss', { restore: true });
var normalizeCssFilter = filter('normalize.css', { restore: true });
var supportedBrowsers = [
  '> 1%',
  'Last 2 versions',
  'IE 11',
  'IE 10',
  'IE 9',
];

gulp.task('stylelint',
  linter('./src/stylesheets/{,core/,components/,elements/}*.scss',
  {
    ignore: './src/stylesheets/lib/**/*.scss'
  })
);

gulp.task('copy-vendor-sass', function (done) {

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

/**
 * XXX the 'stylelint' prerequisite is commented out here because
 * there are currently a TON of linting errors in our SCSS files.
 */
gulp.task(task, [ /* 'stylelint' */ ], function (done) {

  dutil.logMessage(task, 'Compiling Sass');

  var entryFile = 'src/stylesheets/uswds.scss';

  var replaceVersion = replace(
    /\buswds @version\b/g,
    'uswds v' + pkg.version
  );

  var defaultStream = gulp.src(entryFile)
    .pipe(
      sass({ outputStyle: 'expanded' })
        .on('error', sass.logError)
    )
    .pipe(
      autoprefixer({
        browsers: supportedBrowsers,
        cascade: false,
      })
    )
    .pipe(rename({ basename: dutil.pkg.name }))
    .pipe(replaceVersion)
    .pipe(gulp.dest('dist/css'));

  var minifiedStream = gulp.src(entryFile)
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(
      sass({ outputStyle: 'compressed' })
        .on('error', sass.logError)
    )
    .pipe(
      autoprefixer({
        browsers: supportedBrowsers,
        cascade: false,
      })
    )
    .pipe(rename({
      basename: dutil.pkg.name,
      suffix: '.min',
    }))
    .pipe(sourcemaps.write('.', { addComment: false }))
    .pipe(replaceVersion)
    .pipe(gulp.dest('dist/css'));

  var streams = merge(defaultStream, minifiedStream);

  return streams;

});
