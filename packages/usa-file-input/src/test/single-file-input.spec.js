const assert = require("assert");
const fs = require("fs");
const fileInput = require("../index");

const TEMPLATE = fs.readFileSync(
  `${__dirname}/file-input-single.template.html`,
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
    describe("file input: single file input", () => {
      const { body } = document;

      let dragText;
      let inputEl;

      beforeEach(() => {
        body.innerHTML = TEMPLATE;
        fileInput.on(containerSelector());
        dragText = body.querySelector(".usa-file-input__drag-text");
        inputEl = body.querySelector(".usa-file-input__input");
      });

      afterEach(() => {
        fileInput.off(containerSelector());
        body.innerHTML = "";
      });

      it('uses singular "file" if there is not a "multiple" attribute', () => {
        assert.strictEqual(dragText.innerHTML, "Drag file here or");
      });

      it("uses the desktop drag instruction as its default aria label", () => {
        assert.strictEqual(
          inputEl.getAttribute("aria-label"),
          "Drag file here or choose from folder",
        );
      });
    });

    describe("file input: coarse pointer devices", () => {
      const { body } = document;
      const originalMatchMedia = window.matchMedia;

      let dragText;
      let chooseText;
      let inputEl;

      beforeEach(() => {
        window.matchMedia = () => ({
          matches: true,
          media: "(hover: none), (pointer: coarse)",
        });
        body.innerHTML = TEMPLATE;
        fileInput.on(containerSelector());
        dragText = body.querySelector(".usa-file-input__drag-text");
        chooseText = body.querySelector(".usa-file-input__choose");
        inputEl = body.querySelector(".usa-file-input__input");
      });

      afterEach(() => {
        fileInput.off(containerSelector());
        body.innerHTML = "";
        window.matchMedia = originalMatchMedia;
      });

      it("removes the drag instruction", () => {
        assert.strictEqual(dragText, null);
      });

      it("uses a mobile-safe choose instruction", () => {
        assert.strictEqual(chooseText.innerHTML, "Choose from folder");
        assert.strictEqual(
          inputEl.getAttribute("aria-label"),
          chooseText.innerHTML,
        );
      });
    });
  });
});
