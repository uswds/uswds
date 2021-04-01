/* eslint-disable arrow-body-style */
const path = require("path");

const ROOT_DIR = path.join(__dirname, "../");

const { src, dest, series } = require("gulp");
const del = require("del");
const svgSprite = require("gulp-svg-sprite");
const rename = require("gulp-rename");

const svgPath = path.join(ROOT_DIR, "src/img");

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
  return src(`${svgPath}/usa-icons/**/*.svg`)
    .pipe(svgSprite(config))
    // eslint-disable-next-line no-console
    .on("error", (error) => console.error("There was an error", error))
    .pipe(dest(`${svgPath}`))
    .on("end", () => done())
};

function renameSprite() {
  return src(`${svgPath}/symbol/svg/sprite.symbol.svg`)
    .pipe(rename(`${svgPath}/sprite.svg`))
    .pipe(dest(`./`));
};

function cleanSprite() {
  return del(`${svgPath}/symbol`)
};

exports.svgSprite = series(buildSprite, renameSprite, cleanSprite)
