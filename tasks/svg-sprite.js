/* eslint-disable arrow-body-style */
const { src, dest, series } = require("gulp");
const svgSprite = require("gulp-svg-sprite");
const rename = require("gulp-rename");
const del = require("del");
const { logError } = require('./utils/doc-util');

const svgPath = "packages/usa-icon/src/img";

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

exports.buildSprite = series(
  buildSprite,
  renameSprite,
  cleanSprite
)
