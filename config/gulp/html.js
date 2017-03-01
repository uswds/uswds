var gulp = require('gulp');
var nunjucks = require('gulp-nunjucks');
var beautify = require('gulp-html-beautify');

gulp.task('html', function (done) {
  return gulp.src([
      'src/template/*.html'
    ])
    .pipe(nunjucks.compile({
      lang: 'en-US',
      uswds: {
        path: '..',
      }
    }))
    .pipe(beautify({
      indent_char: ' ',
      indent_size: 2,
    }))
    .pipe(gulp.dest('dist/html'));
});
