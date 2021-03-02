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
const PL_BUILD_PATTERNS_DIR = path.join(ROOT_DIR, "build/patterns/");
const { styleguide } = require("../gulpfile");

function buildFilePath() {
  const components = [];
  let done = false;
  fs.readdir(PL_BUILD_PATTERNS_DIR, (err, files) => {
    files.forEach((file) => {
      const builtComponentDir = PL_BUILD_PATTERNS_DIR + file;
      fs.readdir(builtComponentDir, (err, dir) => {
        // if (err) console.log(err);
        dir.forEach((component) => {
          if (component.includes(".rendered.html")) {
            const c = file + "/" + component;
            // console.log({ c });
            components.push(c);
          }
          // console.log("1", {components});
          return components;
        });
      });
    });
  });
}

async function getPatterns() {
  const promise = new Promise((resolve, reject) => {
    resolve(buildFilePath());
  });

  const handles = await promise; // wait until the promise resolves (*)
  console.log("patternlab is ready.."); // "done!"

  return handles;
}

const p = Promise.resolve(getPatterns());
const p2 = new Promise((resolve) => resolve(p));

async function getComponents() {
  const str = await p2;
  // `p2` "assimilates" the value of `p`.
  console.log(str); // 'Hello, World'
  return str;
}

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

  return ready;
}

exports.loadPatternLab = loadPatternLab();
exports.getComponents = getComponents().then(values => console.log({values}));

Promise.all([exports.loadPatternLab, exports.getComponents])
  .then(() => {
    run();
  })
  .catch(() => {
    process.exit(1);
  });
