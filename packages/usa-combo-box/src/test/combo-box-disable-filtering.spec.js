const fs = require("fs");
const path = require("path");
const assert = require("assert");
const ComboBox = require("../index");
const EVENTS = require("./events");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/combo-box-disable-filtering.template.html"),
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
    describe("combo box component with disable filtering attribute", () => {
      const { body } = document;

      let root;
      let input;
      let list;
      let select;

      beforeEach(() => {
        body.innerHTML = TEMPLATE;
        root = containerSelector();
        ComboBox.on(root);
        input = root.querySelector(".usa-combo-box__input");
        list = root.querySelector(".usa-combo-box__list");
        select = root.querySelector(".usa-combo-box__select");
      });

      afterEach(() => {
        ComboBox.off(root);
        body.textContent = "";
      });

      it("should display the full list and focus the first found item", () => {
        input.value = "oo";

        EVENTS.input(input);

        const focusedOption = list.querySelector(
          ".usa-combo-box__list-option--focused",
        );
        assert.ok(!list.hidden, "should show the option list");
        assert.strictEqual(
          list.children.length,
          select.options.length - 1,
          "should have all of the initial select items in the list except placeholder empty items",
        );
        assert.strictEqual(
          focusedOption.textContent,
          "Blood orange",
          "should be the first found item",
        );
      });
    });
  });
});
