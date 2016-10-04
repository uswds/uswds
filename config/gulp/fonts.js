var gulp = require('gulp');
var dutil = require('./doc-util');
var task = 'fonts';

gulp.task(task, function (done) {

  dutil.logMessage(task, 'Copying Fonts');

  var stream = gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));

  return stream;

});
