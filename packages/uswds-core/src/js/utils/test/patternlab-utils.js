const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.join(__dirname, "../../../");
const PL_BUILD_DIR = path.join(ROOT_DIR, "build");
const PL_BUILD_PATTERNS_DIR = path.join(ROOT_DIR, "build/");
const { styleguide } = require("../../../gulpfile");

async function getComponents() {
  const getDirectories = new Promise((resolve) => {
    const directories = [];
    fs.readdir(PL_BUILD_PATTERNS_DIR, (err, files) => {
      files.forEach((file, index) => {
        directories.push(file);
        if (index === files.length - 1) {
          console.log("getting components"); // eslint-disable-line no-console
          resolve(directories);
        }
      });
    });
  });

  const buildComponentPaths = new Promise((resolve) => {
    console.log("resolving component paths"); // eslint-disable-line no-console
    const components = [];
    getDirectories.then((directories) => {
      directories.map((file, index) => {
        const builtComponentDir = PL_BUILD_PATTERNS_DIR + file;
        fs.readdir(builtComponentDir, (err, dir) => {
          // eslint-disable-next-line no-restricted-syntax
          for (const component in dir) {
            if (component) {
              if (component.includes(".rendered.html")) {
                const c = `${file}/${component}`;
                components.push(c);
              }
              if (index === directories.length - 1) {
                resolve(components);
              }
            }
          }
        });
        return true;
      });
    });
  });

  const paths = await Promise.resolve(buildComponentPaths).then(
    (values) => values
  );
  return paths;
}

async function loadPatternLab() {
  const promise = new Promise((resolve) => {
    if (fs.existsSync(PL_BUILD_DIR)) {
      console.log("patterns already built"); // eslint-disable-line no-console
      setTimeout(() => resolve(), 2000);
    } else {
      resolve(styleguide());
    }
  });

  const ready = await promise; // wait until the promise resolves (*)
  console.log("patternlab is ready.."); // eslint-disable-line no-console

  return ready;
}

exports.loadPatternLab = loadPatternLab();
exports.getComponents = getComponents();
