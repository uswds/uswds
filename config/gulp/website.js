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

  var cp = spawn('cp', [
    '-rvf',
    'docs/doc_assets/img/*',
    'docs/assets/img',
  ], { shell: true });

  cp.stdout.on('data', function (data) {

    if (/[\w\d]+/.test(data)) {

      dutil.logData('copy-docs-assets:images', data);

    }

  });

  cp.stderr.on('data', function (data) {

    dutil.logError('copy-docs-assets:images', data);

  });

  cp.on('error', function (error) { done(error); });

  cp.on('close', function (code) { if (0 === code) { done(); } });

});

gulp.task('copy-docs-assets:stylesheets', function (done) {

  var cp = spawn('cp', [
    '-rvf',
    'docs/doc_assets/css/*',
    'docs/assets/css/',
  ], { shell: true });

  cp.stdout.on('data', function (data) {

    if (/[\w\d]+/.test(data)) {

      dutil.logData('copy-docs-assets:stylesheets', data);

    }

  });

  cp.stderr.on('data', function (data) {

    dutil.logError('copy-docs-assets:stylesheets', data);

  });

  cp.on('error', function (error) { done(error); });

  cp.on('close', function (code) { if (0 === code) { done(); } });

});
gulp.task('copy-docs-assets:javascript', function (done) {

  // Only copies over the vendor files. The source JavaScript is bundled using Browserify
  // @see: config/gulp/javascript.js

  var cp = spawn('cp', [
    '-rvf',
    'docs/doc_assets/js/vendor/*',
    'docs/assets/js/vendor',
  ], { shell: true });

  cp.stdout.on('data', function (data) {

    if (/[\w\d]+/.test(data)) {

      dutil.logData('copy-docs-assets:javascript', data);

    }

  });

  cp.stderr.on('data', function (data) {

    if (/[\w\d]+/.test(data)) {

      dutil.logError('copy-docs-assets:javascript', data);

    }

  });

  cp.on('error', function (error) { done(error); });

  cp.on('close', function (code) { if (0 === code) { done(); } });

});

gulp.task('make-bundled-javascript-dirs', function(done) {
  var makeBundledJavaScriptDirs = spawn('mkdir', [
    '-p',
    'docs/assets/js/vendor'
  ]);

  makeBundledJavaScriptDirs.stdout.on('data', function (data) {
    if (/[\w\d]+/.test(data)) {
      dutil.logData('make-bundled-javascript-dirs', data);
    }
  });

  makeBundledJavaScriptDirs.on('error', function (error) { done(error); });

  makeBundledJavaScriptDirs.on('close', function (code) { if (0 === code) { done(); } });
});

gulp.task('copy-bundled-javascript', function (done) {

  var copyBundledJavaScript = spawn('cp', [
    '-rvf',
    'dist/js/' + dutil.pkg.name + '.min.js',
    'docs/assets/js/vendor/',
  ]);

  copyBundledJavaScript.stdout.on('data', function (data) {

    if (/[\w\d]+/.test(data)) {

      dutil.logData('copy-bundled-javascript', data);

    }

  });

  copyBundledJavaScript.on('error', function (error) { done(error); });

  copyBundledJavaScript.on('close', function (code) { if (0 === code) { done(); } });

});

gulp.task('make-fonts-dirs', function(done) {
  var makeFontsDirs = spawn('mkdir', [
    '-p',
    'docs/assets/fonts'
  ]);

  makeFontsDirs.stdout.on('data', function (data) {
    if (/[\w\d]+/.test(data)) {
      dutil.logData('make-fonts-dirs', data);
    }
  });

  makeFontsDirs.on('error', function (error) { done(error); });

  makeFontsDirs.on('close', function (code) { if (0 === code) { done(); } });
});

gulp.task('copy-fonts', function (done) {

  var copyFonts = exec('cp -rvf dist/fonts/* docs/assets/fonts/', function (error, stdout, stderr) {

    if (stdout && /[\w\d]+/.test(stdout)) {

      dutil.logData('copy-fonts', stdout);

    }

    done();

  });

});

gulp.task('make-images-dirs', function(done) {
  var makeImagesDirs = spawn('mkdir', [
    '-p',
    'docs/assets/img'
  ]);

  makeImagesDirs.stdout.on('data', function (data) {
    if (/[\w\d]+/.test(data)) {
      dutil.logData('make-images-dirs', data);
    }
  });

  makeImagesDirs.on('error', function (error) { done(error); });

  makeImagesDirs.on('close', function (code) { if (0 === code) { done(); } });
});

gulp.task('copy-images', function (done) {

  var copyImages = exec('cp -rvf dist/img/* docs/assets/img/', function (error, stdout, stderr) {

    if (stdout && /[\w\d]+/.test(stdout)) {

      dutil.logData('copy-images', stdout);

    }

    done();

  });

});

gulp.task('copy-assets', [ 'build' ], function (done) {
  runSequence(
    'docs_javascript',
    'clean-generated-assets',
    'make-bundled-javascript-dirs',
    'copy-bundled-javascript',
    'make-fonts-dirs',
    'copy-fonts',
    'make-images-dirs',
    'copy-images',
    'copy-docs-assets:images',
    'copy-docs-assets:stylesheets',
    'copy-docs-assets:javascript',
    done
  );
});

// Wrapper task for `bundle install` which installs gems for the Jekyll site.
//
gulp.task('bundle-gems', [ 'copy-assets' ], function (done) {

  var bundle = spawn('bundle');

  bundle.stdout.on('data', function (data) {

    if (/[\w\d]+/.test(data)) {

      dutil.logData('bundle-gems', data);

    }

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
gulp.task(taskServe, [ 'bundle-gems' ], function (done) {

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
      'make-bundled-javascript-dirs',
      'copy-bundled-javascript',
      'copy-docs-assets:javascript'
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
      'make-images-dirs',
      'copy-images',
      'copy-docs-assets:images'
    );
  });
  gulp.watch('src/fonts/**/*', function (event) {
    runSequence(
      'fonts',
      'clean-fonts',
      'make-fonts-dirs',
      'copy-fonts'
    );
  });

  var jekyll = spawn('jekyll', [ 'serve', '-w' ]);

  jekyll.stdout.on('data', function (data) {

    if (/[\w\d]+/.test(data)) {

      data += '';
      data = data.replace(/[\s]+/g, ' ');

      if (/done|regen/i.test(data)) {

        dutil.logMessage(taskServe, data);

      } else {

        dutil.logData(taskServe, data);

      }

    }

  });

  jekyll.on('error', function (error) { done(error); });

  jekyll.on('close', function (code) { if (0 === code) { done(); } });


});

// Wrapper task for `jekyll build` which runs after `gulp bundle-gems` to make sure
// the gems are properly bundled.
//
gulp.task(taskBuild, [ 'bundle-gems' ], function (done) {

  var jekyll = spawn('jekyll', [ 'build' ]);

  jekyll.stdout.on('data', function (data) {

    if (/[\w\d]+/.test(data)) {

      data += '';
      data = data.replace(/[\s]+/g, ' ');
      dutil.logData(taskBuild, data);

    }

  });

  jekyll.on('error', function (error) { done(error); });

  jekyll.on('close', function (code) { if (0 === code) { done(); } });

});
