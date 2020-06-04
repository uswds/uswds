const fs = require("fs");
const path = require("path");
const assert = require("assert");
const DatePicker = require("../../../src/js/components/date-picker");
const DatePickerRange = require("../../../src/js/components/date-picker-range");
const EVENTS = require("./events");

const INVALID_TEMPLATE_NO_WRAPPER = fs.readFileSync(
  path.join(__dirname, "/invalid-template-no-wrapper.template.html")
);

describe("Date picker range button without wrapping element", () => {
  const { body } = document;
  let rangeStartInputEl;
  let rangeEndInputEl;
  let error;
  let expectedError;

  beforeEach(() => {
    body.innerHTML = INVALID_TEMPLATE_NO_WRAPPER;
    DatePicker.on();
    DatePickerRange.on();
    rangeStartInputEl = body.querySelector(
      ".usa-date-picker-range__range-start .usa-date-picker__input"
    );
    rangeEndInputEl = body.querySelector(
      ".usa-date-picker-range__range-end .usa-date-picker__input"
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
    DatePickerRange.off(body);
  });

  it('should throw an error when the range start value is changed without a wrapping "usa-date-picker-range"', () => {
    expectedError = "Element is missing outer .usa-date-picker-range";
    rangeStartInputEl.value = "12/12/2020";
    EVENTS.input(rangeStartInputEl);
    assert.equal(error, expectedError, "caught the error");
  });

  it('should throw an error when the range end value is changed without a wrapping "usa-date-picker-range"', () => {
    expectedError = "Element is missing outer .usa-date-picker-range";
    rangeEndInputEl.value = "12/12/2020";
    EVENTS.input(rangeEndInputEl);
    assert.equal(error, expectedError, "caught the error");
  });
});
