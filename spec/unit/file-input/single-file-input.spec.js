const assert = require("assert");
const fs = require("fs");
const path = require("path");
const fileInput = require("../../../src/js/components/file-input");

const RENDER = "../../../build/components/render/";
const TEMPLATE = fs.readFileSync(
  path.join(__dirname, RENDER, "file-input--default.html")
);

const tests = [
  { name: "document.body", selector: () => document.body },
  { name: "file input", selector: () => document.querySelector('.usa-file-input') }
];

tests.forEach(({name, selector: containerSelector}) => {
  describe(`File input initialized at ${name}`, () => {
    describe("file input: single file input", () => {
      const { body } = document;

      let dragText;

      beforeEach(() => {
        body.innerHTML = TEMPLATE;
        fileInput.on(containerSelector());
        dragText = body.querySelector(".usa-file-input__drag-text");
      });

      afterEach(() => {
        fileInput.off(containerSelector());
        body.innerHTML = "";
      });

      it('uses singular "file" if there is not a "multiple" attribute', () => {
        assert.strictEqual(dragText.innerHTML, "Drag file here or ");
      });
    });
  });
});
