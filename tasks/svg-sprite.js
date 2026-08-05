/* eslint-disable arrow-body-style */
const { src, dest, series } = require("gulp");
const svgSprite = require("gulp-svgstore");
const rename = require("gulp-rename");
const del = require("del");
const through2 = require("through2");
const dutil = require("./utils/doc-util");
const { logError } = require('./utils/doc-util');
const { copyIcons } = require("./copy");
const iconConfig = require("../packages/usa-icon/src/usa-icons.config");

const svgPath = "dist/img";

// Gulp 5 removed ordered-glob guarantees; sort SVG files by basename
// (code-unit order, matching the prior fs.readdir/glob@7 behavior on this
// filesystem) so sprite.svg symbol order is deterministic regardless of
// platform readdir order.
function sortByBasename() {
  const files = [];
  return through2.obj(
    function collect(file, _, cb) {
      files.push(file);
      cb();
    },
    function flush(cb) {
      files.sort((a, b) => {
        const nameA = a.basename;
        const nameB = b.basename;
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
      files.forEach((f) => this.push(f));
      cb();
    }
  );
}

function cleanIcons() {
  return del(`${svgPath}/usa-icons`);
}

function collectIcons() {
  dutil.logMessage("collectIcons", "Collecting default icon set in dist/img/usa-icons");
  return src([
    `node_modules/@material-design-icons/svg/filled/{${iconConfig.material}}.svg`,
    `packages/usa-icon/src/img/material-icons-deprecated/{${iconConfig.materialDeprecated}}.svg`,
    `packages/usa-icon/src/img/uswds-icons/{${iconConfig.uswds}}.svg`,
  ])
    .pipe(dest(`${svgPath}/usa-icons`))
}

function buildSprite(done) {
  return (
    src(`${svgPath}/usa-icons/*.svg`)
      .pipe(sortByBasename())
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
