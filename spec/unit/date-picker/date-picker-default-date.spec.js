const fs = require("fs");
const path = require("path");
const assert = require("assert");
const EVENTS = require("./events");
const DatePicker = require("../../../src/js/components/date-picker");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/date-picker-default-date.template.html")
);

describe("date picker component with default date", () => {
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
    input = root.querySelector(".usa-date-picker__external-input");
    button = root.querySelector(".usa-date-picker__button");
  });

  afterEach(() => {
    window.onerror = null;
    body.textContent = "";
    DatePicker.off(body);
  });

  it("should display the input date when an input date is present", () => {
    input.value = "06/20/2020";

    EVENTS.click(button);

    assert.equal(getCalendarEl().hidden, false, "The calendar is shown");
    assert.equal(
      getCalendarEl(".usa-date-picker__calendar__date--focused").dataset.value,
      "2020-06-20",
      "focuses correct date"
    );
  });

  it("should display the default date when the input date is empty", () => {
    input.value = "";

    EVENTS.click(button);

    assert.equal(getCalendarEl().hidden, false, "The calendar is shown");
    assert.equal(
      getCalendarEl(".usa-date-picker__calendar__date--focused").dataset.value,
      "2020-05-22",
      "focuses correct date"
    );
  });

  it("should display the default date when the input date is invalid", () => {
    input.value = "";

    EVENTS.click(button);

    assert.equal(getCalendarEl().hidden, false, "The calendar is shown");
    assert.equal(
      getCalendarEl(".usa-date-picker__calendar__date--focused").dataset.value,
      "2020-05-22",
      "focuses correct date"
    );
  });
});
