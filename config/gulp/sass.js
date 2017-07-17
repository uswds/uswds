var path = require('path');
var gulp = require('gulp');
var dutil = require('./doc-util');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var linter = require('@18f/stylelint-rules');
var pkg = require('../../package.json');
var sassIncludePaths = require('../../sass-include-paths');
var filter = require('gulp-filter');
var replace = require('gulp-replace');
var runSequence = require('run-sequence');
var del = require('del');
var task = 'sass';

gulp.task('stylelint',
  linter('./src/stylesheets/{,core/,components/,elements/}*.scss',
  {
    ignore: './src/stylesheets/lib/**/*.scss'
  })
);

gulp.task('copy-dist-sass', function () {
  dutil.logMessage('copy-dist-sass', 'Copying all SASS to dist dir');

  var sources = sassIncludePaths.all.map(path => `${path}/**/*.{scss,css}`);
  var stream = gulp.src(sources)
   .pipe(gulp.dest('dist/scss'));

  return stream;
});

gulp.task(task, function () {

  dutil.logMessage(task, 'Compiling Sass');

  var stream = gulp.src('src/stylesheets/uswds.scss')
    // 1. do the version replacement
    .pipe(replace(
      /\buswds @version\b/g,
      'uswds v' + pkg.version
    ))
    // 2. convert SCSS to CSS
    .pipe(
      sass({
        outputStyle: 'expanded',
        includePaths: sassIncludePaths.thirdParty,
      })
        .on('error', sass.logError)
    )
    // 3. run it through autoprefixer
    .pipe(
      autoprefixer({
        browsers: require('./browsers'),
        cascade: false,
      })
    )
    // 4. write dist/css/uswds.css
    .pipe(gulp.dest('dist/css'));

  // we can reuse this stream for minification!
  stream
    // 1. initialize sourcemaps
    .pipe(sourcemaps.init({ loadMaps: true }))
    // 2. minify with cssnano
    .pipe(cssnano({
      safe: true,
      // XXX see https://github.com/ben-eb/cssnano/issues/340
      mergeRules: false,
    }))
    // 3. rename to uswds.min.css
    .pipe(rename({
      suffix: '.min',
    }))
    // 4. write dist/css/uswds.min.css.map
    .pipe(sourcemaps.write('.'))
    // 5. write dist/css/uswds.min.css
    .pipe(gulp.dest('dist/css'));

  return stream;
});
