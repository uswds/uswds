'use strict';

// Include gulp
const { src, dest } = require('gulp');

// Include Our Plugins
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');

// Export our tasks.
module.exports = {

  // Compress svg/png/jpg files.
  compressAssets: function() {
    return src([
      './src/patterns/**/*{.png,.jpg,.svg}'
    ])
      .pipe(
        imagemin({
          progressive: true,
          svgoPlugins: [
            {
              removeViewBox: false
            }
          ]
        })
      )
      .pipe(
        rename(function(path) {
          path.dirname = '';
          return path;
        })
      )
      .pipe(dest('./dist/images'));
  }
};
