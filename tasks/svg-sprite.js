/* eslint-disable arrow-body-style */
const { src, dest, series } = require("gulp");
const svgSprite = require("gulp-svgstore");
const rename = require("gulp-rename");
const del = require("del");
const dutil = require("./utils/doc-util");
const { logError } = require('./utils/doc-util');
const { copyIcons } = require("./copy");
const iconConfig = require("../packages/usa-icon/src/usa-icons.config");

const svgPath = "dist/img";

function buildSprite(done) {
  return (
    src(`${svgPath}/usa-icons/*.svg`)
      .pipe(svgSprite())
      .on("error", logError)
      .pipe(dest(svgPath))
      .on("end", () => done())
  );
}

function renameSprite() {
  return src(`${svgPath}/usa-icons.svg`)
    .pipe(rename(`${svgPath}/sprite.svg`))
    .pipe(dest(`./`));
}

function cleanSprite() {
  return del(`${svgPath}/usa-icons.svg`);
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
