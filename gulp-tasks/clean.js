/**
 * Clean tasks - Clean compiled dist directories.
 */

// Include Our Plugins
const del = require('del');
const cFlags = require("./utils/cflags");
const dutil = require("./utils/doc-util");

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
  },

  // Clean generated Dist directory.
  cleanDist(done) {
    if (!cFlags.cleanup) {
      dutil.logMessage(
        "clean-dist",
        "Skipping cleaning up the distribution directories."
      );
      return done();
    }
    dutil.logMessage("clean-dist", "Removing distribution directories.");

    return del("dist");
  }
};
