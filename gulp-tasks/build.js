const { series, parallel } = require("gulp");
const dutil = require("./utils/doc-util");
const { buildSprite } = require("./svg-sprite");
const { compileSass } = require("./sass");
const { compileJS } = require("./javascript");
const { copyDocs, copyFonts, copyImages, copySass } = require("./copy");
const { cleanDist } = require("./clean");

/**
 * Generates the dist directory that gets zipped on release.
  .
  ├── * Delete `dist/` directory
  ├── * Create SVG spritesheet
  ├── * Copy markdown docs
  ├── * Compile sass and js
  └── * Copy sass, copy images, and fonts to `dist/`
 */
exports.build = series(
  (done) => {
    dutil.logIntroduction();
    dutil.logMessage("build", "Creating distribution directories.");
    done();
  },
  cleanDist,
  buildSprite,
  copyDocs,
  parallel(compileSass, compileJS),
  parallel(copyImages, copyFonts, copySass)
);
