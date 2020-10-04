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
const { copyVendor, copySass, copyImages, copyFonts, copyStyleguide } = require('./gulp-tasks/copy');
const { lintSass, lintJS } = require('./gulp-tasks/lint');
const { compileSass, compileJS } = require('./gulp-tasks/compile');
const server = require('browser-sync').create();

// Clean all directories.
exports.clean = parallel(cleanCSS, cleanFonts, cleanImages, cleanJS, cleanSass);

// Lint Sass and JavaScript
exports.lint = parallel(lintSass, lintJS);

// Compile Our Sass and JS
exports.compile = parallel(compileSass, compileJS);

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

// Build task for Pattern Lab.
exports.styleguide = buildPatternlab;

/**
 * Watch Sass and JS files.
 * @returns {undefined}
 */
function watchFiles() {
  // Watch all my sass files and compile sass if a file changes.
  watch(
    './src/patterns/**/**/*.scss',
    series(parallel(lintSass, compileSass), (done) => {
      server.reload('*.css');
      done();
    })
  );

  // Watch all my JS files and compile if a file changes.
  watch(
    './src/js/**/*.js',
    series(parallel(lintJS, compileJS), (done) => {
      server.reload('*.js');
      done();
    })
  );

  // Watch all my patterns and compile if a file changes.
  watch(
    './src/patterns/**/**/*{.twig,.yml}',
    series(
      parallel(buildPatternlab), (done) => {
        server.reload('*{.html}');
        done();
      }
    )
  );

  // Reload the browser after patternlab updates.
  patternlab.events.on('patternlab-build-end', () => {
    server.reload('*.html');
  });
}

// Watch task that runs a browsersync server.
exports.watch = series(
  parallel(cleanCSS, cleanFonts, cleanImages, cleanJS, cleanSass),
  parallel(copyVendor),
  parallel(lintSass, compileSass, lintJS, compileJS),
  parallel(copyFonts, copyImages, copySass, copyStyleguide),
  series(watchPatternlab, serve, watchFiles)
);

// Default Task
exports.default = series(
  parallel(cleanCSS, cleanFonts, cleanImages, cleanJS, cleanSass),
  parallel(copyVendor),
  parallel(lintSass, compileSass, lintJS, compileJS),
  parallel(copyFonts, copyImages, copySass, copyStyleguide),
  buildPatternlab
);
