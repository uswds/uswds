const { src, dest } = require('gulp');
const filter = require("gulp-filter");
const rename = require('gulp-rename');
const dutil = require("./utils/doc-util");

module.exports = {

  // Copy documentation
  copyDocs() {
    const docs = ["README.md", "LICENSE.md", "CONTRIBUTING.md"];

    dutil.logMessage("docs", "Copying documentation dist dir");
    return src(docs).pipe(dest("dist"));
  },

  // Copy vendor sass to library
  copyVendor() {
    return src('./node_modules/normalize.css/normalize.css')
      .pipe(filter("**/normalize.css", { restore: true }))
      .pipe(rename("_normalize.scss"))
      .pipe(dest('src/patterns/stylesheets/lib'));
  },

  // Copy Sass to dist folder
  copySass() {
    dutil.logMessage("copyDistSass", "Copying all Sass to dist dir");

    return src('src/patterns/**/**/*.scss')
      .pipe(dest('dist/scss'));
  },

  // Copy Images to dist folder
  copyImages() {
    dutil.logMessage("images", "Copying Images");
    return src(['src/img/**/*'])
      .pipe(dest('dist/img'));
  },

  // Copy Fonts to dist folder
  copyFonts() {
    return src('src/fonts/**/*')
      .pipe(dest('dist/fonts'));
  },

  // Copy Styleguide to dist folder.
  // Specific to pattern library.
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
