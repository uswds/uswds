const { src, dest } = require("gulp");
const rename = require("gulp-rename");
const dutil = require("./utils/doc-util");

// gulp 5 (vinyl-fs@4) defaults to encoding:'utf8', which runs binary files
// through iconv-lite decode/encode and corrupts fonts, images, and other
// binary assets. Pass encoding:false for all binary file copies so gulp reads
// and writes the raw Buffer without any character-encoding transformation.

module.exports = {
  // Copy theme settings files to /dist directory
  copyTheme() {
    dutil.logMessage(
      "copyTheme",
      "Copying theme settings files to /dist/theme"
    );
    return src("packages/uswds-core/src/theme/*.scss").pipe(dest("dist/theme"));
  },

  // Copy Sass stylesheets to /dist directory
  // TODO: Do we want to copy to the scss any more?
  copySass() {
    dutil.logMessage("copySass", "Copying Sass stylesheets to /dist/scss");
    return src("src/**/**/*.scss").pipe(dest("dist/scss"));
  },

  // Copy material icons to /dist/img/material-icons
  copyIcons() {
    dutil.logMessage("copyIcons", "Copying Material icons to dist/img/material-icons");
    return src(["node_modules/@material-design-icons/svg/filled/*"], { encoding: false })
      .pipe(dest("dist/img/material-icons"));
  },

  // Copy images to /dist directory
  copyImages() {
    dutil.logMessage("copyImages", "Copying images to /dist/img");
    // Note: gulp 5 uses picomatch where [!_] bracket negation has different
    // semantics than glob@7 (used by gulp 4). Use an explicit negation entry
    // in the glob array to exclude underscore-prefixed files instead.
    return src([
      "packages/**/src/img/**/*.{png,jpg,gif,webp,svg,ico}",
      "!packages/**/src/img/**/_*",
    ], { encoding: false })
      .pipe(
        // use only the part of the path specific to the package img dir
        rename((path) => {
          path.dirname = path.dirname.replace(/[a-z-]+?\/src\/img/i, "");
          return path;
        })
      )
      .pipe(dest("dist/img"));
  },

  // Copy fonts to /dist directory
  copyFonts() {
    dutil.logMessage("copyFonts", "Copying fonts to /dist/fonts");
    return src("packages/uswds-core/src/assets/fonts/**/*", { encoding: false }).pipe(
      dest("dist/fonts")
    );
  },
};
