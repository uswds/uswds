import { testUtils } from "@uswds/utils"

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const { runGulp, distCssPath } = testUtils.util

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
