var gulp = require('gulp');
var dutil = require('./doc-util');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var linter = require('gulp-scss-lint');
var merge = require('merge-stream');
var filter = require('gulp-filter');
var task = /([\w\d-_]+)\.js$/.exec(__filename)[ 1 ];

var options = {
  outputStyle: cFlags.production ? 'compressed' : 'expanded',
  includePaths: require('node-bourbon').includePaths.concat(
                require('node-neat').includePaths)
};

var entryFile = filter('all.scss', { restore: true });

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

gulp.task(task, [ 'scss-lint' ], function (done) {

  dutil.logMessage(task, 'Compiling Sass');

  var compiledStream = gulp.src('src/stylesheets/all.scss')
    .pipe(sourcemaps.init())
    .pipe(sass(options).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(rename({ basename: dutil.pkg.name }))
    .pipe(gulp.dest('dist/css'));

  var streams = merge(compiledStream);

  if (cFlags.gem) {
    dutil.logMessage(task, 'Creating gem directories');
    compiledStream.pipe(gulp.dest('dist-gem/assets/css'))
      .pipe(gulp.dest('dist-gem/app/assets/stylesheets'));
    dutil.logMessage(task, 'Creating gem src directories');
    var srcStream = gulp.src('src/stylesheets/**/*.scss')
      .pipe(entryFile)
        .pipe(rename('us_web_design_standards.scss'))
      .pipe(entryFile.restore)
      .pipe(gulp.dest('dist-gem/assets/sass'));
    streams.add(srcStream);
  }

  return streams;

});
