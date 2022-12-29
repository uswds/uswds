const dutil = require("./utils/doc-util");
const cFlags = require("./utils/cflags");

module.exports = {
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
