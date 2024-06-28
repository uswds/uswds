const fs = require("fs");
const path = require("path");
const assert = require("assert");
const ComboBox = require("../index");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/combo-box-placeholder.template.html"),
);

const tests = [
  { name: "document.body", selector: () => document.body },
  {
    name: "combo box",
    selector: () => document.querySelector(".usa-combo-box"),
  },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`Combo box initialized at ${name}`, () => {
    describe("combo box component with placeholder attribute", () => {
      const { body } = document;

      let root;
      let input;

      beforeEach(() => {
        body.innerHTML = TEMPLATE;
        root = containerSelector();
        ComboBox.on(root);
        input = root.querySelector(".usa-combo-box__input");
      });

      afterEach(() => {
        ComboBox.off(root);
        body.textContent = "";
      });

      it("enhances a select element into a combo box component", () => {
        assert.ok(input, "adds an input element");
        assert.strictEqual(
          input.placeholder,
          "Select one...",
          "transfers placeholder attribute from combo box",
        );
      });
    });
  });
});
