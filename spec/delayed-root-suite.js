// We need a bit of extra time to collect our list of tests. Mocha
// provides a mechanism for this called the "delayed root suite",
// which is documented here:
//
//   https://mochajs.org/#delayed-root-suite
//
// Put simply, Mocha provides an extra global function called 'run'
// which we need to call manually once we're done loading any
// prerequisites needed for test collection to work. That's what
// this file is for.
const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.join(__dirname, "..");
const PL_BUILD_DIR = path.join(ROOT_DIR, "build");
const { styleguide } = require("../gulpfile");

async function loadPatternLab() {
  const promise = new Promise((resolve, reject) => {
    if (fs.existsSync(PL_BUILD_DIR)) {
      console.log("patterns already built");
      setTimeout(() => resolve(), 5000);
    } else {
      resolve(styleguide());
    }
  });

  const ready = await promise; // wait until the promise resolves (*)
  console.log("patternlab is ready.."); // "done!"

  // once patternlab is built we need to get an array of
  // component pages that are made avalible
  return ready;
}

exports.loadPatternLab = loadPatternLab().then(() => run());
