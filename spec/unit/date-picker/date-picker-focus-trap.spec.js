const fs = require("fs");
const path = require("path");
const assert = require("assert");
const DatePicker = require("../../../src/js/components/date-picker");
const EVENTS = require("./events");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/date-picker.template.html")
);

describe("date picker component focus trap", () => {
  const { body } = document;

  let root;
  let button;

  //  const getCalendarEl = () => root.querySelector(".usa-date-picker__calendar");

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    DatePicker.on();
    root = body.querySelector(".usa-date-picker");
    button = root.querySelector(".usa-date-picker__button");
  });

  afterEach(() => {
    body.textContent = "";
    DatePicker.off(body);
  });

  it("should move focus to the first item when pressing tab form last item", () => {
    EVENTS.click(button);
    assert.ok(
      document.activeElement.classList.contains(
        "usa-date-picker__calendar__date--focused"
      ),
      "focuses correct item"
    );

    EVENTS.keydownTab();

    assert.ok(
      document.activeElement.classList.contains(
        "usa-date-picker__calendar__previous-year"
      ),
      "focuses correct item"
    );
  });

  it("should move focus to the last item when pressing shift+tab form first item", () => {
    EVENTS.click(button);
    EVENTS.keydownTab();
    assert.ok(
      document.activeElement.classList.contains(
        "usa-date-picker__calendar__previous-year"
      ),
      "focuses correct item"
    );

    EVENTS.keydownShiftTab();

    assert.ok(
      document.activeElement.classList.contains(
        "usa-date-picker__calendar__date--focused"
      ),
      "focuses correct item"
    );
  });
});
