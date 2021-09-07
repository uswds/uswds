const assert = require("assert");
const fs = require("fs");
const path = require("path");
const fileInput = require("../../../src/js/components/file-input");

const RENDER = "../../../build/components/render/";
const TEMPLATE = fs.readFileSync(
  path.join(__dirname, RENDER, "file-input--disabled.html")
);

const tests = [
  { name: "document.body", selector: () => document.body },
  { name: "file input", selector: () => document.querySelector('.usa-file-input') }
];

tests.forEach(({name, selector: containerSelector}) => {
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
