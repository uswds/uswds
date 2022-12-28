import gulp from "gulp";
import svgSprite from "gulp-svgstore";
import rename from "gulp-rename";
import del from "del";
import dutil from "./utils/doc-util.js";
import { copyIcons } from "./copy.js";
import iconConfig from "../packages/usa-icon/src/usa-icons.config.js";

const { src, dest, series } = gulp;
const svgPath = "dist/img";

function cleanIcons() {
  return del(`${svgPath}/usa-icons`);
}

function collectIcons() {
  dutil.logMessage(
    "collectIcons",
    "Collecting default icon set in dist/img/usa-icons"
  );
  return src([
    `node_modules/@material-design-icons/svg/filled/{${iconConfig.material}}.svg`,
    `packages/usa-icon/src/img/material-icons-deprecated/{${iconConfig.materialDeprecated}}.svg`,
    `packages/usa-icon/src/img/uswds-icons/{${iconConfig.uswds}}.svg`,
  ]).pipe(dest(`${svgPath}/usa-icons`));
}

function buildSpriteFile(done) {
  return src(`${svgPath}/usa-icons/*.svg`)
    .pipe(svgSprite())
    .on("error", dutil.logError)
    .pipe(dest(svgPath))
    .on("end", () => done());
}

function renameSprite() {
  return src(`${svgPath}/usa-icons.svg`)
    .pipe(rename(`${svgPath}/sprite.svg`))
    .pipe(dest(`./`));
}

function cleanSprite() {
  return del(`${svgPath}/usa-icons.svg`);
}

const buildSprite = series(
  cleanIcons,
  collectIcons,
  buildSpriteFile,
  renameSprite,
  cleanSprite
);

const buildSpriteStandalone = series(copyIcons, buildSprite);

export { buildSprite, buildSpriteStandalone };
