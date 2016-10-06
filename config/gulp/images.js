var gulp = require('gulp');
var dutil = require('./doc-util');
var task = 'images';

gulp.task(task, function (done) {

  dutil.logMessage(task, 'Copying Images');

  var stream = gulp.src('src/img/**/*')
    .pipe(gulp.dest('dist/img'));

  return stream;

});
