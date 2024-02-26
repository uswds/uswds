const fs = require("fs");
const path = require("path");
const assert = require("assert");
const ComboBox = require("../index");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/combo-box-default-value.template.html"),
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
    describe("combo box component with default value attribute", () => {
      const { body } = document;

      let root;
      let input;
      let select;

      beforeEach(() => {
        body.innerHTML = TEMPLATE;
        root = containerSelector();
        ComboBox.on(root);
        input = root.querySelector(".usa-combo-box__input");
        select = root.querySelector(".usa-combo-box__select");
      });

      afterEach(() => {
        ComboBox.off(root);
        body.textContent = "";
      });

      it("enhances a select element into a combo box component", () => {
        assert.ok(input, "adds an input element");
        assert.strictEqual(
          input.value,
          "Blackberry",
          "updates the default value of the input",
        );
        assert.strictEqual(
          select.value,
          "blackberry",
          "updates the default value of the select",
        );
      });
    });
  });
});
