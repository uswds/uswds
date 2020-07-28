const assert = require("assert");
const fileInput = require("../../../src/js/components/file-input");
const fs = require("fs");
const path = require("path");

const RENDER = "../../../build/components/render/";
const TEMPLATE = fs.readFileSync(
  path.join(__dirname, RENDER, "file-input--disabled.html")
);

describe("file input is disabled", () => {
  const { body } = document;

  let component;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    fileInput.on();
    component = body.querySelector(".usa-file-input");
    fileInput.on(body);
  });

  afterEach(() => {
    body.innerHTML = "";
    fileInput.off(body);
  });

  it("has disabled styling", () => {
    const expectedClass = "usa-file-input--disabled";
    assert.strictEqual(
      component.getAttribute("class").includes(expectedClass),
      true
    );
  });
});
