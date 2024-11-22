const fs = require("fs");
const path = require("path");
const assert = require("assert");
const EVENTS = require("./events");
const DatePicker = require("../index");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/date-picker-min-date-max-date.template.html"),
);

const VALIDATION_MESSAGE = "Please enter a valid date";

const datePickerSelector = () => document.querySelector(".usa-date-picker");
const tests = [
  { name: "document.body", selector: () => document.body },
  { name: "date picker", selector: datePickerSelector },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`date picker component with min date and max date initialized at ${name}`, () => {
    const { body } = document;

    let root;
    let input;
    let button;
    let error;
    let expectedError;
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
      expectedError = "";
      window.onerror = (message) => {
        error = message;
        return error === expectedError;
      };
    });

    afterEach(() => {
      DatePicker.off(containerSelector());
      window.onerror = null;
      body.textContent = "";
    });

    it("should allow navigation back a year to a month that is partially disabled due to a minimum date being set", () => {
      input.value = "05/15/2021";
      EVENTS.click(button);
      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );

      EVENTS.click(getCalendarEl(".usa-date-picker__calendar__previous-year"));

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2020-05-22",
        "focuses correct date",
      );
    });

    it("should disable back buttons when displaying the minimum month", () => {
      input.value = "05/30/2020";
      EVENTS.click(button);
      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__previous-month").disabled,
        true,
        "the previous month button is disabled",
      );
      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__previous-year").disabled,
        true,
        "the previous year button is disabled",
      );

      EVENTS.click(getCalendarEl(".usa-date-picker__calendar__previous-month"));
      EVENTS.click(getCalendarEl(".usa-date-picker__calendar__previous-year"));

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2020-05-30",
        "focuses correct date",
      );
    });

    it("should disable forward buttons when displaying the maximum month", () => {
      input.value = "06/01/2021";
      EVENTS.click(button);
      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__next-month").disabled,
        true,
        "the next month button is disabled",
      );
      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__next-year").disabled,
        true,
        "the next year button is disabled",
      );

      EVENTS.click(getCalendarEl(".usa-date-picker__calendar__next-month"));
      EVENTS.click(getCalendarEl(".usa-date-picker__calendar__next-year"));

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2021-06-01",
        "focuses correct date",
      );
    });

    it("should allow navigation back a year to a month that is less than a year from the minimum date being set and cap at that minimum date", () => {
      input.value = "04/15/2021";
      EVENTS.click(button);
      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );

      EVENTS.click(getCalendarEl(".usa-date-picker__calendar__previous-year"));

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2020-05-22",
        "focuses correct date",
      );
    });

    it("should allow navigation back a month to a month that is partially disabled due to a minimum date being set", () => {
      input.value = "06/15/2020";
      EVENTS.click(button);
      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );

      EVENTS.click(getCalendarEl(".usa-date-picker__calendar__previous-month"));

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2020-05-22",
        "focuses correct date",
      );
    });

    it("should not allow navigation back a month to a month that is fully disabled due to a minimum date being set", () => {
      input.value = "05/30/2020";
      EVENTS.click(button);
      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__previous-year").disabled,
        true,
        "the button is disabled",
      );

      EVENTS.click(getCalendarEl(".usa-date-picker__calendar__previous-month"));

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2020-05-30",
        "focuses correct date",
      );
    });

    it("should allow navigation forward a year to a month that is partially disabled due to a maximum date being set", () => {
      input.value = "06/25/2020";
      EVENTS.click(button);
      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );

      EVENTS.click(getCalendarEl(".usa-date-picker__calendar__next-year"));

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2021-06-20",
        "focuses correct date",
      );
    });

    it("should allow navigation forward a year to a month that is less than a year from the maximum date and cap at that maximum date", () => {
      input.value = "07/25/2020";
      EVENTS.click(button);
      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );

      EVENTS.click(getCalendarEl(".usa-date-picker__calendar__next-year"));

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2021-06-20",
        "focuses correct date",
      );
    });

    it("should allow navigation forward a month to a month that is partially disabled due to a maximum date being set", () => {
      input.value = "05/25/2021";
      EVENTS.click(button);
      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );

      EVENTS.click(getCalendarEl(".usa-date-picker__calendar__next-month"));

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2021-06-20",
        "focuses correct date",
      );
    });

    it("should not allow navigation forward a month to a month that is fully disabled due to a maximum date being set", () => {
      input.value = "06/17/2021";
      EVENTS.click(button);
      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );

      EVENTS.click(getCalendarEl(".usa-date-picker__calendar__next-month"));

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2021-06-17",
        "focuses correct date",
      );
    });

    it("should allow selection of a month in the month selection screen that is partially disabled due to a minimum date being set", () => {
      input.value = "12/01/2020";
      EVENTS.click(button);
      EVENTS.click(
        getCalendarEl(".usa-date-picker__calendar__month-selection"),
      );
      assert.ok(
        getCalendarEl(".usa-date-picker__calendar__month-picker"),
        "the month picker is shown",
      );

      EVENTS.click(
        getCalendarEl().querySelector(
          '.usa-date-picker__calendar__month[data-label="May"]',
        ),
      );

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2020-05-22",
        "focuses correct date",
      );
      assert.ok(
        getCalendarEl(".usa-date-picker__calendar__date-picker"),
        "the date picker is shown",
      );
    });

    it("should not allow selection of a month in the month selection screen that is fully disabled due to a minimum date being set", () => {
      input.value = "10/31/2020";
      EVENTS.click(button);
      EVENTS.click(
        getCalendarEl(".usa-date-picker__calendar__month-selection"),
      );
      assert.ok(
        getCalendarEl(".usa-date-picker__calendar__month-picker"),
        "the month picker is shown",
      );

      EVENTS.click(
        getCalendarEl(
          '.usa-date-picker__calendar__month[data-label="January"]',
        ),
      );

      assert.ok(
        getCalendarEl(".usa-date-picker__calendar__month-picker"),
        "the month picker is shown",
      );
    });

    it("should allow selection of a month in the month selection screen that is partially disabled due to a maximum date being set", () => {
      input.value = "01/30/2021";
      EVENTS.click(button);
      EVENTS.click(
        getCalendarEl(".usa-date-picker__calendar__month-selection"),
      );
      assert.ok(
        getCalendarEl(".usa-date-picker__calendar__month-picker"),
        "the month picker is shown",
      );

      EVENTS.click(
        getCalendarEl().querySelector(
          '.usa-date-picker__calendar__month[data-label="June"]',
        ),
      );

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2021-06-20",
        "focuses correct date",
      );
      assert.ok(
        getCalendarEl(".usa-date-picker__calendar__date-picker"),
        "the date picker is shown",
      );
    });

    it("should not allow selection of a month in the month selection screen that is fully disabled due to a maximum date being set", () => {
      input.value = "02/29/2021";
      EVENTS.click(button);
      EVENTS.click(
        getCalendarEl(".usa-date-picker__calendar__month-selection"),
      );
      assert.ok(
        getCalendarEl(".usa-date-picker__calendar__month-picker"),
        "the month picker is shown",
      );

      EVENTS.click(
        getCalendarEl(
          '.usa-date-picker__calendar__month[data-label="December"]',
        ),
      );

      assert.ok(
        getCalendarEl(".usa-date-picker__calendar__month-picker"),
        "the month picker is shown",
      );
    });

    it("should allow selection of a year in the year selection screen that is partially disabled due to a minimum date being set", () => {
      input.value = "04/01/2021";
      EVENTS.click(button);
      EVENTS.click(getCalendarEl(".usa-date-picker__calendar__year-selection"));
      assert.ok(
        getCalendarEl(".usa-date-picker__calendar__year-picker"),
        "the year picker is shown",
      );

      EVENTS.click(
        getCalendarEl('.usa-date-picker__calendar__year[data-value="2020"]'),
      );

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2020-05-22",
        "focuses correct date",
      );
      assert.ok(
        getCalendarEl(".usa-date-picker__calendar__date-picker"),
        "the date picker is shown",
      );
    });

    it("should allow selection of a year in the year selection screen that is partially disabled due to a maximum date being set", () => {
      input.value = "12/01/2020";
      EVENTS.click(button);
      EVENTS.click(getCalendarEl(".usa-date-picker__calendar__year-selection"));
      assert.ok(
        getCalendarEl(".usa-date-picker__calendar__year-picker"),
        "the year picker is shown",
      );

      EVENTS.click(
        getCalendarEl('.usa-date-picker__calendar__year[data-value="2021"]'),
      );

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2021-06-20",
        "focuses correct date",
      );
      assert.ok(
        getCalendarEl(".usa-date-picker__calendar__date-picker"),
        "the date picker is shown",
      );
    });

    it("should not allow selection of a year in the year selection screen that is fully disabled due to a minimum date being set", () => {
      input.value = "07/04/2020";
      EVENTS.click(button);
      EVENTS.click(getCalendarEl(".usa-date-picker__calendar__year-selection"));
      assert.ok(
        getCalendarEl(".usa-date-picker__calendar__year-picker"),
        "the year picker is shown",
      );

      EVENTS.click(
        getCalendarEl('.usa-date-picker__calendar__year[data-value="2018"]'),
      );

      assert.ok(
        getCalendarEl(".usa-date-picker__calendar__year-picker"),
        "the year picker is shown",
      );
    });

    it("should not allow selection of a year  in the year selection screen that is fully disabled due to a maximum date being set", () => {
      input.value = "12/01/2020";
      EVENTS.click(button);
      EVENTS.click(getCalendarEl(".usa-date-picker__calendar__year-selection"));
      assert.ok(
        getCalendarEl(".usa-date-picker__calendar__year-picker"),
        "the year picker is shown",
      );

      EVENTS.click(
        getCalendarEl('.usa-date-picker__calendar__year[data-value="2023"]'),
      );

      assert.ok(
        getCalendarEl(".usa-date-picker__calendar__year-picker"),
        "the year picker is shown",
      );
    });

    it("should allow selection of a date that is the minimum date", () => {
      input.value = "05/25/2020";
      EVENTS.click(button);
      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );

      EVENTS.click(
        getCalendarEl().querySelector(
          '.usa-date-picker__calendar__date[data-day="22"]',
        ),
      );

      assert.strictEqual(
        input.value,
        "05/22/2020",
        "The value has been filled in",
      );
    });

    it("should allow selection of a date that is the maximum date", () => {
      input.value = "06/15/2020";
      EVENTS.click(button);
      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );

      EVENTS.click(
        getCalendarEl().querySelector(
          '.usa-date-picker__calendar__date[data-day="20"]',
        ),
      );

      assert.strictEqual(
        input.value,
        "06/20/2020",
        "The value has been filled in",
      );
    });

    it("should not allow selection of a date that is before the minimum date", () => {
      input.value = "05/25/2020";
      EVENTS.click(button);
      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );

      EVENTS.click(
        getCalendarEl().querySelector(
          '.usa-date-picker__calendar__date[data-day="15"]',
        ),
      );

      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );
    });

    it("should not allow selection of a date that is after the maximum date", () => {
      input.value = "06/15/2021";
      EVENTS.click(button);
      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );

      EVENTS.click(
        getCalendarEl().querySelector(
          '.usa-date-picker__calendar__date[data-day="25"]',
        ),
      );

      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );
    });

    it("should allow keyboard navigation to move back one day to a date that is the minimum date", () => {
      input.value = "05/23/2020";
      EVENTS.click(button);
      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );

      EVENTS.keydownArrowLeft();

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2020-05-22",
        "focuses correct date",
      );
    });

    it("should allow keyboard navigation to move back one week to a date that is the minimum date", () => {
      input.value = "05/29/2020";
      EVENTS.click(button);
      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );

      EVENTS.keydownArrowUp();

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2020-05-22",
        "focuses correct date",
      );
    });

    it("should allow keyboard navigation to move back one month to a date that is the minimum date", () => {
      input.value = "06/22/2020";
      EVENTS.click(button);
      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );

      EVENTS.keydownPageUp();

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2020-05-22",
        "focuses correct date",
      );
    });

    it("should allow keyboard navigation to move back one year to a date that is the minimum date", () => {
      input.value = "05/22/2021";
      EVENTS.click(button);
      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );

      EVENTS.keydownShiftPageUp();

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2020-05-22",
        "focuses correct date",
      );
    });

    it("should not allow keyboard navigation to move back one day to a date that is before the minimum date", () => {
      input.value = "05/22/2020";
      EVENTS.click(button);
      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );

      EVENTS.keydownArrowLeft();

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2020-05-22",
        "focuses correct date",
      );
    });

    it("should allow keyboard navigation to move to the start of the week to a date that is before the minimum date but cap at minimum date", () => {
      input.value = "05/23/2020";
      EVENTS.click(button);
      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );

      EVENTS.keydownHome();

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2020-05-22",
        "focuses correct date",
      );
    });

    it("should allow keyboard navigation to move back one week to a date that is before the minimum date but cap at minimum date", () => {
      input.value = "05/28/2020";
      EVENTS.click(button);
      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );

      EVENTS.keydownArrowUp();

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2020-05-22",
        "focuses correct date",
      );
    });

    it("should allow keyboard navigation to move back one month to a date that is before the minimum date but cap at minimum date", () => {
      input.value = "06/21/2020";
      EVENTS.click(button);
      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );

      EVENTS.keydownPageUp();

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2020-05-22",
        "focuses correct date",
      );
    });

    it("should allow keyboard navigation to move back one year to a date that is before the minimum date but cap at minimum date", () => {
      input.value = "05/21/2021";
      EVENTS.click(button);
      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );

      EVENTS.keydownShiftPageUp();

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2020-05-22",
        "focuses correct date",
      );
    });

    it("should allow keyboard navigation to move forward one day to a date that is the maximum date", () => {
      input.value = "06/19/2021";
      EVENTS.click(button);
      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );

      EVENTS.keydownArrowRight();

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2021-06-20",
        "focuses correct date",
      );
    });

    it("should allow keyboard navigation to move forward one week to a date that is the maximum date", () => {
      input.value = "06/13/2021";
      EVENTS.click(button);
      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );

      EVENTS.keydownArrowDown();

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2021-06-20",
        "focuses correct date",
      );
    });

    it("should allow keyboard navigation to move forward one month to a date that is the maximum date", () => {
      input.value = "05/20/2021";
      EVENTS.click(button);
      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );

      EVENTS.keydownPageDown();

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2021-06-20",
        "focuses correct date",
      );
    });

    it("should allow keyboard navigation to move forward one year to a date that is the maximum date", () => {
      input.value = "06/20/2020";
      EVENTS.click(button);
      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );

      EVENTS.keydownShiftPageDown();

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2021-06-20",
        "focuses correct date",
      );
    });

    it("should not allow keyboard navigation to move forward one day to a date that is after the maximum date", () => {
      input.value = "06/20/2021";
      EVENTS.click(button);
      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );

      EVENTS.keydownArrowRight();

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2021-06-20",
        "focuses correct date",
      );
    });

    it("should allow keyboard navigation to move to the end of the week to a date that is after the maximum date but cap at maximum date", () => {
      root.dataset.maxDate = "2021-06-21";
      input.value = "06/20/2021";
      EVENTS.click(button);
      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );

      EVENTS.keydownEnd();

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2021-06-21",
        "focuses correct date",
      );
    });

    it("should allow keyboard navigation to move forward one week to a date that is after the maximum date but cap at maximum date", () => {
      input.value = "06/14/2021";
      EVENTS.click(button);
      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );

      EVENTS.keydownArrowDown();

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2021-06-20",
        "focuses correct date",
      );
    });

    it("should allow keyboard navigation to move forward one month to a date that is after the maximum date but cap at maximum date", () => {
      input.value = "05/21/2021";
      EVENTS.click(button);
      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );

      EVENTS.keydownPageDown();

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2021-06-20",
        "focuses correct date",
      );
    });

    it("should allow keyboard navigation to move forward one year to a date that is after the maximum date but cap at maximum date", () => {
      input.value = "06/21/2020";
      EVENTS.click(button);
      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );

      EVENTS.keydownShiftPageDown();

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2021-06-20",
        "focuses correct date",
      );
    });

    it("should show a date that is after the maximum date as invalid", () => {
      input.value = "06/30/2021";

      EVENTS.keydownEnter(input);

      assert.strictEqual(input.validationMessage, VALIDATION_MESSAGE);
    });

    it("should show a date that is the maximum date as valid", () => {
      input.value = "06/20/2021";

      EVENTS.keydownEnter(input);

      assert.strictEqual(input.validationMessage, "");
    });

    it("should show a date that is before the minimum date as invalid", () => {
      input.value = "05/01/2020";

      EVENTS.keydownEnter(input);

      assert.strictEqual(input.validationMessage, VALIDATION_MESSAGE);
    });

    it("should show a date that is the minimum date as valid", () => {
      input.value = "05/22/2020";

      EVENTS.keydownEnter(input);

      assert.strictEqual(input.validationMessage, "");
    });

    it("should throw when minDate is larger than maxDate", () => {
      root.dataset.minDate = "2020-07-04";
      root.dataset.maxDate = "2020-06-20";
      expectedError = "Minimum date cannot be after maximum date";

      EVENTS.click(button);

      assert.strictEqual(error, expectedError, "caught the error");
    });

    it("should open the calendar on the min date when the input date is before the min date", () => {
      input.value = "04/15/2020";
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

    it("should open the calendar on the max date when the input date is after the max date", () => {
      input.value = "04/15/2023";
      EVENTS.click(button);

      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );
      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2021-06-20",
        "focuses correct date",
      );
    });

    it("should open the calendar on the max date when the input is empty and the current date is after the max date", () => {
      root.dataset.minDate = "2020-01-01";
      root.dataset.maxDate = "2020-02-14";
      EVENTS.click(button);

      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "The calendar is shown",
      );
      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2020-02-14",
        "focuses correct date",
      );
    });

    it("should update the calendar to the max date when the input is changed and the input date is after the max date", () => {
      root.dataset.minDate = "2020-01-01";
      root.dataset.maxDate = "2020-02-14";
      input.value = "01/20/2020";
      EVENTS.click(button);
      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2020-01-20",
        "focuses correct date",
      );

      input.value = "6/20/2020";
      EVENTS.input(input);

      assert.strictEqual(
        getCalendarEl(".usa-date-picker__calendar__date--focused").dataset
          .value,
        "2020-02-14",
        "focuses correct date",
      );
    });
  });
});
