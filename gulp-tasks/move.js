// Include gulp
const { src, dest } = require('gulp');

// Include Our Plugins
const rename = require('gulp-rename');

// Export our tasks.
module.exports = {

  // Move any fonts to where Pattern Lab is looking for them.
  moveFonts() {
    return src('src/fonts/**/*', { base: './' })
      .pipe(
        rename((path) => {
          path.dirname = '';
          return path;
        })
      )
      .pipe(dest('dist/fonts'));
  },

  // Move CSS specific to styling Pattern Lab.
  movePatternCSS() {
    return src(['./src/styleguide/**/*.css'], { base: './' })
      .pipe(
        rename((path) => {
          path.dirname = '';
          return path;
        })
      )
      .pipe(dest('./dist/css'));
  }
};
