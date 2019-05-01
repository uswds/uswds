const { formatters } = require('stylelint');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const discardComments = require('postcss-discard-comments');
const filter = require('gulp-filter');
const gulp = require('gulp');
const gulpStylelint = require('gulp-stylelint');
const packCSS = require('css-mqpacker');
const postcss = require('gulp-postcss');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixerOptions = require('./browsers');
const dutil = require('./doc-util');
const pkg = require('../../package.json');

const task = 'sass';
const normalizeCssFilter = filter('**/normalize.css', { restore: true });

const IGNORE_STRING = 'This file is ignored';
const ignoreStylelintIgnoreWarnings = lintResults => formatters.string(
  lintResults.reduce((memo, result) => {
    const { warnings } = result;
    const fileIsIgnored = warnings.some(warning => RegExp(IGNORE_STRING, 'i').test(warning.text));

    if (!fileIsIgnored) {
      memo.push(result);
    }

    return memo;
  }, []),
);

gulp.task('stylelint', () => gulp
  .src('./src/stylesheets/**/*.scss')
  .pipe(gulpStylelint({
    failAfterError: true,
    reporters: [{
      formatter: ignoreStylelintIgnoreWarnings, console: true,
    }],
    syntax: 'scss',
  }))
  .on('error', dutil.logError));

gulp.task('copy-vendor-sass', () => {
  dutil.logMessage('copy-vendor-sass', 'Compiling vendor CSS');

  const stream = gulp.src([
    './node_modules/normalize.css/normalize.css',
  ])
    .pipe(normalizeCssFilter)
    .pipe(rename('_normalize.scss'))
    .on('error', (error) => {
      dutil.logError('copy-vendor-sass', error);
    })
    .pipe(gulp.dest('src/stylesheets/lib'));

  return stream;
});

gulp.task('copy-dist-sass', () => {
  dutil.logMessage('copy-dist-sass', 'Copying all Sass to dist dir');

  const stream = gulp.src('src/stylesheets/**/*.scss')
    .pipe(gulp.dest('dist/scss'));

  return stream;
});

gulp.task('sass', gulp.series('copy-vendor-sass',
  () => {
    dutil.logMessage(task, 'Compiling Sass');
    const pluginsProcess = [
      discardComments(),
      autoprefixer(autoprefixerOptions),
      packCSS({ sort: true }),
    ];
    const pluginsMinify = [
      autoprefixer(autoprefixerOptions),
      packCSS({ sort: true }),
      cssnano(({ autoprefixer: { browsers: autoprefixerOptions } })),
    ];

    const stream = gulp.src('src/stylesheets/*.scss')
      .pipe(replace(
        /\buswds @version\b/g,
        `uswds v${pkg.version}`,
      ))
      .pipe(sourcemaps.init({ largeFile: true }))
      .pipe(
        sass({
          outputStyle: 'expanded',
        })
          .on('error', sass.logError),
      )
      .pipe(postcss(pluginsProcess))
      .pipe(gulp.dest('dist/css'))
      .pipe(rename({
        suffix: '.min',
      }))
      .pipe(postcss(pluginsMinify))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('dist/css'));

    return stream;
  }));
