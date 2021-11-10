const assert = require("assert");
const fs = require("fs");
const fileInput = require("../file-input");

const TEMPLATE = fs.readFileSync(
  `${__dirname}/file-input-multiple.template.html`
);

describe("file input component builds successfully", () => {
  const { body } = document;

  let dropZone;
  let instructions;
  let inputEl;
  let dragText;
  let box;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    fileInput.on();
    dropZone = body.querySelector(".usa-file-input__target");
    instructions = body.querySelector(".usa-file-input__instructions");
    inputEl = body.querySelector(".usa-file-input__input");
    box = body.querySelector(".usa-file-input__box");
    dragText = body.querySelector(".usa-file-input__drag-text");
    fileInput.on(body);
  });

  afterEach(() => {
    body.innerHTML = "";
    fileInput.off(body);
  });

  it("instructions are created", () => {
    assert.strictEqual(
      instructions.getAttribute("class"),
      "usa-file-input__instructions"
    );
  });

  it("target ui is created", () => {
    assert.strictEqual(
      dropZone.getAttribute("class"),
      "usa-file-input__target"
    );
  });

  it("input gets new class", () => {
    assert.strictEqual(inputEl.getAttribute("class"), "usa-file-input__input");
  });

  it("box is created", () => {
    assert.strictEqual(box.getAttribute("class"), "usa-file-input__box");
  });

  it('pluralizes "files" if there is a "multiple" attribute', () => {
    assert.strictEqual(dragText.innerHTML, "Drag files here or ");
  });
});
