import gulp from "gulp";
import rename from "gulp-rename";
import dutil from "./utils/doc-util.js";

const { src, dest } = gulp;

// Copy theme settings files to /dist directory
const copyTheme = () => {
  dutil.logMessage("copyTheme", "Copying theme settings files to /dist/theme");
  return src("packages/uswds-core/src/theme/*.scss").pipe(dest("dist/theme"));
};

// Copy Sass stylesheets to /dist directory
// TODO: Do we want to copy to the scss any more?
const copySass = () => {
  dutil.logMessage("copySass", "Copying Sass stylesheets to /dist/scss");
  return src("src/**/**/*.scss").pipe(dest("dist/scss"));
};

// Copy material icons to /dist/img/material-icons
const copyIcons = () => {
  dutil.logMessage(
    "copyIcons",
    "Copying Material icons to dist/img/material-icons"
  );
  return src(["node_modules/@material-design-icons/svg/filled/*"]).pipe(
    dest("dist/img/material-icons")
  );
};

// Copy images to /dist directory
const copyImages = () => {
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
};

// Copy fonts to /dist directory
const copyFonts = () => {
  dutil.logMessage("copyFonts", "Copying fonts to /dist/fonts");
  return src("packages/uswds-core/src/assets/fonts/**/*").pipe(
    dest("dist/fonts")
  );
};

export { copyTheme, copySass, copyIcons, copyImages, copyFonts };
