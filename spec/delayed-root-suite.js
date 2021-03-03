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

async function getComponents() {
  const getDirectories = new Promise((resolve, reject) => {
    const directories = [];
    fs.readdir(PL_BUILD_PATTERNS_DIR, (err, files) => {
      files.forEach((file, index) => {
        directories.push(file);
        if (index === files.length - 1) {
          console.log("getting components");
          resolve(directories);
        }
      });
    });
  });

  const buildComponentPaths = new Promise((resolve, reject) => {
    const components = [];
    getDirectories.then((directories) => {
      directories.map((file, index) => {
        const builtComponentDir = PL_BUILD_PATTERNS_DIR + file;
        fs.readdir(builtComponentDir, (err, dir) => {
          dir.forEach((component) => {
            if (component.includes(".rendered.html")) {
              const c = file + "/" + component;
              components.push(c);
            }
            if (index === directories.length - 1) {
              console.log("resolving component paths");
              resolve(components);
            }
          });
        });
        return true;
      });
    });
  });

  const paths = await Promise.resolve(buildComponentPaths).then(
    (values) => {
      return values;
    },
  );
  return paths;
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
exports.getComponents = getComponents();

Promise.all([exports.loadPatternLab, exports.getComponents])
  .then(() => {
    run();
  })
  .catch(() => {
    process.exit(1);
  });
