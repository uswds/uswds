const fs = require("fs");
const path = require("path");
const assert = require("assert");
const EVENTS = require("./events");
const DatePicker = require("../index");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/date-picker-default-value.template.html"),
);

const datePickerSelector = () => document.querySelector(".usa-date-picker");
const tests = [
  { name: "document.body", selector: () => document.body },
  { name: "date picker", selector: datePickerSelector },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`date picker component with default date initialized at ${name}`, () => {
    const { body } = document;

    let root;
    let input;
    let button;
    const getCalendarEl = (query) =>
      root.querySelector(
        `.usa-date-picker__calendar${query ? ` ${query}` : ""}`,
      );

    beforeEach(() => {
      body.innerHTML = TEMPLATE;
      DatePicker.on(containerSelector());
      root = datePickerSelector();
      input = root.querySelector(".usa-date-picker__external-input");
      button = root.querySelector(".usa-date-picker__button");
    });

    afterEach(() => {
      DatePicker.off(containerSelector());
      window.onerror = null;
      body.textContent = "";
    });

    it("should set the input date of the calendar", () => {
      assert.strictEqual(
        input.value,
        "05/22/2020",
        "updates the calendar value",
      );
    });

    it("should display the selected date when the calendar is opened", () => {
      EVENTS.click(button);

      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );
      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2020-05-22",
        "focuses correct date",
      );
    });
  });
});
