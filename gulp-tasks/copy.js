const { src, dest } = require('gulp');
const filter = require("gulp-filter");
const rename = require('gulp-rename');
const changed = require("gulp-changed");
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
    const vendorSass = "src/stylesheets/lib";

    return src('./node_modules/normalize.css/normalize.css')
      .pipe(changed(vendorSass))
      .pipe(filter("**/normalize.css", { restore: true }))
      .pipe(rename("_normalize.scss"))
      .pipe(dest(vendorSass));
  },

  // Copy Sass to dist folder
  // TODO: Do we want to copy to the scss any more?
  copySass() {
    dutil.logMessage("copyDistSass", "Copying all Sass to dist dir");

    return src('src/**/**/*.scss')
      .pipe(dest('dist/scss'));
  },

  // Copy Images to dist folder
  copyImages() {
    dutil.logMessage("images", "Copying Images");
    return src(['packages/**/src/img/**/*{png,jpg,gif,webp,svg}'])
    .pipe(
      // use only the part of the path specific to the package img dir
      rename((path) => {
        path.dirname = path.dirname.replace(/.+?\/src\/img/gi, "");
        return path;
      })
    )
    .pipe(dest('dist/img'));
  },

  // Copy Fonts to dist folder
  copyFonts() {
    return src('packages/uswds-core/src/assets/fonts/**/*')
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
