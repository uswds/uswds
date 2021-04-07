const { src, dest, series, parallel } = require("gulp");
const del = require("del");
const dutil = require("./utils/doc-util");
const cFlags = require("./utils/cflags");
const { buildSprite } = require("./svg-sprite");
const { copyDistSass, sass } = require("./sass");
const { compileJS } = require("./javascript");
const { fonts } = require("./fonts");
const { images } = require("./images");

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

function docs(done) {
  dutil.logMessage("docs", "Copying documentation dist dir");

  const stream = src(["README.md", "LICENSE.md", "CONTRIBUTING.md"]).pipe(
    dest("dist")
  );

  done();
  return stream;
}

exports.build = series(
  (done) => {
    dutil.logIntroduction();
    dutil.logMessage("build", "Creating distribution directories.");
    done();
  },
  cleanDist,
  buildSprite,
  docs,
  parallel(sass, compileJS, images, fonts),
  copyDistSass
);
