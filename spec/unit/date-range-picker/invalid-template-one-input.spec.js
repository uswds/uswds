const fs = require("fs");
const path = require("path");
const assert = require("assert");
const DatePicker = require("../../../src/js/components/date-picker");
const DateRangePicker = require("../../../src/js/components/date-range-picker");

const INVALID_TEMPLATE_ONE_INPUT = fs.readFileSync(
  path.join(__dirname, "/invalid-template-one-input.template.html")
);

describe("Date range picker without second date picker", () => {
  const { body } = document;

  beforeEach(() => {
    body.innerHTML = INVALID_TEMPLATE_ONE_INPUT;
    DatePicker.on();
  });

  afterEach(() => {
    body.textContent = "";
    DatePicker.off(body);
    DateRangePicker.off(body);
  });

  it('should throw an error when a date range picker without two "usa-date-picker" elements', () => {
    assert.throws(() => DateRangePicker.on(), {
      message:
        ".usa-date-range-picker is missing second '.usa-date-picker' element"
    });
  });
});
