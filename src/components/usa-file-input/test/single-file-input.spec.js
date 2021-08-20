const assert = require("assert");
const fs = require("fs");
const path = require("path");
const fileInput = require("../file-input");

const RENDER =
  "../../../../build/components-usa-file-input-usa-file-input/";
const TEMPLATE = fs.readFileSync(
  path.join(
    __dirname,
    RENDER,
    "components-usa-file-input-usa-file-input.rendered.html"
  )
);

describe("file input: single file input", () => {
  const { body } = document;

  let dragText;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    fileInput.on();
    dragText = body.querySelector(".usa-file-input__drag-text");
    fileInput.on(body);
  });

  afterEach(() => {
    body.innerHTML = "";
    fileInput.off(body);
  });

  it('uses singular "file" if there is not a "multiple" attribute', () => {
    assert.strictEqual(dragText.innerHTML, "Drag file here or ");
  });
});
