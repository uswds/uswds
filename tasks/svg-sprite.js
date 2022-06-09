/* eslint-disable arrow-body-style */
const { src, dest, series } = require("gulp");
const svgSprite = require("gulp-svg-sprite");
const rename = require("gulp-rename");
const del = require("del");
const dutil = require("./utils/doc-util");
const { logError } = require('./utils/doc-util');
const { copyIcons } = require("./copy");
const iconConfig = require("../packages/usa-icon/src/usa-icons.config");

const svgPath = "dist/img";

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
  return del(`${svgPath}/usa-icons`);
}

function collectIcons() {
  dutil.logMessage("collectIcons", "Collecting default icon set in dist/img/usa-icons");
  return src([
    `node_modules/@material-design-icons/svg/outlined/{${iconConfig.material}}.svg`,
    `packages/usa-icon/src/img/material-icons-deprecated/{${iconConfig.materialDeprecated}}.svg`,
    `packages/usa-icon/src/img/uswds-icons/{${iconConfig.uswds}}.svg`,
  ])
    .pipe(dest(`${svgPath}/usa-icons`))
}

function buildSprite(done) {
  return (
    src(`${svgPath}/usa-icons/*.svg`)
      .pipe(svgSprite(config))
      .on("error", logError)
      .pipe(dest(svgPath))
      .on("end", () => done())
  );
}

function renameSprite() {
  return src(`${svgPath}/symbol/svg/sprite.symbol.svg`)
    .pipe(rename(`${svgPath}/sprite.svg`))
    .pipe(dest(`./`));
}

function cleanSprite() {
  return del(`${svgPath}/symbol`);
}

exports.buildSpriteStandalone = series(
  copyIcons,
  cleanIcons,
  collectIcons,
  buildSprite,
  renameSprite,
  cleanSprite
)

exports.buildSprite = series(
  cleanIcons,
  collectIcons,
  buildSprite,
  renameSprite,
  cleanSprite
)
