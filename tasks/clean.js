/**
 * Clean tasks - Clean compiled dist directories.
 */

// Include Our Plugins
const cFlags = require("./utils/cflags");
const dutil = require("./utils/doc-util");

// Clean generated Dist directory.
exports.cleanDist = async (done) => {
  if (!cFlags.cleanup) {
    dutil.logMessage(
      "clean-dist",
      "Skipping cleaning up the distribution directories."
    );
    return done();
  }
  dutil.logMessage("clean-dist", "Removing distribution directories.");

  const { deleteAsync } = await import("del");
  return deleteAsync("dist");
};
