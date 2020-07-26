'use strict';

// Include gulp
const { src, dest } = require('gulp');

// Export our tasks.
module.exports = {

  // Move any fonts to where Pattern Lab is lookinging for them.
  moveFonts: function() {
    return src(['./src/patterns/core/fonts/**/*'])
      .pipe(dest('./dist/fonts'));
  },

  // Move CSS specific to styling Pattern Lab.
  movePatternCSS: function() {
    return src(['./src/styleguide/**/*.css'])
      .pipe(dest('./dist/css'));
  }
};
