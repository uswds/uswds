const assert = require("assert");
const fs = require("fs");
const fileInput = require("../index");

const TEMPLATE = fs.readFileSync(
  `${__dirname}/file-input-disabled.template.html`
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

      it("includes aria-disabled attribute", () => {
        assert(
          component.getAttribute("aria-disabled").includes("true")
        );
      });
    });
  });
});
