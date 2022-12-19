/**
 * Clean tasks - Clean compiled dist directories.
 */

// Include Our Plugins
import del from "del";
import cFlags from "./utils/cflags";
import dutil from "./utils/doc-util";

// Clean generated Dist directory.
const cleanDist = done => {
  if (!cFlags.cleanup) {
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
