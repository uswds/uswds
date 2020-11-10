'use strict';

const GulpClient = require('gulp');
// Include gulp
const { src, dest } = require('gulp');

// Include Our Plugins
const filter = require("gulp-filter");
const rename = require('gulp-rename');
const mergeStream = require('merge-stream');
const replace = require('gulp-replace');

// Export our tasks.
module.exports = {

  // Copy vendor sass to library
  copyVendor: function() {
    return src('./node_modules/normalize.css/normalize.css')
      .pipe(filter("**/normalize.css", { restore: true }))
      .pipe(rename("_normalize.scss"))
      .pipe(dest('src/patterns/stylesheets/lib'));
  },

  // Copy Sass to dist folder
  copySass: function() {

    return mergeStream(
      src('src/patterns/components/**/*.scss').pipe(
        dest('dist/scss/components')
      ),
      src('src/patterns/stylesheets/**/*.scss')
        .pipe(replace(/(..\/..\/components)/g, '../components'))
        .pipe(dest('dist/scss'))
    );
  },

  // Copy Images to dist folder
  copyImages: function() {
    return src(['src/img/**/*', 'src/patterns/**/*{.png,.jpg,.svg}'])
      .pipe(
        rename(function(path) {
          path.dirname = '';
          return path;
        })
      )
      .pipe(dest('dist/img'));
  },

  // Copy Fonts to dist folder
  copyFonts: function() {
    return src('src/fonts/**/*')
      .pipe(dest('dist/fonts'));
  },

  // Copy Styleguide to dist folder
  copyStyleguide: function() {
    return src('src/styleguide/**/*.css')
      .pipe(
        rename(function(path) {
          path.dirname = '';
          return path;
        })
      )
      .pipe(dest('dist/css'));
  }

};
