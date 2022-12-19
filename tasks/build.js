import { series, parallel } from "gulp";
import dutil from "./utils/doc-util";
import { buildSprite } from "./svg-sprite";
import { compileSass } from "./sass";
import { compileJS } from "./javascript";
import { copyTheme, copyFonts, copyIcons, copyImages, copySass } from "./copy";
import { cleanDist } from "./clean";

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
