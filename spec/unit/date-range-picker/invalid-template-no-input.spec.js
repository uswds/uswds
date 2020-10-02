const fs = require("fs");
const path = require("path");
const assert = require("assert");
const DatePicker = require("../../../src/js/components/date-picker");
const DateRangePicker = require("../../../src/js/components/date-range-picker");

const INVALID_TEMPLATE_NO_INPUT = fs.readFileSync(
  path.join(__dirname, "/invalid-template-no-input.template.html")
);

describe("Date range picker without inputs", () => {
  const { body } = document;

  beforeEach(() => {
    body.innerHTML = INVALID_TEMPLATE_NO_INPUT;
    DatePicker.on();
  });

  afterEach(() => {
    body.textContent = "";
    DatePicker.off(body);
    DateRangePicker.off(body);
  });

  it('should throw an error when a toggle button is clicked without a wrapping "usa-date-picker"', () => {
    assert.throws(() => DateRangePicker.on(), {
      message:
        ".usa-date-range-picker is missing inner two '.usa-date-picker' elements"
    });
  });
});
