const { src, dest } = require("gulp");
const rename = require("gulp-rename");
const dutil = require("./utils/doc-util");

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
    return src(["node_modules/@material-design-icons/svg/filled/*"])
      .pipe(dest("dist/img/material-icons"));
  },

  // Copy images to /dist directory
  copyImages() {
    dutil.logMessage("copyImages", "Copying images to /dist/img");
    return src(["packages/**/src/img/**/[!_]*.{png,jpg,gif,webp,svg,ico}"])
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
    return src("packages/uswds-core/src/assets/fonts/**/*").pipe(
      dest("dist/fonts")
    );
  },
};
