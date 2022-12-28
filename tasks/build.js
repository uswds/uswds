import gulp from "gulp";
import dutil from "./utils/doc-util.js";
import { buildSprite } from "./svg-sprite.js";
import compileSass from "./sass.js";
import { compileJS } from "./javascript.js";
import { copyTheme, copyFonts, copyIcons, copyImages, copySass } from "./copy.js";
import cleanDist from "./clean.js";

const { series, parallel } = gulp;

/**
 * Generates the dist directory that gets zipped on release.
  .
  ├── * Delete `dist/` directory
  ├── * Create SVG spritesheet
  ├── * Copy markdown docs
  ├── * Compile sass and js
  └── * Copy sass, images, and fonts to `dist/`
 */
const build = series(
  (done) => {
    dutil.logIntroduction();
    dutil.logMessage("build", "Creating distribution directories.");
    done();
  },
  cleanDist,
  parallel(copyTheme, copyImages, copyFonts, copyIcons, copySass),
  buildSprite,
  compileJS,
  compileSass
);

export default build;
