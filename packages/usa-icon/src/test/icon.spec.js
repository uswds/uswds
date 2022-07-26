const assert = require("assert");
const fs = require("fs");
const path = require("path");

const distPath = path.resolve(path.join(__dirname, "../../dist/img"));

describe("build output", () => {
  // test copyMaterialIcons()
  it("copies material icons to ./packages/usa-icon/dist/img", () => {
    const distFilename = path.join(distPath, "/material-icons");
    assert.ok(
      fs.existsSync(distFilename),
      `the file does not exist:  ${distFilename}`
    );
  });

  // test copyPackageIcons()
  it("copies USWDS package icons to ./packages/usa-icon/dist/img", () => {
    const distFilename = path.join(distPath, "/file.svg");
    assert.ok(
      fs.existsSync(distFilename),
      `the file does not exist:  ${distFilename}`
    );
  });

  // test buildSprite(), renameSprite()
  it("creates sprite.svg in ./packages/usa-icon/dist/img", () => {
    const distFilename = path.join(distPath, "sprite.svg");
    assert.ok(
      fs.existsSync(distFilename),
      `the file does not exist:  ${distFilename}`
    );
  });

  // test collectIcons()
  it("collects src icons ./packages/usa-icon/dist/img/usa-icons", () => {
    const distFilename = path.join(distPath, "/usa-icons");
    assert.ok(
      fs.existsSync(distFilename),
      `the file does not exist:  ${distFilename}`
    );
  });
});

