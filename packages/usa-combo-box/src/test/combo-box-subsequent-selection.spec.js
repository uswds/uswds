const fs = require("fs");
const path = require("path");
const assert = require("assert");
const ComboBox = require("../index");
const EVENTS = require("./events");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/combo-box-subsequent-selection.template.html"),
);

const comboBoxSelector = () => document.querySelector(".usa-combo-box");

const tests = [
  { name: "document.body", selector: () => document.body },
  { name: "combo box", selector: comboBoxSelector },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`Combo box initialized at ${name}`, () => {
    describe("combo box component - subsequent selection", () => {
      const { body } = document;

      let root;
      let comboBox;
      let input;
      let select;
      let list;

      beforeEach(() => {
        body.innerHTML = TEMPLATE;
        root = containerSelector();
        ComboBox.on(root);
        comboBox = comboBoxSelector();
        input = root.querySelector(".usa-combo-box__input");
        select = root.querySelector(".usa-combo-box__select");
        list = root.querySelector(".usa-combo-box__list");
      });

      afterEach(() => {
        ComboBox.off(root);
        body.textContent = "";
      });

      it("should display the full list and focus the selected item when the input is pristine (after fresh selection)", () => {
        assert.ok(
          comboBox.classList.contains("usa-combo-box--pristine"),
          "pristine class added after selection",
        );
        EVENTS.click(input);

        assert.ok(!list.hidden, "should show the option list");
        assert.strictEqual(
          list.children.length,
          select.options.length - 1,
          "should have all of the initial select items in the list except placeholder empty items",
        );
        const highlightedOption = list.querySelector(
          ".usa-combo-box__list-option--focused",
        );
        assert.ok(
          highlightedOption.classList.contains(
            "usa-combo-box__list-option--focused",
          ),
          "should style the focused item in the list",
        );
        assert.strictEqual(
          highlightedOption.textContent,
          "Blackberry",
          "should be the previously selected item",
        );
      });

      it("should display the filtered list when the input is dirty (characters inputted)", () => {
        EVENTS.click(input);
        assert.strictEqual(
          list.children.length,
          select.options.length - 1,
          "should have all of the initial select items in the list except placeholder empty items",
        );

        input.value = "COBOL";
        EVENTS.input(input);

        assert.ok(
          !comboBox.classList.contains("usa-combo-box--pristine"),
          "pristine class is removed after input",
        );
        assert.strictEqual(
          list.children.length,
          1,
          "should only show the filtered items",
        );
      });

      it("should show a clear button when the input has a selected value present", () => {
        assert.ok(
          comboBox.classList.contains("usa-combo-box--pristine"),
          "pristine class added after selection",
        );
        assert.ok(
          comboBox.querySelector(".usa-combo-box__clear-input"),
          "clear input button is present",
        );
      });

      it("should clear the input when the clear button is clicked", () => {
        assert.strictEqual(select.value, "blackberry");
        assert.strictEqual(input.value, "Blackberry");

        EVENTS.click(comboBox.querySelector(".usa-combo-box__clear-input"));

        assert.strictEqual(
          select.value,
          "",
          "should clear the value on the select",
        );
        assert.strictEqual(
          input.value,
          "",
          "should clear the value on the input",
        );
        assert.strictEqual(
          document.activeElement,
          input,
          "should focus the input",
        );
      });

      it("should update the filter and begin filtering once a pristine input value is changed", () => {
        input.value = "go";
        EVENTS.click(input);
        EVENTS.keydownEnter(input);
        assert.strictEqual(
          input.value,
          "Blackberry",
          "should set that item to the input value",
        );
        EVENTS.click(input);
        assert.strictEqual(
          list.children.length,
          select.options.length - 1,
          "should have all of the initial select items in the list except placeholder empty items",
        );

        input.value = "Fig";
        EVENTS.input(input);

        assert.strictEqual(
          list.children.length,
          1,
          "should only show the filtered items",
        );
      });
    });
  });
});
