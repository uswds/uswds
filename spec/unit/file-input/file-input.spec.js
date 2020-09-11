const assert = require("assert");
const fileInput = require("../../../src/js/components/file-input");
const fs = require("fs");
const path = require("path");

const RENDER = "../../../build/components/render/";
const TEMPLATE = fs.readFileSync(
  path.join(__dirname, RENDER, "file-input--multiple.html")
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
    assert.equal(
      instructions.getAttribute("class"),
      "usa-file-input__instructions"
    );
  });

  it("target ui is created", () => {
    assert.equal(dropZone.getAttribute("class"), "usa-file-input__target");
  });

  it("input gets new class", () => {
    assert.equal(inputEl.getAttribute("class"), "usa-file-input__input");
  });

  it("box is created", () => {
    assert.equal(box.getAttribute("class"), "usa-file-input__box");
  });

  it('pluralizes "files" if there is a "multiple" attribute', () => {
    assert.equal(dragText.innerHTML, "Drag files here or ");
  });
});
