const assert = require("assert");
const fs = require("fs");
const fileInput = require("../file-input");

const TEMPLATE = fs.readFileSync(
  `${__dirname}/file-input-single.template.html`
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
