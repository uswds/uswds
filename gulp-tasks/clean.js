/**
 * Clean tasks - Clean compiled dist directories.
 */

// Include Our Plugins
const del = require('del');

// Export our tasks.
module.exports = {

  // Clean CSS files.
  cleanCSS() {
    return del(['./dist/css/*'], { force: true });
  },

  // Clean Fonts files.
  cleanFonts() {
    return del(['./dist/fonts/*'], { force: true });
  },

  // Clean Images files.
  cleanImages() {
    return del(['./dist/img/*'], { force: true });
  },

  // Clean JS files.
  cleanJS() {
    return del(['./dist/js/*'], { force: true });
  },

   // Clean Sass files.
  cleanSass() {
    return del(['./dist/scss/*'], { force: true });
  }
};
