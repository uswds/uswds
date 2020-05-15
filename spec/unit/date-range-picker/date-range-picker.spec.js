const fs = require("fs");
const path = require("path");
const sinon = require("sinon");
const assert = require("assert");
const DateRangePicker = require("../../../src/js/components/date-range-picker");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/date-range-picker.template.html")
);

const EVENTS = {};
const VALIDATION_MESSAGE = "Please enter a valid date";

/**
 * send an input event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.input = (el = document.activeElement) => {
  const evt = new KeyboardEvent("input", {
    bubbles: true,
    cancelable: true
  });
  el.dispatchEvent(evt);
};

/**
 * send a click event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.click = (el = document.activeElement) => {
  const evt = new MouseEvent("click", {
    view: el.ownerDocument.defaultView,
    bubbles: true,
    cancelable: true
  });
  el.dispatchEvent(evt);
};

/**
 * send a focusout event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.focusout = (el = document.activeElement) => {
  const evt = new Event("focusout", {
    bubbles: true,
    cancelable: true
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown Enter event
 * @param {HTMLElement} el the element to sent the event to
 * @returns {{preventDefaultSpy: sinon.SinonSpy<[], void>}}
 */
EVENTS.keydownEnter = (el = document.activeElement) => {
  const evt = new KeyboardEvent("keydown", {
    bubbles: true,
    keyCode: 13,
    key: "Enter"
  });
  const preventDefaultSpy = sinon.spy(evt, "preventDefault");
  el.dispatchEvent(evt);
  return { preventDefaultSpy };
};

/**
 * send a keyup Enter event
 * @param {HTMLElement} el the element to sent the event to
 * @returns {{preventDefaultSpy: sinon.SinonSpy<[], void>}}
 */
EVENTS.keyupEnter = (el = document.activeElement) => {
  const evt = new KeyboardEvent("keyup", {
    bubbles: true,
    keyCode: 13,
    key: "Enter"
  });
  const preventDefaultSpy = sinon.spy(evt, "preventDefault");
  el.dispatchEvent(evt);
  return { preventDefaultSpy };
};

/**
 * send a keydown Escape event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownEscape = (el = document.activeElement) => {
  const evt = new KeyboardEvent("keydown", {
    bubbles: true,
    key: "Escape"
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown Space event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownSpace = (el = document.activeElement) => {
  const evt = new KeyboardEvent("keydown", {
    bubbles: true,
    keyCode: 32,
    key: " "
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown ArrowDown event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownArrowDown = (el = document.activeElement) => {
  const evt = new KeyboardEvent("keydown", {
    bubbles: true,
    key: "ArrowDown"
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown ArrowUp event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownArrowUp = (el = document.activeElement) => {
  const evt = new KeyboardEvent("keydown", {
    bubbles: true,
    key: "ArrowUp"
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown ArrowLeft event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownArrowLeft = (el = document.activeElement) => {
  const evt = new KeyboardEvent("keydown", {
    bubbles: true,
    key: "ArrowLeft"
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown ArrowRight event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownArrowRight = (el = document.activeElement) => {
  const evt = new KeyboardEvent("keydown", {
    bubbles: true,
    key: "ArrowRight"
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown Home event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownHome = (el = document.activeElement) => {
  const evt = new KeyboardEvent("keydown", {
    bubbles: true,
    key: "Home"
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown End event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownEnd = (el = document.activeElement) => {
  const evt = new KeyboardEvent("keydown", {
    bubbles: true,
    key: "End"
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown PageUp event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownPageUp = (el = document.activeElement) => {
  const evt = new KeyboardEvent("keydown", {
    bubbles: true,
    key: "PageUp"
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown PageDown event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownPageDown = (el = document.activeElement) => {
  const evt = new KeyboardEvent("keydown", {
    bubbles: true,
    key: "PageDown"
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown Shift + PageUp event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownShiftPageUp = (el = document.activeElement) => {
  const evt = new KeyboardEvent("keydown", {
    bubbles: true,
    key: "PageUp",
    shiftKey: true
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown Shift + PageDown event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownShiftPageDown = (el = document.activeElement) => {
  const evt = new KeyboardEvent("keydown", {
    bubbles: true,
    key: "PageDown",
    shiftKey: true
  });
  el.dispatchEvent(evt);
};

describe("date range picker component", () => {
  const { body } = document;

  let root;
  let startInput;
  let endInput;
  let button;
  let calendar;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    DateRangePicker.on();
    root = body.querySelector(".usa-date-range-picker");
    startInput = root.querySelector(".usa-date-range-picker__start-input");
    endInput = root.querySelector(".usa-date-range-picker__end-input");
    button = root.querySelector(".usa-date-range-picker__button");
    calendar = root.querySelector(".usa-date-range-picker__calendar");
  });

  afterEach(() => {
    body.textContent = "";
    DateRangePicker.off(body);
  });

  it("should enhance the date input with a date range picker button", () => {
    assert.ok(startInput, "has a start input element");
    assert.ok(endInput, "has an end input element");
    assert.ok(button, "has a button element");
  });

  // mouse interactions
  it("should display a calendar for the current date when the date range picker button is clicked", () => {
    EVENTS.click(button);

    assert.equal(calendar.hidden, false, "The calendar is shown");
    assert.ok(
      calendar.contains(document.activeElement),
      "The focus is within the component"
    );
  });

  it("should hide the calendar when the date range picker button is clicked and the calendar is already open", () => {
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, "The calendar is shown");

    EVENTS.click(button);
    assert.equal(calendar.hidden, true, "The calendar is hidden");
  });

  it("should close the calendar you click outside of an active calendar", () => {
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, "The calendar is shown");

    EVENTS.focusout();

    assert.equal(calendar.hidden, true, "The calendar is hidden");
  });

  it("should display a calendar for the inputted date when the date range picker button is clicked with a date entered", () => {
    startInput.value = "1/1/2020";
    EVENTS.click(button);

    assert.equal(calendar.hidden, false, "The calendar is shown");
    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__date--focused")
        .textContent,
      "1",
      "focuses correct date"
    );
    assert.equal(
      calendar.querySelector(
        ".usa-date-range-picker__calendar__month-selection"
      ).textContent,
      "January",
      "shows correct month"
    );
    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__year-selection")
        .textContent,
      "2020",
      "shows correct year"
    );
  });

  it("should allow for the selection of a date within the calendar", () => {
    startInput.value = "1/1/2020";
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, "The calendar is shown");

    EVENTS.click(
      calendar.querySelector(
        '.usa-date-range-picker__calendar__date[data-day="9"]'
      )
    );

    EVENTS.click(
      calendar.querySelector(
        '.usa-date-range-picker__calendar__date[data-day="10"]'
      )
    );

    assert.equal(
      startInput.value,
      "01/09/2020",
      "The value has been filled in"
    );
    assert.equal(endInput.value, "01/10/2020", "The value has been filled in");
    assert.equal(
      endInput,
      document.activeElement,
      "The focus is on the end input"
    );
    assert.equal(calendar.hidden, true, "The calendar is hidden");
  });

  it("should allow for navigation to the preceding month by clicking the left single arrow button within the calendar", () => {
    startInput.value = "1/1/2020";
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, "The calendar is shown");

    EVENTS.click(
      calendar.querySelector(".usa-date-range-picker__calendar__previous-month")
    );

    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__date--focused")
        .textContent,
      "1",
      "focuses correct date"
    );
    assert.equal(
      calendar.querySelector(
        ".usa-date-range-picker__calendar__month-selection"
      ).textContent,
      "December",
      "shows correct month"
    );
    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__year-selection")
        .textContent,
      "2019",
      "shows correct year"
    );
  });

  it("should allow for navigation to the succeeding month by clicking the right single arrow button within the calendar", () => {
    startInput.value = "1/1/2020";
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, "The calendar is shown");

    EVENTS.click(
      calendar.querySelector(".usa-date-range-picker__calendar__next-month")
    );

    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__date--focused")
        .textContent,
      "1",
      "focuses correct date"
    );
    assert.equal(
      calendar.querySelector(
        ".usa-date-range-picker__calendar__month-selection"
      ).textContent,
      "February",
      "shows correct month"
    );
    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__year-selection")
        .textContent,
      "2020",
      "shows correct year"
    );
  });

  it("should allow for navigation to the preceding year by clicking the left double arrow button within the calendar", () => {
    startInput.value = "1/1/2016";
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, "The calendar is shown");

    EVENTS.click(
      calendar.querySelector(".usa-date-range-picker__calendar__previous-year")
    );

    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__date--focused")
        .textContent,
      "1",
      "focuses correct date"
    );
    assert.equal(
      calendar.querySelector(
        ".usa-date-range-picker__calendar__month-selection"
      ).textContent,
      "January",
      "shows correct month"
    );
    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__year-selection")
        .textContent,
      "2015",
      "shows correct year"
    );
  });

  it("should allow for navigation to the succeeding year by clicking the right double arrow button within the calendar", () => {
    startInput.value = "1/1/2020";
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, "The calendar is shown");

    EVENTS.click(
      calendar.querySelector(".usa-date-range-picker__calendar__next-year")
    );

    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__date--focused")
        .textContent,
      "1",
      "focuses correct date"
    );
    assert.equal(
      calendar.querySelector(
        ".usa-date-range-picker__calendar__month-selection"
      ).textContent,
      "January",
      "shows correct month"
    );
    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__year-selection")
        .textContent,
      "2021",
      "shows correct year"
    );
  });

  it("should display a month selection screen by clicking the month display within the calendar", () => {
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, "The calendar is shown");

    EVENTS.click(
      calendar.querySelector(
        ".usa-date-range-picker__calendar__month-selection"
      )
    );

    assert.ok(
      calendar.querySelector(".usa-date-range-picker__calendar__month-picker"),
      "calendar is showing the month picker"
    );
    assert.equal(document.activeElement, calendar, "calendar is focused");
  });

  it("should allow for the selection of a month within month selection screen", () => {
    startInput.value = "2/1/2020";
    EVENTS.click(button);
    EVENTS.click(
      calendar.querySelector(
        ".usa-date-range-picker__calendar__month-selection"
      )
    );

    EVENTS.click(
      calendar.querySelector(".usa-date-range-picker__calendar__month")
    );

    assert.equal(
      calendar.querySelector(
        ".usa-date-range-picker__calendar__month-selection"
      ).textContent,
      "January",
      "shows correct month"
    );
  });

  it("should display a year selection screen by clicking the year display within the calendar", () => {
    EVENTS.click(button);

    EVENTS.click(
      calendar.querySelector(".usa-date-range-picker__calendar__year-selection")
    );

    assert.ok(
      calendar.querySelector(".usa-date-range-picker__calendar__year-picker"),
      "calendar is showing the year picker"
    );
    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__year")
        .textContent,
      "2016",
      "shows correct first year of chunk"
    );
    assert.equal(document.activeElement, calendar, "calendar is focused");
  });

  it("should allow for navigation to the preceding dozen years by clicking the left single arrow button within the year selection screen", () => {
    EVENTS.click(button);
    EVENTS.click(
      calendar.querySelector(".usa-date-range-picker__calendar__year-selection")
    );

    EVENTS.click(
      calendar.querySelector(
        ".usa-date-range-picker__calendar__previous-year-chunk"
      )
    );

    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__year")
        .textContent,
      "2004",
      "shows correct first year of chunk"
    );
  });

  it("should allow for navigation to the succeeding dozen year by clicking the right single arrow button within the year selection screen", () => {
    EVENTS.click(button);
    EVENTS.click(
      calendar.querySelector(".usa-date-range-picker__calendar__year-selection")
    );

    EVENTS.click(
      calendar.querySelector(
        ".usa-date-range-picker__calendar__next-year-chunk"
      )
    );

    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__year")
        .textContent,
      "2028",
      "shows correct first year of chunk"
    );
  });

  it("should allow for the selection of a year within year selection screen", () => {
    startInput.value = "2/1/2020";
    EVENTS.click(button);
    EVENTS.click(
      calendar.querySelector(".usa-date-range-picker__calendar__year-selection")
    );

    EVENTS.click(
      calendar.querySelector(".usa-date-range-picker__calendar__year")
    );

    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__year-selection")
        .textContent,
      "2016",
      "shows correct year"
    );
  });

  it("should hide the calendar when the date range picker button is clicked and the calendar is already open", () => {
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, "The calendar is shown");

    EVENTS.click(button);
    assert.equal(calendar.hidden, true, "The calendar is hidden");
  });

  it("should close the calendar you click outside of an active calendar", () => {
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, "The calendar is shown");

    EVENTS.focusout();

    assert.equal(calendar.hidden, true, "The calendar is hidden");
  });

  it("should display a calendar for the inputted date when the date range picker button is clicked with a date entered", () => {
    startInput.value = "1/1/2020";
    EVENTS.click(button);

    assert.equal(calendar.hidden, false, "The calendar is shown");
    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__date--focused")
        .textContent,
      "1",
      "focuses correct date"
    );
    assert.equal(
      calendar.querySelector(
        ".usa-date-range-picker__calendar__month-selection"
      ).textContent,
      "January",
      "shows correct month"
    );
    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__year-selection")
        .textContent,
      "2020",
      "shows correct year"
    );
  });

  // keyboard interactions

  it("should close the calendar and focus the start input when escape is pressed within the calendar", () => {
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, "The calendar is shown");

    EVENTS.keydownEscape();

    assert.equal(calendar.hidden, true, "The calendar is hidden");
    assert.equal(
      startInput,
      document.activeElement,
      "The focus is on the start input"
    );
  });

  it("should close the calendar and focus the end input when escape is pressed within the calendar and a start value has already been selected", () => {
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, "The calendar is shown");

    EVENTS.click(
      calendar.querySelector(
        '.usa-date-range-picker__calendar__date[data-day="9"]'
      )
    );

    EVENTS.keydownEscape();

    assert.equal(
      startInput.value,
      "01/09/2020",
      "The start value has been filled in"
    );
    assert.equal(calendar.hidden, true, "The calendar is hidden");
    assert.equal(
      endInput,
      document.activeElement,
      "The focus is on the end input"
    );
  });

  it("should open the calendar and select and end date when a start date has already been selected", () => {
    startInput.value = "01/09/2020";
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, "The calendar is shown");

    EVENTS.click(
      calendar.querySelector(
        '.usa-date-range-picker__calendar__date[data-day="10"]'
      )
    );

    assert.equal(
      endInput.value,
      "01/10/2020",
      "The end value has been filled in"
    );
    assert.equal(calendar.hidden, true, "The calendar is hidden");
    assert.equal(
      endInput,
      document.activeElement,
      "The focus is on the end input"
    );
  });

  it("should close the calendar when escape is pressed within the calendar", () => {
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, "The calendar is shown");

    EVENTS.keydownEscape();

    assert.equal(calendar.hidden, true, "The calendar is hidden");
  });

  it("should move focus to the same day of week of the previous week when up is pressed from the currently focused day", () => {
    startInput.value = "1/10/2020";
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, "The calendar is shown");

    EVENTS.keydownArrowUp();

    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__date--focused")
        .textContent,
      "3",
      "focuses correct date"
    );
    assert.equal(
      calendar.querySelector(
        ".usa-date-range-picker__calendar__month-selection"
      ).textContent,
      "January",
      "shows correct month"
    );
    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__year-selection")
        .textContent,
      "2020",
      "shows correct year"
    );
  });

  it("should move focus to the same day of week of the next week when down is pressed from the currently focused day", () => {
    startInput.value = "1/10/2020";
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, "The calendar is shown");

    EVENTS.keydownArrowDown();

    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__date--focused")
        .textContent,
      "17",
      "focuses correct date"
    );
    assert.equal(
      calendar.querySelector(
        ".usa-date-range-picker__calendar__month-selection"
      ).textContent,
      "January",
      "shows correct month"
    );
    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__year-selection")
        .textContent,
      "2020",
      "shows correct year"
    );
  });

  it("should move focus to the previous day when left is pressed from the currently focused day", () => {
    startInput.value = "1/10/2020";
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, "The calendar is shown");

    EVENTS.keydownArrowLeft();

    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__date--focused")
        .textContent,
      "9",
      "focuses correct date"
    );
    assert.equal(
      calendar.querySelector(
        ".usa-date-range-picker__calendar__month-selection"
      ).textContent,
      "January",
      "shows correct month"
    );
    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__year-selection")
        .textContent,
      "2020",
      "shows correct year"
    );
  });

  it("should move focus to the next day when right is pressed from the currently focused day", () => {
    startInput.value = "1/10/2020";
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, "The calendar is shown");

    EVENTS.keydownArrowRight();

    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__date--focused")
        .textContent,
      "11",
      "focuses correct date"
    );
    assert.equal(
      calendar.querySelector(
        ".usa-date-range-picker__calendar__month-selection"
      ).textContent,
      "January",
      "shows correct month"
    );
    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__year-selection")
        .textContent,
      "2020",
      "shows correct year"
    );
  });

  it("should move focus to the first day (e.g. Sunday) of the current week when home is pressed from the currently focused day", () => {
    startInput.value = "1/1/2020";
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, "The calendar is shown");

    EVENTS.keydownHome();

    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__date--focused")
        .textContent,
      "29",
      "focuses correct date"
    );
    assert.equal(
      calendar.querySelector(
        ".usa-date-range-picker__calendar__month-selection"
      ).textContent,
      "December",
      "shows correct month"
    );
    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__year-selection")
        .textContent,
      "2019",
      "shows correct year"
    );
  });

  it("should move focus to the last day (e.g. Saturday) of the current week when end is pressed from the currently focused day", () => {
    startInput.value = "1/1/2020";
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, "The calendar is shown");

    EVENTS.keydownEnd();

    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__date--focused")
        .textContent,
      "4",
      "focuses correct date"
    );
    assert.equal(
      calendar.querySelector(
        ".usa-date-range-picker__calendar__month-selection"
      ).textContent,
      "January",
      "shows correct month"
    );
    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__year-selection")
        .textContent,
      "2020",
      "shows correct year"
    );
  });

  it("should move focus to the same day of the previous month when page up is pressed from the currently focused day", () => {
    startInput.value = "1/1/2020";
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, "The calendar is shown");

    EVENTS.keydownPageUp();

    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__date--focused")
        .textContent,
      "1",
      "focuses correct date"
    );
    assert.equal(
      calendar.querySelector(
        ".usa-date-range-picker__calendar__month-selection"
      ).textContent,
      "December",
      "shows correct month"
    );
    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__year-selection")
        .textContent,
      "2019",
      "shows correct year"
    );
  });

  it("should move focus to the last day of the previous month when page up is pressed from the the last day of a longer month", () => {
    startInput.value = "12/31/2019";
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, "The calendar is shown");

    EVENTS.keydownPageUp();

    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__date--focused")
        .textContent,
      "30",
      "focuses correct date"
    );
    assert.equal(
      calendar.querySelector(
        ".usa-date-range-picker__calendar__month-selection"
      ).textContent,
      "November",
      "shows correct month"
    );
    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__year-selection")
        .textContent,
      "2019",
      "shows correct year"
    );
  });

  it("should not move focus to the previous month when page up is pressed from a focused date that will then move before the minimum date", () => {
    startInput.value = "1/28/0000";
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, "The calendar is shown");

    EVENTS.keydownPageUp();

    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__date--focused")
        .textContent,
      "28",
      "focuses correct date"
    );
    assert.equal(
      calendar.querySelector(
        ".usa-date-range-picker__calendar__month-selection"
      ).textContent,
      "January",
      "shows correct month"
    );
    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__year-selection")
        .textContent,
      "0",
      "shows correct year"
    );
  });

  it("should move focus to the same day of the next month when page down is pressed from the currently focused day", () => {
    startInput.value = "1/1/2020";
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, "The calendar is shown");

    EVENTS.keydownPageDown();

    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__date--focused")
        .textContent,
      "1",
      "focuses correct date"
    );
    assert.equal(
      calendar.querySelector(
        ".usa-date-range-picker__calendar__month-selection"
      ).textContent,
      "February",
      "shows correct month"
    );
    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__year-selection")
        .textContent,
      "2020",
      "shows correct year"
    );
  });

  it("should move focus to the last day of the next month when page down is pressed from the the last day of a longer month", () => {
    startInput.value = "1/31/2020";
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, "The calendar is shown");

    EVENTS.keydownPageDown();

    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__date--focused")
        .textContent,
      "29",
      "focuses correct date"
    );
    assert.equal(
      calendar.querySelector(
        ".usa-date-range-picker__calendar__month-selection"
      ).textContent,
      "February",
      "shows correct month"
    );
    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__year-selection")
        .textContent,
      "2020",
      "shows correct year"
    );
  });

  it("should move focus to the same day of the month January when page down is pressed from the currently focused day in December", () => {
    startInput.value = "12/31/2020";
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, "The calendar is shown");

    EVENTS.keydownPageDown();

    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__date--focused")
        .textContent,
      "31",
      "focuses correct date"
    );
    assert.equal(
      calendar.querySelector(
        ".usa-date-range-picker__calendar__month-selection"
      ).textContent,
      "January",
      "shows correct month"
    );
    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__year-selection")
        .textContent,
      "2021",
      "shows correct year"
    );
  });

  it("should move focus to the same day/month of the previous year when shift + page up is pressed from the currently focused day", () => {
    startInput.value = "1/1/2020";
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, "The calendar is shown");

    EVENTS.keydownShiftPageUp();

    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__date--focused")
        .textContent,
      "1",
      "focuses correct date"
    );
    assert.equal(
      calendar.querySelector(
        ".usa-date-range-picker__calendar__month-selection"
      ).textContent,
      "January",
      "shows correct month"
    );
    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__year-selection")
        .textContent,
      "2019",
      "shows correct year"
    );
  });

  it("should not move focus to the previous year when shift + page up is pressed from a focused date that will then move before the minimum date", () => {
    startInput.value = "2/28/0000";
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, "The calendar is shown");

    EVENTS.keydownShiftPageUp();

    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__date--focused")
        .textContent,
      "28",
      "focuses correct date"
    );
    assert.equal(
      calendar.querySelector(
        ".usa-date-range-picker__calendar__month-selection"
      ).textContent,
      "February",
      "shows correct month"
    );
    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__year-selection")
        .textContent,
      "0",
      "shows correct year"
    );
  });

  it("should not move focus to February 28th of the previous year when shift + page up is pressed from a focused February 29th date of a leap year", () => {
    startInput.value = "2/29/2020";
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, "The calendar is shown");

    EVENTS.keydownShiftPageUp();

    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__date--focused")
        .textContent,
      "28",
      "focuses correct date"
    );
    assert.equal(
      calendar.querySelector(
        ".usa-date-range-picker__calendar__month-selection"
      ).textContent,
      "February",
      "shows correct month"
    );
    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__year-selection")
        .textContent,
      "2019",
      "shows correct year"
    );
  });

  it("should move focus to the same day/month of the next year when shift + page down is pressed from the currently focused day", () => {
    startInput.value = "1/1/2020";
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, "The calendar is shown");

    EVENTS.keydownShiftPageDown();

    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__date--focused")
        .textContent,
      "1",
      "focuses correct date"
    );
    assert.equal(
      calendar.querySelector(
        ".usa-date-range-picker__calendar__month-selection"
      ).textContent,
      "January",
      "shows correct month"
    );
    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__year-selection")
        .textContent,
      "2021",
      "shows correct year"
    );
  });

  it("should move focus to February 28th of the next year when shift + page down is pressed from a focused February 29th date of a leap year", () => {
    startInput.value = "2/29/2020";
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, "The calendar is shown");

    EVENTS.keydownShiftPageDown();

    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__date--focused")
        .textContent,
      "28",
      "focuses correct date"
    );
    assert.equal(
      calendar.querySelector(
        ".usa-date-range-picker__calendar__month-selection"
      ).textContent,
      "February",
      "shows correct month"
    );
    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__year-selection")
        .textContent,
      "2021",
      "shows correct year"
    );
  });

  it("should accept a parse-able date with a two digit year and display the calendar of that year in the current century", () => {
    startInput.value = "2/29/20";
    EVENTS.click(button);

    assert.equal(calendar.hidden, false, "The calendar is shown");
    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__date--focused")
        .textContent,
      "29",
      "focuses correct date"
    );
    assert.equal(
      calendar.querySelector(
        ".usa-date-range-picker__calendar__month-selection"
      ).textContent,
      "February",
      "shows correct month"
    );
    assert.equal(
      calendar.querySelector(".usa-date-range-picker__calendar__year-selection")
        .textContent,
      "2020",
      "shows correct year"
    );
  });

  it("should show an improper date as invalid as the user leaves the input", () => {
    startInput.value = "abcdefg... That means the convo is done";
    EVENTS.focusout(startInput);

    assert.equal(startInput.validationMessage, VALIDATION_MESSAGE);
  });

  it("should update the calendar when a valid date is entered in the startInput while the date range picker is open", () => {
    startInput.value = "6/1/2020";
    EVENTS.click(button);
    const firstFocus = calendar.querySelector(
      ".usa-date-range-picker__calendar__date--focused"
    );

    startInput.value = "6/20/2020";
    EVENTS.input(startInput);

    const secondFocus = calendar.querySelector(
      ".usa-date-range-picker__calendar__date--focused"
    );

    assert.equal(firstFocus !== secondFocus, true);
  });

  it("should validate the startInput when a date is selected", () => {
    startInput.value = "2/31/2019";
    EVENTS.focusout(startInput);
    assert.equal(startInput.validationMessage, VALIDATION_MESSAGE);
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, "The calendar is shown");

    EVENTS.click(
      calendar.querySelector(
        '.usa-date-range-picker__calendar__date[data-day="10"]'
      )
    );

    assert.equal(startInput.validationMessage, "");
  });

  it("should show an improper date as invalid if the user presses enter from the startInput", () => {
    startInput.value = "2/31/2019";

    EVENTS.keydownEnter(startInput);

    assert.equal(startInput.validationMessage, VALIDATION_MESSAGE);
  });

  it("should prevent action from button when event didn't originate from date", () => {
    startInput.value = "2/31/2019";
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, "The calendar is shown");
    const { preventDefaultSpy } = EVENTS.keyupEnter();
    assert.ok(
      preventDefaultSpy.called,
      "should not have allowed enter to perform default action"
    );
  });

  it("should display a calendar for the current date when enter is pressed from the date range picker button", () => {
    EVENTS.keydownEnter(button);

    assert.equal(calendar.hidden, false, "The calendar is shown");
    assert.ok(
      calendar.contains(document.activeElement),
      "The focus is within the component"
    );
  });

  it("should display a calendar for the current date when space is pressed from the date range picker button", () => {
    EVENTS.keydownSpace(button);

    assert.equal(calendar.hidden, false, "The calendar is shown");
    assert.ok(
      calendar.contains(document.activeElement),
      "The focus is within the component"
    );
  });
});
