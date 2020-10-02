'use strict';

// Include gulp helpers.
const { series, parallel, watch } = require('gulp');

// Include Pattern Lab and config.
const config = require('./patternlab-config.json');
const patternlab = require('@pattern-lab/core')(config);

// Include Our tasks.
//
// Each task is broken apart to it's own node module.
// Check out the ./gulp-tasks directory for more.
const { cleanCSS, cleanFonts, cleanImages, cleanJS, cleanSass } = require('./gulp-tasks/clean');

// Clean all directories.
exports.clean = parallel(cleanCSS, cleanFonts, cleanImages, cleanJS, cleanSass);


/**
 * Start Pattern Lab build watch process.
 * @param {function} done callback function.
 * @returns {undefined}
 */
function watchPatternlab(done) {
  patternlab
    .build({
      cleanPublic: config.cleanPublic,
      watch: true
    })
    .then(() => {
      done();
    });
}

/**
 * Build Pattern Lab.
 * @param {function} done callback function.
 * @returns {undefined}
 */
function buildPatternlab(done) {
  patternlab
    .build({
      cleanPublic: config.cleanPublic,
      watch: false
    })
    .then(() => {
      done();
    });
}

// Browsersync
const server = require('browser-sync').create();

/**
 * Start browsersync server.
 * @param {function} done callback function.
 * @returns {undefined}
 */
function serve(done) {
  // See https://browsersync.io/docs/options for more options.
  server.init({
    server: ['./patternlab/'],
    notify: false,
    open: false
  });
  done();
}






// Bring in individual Gulp configurations
require("./config/gulp/sass");
require("./config/gulp/javascript");
require("./config/gulp/images");
require("./config/gulp/fonts");
require("./config/gulp/build");
require("./config/gulp/release");
require("./config/gulp/test");

var gulp = require("gulp");
var dutil = require("./config/gulp/doc-util");

gulp.task("default", function(done) {
  dutil.logIntroduction();

  dutil.logHelp(
    "gulp",
    "This task will output the currently supported automation tasks. (e.g. This help message.)"
  );

  dutil.logHelp(
    "gulp no-cleanup [ task-name ]",
    "Prefixing tasks with `no-cleanup ` will not remove the distribution directories."
  );

  dutil.logHelp(
    "gulp no-test [ task-name ]",
    "Prefixing tasks with `no-test` will disable testing and linting for all supported tasks."
  );

  dutil.logCommand(
    "gulp clean-dist",
    "This task will remove the distribution directories."
  );

  dutil.logHelp(
    "gulp build",
    "This task is an alias for running `gulp sass javascript images fonts` and is the recommended task to build all assets."
  );

  dutil.logCommand(
    "gulp sass",
    "This task will compile all the Sass files into distribution directories."
  );

  dutil.logCommand(
    "gulp javascript",
    "This task will compile all the JavaScript files into distribution directories."
  );

  dutil.logCommand(
    "gulp images",
    "This task will copy all the image files into distribution directories."
  );

  dutil.logCommand(
    "gulp fonts",
    "This task will copy all the font files into distribution directories."
  );

  dutil.logCommand(
    "gulp release",
    "This task will run `gulp build` and prepare a release directory."
  );

  dutil.logCommand(
    "gulp test",
    "This task will run `gulp test` and run this repository's unit tests."
  );

  done();
});

gulp.task("watch", function() {
  gulp.watch("src/patterns/stylesheets/**/*.scss", gulp.series("sass")),
  gulp.watch("src/js/**/*.js", gulp.series("javascript"));
  return;
});



exports.pl = buildPatternlab;
