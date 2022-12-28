import dutil from "./utils/doc-util.js";
import cFlags from "./utils/cflags.js";

export default {
  noTest(done) {
    dutil.logMessage("no-test", "Disabling linting and tests for all assets.");
    cFlags.test = false;
    done();
  },

  noCleanup(done) {
    dutil.logMessage(
      "no-cleanup",
      "Disabling cleanup of distribution directories."
    );
    cFlags.cleanup = false;
    done();
  }
}
