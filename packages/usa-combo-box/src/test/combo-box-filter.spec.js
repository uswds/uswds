const fs = require("fs");
const path = require("path");
const assert = require("assert");
const ComboBox = require("../index");
const EVENTS = require("./events");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/combo-box-filter.template.html"),
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
    describe("combo box component with filter attribute", () => {
      const { body } = document;

      let root;
      let input;
      let list;

      beforeEach(() => {
        body.innerHTML = TEMPLATE;
        root = containerSelector();
        ComboBox.on(root);
        input = root.querySelector(".usa-combo-box__input");
        list = root.querySelector(".usa-combo-box__list");
      });

      afterEach(() => {
        ComboBox.off(root);
        body.textContent = "";
      });

      it("should display and filter the option list after a character is typed", () => {
        input.value = "st";

        EVENTS.input(input);

        assert.ok(!list.hidden, "should display the option list");
        assert.strictEqual(
          list.children.length,
          2,
          "should filter the item by the string starting with the option",
        );
      });
    });
  });
});
