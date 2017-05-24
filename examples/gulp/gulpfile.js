var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

var sourcemaps = require('gulp-sourcemaps');

var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');

gulp.task('css', function () {
  return gulp.src([
      'src/css/*.scss',
      '!**/_*.scss'
    ])
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: [
        'node_modules/uswds/src/stylesheets',
      ],
      outputStyle: 'compressed',
    }))
    .pipe(autoprefixer({
      // NB: browsers are read from the "browserslist" field in
      // package.json
      cascade: false,
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('assets/css'));
});

gulp.task('js', function () {
  return browserify({
      entries: 'src/js/main.js',
      debug: true,
    })
    .transform('babelify', {
      global: true,
      presets: ['es2015']
    })
    .bundle()
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({
      loadMaps: true,
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('assets/js'));
});

gulp.task('default', ['css', 'js']);
