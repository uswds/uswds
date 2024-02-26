const assert = require("assert");
const fs = require("fs");
const fileInput = require("../index");

const TEMPLATE = fs.readFileSync(
  `${__dirname}/file-input-multiple.template.html`,
);

const tests = [
  { name: "document.body", selector: () => document.body },
  {
    name: "file input",
    selector: () => document.querySelector(".usa-file-input"),
  },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`File input initialized at ${name}`, () => {
    describe("file input component builds successfully", () => {
      const { body } = document;

      let dropZone;
      let instructions;
      let inputEl;
      let dragText;
      let box;
      let statusMessage;

      beforeEach(() => {
        body.innerHTML = TEMPLATE;
        fileInput.on(containerSelector());
        dropZone = body.querySelector(".usa-file-input__target");
        instructions = body.querySelector(".usa-file-input__instructions");
        inputEl = body.querySelector(".usa-file-input__input");
        box = body.querySelector(".usa-file-input__box");
        dragText = body.querySelector(".usa-file-input__drag-text");
        statusMessage = body.querySelector(".usa-sr-only");
      });

      afterEach(() => {
        fileInput.off(containerSelector());
        body.innerHTML = "";
      });

      it("instructions are created", () => {
        assert.strictEqual(
          instructions.getAttribute("class"),
          "usa-file-input__instructions",
        );
      });

      it("target ui is created", () => {
        assert.strictEqual(
          dropZone.getAttribute("class"),
          "usa-file-input__target",
        );
      });

      it("input gets new class", () => {
        assert.strictEqual(
          inputEl.getAttribute("class"),
          "usa-file-input__input",
        );
      });

      it("box is created", () => {
        assert.strictEqual(box.getAttribute("class"), "usa-file-input__box");
      });

      it('pluralizes "files" if there is a "multiple" attribute', () => {
        assert.strictEqual(dragText.innerHTML, "Drag files here or");
      });

      it("creates a status message element", () => {
        assert.strictEqual(statusMessage.getAttribute("class"), "usa-sr-only");
      });

      it("adds a default status message", () => {
        assert.strictEqual(statusMessage.innerHTML, "No files selected.");
      });
    });
  });
});
