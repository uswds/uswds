var gulp = require('gulp');
var nunjucks = require('gulp-nunjucks');
var beautify = require('gulp-html-beautify');

gulp.task('html', function (done) {
  var data = require('./template-data');
  return gulp.src([
      'src/templates/**/page-*.html'
    ])
    .pipe(nunjucks.compile(data))
    .pipe(beautify({
      indent_char: ' ',
      indent_size: 2,
    }))
    .pipe(gulp.dest('dist/html'));
});
