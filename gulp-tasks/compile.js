'use strict';

// Include gulp
const { src, dest } = require('gulp');

// Include Our Plugins
const autoprefixer = require("autoprefixer");
const browserify = require("browserify");
const buffer = require("vinyl-buffer");
const csso = require("postcss-csso");
const discardComments = require("postcss-discard-comments");
const log = require("fancy-log");
const pkg = require("../package.json");
const postcss = require("gulp-postcss");
const rename = require('gulp-rename');
const replace = require("gulp-replace");
const sass = require('gulp-sass');
const source = require("vinyl-source-stream");
const sourcemaps = require('gulp-sourcemaps');
const uglify = require("gulp-uglify");

// Initialize Plugins
const pluginsProcess = [discardComments(), autoprefixer()];
const pluginsMinify = [csso({ forceMediaMerge: false })];

// Set sass compiler to use Dart Sass
sass.compiler = require('sass');

/**
 * Error handler function so we can see when errors happen.
 * @param {object} err error that was thrown
 * @returns {undefined}
 */
function handleError(err) {
  // eslint-disable-next-line no-console
  console.error(err.toString());
  this.emit('end');
}

// Export our tasks.
module.exports = {

  // Compile Sass.
  compileSass: function() {
    return src('src/patterns/stylesheets/uswds.scss')
      .pipe(sourcemaps.init({ largeFile: true }))
      .pipe(sass.sync({ outputStyle: 'expanded' }).on('error', handleError))
      .pipe(postcss(pluginsProcess))
      .pipe(replace(/\buswds @version\b/g, `uswds v${pkg.version}`))
      .pipe(postcss(pluginsMinify))
      .pipe(dest('dist/css'))
      .pipe(rename({ suffix: '.min' }))
      .pipe(sourcemaps.write("."))
      .pipe(dest('dist/css'));
  },

  // Compile JavaScript.
  compileJS: function(done) {
    const defaultStream = browserify({
      entries: "src/js/start.js",
      debug: true,
    }).transform("babelify", {
      global: true,
      presets: ["@babel/preset-env"],
    });

    const stream = defaultStream
      .bundle()
      .pipe(source("uswds.js")) // XXX why is this necessary?
      .pipe(buffer())
      .pipe(rename({ basename: pkg.name }))
      .pipe(dest("dist/js"));

    stream.pipe(sourcemaps.init({ loadMaps: true }));

    if (process.env.NODE_ENV !== "development") {
      stream.pipe(uglify());
    }

    stream
      .on("error", log)
      .pipe(rename({ suffix: ".min" }))
      .pipe(sourcemaps.write("."))
      .pipe(dest("dist/js"));

    done();
    return stream;
  }
};
