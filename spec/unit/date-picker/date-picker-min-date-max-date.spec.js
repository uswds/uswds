const fs = require("fs");
const path = require("path");
const assert = require("assert");
const EVENTS = require("./events");
const DatePicker = require("../../../src/js/components/date-picker");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/date-picker-min-date-max-date.template.html")
);

const VALIDATION_MESSAGE = "Please enter a valid date";

describe("date picker component with min date and max date", () => {
  const { body } = document;

  let root;
  let input;
  let button;
  const getCalendarEl = query =>
    root.querySelector(
      ".usa-date-picker__calendar" + (query ? ` ${query}` : "")
    );

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    DatePicker.on();
    root = body.querySelector(".usa-date-picker");
    input = root.querySelector(".usa-date-picker__input");
    button = root.querySelector(".usa-date-picker__button");
  });

  afterEach(() => {
    body.textContent = "";
    DatePicker.off(body);
  });

  it("should allow navigation back a year to a month that is partially disabled due to a minimum date being set", () => {
    input.value = "05/15/2021";
    EVENTS.click(button);
    assert.equal(getCalendarEl().hidden, false, "The calendar is shown");

    EVENTS.click(getCalendarEl(".usa-date-picker__calendar__previous-year"));

    assert.equal(
      getCalendarEl(".usa-date-picker__calendar__date--focused").dataset.value,
      "05/22/2020",
      "focuses correct date"
    );
  });

  it("should not allow navigation back a year to a month that is fully disabled due to a minimum date being set", () => {
    input.value = "04/15/2021";
    EVENTS.click(button);
    assert.equal(getCalendarEl().hidden, false, "The calendar is shown");

    assert.equal(
      getCalendarEl(".usa-date-picker__calendar__previous-year").disabled,
      true,
      "the button is disabled"
    );

    EVENTS.click(getCalendarEl(".usa-date-picker__calendar__previous-year"));

    assert.equal(
      getCalendarEl(".usa-date-picker__calendar__date--focused").dataset.value,
      "04/15/2021",
      "focuses correct date"
    );
  });

  it("should allow navigation back a month to a month that is partially disabled due to a minimum date being set", () => {});

  it("should not allow navigation back a month to a month that is fully disabled due to a minimum date being set", () => {});

  it("should allow navigation forward a year to a month that is partially disabled due to a maximum date being set", () => {});

  it("should not allow navigation forward a year to a month that is fully disabled due to a maximum date being set", () => {});

  it("should allow navigation forward a month to a month that is partially disabled due to a maximum date being set", () => {});

  it("should not allow navigation forward a month to a month that is fully disabled due to a maximum date being set", () => {});

  it("should allow selection of a month in the month selection screen that is partially disabled due to a minimum date being set", () => {});

  it("should allow selection of a month in the month selection screen that is partially disabled due to a maximum date being set", () => {});

  it("should not allow selection of a month in the month selection screen that is fully disabled due to a minimum date being set", () => {});

  it("should not allow selection of a month in the month selection screen that is fully disabled due to a maximum date being set", () => {});

  it("should allow selection of a year in the year selection screen that is partially disabled due to a minimum date being set", () => {});

  it("should allow selection of a year in the year selection screen that is partially disabled due to a maximum date being set", () => {});

  it("should not allow selection of a year in the year selection screen that is fully disabled due to a minimum date being set", () => {});

  it("should not allow selection of a year to a year that is fully disabled due to a maximum date being set", () => {});

  it("should allow selection of a date that is the minimum date", () => {
    input.value = "05/25/2020";
    EVENTS.click(button);
    assert.equal(getCalendarEl().hidden, false, "The calendar is shown");

    EVENTS.click(
      getCalendarEl().querySelector(
        '.usa-date-picker__calendar__date[data-day="22"]'
      )
    );

    assert.equal(input.value, "05/22/2020", "The value has been filled in");
  });

  it("should allow selection of a date that is the maximum date", () => {});

  it("should not allow selection of a date that is before the minimum date", () => {});

  it("should not allow selection of a date that is after the maximum date", () => {});

  it("should allow keyboard navigation to move back one day to a date that is the minimum date", () => {});

  it("should allow keyboard navigation to move back one week to a date that is the minimum date", () => {});

  it("should allow keyboard navigation to move back one month to a date that is the minimum date", () => {});

  it("should allow keyboard navigation to move back one year to a date that is the minimum date", () => {});

  it("should not allow keyboard navigation to move back one day to a date that is before the minimum date", () => {});

  it("should not allow keyboard navigation to move back one week to a date that is before the minimum date", () => {});

  it("should not allow keyboard navigation to move back one month to a date that is before the minimum date", () => {});

  it("should not allow keyboard navigation to move back one year to a date that is before the minimum date", () => {});

  it("should allow keyboard navigation to move forward one day to a date that is the maximum date", () => {});

  it("should allow keyboard navigation to move forward one week to a date that is the maximum date", () => {});

  it("should allow keyboard navigation to move forward one month to a date that is the maximum date", () => {});

  it("should allow keyboard navigation to move forward one year to a date that is the maximum date", () => {});

  it("should not allow keyboard navigation to move forward one day to a date that is after the maximum date", () => {});

  it("should not allow keyboard navigation to move forward one week to a date that is after the maximum date", () => {});

  it("should not allow keyboard navigation to move forward one month to a date that is after the maximum date", () => {});

  it("should not allow keyboard navigation to move forward one year to a date that is after the maximum date", () => {});

  it("should show a date that is after the maximum date as invalid", () => {
    input.value = "06/30/2021";

    EVENTS.keydownEnter(input);

    assert.equal(input.validationMessage, VALIDATION_MESSAGE);
  });

  it("should show a date that is the maximum date as valid", () => {
    input.value = "06/20/2021";

    EVENTS.keydownEnter(input);

    assert.equal(input.validationMessage, "");
  });

  it("should show a date that is before the minimum date as invalid", () => {
    input.value = "05/01/2020";

    EVENTS.keydownEnter(input);

    assert.equal(input.validationMessage, VALIDATION_MESSAGE);
  });

  it("should show a date that is the minimum date as valid", () => {
    input.value = "05/22/2020";

    EVENTS.keydownEnter(input);

    assert.equal(input.validationMessage, "");
  });
});
