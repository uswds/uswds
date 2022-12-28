/**
 * Clean tasks - Clean compiled dist directories.
 */

// Include Our Plugins
import del from "del";
import flags from "./utils/cflags.js";
import dutil from "./utils/doc-util.js";

// Clean generated Dist directory.
const cleanDist = done => {
  if (!flags.cleanup) {
    dutil.logMessage(
      "clean-dist",
      "Skipping cleaning up the distribution directories."
    );
    return done();
  }
  dutil.logMessage("clean-dist", "Removing distribution directories.");

  return del("dist");
};

export default cleanDist;
