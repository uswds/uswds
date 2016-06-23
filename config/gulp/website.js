var gulp = require('gulp');
var dutil = require('./doc-util');
var spawn = require('cross-spawn');
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var runSequence = require('run-sequence');
var del = require('del');
var clean = require('gulp-clean');

var task = /([\w\d-_]+)\.js$/.exec(__filename)[ 1 ];
var taskBuild = task + ':build';
var taskServe = task + ':serve';
var taskDev = task + ':development';

gulp.task('clean-fonts', function () {
  return del('docs/assets/fonts/');
});
gulp.task('clean-bundled-javascript', function () {
  return del('docs/assets/js/vendor/' + dutil.pkg.name + '.min.js');
});

gulp.task('clean-generated-assets', function (done) {
  runSequence(
    [
      'clean-fonts',
      'clean-bundled-javascript',
    ],
    done
  );
});


gulp.task('copy-docs-assets:images', function (done) {

  dutil.logMessage('copy-docs-assets:images', 'Copying docs/doc_assets/img to docs/assets/img');

  return gulp.src('docs/doc_assets/img/**/*')
    .on('error', function (data) { dutil.logError('copy-docs-assets:images', data); })
    .pipe(gulp.dest('docs/assets/img'));

});

gulp.task('copy-docs-assets:stylesheets', function (done) {

  dutil.logMessage('copy-docs-assets:stylesheets', 'Copying docs/doc_assets/css to docs/assets/css');

  return gulp.src('docs/doc_assets/css/**/*')
    .on('error', function (data) { dutil.logError('copy-docs-assets:stylesheets', data); })
    .pipe(gulp.dest('docs/assets/css'));

});
gulp.task('copy-docs-assets:javascript', function (done) {

  // Only copies over the vendor files. The source JavaScript is bundled using Browserify
  // @see: config/gulp/javascript.js

  dutil.logMessage('copy-docs-assets:javascript', 'Copying docs/doc_assets/js/vendor to docs/assets/js/vendor');

  return gulp.src('docs/doc_assets/js/vendor/**/*')
    .on('error', function (data) { dutil.logError('copy-docs-assets:javascript', data); })
    .pipe(gulp.dest('docs/assets/js/vendor'));

});

gulp.task('copy-bundled-javascript', function (done) {

  dutil.logMessage('copy-bundled-javascript', 'Copying ' + dutil.dirName + ' release JavaScript');

  return gulp.src('dist/js/' + dutil.pkg.name + '.min.js')
    .on('error', function (data) { dutil.logError('copy-bundled-javascript', data); })
    .pipe(gulp.dest('docs/assets/js/vendor'));

});

gulp.task('copy-fonts', function (done) {

  dutil.logMessage('copy-fonts', 'Copying ' + dutil.dirName + ' release fonts');

  return gulp.src('dist/fonts/**/*')
    .on('error', function (data) { dutil.logError('copy-fonts', data); })
    .pipe(gulp.dest('docs/assets/fonts'));

});

gulp.task('copy-images', function (done) {

  dutil.logMessage('copy-images', 'Copying ' + dutil.dirName + ' release images');

  return gulp.src('dist/img/**/*')
    .on('error', function (data) { dutil.logError('copy-images', data); })
    .pipe(gulp.dest('docs/assets/img'));
});

gulp.task('copy-assets', [ 'build' ], function (done) {
  runSequence(
    'clean-generated-assets',
    'docs_javascript',
    [
      'copy-bundled-javascript',
      'copy-fonts',
      'copy-images',
      'copy-docs-assets:images',
      'copy-docs-assets:stylesheets',
      'copy-docs-assets:javascript',
    ],
    done
  );
});

// Wrapper task for `bundle install` which installs gems for the Jekyll site.
//
gulp.task('bundle-gems', function (done) {

  var bundle = spawn('bundle');

  bundle.stdout.on('data', function (data) {

    if (/[\w\d]+/.test(data)) {

      dutil.logData('bundle-gems', data);

    }

  });

  bundle.stderr.on('data', function (data) {

    dutil.logError('bundle-gems', data);

  });

  bundle.on('error', function (error) { done(error); });

  bundle.on('close', function (code) { if (0 === code) { done(); } });

});

// Base task for `gulp website` prints helpful information about available commands.
//
gulp.task(task, function (done) {

  dutil.logIntroduction();

  dutil.logHelp(
    'gulp ' + task,
    'This is the default website task. Please review the available commands.'
 );

  dutil.logCommand(
    'gulp ' + taskBuild,
    'Build the website.'
 );

  dutil.logCommand(
    'gulp ' + taskServe,
    'Preview the website locally and rebuild it when files change.'
 );

  done();

});

// Wrapper task for `jekyll serve --watch` which runs after `gulp bundle-gems` to make sure
// the gems are properly bundled.
//
gulp.task(taskServe, [ 'copy-assets', 'bundle-gems' ], function (done) {

  gulp.watch([
    'docs/doc_assets/css/**/*.scss',
    'src/stylesheets/components/**/*.scss',
    'src/stylesheets/elements/**/*.scss',
    'src/stylesheets/core/**/*.scss',
    'src/stylesheets/all.scss',
    '!docs/doc_assets/css/lib/**/*',
    '!src/stylesheets/lib/**/*',
  ], function (event) {
    runSequence(
      'sass',
      'copy-docs-assets:stylesheets'
    );
  });
  gulp.watch([
    'src/js/**/*.js',
    '!src/js/vendor/**/*',
  ], function (event) {
    runSequence(
      'javascript',
      'clean-bundled-javascript',
      [
        'copy-bundled-javascript',
        'copy-docs-assets:javascript',
      ]
    );
  });
  gulp.watch([
    'docs/doc_assets/js/**/*.js',
    '!docs/doc_assets/js/vendor/**/*',
  ], function (event) {
    runSequence('docs_javascript');
  });
  gulp.watch('src/img/**/*', function (event) {
    runSequence(
      'images',
      [
        'copy-images',
        'copy-docs-assets:images',
      ]
    );
  });
  gulp.watch('src/fonts/**/*', function (event) {
    runSequence(
      'fonts',
      'clean-fonts',
      'copy-fonts'
    );
  });

  var jekyll = spawn('jekyll', [ 'serve', '-w' ]);

  jekyll.stdout.on('data', function (data) {

    if (/[\w\d]+/.test(data)) {

      data += '';
      data = data.replace(/[\s]+/g, ' ');

      if (/done|[^-]regen/i.test(data)) {

        dutil.logMessage(taskServe, data);

      } else {

        dutil.logData(taskServe, data);

      }

    }

  });

  jekyll.stderr.on('data', function (data) {
    dutil.logError(taskServe, data);
  });

  jekyll.on('error', function (error) { done(error); });

  jekyll.on('close', function (code) { if (0 === code) { done(); } });


});

// Wrapper task for `jekyll build` which runs after `gulp bundle-gems` to make sure
// the gems are properly bundled.
//
gulp.task(taskBuild, [ 'copy-assets', 'bundle-gems' ], function (done) {

  var jekyll = spawn('jekyll', [ 'build' ]);

  jekyll.stdout.on('data', function (data) {

    if (/[\w\d]+/.test(data)) {

      data += '';
      data = data.replace(/[\s]+/g, ' ');
      dutil.logData(taskBuild, data);

    }

  });

  jekyll.stderr.on('data', function (data) {
    dutil.logError(taskBuild, data);
  });

  jekyll.on('error', function (error) { done(error); });

  jekyll.on('close', function (code) { if (0 === code) { done(); } });

});
