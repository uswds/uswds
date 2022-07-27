/* eslint-disable arrow-body-style */
const { src, dest, series } = require("gulp");
const svgSprite = require("gulp-svg-sprite");
const rename = require("gulp-rename");
const del = require("del");
const dutil = require("./utils/doc-util");
const { logError } = require('./utils/doc-util');
const { copyIconAssets } = require("./copy");
const iconConfig = require("../packages/usa-icon/src/usa-icons.config");

const svgPackagePath = "packages/usa-icon/dist/img";

// More complex configuration example
const config = {
  shape: {
    dimension: {
      // Set maximum dimensions
      maxWidth: 24,
      maxHeight: 24,
    },
    id: {
      separator: "-",
    },
    spacing: {
      // Add padding
      padding: 0,
    },
  },
  mode: {
    symbol: true,
  },
};

// Copy material icons to dist
function copyMaterialIcons() {
  dutil.logMessage("copyMaterialIcons", "Copying Material icons to packages/usa-icon/dist/img/material-icons");
  return src(["node_modules/@material-design-icons/svg/filled/*"])
    .pipe(dest("packages/usa-icon/dist/img/material-icons"));
}

// Copy USWDS package icons to dist
function copyPackageIcons() {
  dutil.logMessage("copyPackageIcons", "Copying USWDS Icons to packages/usa-icon/dist/img");
  return src([
    "packages/**/src/img/**/*{png,svg,gif}",
    // exclude hero images and favicons
    "!packages/usa-hero/**",
    "!packages/uswds-core/src/img/favicons/**"
  ])
  .pipe(
    // use only the part of the path specific to the package img dir
    rename((path) => {
      path.dirname = path.dirname.replace(/[a-z-]+?\/src\/img/i, "");
      return path;
    })
  )
  .pipe(dest("packages/usa-icon/dist/img"));
}

function cleanIcons() {
  return del(`${svgPackagePath}/usa-icons`);
}

function collectIcons() {
  dutil.logMessage("collectIcons", "Collecting default icon set in dist/img/usa-icons");
  return src([
    `node_modules/@material-design-icons/svg/filled/{${iconConfig.material}}.svg`,
    `packages/usa-icon/src/img/material-icons-deprecated/{${iconConfig.materialDeprecated}}.svg`,
    `packages/usa-icon/src/img/uswds-icons/{${iconConfig.uswds}}.svg`,
  ])
    .pipe(dest(`${svgPackagePath}/usa-icons`));
}

function buildSprite(done) {
  return (
    src(`${svgPackagePath}/usa-icons/*.svg`)
      .pipe(svgSprite(config))
      .on("error", logError)
      .pipe(dest(svgPackagePath))
      .on("end", () => done())
  );
}

function renameSprite() {
  return src(`${svgPackagePath}/symbol/svg/sprite.symbol.svg`)
    .pipe(rename(`${svgPackagePath}/sprite.svg`))
    .pipe(dest(`./`));
}

function cleanSprite() {
  return del([`${svgPackagePath}/symbol`]);
}

// create sprite and gather all usa-icon assets in package dist
exports.buildIcons = series(
  copyMaterialIcons,
  copyPackageIcons,
  cleanIcons,
  collectIcons,
  buildSprite,
  renameSprite,
  cleanSprite,
  copyIconAssets
)

// create sprite and gather config icons in dist/img/usa-icons
exports.buildSprite = series(
  cleanIcons,
  collectIcons,
  buildSprite,
  renameSprite,
  cleanSprite,
  copyIconAssets
)
