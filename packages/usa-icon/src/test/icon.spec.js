const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { runGulp } = require("../../../uswds-core/src/js/utils/test/util");

const distRootPath = path.resolve(path.join(__dirname, "../../../../dist/img"));
const distPackagePath = path.resolve(path.join(__dirname, "../../dist/img"));

before(() => {
  setTimeout(() => runGulp("buildUSWDS"), 20000);
});

describe("build output", () => {
  it("creates a sprite.svg in ./dist/img", () => {
    const distFilename = path.join(distRootPath, "sprite.svg");
    assert.ok(
      fs.existsSync(distFilename),
      `the file does not exist:  ${distFilename}`
    );
  });

  it("creates a sprite.svg in ./packages/usa-icon/dist/img", () => {
    const distFilename = path.join(distPackagePath, "sprite.svg");
    assert.ok(
      fs.existsSync(distFilename),
      `the file does not exist:  ${distFilename}`
    );
  });

  it("copies material icons to ./dist/img", () => {
    const distFilename = path.join(distRootPath, "/material-icons");
    assert.ok(
      fs.existsSync(distFilename),
      `the file does not exist:  ${distFilename}`
    );
  });

  it("copies material icons to ./packages/usa-icon/dist/img", () => {
    const distFilename = path.join(distPackagePath, "/material-icons");
    assert.ok(
      fs.existsSync(distFilename),
      `the file does not exist:  ${distFilename}`
    );
  });

});

