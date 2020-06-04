const fs = require("fs");
const path = require("path");
const assert = require("assert");
const DatePicker = require("../../../src/js/components/date-picker");
const DatePickerRange = require("../../../src/js/components/date-picker-range");

const INVALID_TEMPLATE_ONE_INPUT = fs.readFileSync(
  path.join(__dirname, "/invalid-template-one-input.template.html")
);

describe("Date picker range without second date picker", () => {
  const { body } = document;

  beforeEach(() => {
    body.innerHTML = INVALID_TEMPLATE_ONE_INPUT;
    DatePicker.on();
  });

  afterEach(() => {
    body.textContent = "";
    DatePicker.off(body);
    DatePickerRange.off(body);
  });

  it('should throw an error when a date range picker without two "usa-date-picker" elements', () => {
    assert.throws(() => DatePickerRange.on(), {
      message:
        ".usa-date-picker-range is missing second '.usa-date-picker' element"
    });
  });
});
