const { series, parallel } = require("gulp");
const dutil = require("./utils/doc-util");
const { buildSprite } = require("./svg-sprite");
const { copyDistSass, sass } = require("./sass");
const { compileJS } = require("./javascript");
const { copyDocs, copyFonts, copyImages } = require("./copy");
const { cleanDist } = require("./clean");

exports.build = series(
  (done) => {
    dutil.logIntroduction();
    dutil.logMessage("build", "Creating distribution directories.");
    done();
  },
  cleanDist,
  buildSprite,
  copyDocs,
  parallel(sass, compileJS, copyImages, copyFonts),
  copyDistSass
);
