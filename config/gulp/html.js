var gulp = require('gulp');
var nj = require('nunjucks');
var nunjucks = require('gulp-nunjucks');
var beautify = require('gulp-html-beautify');
var path = require('path');
var pkg = require('../../package.json');

gulp.task('html', function (done) {
  var paths = [
    'src/templates',
    'src/components',
  ].map(dir => path.join(__dirname, '../../', dir));

  var options = {
    env: new nj.Environment(new nj.FileSystemLoader(paths)),
  };

  return gulp.src([
      'src/templates/**/*.html'
    ])
    .pipe(nunjucks.compile({
      lang: 'en-US',
      'package': pkg,
      uswds: {
        path: '..',
      },
    }, options))
    .pipe(beautify({
      indent_char: ' ',
      indent_size: 2,
    }))
    .pipe(gulp.dest('dist/html'));
});
