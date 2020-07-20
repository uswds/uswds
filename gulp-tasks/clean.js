'use strict';

// Include Our Plugins
const del = require('del');

// Export our tasks.
module.exports = {

  // Clean CSS files.
  cleanCSS: function() {
    return del(['./dist/css/*'], { force: true });
  },

  // Clean Fonts files.
  cleanFonts: function() {
    return del(['./dist/fonts/*'], { force: true });
  },

  // Clean Images files.
  cleanImages: function() {
    return del(['./dist/images/*'], { force: true });
  },

  // Clean JS files.
  cleanJS: function() {
    return del(['./dist/js/*'], { force: true });
  }
};
