const fs = require("fs");
const path = require("path");
const assert = require("assert");
const EVENTS = require("./events");
const DatePicker = require("../index");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/date-picker-range-date.template.html"),
);

const datePickerSelector = () => document.querySelector(".usa-date-picker");
const tests = [
  { name: "document.body", selector: () => document.body },
  { name: "date picker", selector: datePickerSelector },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`date picker component with range date initialized at ${name}`, () => {
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

    it("should display the range date when showing the month of the range date", () => {
      input.value = "05/21/2020";

      EVENTS.click(button);

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--range-date").dataset
          .value,
        "2020-05-22",
        "shows the correct date as the range date",
      );
    });

    it("should not display the range date when showing the a month different from the range date month", () => {
      input.value = "06/21/2020";

      EVENTS.click(button);

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--range-date"),
        null,
        "the range date is not present",
      );
    });

    it("should display the days between the calendar date and the range date as within range when the calendar date is above the range date", () => {
      input.value = "05/25/2020";

      EVENTS.click(button);

      assert.strictEqual(
        getCalendarEl(
          '.usa-date-picker__calendar__date[data-day="22"]',
        ).classList.contains("usa-date-picker__calendar__date--within-range"),
        false,
        "should not show the range date as within range",
      );
      assert.strictEqual(
        getCalendarEl(
          '.usa-date-picker__calendar__date[data-day="23"]',
        ).classList.contains("usa-date-picker__calendar__date--within-range"),
        true,
        "shows date within range as within range",
      );
      assert.strictEqual(
        getCalendarEl(
          '.usa-date-picker__calendar__date[data-day="24"]',
        ).classList.contains("usa-date-picker__calendar__date--within-range"),
        true,
        "shows date within range as within range",
      );
      assert.strictEqual(
        getCalendarEl(
          '.usa-date-picker__calendar__date[data-day="25"]',
        ).classList.contains("usa-date-picker__calendar__date--within-range"),
        false,
        "should not show the current calendar date as within range",
      );
      assert.strictEqual(
        getCalendarEl(
          '.usa-date-picker__calendar__date[data-day="26"]',
        ).classList.contains("usa-date-picker__calendar__date--within-range"),
        false,
        "does not show dates outside of the range as within range",
      );
    });

    it("should display the days between the calendar date and the range date as within range when the calendar date is below the range date", () => {
      input.value = "05/18/2020";

      EVENTS.click(button);

      assert.strictEqual(
        getCalendarEl(
          '.usa-date-picker__calendar__date[data-day="22"]',
        ).classList.contains("usa-date-picker__calendar__date--within-range"),
        false,
        "should not show the range date as within range",
      );
      assert.strictEqual(
        getCalendarEl(
          '.usa-date-picker__calendar__date[data-day="21"]',
        ).classList.contains("usa-date-picker__calendar__date--within-range"),
        true,
        "shows date within range as within range",
      );

      assert.strictEqual(
        getCalendarEl(
          '.usa-date-picker__calendar__date[data-day="20"]',
        ).classList.contains("usa-date-picker__calendar__date--within-range"),
        true,
        "shows date within range as within range",
      );
      assert.strictEqual(
        getCalendarEl(
          '.usa-date-picker__calendar__date[data-day="19"]',
        ).classList.contains("usa-date-picker__calendar__date--within-range"),
        true,
        "shows date within range as within range",
      );
      assert.strictEqual(
        getCalendarEl(
          '.usa-date-picker__calendar__date[data-day="18"]',
        ).classList.contains("usa-date-picker__calendar__date--within-range"),
        false,
        "should not show the current calendar date as within range",
      );
      assert.strictEqual(
        getCalendarEl(
          '.usa-date-picker__calendar__date[data-day="17"]',
        ).classList.contains("usa-date-picker__calendar__date--within-range"),
        false,
        "does not show dates outside of the range as within range",
      );
    });
  });
});
