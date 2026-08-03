const fs = require("fs");
const path = require("path");
const assert = require("assert");
const DatePicker = require("../index");
const EVENTS = require("./events");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/date-picker.template.html"),
);

const datePickerSelector = () => document.querySelector(".usa-date-picker");
const tests = [
  { name: "document.body", selector: () => document.body },
  { name: "date picker", selector: datePickerSelector },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`date picker component focus trap initialized at ${name}`, () => {
    const { body } = document;

    let root;
    let button;

    beforeEach(() => {
      body.innerHTML = TEMPLATE;
      DatePicker.on(containerSelector());
      root = datePickerSelector();
      button = root.querySelector(".usa-date-picker__button");
    });

    afterEach(() => {
      DatePicker.off(containerSelector());
      body.textContent = "";
    });

    it("should move focus to the first item when pressing tab form last item", () => {
      EVENTS.click(button);
      assert.ok(
        document.activeElement.classList.contains(
          "usa-date-picker__calendar__date--focused",
        ),
        "focuses correct item",
      );

      EVENTS.keydownTab();

      assert.ok(
        document.activeElement.classList.contains(
          "usa-date-picker__calendar__previous-year",
        ),
        "focuses correct item",
      );
    });

    it("should move focus to the last item when pressing shift+tab form first item", () => {
      EVENTS.click(button);
      EVENTS.keydownTab();
      assert.ok(
        document.activeElement.classList.contains(
          "usa-date-picker__calendar__previous-year",
        ),
        "focuses correct item",
      );

      EVENTS.keydownShiftTab();

      assert.ok(
        document.activeElement.classList.contains(
          "usa-date-picker__calendar__date--focused",
        ),
        "focuses correct item",
      );
    });
  });
});
