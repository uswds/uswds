var gulp = require('gulp');
var nunjucks = require('gulp-nunjucks');
var beautify = require('gulp-html-beautify');
var pkg = require('../../package.json');

gulp.task('html', function (done) {
  return gulp.src([
      'src/template/*.html'
    ])
    .pipe(nunjucks.compile({
      lang: 'en-US',
      'package': pkg,
      uswds: {
        path: '..',
      },
    }))
    .pipe(beautify({
      indent_char: ' ',
      indent_size: 2,
    }))
    .pipe(gulp.dest('dist/html'));
});
