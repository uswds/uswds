/* eslint-disable arrow-body-style */
const { src, dest, series } = require("gulp");
const svgSprite = require("gulp-svg-sprite");
const rename = require("gulp-rename");
const del = require("del");
const dutil = require("./utils/doc-util");
const { logError } = require('./utils/doc-util');
const { copyMaterialIcons, copyPackageIcons, copyIconAssets } = require("./copy");
const iconConfig = require("../packages/usa-icon/src/usa-icons.config");

const svgRootPath = "dist/img";
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

function cleanIcons() {
  return del([`${svgRootPath}/usa-icons`, `${svgPackagePath}/usa-icons`]);
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
exports.buildSpriteStandalone = series(
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
