'use strict';

// Include gulp
const { src, dest } = require('gulp');

// Include Our Plugins
const sass = require('gulp-sass');
const prefix = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const browserify = require('browserify');
const through = require('through2');

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

const browserified = function() {
  return through.obj(function(chunk, enc, callback) {
    if(chunk.isBuffer()) {
      var b = browserify(chunk.path);
      // Any custom browserify stuff should go here
      //.transform(to5browserify);

      chunk.contents = b.bundle();

      this.push(chunk);
    }
    callback();
  });
};

// Export our tasks.
module.exports = {

  // Compile Sass.
  compileSass: function() {
    return src('./src/patterns/**/**/*.scss')
      .pipe(sass({outputStyle: 'expanded'}).on('error', handleError))
      .pipe(prefix({ cascade: false }))
      .pipe(rename(function(path) { path.dirname = ''; return path;}))
      .pipe(dest('./dist/css'));
  },

  // Compile JavaScript.
  compileJS: function() {
    return src(['./src/patterns/**/**/*.js'], { base: './' })
    // return src(['../scripts/build.js'], { base: './' })
      // .pipe(browserified())
      .pipe(sourcemaps.init())
      .pipe(babel())
      .pipe(
        rename(function(path) {
          // Currently not using ES6 modules so for now
          // es6 files are compiled into individual JS files.
          // Eventually this can use ES6 Modules and compile
          // all files within a component directory into a single
          // foo.bundle.js file. In that case the bundle name should
          // reflect the components directory name.
          path.dirname = '';
          return path;
        })
      )
      .pipe(sourcemaps.write('./'))
      .pipe(dest('./dist/js'));
  }
};
