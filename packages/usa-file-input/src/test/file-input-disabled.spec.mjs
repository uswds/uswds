import assert from "assert";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import fileInput from "../index.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE = fs.readFileSync(
  `${__dirname}/file-input-disabled.template.html`
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
    describe("file input is disabled", () => {
      const { body } = document;

      let component;

      beforeEach(() => {
        body.innerHTML = TEMPLATE;
        fileInput.on(containerSelector());
        component = body.querySelector(".usa-file-input");
      });

      afterEach(() => {
        fileInput.off(containerSelector());
        body.innerHTML = "";
      });

      it("has disabled styling", () => {
        const expectedClass = "usa-file-input--disabled";
        assert.strictEqual(
          component.getAttribute("class").includes(expectedClass),
          true
        );
      });
    });
  });
});
