const fs = require("fs");
const path = require("path");
const assert = require("assert");
const EVENTS = require("./events");
const DatePicker = require("../../../src/js/components/date-picker");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/date-picker-disabled.template.html")
);

describe("date picker component - disabled initialization", () => {
  const { body } = document;

  let root;
  let button;
  const getCalendarEl = query =>
    root.querySelector(
      ".usa-date-picker__calendar" + (query ? ` ${query}` : "")
    );

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    DatePicker.on();
    root = body.querySelector(".usa-date-picker");
    button = root.querySelector(".usa-date-picker__button");
  });

  afterEach(() => {
    window.onerror = null;
    body.textContent = "";
    DatePicker.off(body);
  });

  it("should not display the calendar when the button is clicked as it is disabled", () => {
    EVENTS.click(button);

    assert.equal(getCalendarEl().hidden, true, "the calendar is hidden");
  });

  it("should display the calendar when the button is clicked once the component is enabled", () => {
    DatePicker.enable(root);
    EVENTS.click(button);

    assert.equal(getCalendarEl().hidden, false, "the calendar is shown");
  });
});
