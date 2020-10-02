const fs = require("fs");
const path = require("path");
const assert = require("assert");
const DatePicker = require("../../../src/js/components/date-picker");
const DateRangePicker = require("../../../src/js/components/date-range-picker");
const EVENTS = require("./events");

const INVALID_TEMPLATE_NO_WRAPPER = fs.readFileSync(
  path.join(__dirname, "/invalid-template-no-wrapper.template.html")
);

describe("Date range picker button without wrapping element", () => {
  const { body } = document;
  let rangeStartInputEl;
  let rangeEndInputEl;
  let error;
  let expectedError;

  beforeEach(() => {
    body.innerHTML = INVALID_TEMPLATE_NO_WRAPPER;
    DatePicker.on();
    DateRangePicker.on();
    rangeStartInputEl = body.querySelector(
      ".usa-date-range-picker__range-start .usa-date-picker__external-input"
    );
    rangeEndInputEl = body.querySelector(
      ".usa-date-range-picker__range-end .usa-date-picker__external-input"
    );
    expectedError = "";
    window.onerror = message => {
      error = message;
      return error === expectedError;
    };
  });

  afterEach(() => {
    window.onerror = null;
    body.textContent = "";
    DatePicker.off(body);
    DateRangePicker.off(body);
  });

  it('should throw an error when the range start value is changed without a wrapping "usa-date-range-picker"', () => {
    expectedError = "Element is missing outer .usa-date-range-picker";
    rangeStartInputEl.value = "12/12/2020";
    EVENTS.input(rangeStartInputEl);
    assert.equal(error, expectedError, "caught the error");
  });

  it('should throw an error when the range end value is changed without a wrapping "usa-date-range-picker"', () => {
    expectedError = "Element is missing outer .usa-date-range-picker";
    rangeEndInputEl.value = "12/12/2020";
    EVENTS.input(rangeEndInputEl);
    assert.equal(error, expectedError, "caught the error");
  });
});
