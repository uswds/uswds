const fs = require("fs");
const path = require("path");
const assert = require("assert");
const TimePicker = require("../index");
const ComboBox = require("../../../usa-combo-box/src/index");
const EVENTS = require("../../../usa-combo-box/src/test/events");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/time-picker.template.html"),
);

const timePickerSelector = () => document.querySelector(".usa-time-picker");
const tests = [
  { name: "document.body", selector: () => document.body },
  { name: "time picker", selector: timePickerSelector },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`time picker component initialized at ${name}`, () => {
    const { body } = document;

    let root;
    let input;
    let select;
    let list;

    beforeEach(() => {
      body.innerHTML = TEMPLATE;
      TimePicker.on(containerSelector());
      ComboBox.on(containerSelector());
      root = body.querySelector(".usa-combo-box");
      input = root.querySelector(".usa-combo-box__input");
      select = root.querySelector(".usa-combo-box__select");
      list = root.querySelector(".usa-combo-box__list");
    });

    afterEach(() => {
      ComboBox.off(containerSelector());
      TimePicker.off(containerSelector());
      body.textContent = "";
    });

    it("enhances a select element into a combo box component", () => {
      assert.ok(input, "adds an input element");
      assert.ok(
        select.classList.contains("usa-sr-only"),
        "hides the select element from view",
      );
      assert.ok(list, "adds an list element");
      assert.ok(list.hidden, "the list is hidden");
      assert.strictEqual(
        select.getAttribute("id"),
        "",
        "transfers id attribute to combo box",
      );
      assert.strictEqual(
        input.getAttribute("id"),
        "appointment-time",
        "transfers id attribute to combo box",
      );
      assert.strictEqual(
        select.getAttribute("required"),
        null,
        "transfers required attribute to combo box",
      );
      assert.strictEqual(
        input.getAttribute("required"),
        "",
        "transfers required attribute to combo box",
      );
      assert.strictEqual(
        select.value,
        "13:00",
        "transfers value attribute to combo box",
      );
      assert.strictEqual(
        input.value,
        "1:00pm",
        "transfers value attribute to combo box",
      );
      assert.strictEqual(
        select.getAttribute("name"),
        "appointment-time",
        "should not transfer name attribute to combo box",
      );
      assert.strictEqual(
        input.getAttribute("name"),
        null,
        "should not transfer name attribute to combo box",
      );
    });

    it("should focus the first item found in the list from the query when pressing down from the input", () => {
      input.value = "4p";

      EVENTS.input(input);
      assert.ok(!list.hidden, "should display the option list");

      EVENTS.keydownArrowDown(input);
      const focusedOption = document.activeElement;
      assert.strictEqual(
        focusedOption.textContent,
        "4:00pm",
        "should focus the last item in the list",
      );
    });

    it("should focus the first complete hour found in the list from the query when pressing down from the input", () => {
      input.value = "1p";

      EVENTS.input(input);
      assert.ok(!list.hidden, "should display the option list");

      EVENTS.keydownArrowDown(input);
      const focusedOption = document.activeElement;
      assert.strictEqual(
        focusedOption.textContent,
        "1:00pm",
        "should focus the last item in the list",
      );
    });
  });
});
