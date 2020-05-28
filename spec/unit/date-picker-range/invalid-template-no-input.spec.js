const fs = require("fs");
const path = require("path");
const assert = require("assert");
const DatePicker = require("../../../src/js/components/date-picker");
const DatePickerRange = require("../../../src/js/components/date-picker-range");

const INVALID_TEMPLATE_NO_INPUT = fs.readFileSync(
  path.join(__dirname, "/invalid-template-no-input.template.html")
);

describe("Date picker range without inputs", () => {
  const { body } = document;

  beforeEach(() => {
    body.innerHTML = INVALID_TEMPLATE_NO_INPUT;
    DatePicker.on();
  });

  afterEach(() => {
    body.textContent = "";
    DatePicker.off(body);
    DatePickerRange.off(body);
  });

  it('should throw an error when a toggle button is clicked without a wrapping "usa-date-picker"', () => {
    assert.throws(() => DatePickerRange.on(), {
      message:
        ".usa-date-picker-range is missing inner two '.usa-date-picker' elements"
    });
  });
});
