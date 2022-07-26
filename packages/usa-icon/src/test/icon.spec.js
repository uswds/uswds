const assert = require("assert");
const fs = require("fs");
const path = require("path");

const distRootPath = path.resolve(path.join(__dirname, "../../../../dist/img"));
const distPackagePath = path.resolve(path.join(__dirname, "../../dist/img"));

describe("build output", () => {
  // test copyMaterialIcons()
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

  // test copyUSWDSIcons()
  it("copies USWDS package icons to ./dist/img", () => {
    const distFilename = path.join(distRootPath, "/file.svg");
    assert.ok(
      fs.existsSync(distFilename),
      `the file does not exist:  ${distFilename}`
    );
  });

  it("copies USWDS package icons to ./packages/usa-icon/dist/img", () => {
    const distFilename = path.join(distPackagePath, "/file.svg");
    assert.ok(
      fs.existsSync(distFilename),
      `the file does not exist:  ${distFilename}`
    );
  });

  // test buildSprite(), renameSprite()
  it("creates sprite.svg in ./dist/img", () => {
    const distFilename = path.join(distRootPath, "sprite.svg");
    assert.ok(
      fs.existsSync(distFilename),
      `the file does not exist:  ${distFilename}`
    );
  });

  it("creates sprite.svg in ./packages/usa-icon/dist/img", () => {
    const distFilename = path.join(distPackagePath, "sprite.svg");
    assert.ok(
      fs.existsSync(distFilename),
      `the file does not exist:  ${distFilename}`
    );
  });

  // test collectIcons()
  it("collects src icons in ./dist/img/usa-icons/usa-icons", () => {
    const distFilename = path.join(distRootPath, "/usa-icons");
    assert.ok(
      fs.existsSync(distFilename),
      `the file does not exist:  ${distFilename}`
    );
  });

  it("collects src icons ./packages/usa-icon/dist/img/usa-icons", () => {
    const distFilename = path.join(distPackagePath, "/usa-icons");
    assert.ok(
      fs.existsSync(distFilename),
      `the file does not exist:  ${distFilename}`
    );
  });
});

