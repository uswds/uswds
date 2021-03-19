'use strict';

// Include gulp
const { src, dest } = require('gulp');

// Include Our Plugins
const filter = require("gulp-filter");
const rename = require('gulp-rename');

// Export our tasks.
module.exports = {

  // Copy vendor sass to library
  copyVendor() {
    return src('./node_modules/normalize.css/normalize.css')
      .pipe(filter("**/normalize.css", { restore: true }))
      .pipe(rename("_normalize.scss"))
      .pipe(dest('src/patterns/stylesheets/lib'));
  },

  // Copy Sass to dist folder
  copySass() {
    return src('src/patterns/**/**/*.scss')
      .pipe(dest('dist/scss'));
  },

  // Copy Images to dist folder
  copyImages() {
    return src(['src/img/**/*'])
      .pipe(dest('dist/img'));
  },

  // Copy Fonts to dist folder
  copyFonts() {
    return src('src/fonts/**/*')
      .pipe(dest('dist/fonts'));
  },

  // Copy Styleguide to dist folder
  copyStyleguide() {
    return src('src/styleguide/**/*.css')
      .pipe(
        rename((path) => {
          path.dirname = '';
          return path;
        })
      )
      .pipe(dest('dist/css'));
  }

};
