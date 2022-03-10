const assert = require("assert");
const fs = require("fs");
const path = require("path");
const pkg = require("../../package.json");
const { runGulp, distCssPath } = require("../../packages/uswds-core/src/js/utils/test/util");

before(() => {
  setTimeout(() => runGulp("sass"), 20000);
});

describe("build output", () => {
  it("generates CSS at dist/css/uswds.css", () => {
    const distFilename = path.join(distCssPath, "uswds.css");
    assert.ok(
      fs.existsSync(distFilename),
      `the file does not exist:  ${distFilename}`
    );
  });

  it("generates minified CSS at dist/css/uswds.min.css", () => {
    const distFilename = path.join(distCssPath, "uswds.min.css");
    assert.ok(
      fs.existsSync(distFilename),
      `the file does not exist:  ${distFilename}`
    );
  });
});

describe("version output", () => {
  const versionString = `/*! uswds v${pkg.version} */`;

  /* eslint-disable */
  const checkVersion = (filename, done) =>
    new Promise((resolve, reject) => {
      fs.readFile(filename, (error, buffer) => {
        if (error) {
          return reject(error);
        }

        const css = buffer.toString();
        assert.ok(
          css.indexOf(versionString) > -1,
          `CSS does not include version string: "${css.substr(0, 24)}"...`
        );
        resolve();
      });
    });
  /* eslint-enable */

  it("includes the current version text in uswds.css", () => {
    const distFilename = path.join(distCssPath, "uswds.css");
    return checkVersion(distFilename);
  });

  it("includes the current version text in uswds.min.css", () => {
    const distFilename = path.join(distCssPath, "uswds.min.css");
    return checkVersion(distFilename);
  });
});
