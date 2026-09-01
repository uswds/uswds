const fs = require("fs");
const path = require("path");
const assert = require("assert");
const ComboBox = require("../index");
const EVENTS = require("./events");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/combo-box-disabled.template.html"),
);

const comboBoxSelector = () => document.querySelector(".usa-combo-box");
const tests = [
  { name: "document.body", selector: () => document.body },
  { name: "combo box", selector: comboBoxSelector },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`Combo box initialized at ${name}`, () => {
    describe("combo box component - disabled enhancement", () => {
      const { body } = document;

      let root;
      let comboBox;
      let input;
      let select;
      let toggle;
      let list;

      beforeEach(() => {
        body.innerHTML = TEMPLATE;
        root = containerSelector();
        ComboBox.on(root);
        comboBox = comboBoxSelector();
        input = root.querySelector(".usa-combo-box__input");
        select = root.querySelector(".usa-combo-box__select");
        toggle = root.querySelector(".usa-combo-box__toggle-list");
        list = root.querySelector(".usa-combo-box__list");
      });

      afterEach(() => {
        ComboBox.off(root);
        body.textContent = "";
      });

      it("enhances a select element into a combo box component", () => {
        assert.ok(input, "adds an input element");
        assert.strictEqual(
          input.disabled,
          true,
          "transfers disabled attribute to combo box",
        );
        assert.strictEqual(
          select.disabled,
          false,
          "removes disabled attribute from select",
        );
      });

      it("should not show the list when clicking the disabled input", () => {
        EVENTS.click(input);

        assert.ok(list.hidden, "should not display the option list");
      });

      it("should not show the list when clicking the disabled button", () => {
        EVENTS.click(toggle);

        assert.ok(list.hidden, "should not display the option list");
      });

      it("should show the list when clicking the input once the component has been enabled", () => {
        ComboBox.enable(comboBox);
        EVENTS.click(input);

        assert.ok(!list.hidden, "should display the option list");
      });
    });
  });
});
