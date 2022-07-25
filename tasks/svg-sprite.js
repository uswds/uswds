/* eslint-disable arrow-body-style */
const { src, dest, series } = require("gulp");
const svgSprite = require("gulp-svg-sprite");
const rename = require("gulp-rename");
const del = require("del");
const dutil = require("./utils/doc-util");
const { logError } = require('./utils/doc-util');
const { copyIcons } = require("./copy");
const iconConfig = require("../packages/usa-icon/src/usa-icons.config");

const svgRootPath = "dist/img";
const svgPackagePath = "./packages/usa-icon/dist/img";

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
    .pipe(dest(`${svgRootPath}/usa-icons`))
    .pipe(dest(`${svgPackagePath}/usa-icons`));
}

function buildSprite(done) {
  return (
    src(`${svgRootPath}/usa-icons/*.svg`)
      .pipe(svgSprite(config))
      .on("error", logError)
      .pipe(dest(svgRootPath))
      .pipe(dest(svgPackagePath))
      .on("end", () => done())
  );
}

function renameRootSprite() {
  return src(`${svgRootPath}/symbol/svg/sprite.symbol.svg`)
    .pipe(rename(`${svgRootPath}/sprite.svg`))
    .pipe(dest(`./`));
}

function renamePackageSprite() {
  return src(`${svgPackagePath}/symbol/svg/sprite.symbol.svg`)
    .pipe(rename(`${svgPackagePath}/sprite.svg`))
    .pipe(dest(`./`));
}

function cleanSprite() {
  return del([`${svgRootPath}/symbol`, `${svgPackagePath}/symbol`]);
}

exports.buildSpriteStandalone = series(
  copyIcons,
  cleanIcons,
  collectIcons,
  buildSprite,
  renameRootSprite,
  renamePackageSprite,
  cleanSprite
)

exports.buildSprite = series(
  cleanIcons,
  collectIcons,
  buildSprite,
  renameRootSprite,
  renamePackageSprite,
  cleanSprite
)
