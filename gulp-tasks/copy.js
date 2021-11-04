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
  copySass() {
    dutil.logMessage("copyDistSass", "Copying all Sass to dist dir");

    return src('src/**/**/*.scss')
      .pipe(dest('dist/scss'));
  },

  /**
   * Todo: remove once issue below is resolved
   * Patternlab doesn't move CSS from `dist/` to `build/`.
   * Alternative is run `rebuildPL` task, but that takes 11s on average
   * https://github.com/pattern-lab/patternlab-node/issues/1310
   */
  copyCSSToPL() {
    return src("dist/css/**.*")
      .pipe(dest("build/css"))
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
