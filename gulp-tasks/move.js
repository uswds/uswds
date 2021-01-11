'use strict';

// Include gulp
const { src, dest } = require('gulp');

// Include Our Plugins
const rename = require('gulp-rename');

// Export our tasks.
module.exports = {

  // Move any fonts to where Pattern Lab is lookinging for them.
  moveFonts: function() {
    return src('src/fonts/**/*', { base: './' })
      .pipe(
        rename(function(path) {
          path.dirname = '';
          return path;
        })
      )
      .pipe(dest('dist/fonts'));
  },

  // Move CSS specific to styling Pattern Lab.
  movePatternCSS: function() {
    return src(['./src/styleguide/**/*.css'], { base: './' })
      .pipe(
        rename(function(path) {
          path.dirname = '';
          return path;
        })
      )
      .pipe(dest('./dist/css'));
  }
};
