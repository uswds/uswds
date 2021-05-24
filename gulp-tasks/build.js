const { series, parallel } = require("gulp");
const del = require("del");
const dutil = require("./utils/doc-util");
const cFlags = require("./utils/cflags");
const { buildSprite } = require("./svg-sprite");
const { copyDistSass, sass } = require("./sass");
const { compileJS } = require("./javascript");
const { copyDocs, copyFonts, copyImages } = require("./copy");

function cleanDist(done) {
  if (!cFlags.cleanup) {
    dutil.logMessage(
      "clean-dist",
      "Skipping cleaning up the distribution directories."
    );
    return done();
  }
  dutil.logMessage("clean-dist", "Removing distribution directories.");

  return del("dist");
}

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
