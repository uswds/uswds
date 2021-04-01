// Todo: convert release tasks.

// Include gulp helpers.
const { series, parallel, watch } = require("gulp");
const run = require("gulp-run-command").default;
const server = require("browser-sync").create();

// Include Our tasks.
//
// Each task is broken apart to it's own node module.
// Check out the ./gulp-tasks directory for more.
const { noCleanup, noTest } = require("./gulp-tasks/flags");
const { buildSprite } = require("./gulp-tasks/svg-sprite");
const { fonts } = require("./gulp-tasks/fonts");
const { images } = require("./gulp-tasks/images");
const {
  stylelint,
  copyVendorSass,
  copyDistSass,
  sass,
} = require("./gulp-tasks/sass");
const {
  compileJavascript,
  typeCheck,
  eslint,
} = require("./gulp-tasks/javascript");
const {
  unitTests,
  sassTests,
  a11y,
  cover,
} = require("./gulp-tasks/test");
const {
  cleanCSS,
  cleanFonts,
  cleanImages,
  cleanJS,
  cleanSass,
} = require("./gulp-tasks/clean");
const {
  compileSass,
  compileJS,
  compileSprite,
} = require("./gulp-tasks/compile");
const {
  copyVendor,
  copySass,
  copyImages,
  copyFonts,
  copyStyleguide,
} = require("./gulp-tasks/copy");
const { lintSass, lintJS } = require("./gulp-tasks/lint");
const { moveFonts, movePatternCSS } = require("./gulp-tasks/move");
const { build } = require("./gulp-tasks/build");

async function rebuildPL() {
  return run("npm run pl:build --pattern")();
}

async function buildPL() {
  return run("npm run pl:build")();
}

async function exitServer() {
  return server.exit()
}

/**
 * Start browsersync server.
 * @param {function} done callback function.
 * @returns {undefined}
 */
function serve(done) {
  // See https://browsersync.io/docs/options for more options.
  server.init({
    server: ["./build/"],
    notify: false,
    open: false,
    port: 3333,
  });
  done();
}

/**
 * Watch Sass and JS files.
 * @returns {undefined}
 */
function watchFiles() {
  // Watch all my sass files and compile sass if a file changes.
  watch(
    "./src/patterns/**/**/*.scss",
    series(parallel(lintSass, compileSass), (done) => {
      server.reload("*.css");
      done();
    })
  );

  // Watch all my JS files and compile if a file changes.
  watch(
    "./src/patterns/**/**/*.js",
    series(parallel(lintJS, compileJS), (done) => {
      server.reload("*.js");
      done();
    })
  );

  // Watch all my patterns and compile if a file changes.
  watch(
    "./src/patterns/**/**/*{.twig,.yml}",
    series(rebuildPL, (done) => {
      server.reload("*.html");
      done();
    })
  );

  // Watch all my unit tests and run if a file changes.
  watch(
    "./src/patterns/**/*.spec.js",
    series(series(unitTests, sassTests), (done) => done())
  );
}
// exports

// flags
exports.noTest = noTest;
exports.noCleanup = noCleanup;

// Clean all directories.
exports.clean = parallel(cleanCSS, cleanFonts, cleanImages, cleanJS, cleanSass);

// Lint Sass
exports.lintSass = parallel(lintSass);

// Lint JavaScript
exports.lintJS = parallel(lintJS);

// Lint Sass and JavaScript
exports.lint = parallel(lintSass, lintJS);

// Compile Our Sass and JS
exports.compile = parallel(
  compileSass,
  compileJS,
  compileSprite,
  moveFonts,
  movePatternCSS
);

// tests
exports.a11y = series(serve, a11y, exitServer);

exports.cover = cover;

exports.sassTests = sassTests;

exports.unitTests = unitTests;

exports.test = series(
  typeCheck,
  lintJS,
  lintSass,
  sassTests,
  unitTests,
  serve,
  a11y,
  exitServer
);

// building
exports.buildSprite = buildSprite;
exports.fonts = fonts;
exports.images = images;
exports.sass = series(stylelint, copyVendorSass, copyDistSass, sass);
exports.build = build;

// Build task for Pattern Lab.
exports.styleguide = buildPL;

// Watch task that runs a browsersync server.
exports.watch = series(
  parallel(cleanCSS, cleanFonts, cleanImages, cleanJS, cleanSass),
  parallel(copyVendor),
  parallel(lintSass, compileSass, lintJS, compileJS, compileSprite),
  parallel(copyFonts, copyImages, copySass, copyStyleguide),
  series(rebuildPL, serve, watchFiles)
);

// Default Task
exports.default = series(
  parallel(cleanCSS, cleanFonts, cleanImages, cleanJS, cleanSass),
  parallel(copyVendor),
  parallel(lintSass, compileSass, lintJS, compileJS, compileSprite),
  parallel(copyFonts, copyImages, copySass, copyStyleguide),
  buildPL
);
