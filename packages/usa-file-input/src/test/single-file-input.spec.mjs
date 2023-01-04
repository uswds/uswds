import assert from "assert";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import fileInput from "../index.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE = fs.readFileSync(
  `${__dirname}/file-input-single.template.html`
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
