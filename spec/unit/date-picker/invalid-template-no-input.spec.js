const fs = require("fs");
const path = require("path");
const assert = require("assert");
const DatePicker = require("../../../src/js/components/date-picker");

const INVALID_TEMPLATE_NO_INPUT = fs.readFileSync(
  path.join(__dirname, "/invalid-template-no-input.template.html")
);

describe("Date picker without input", () => {
  const { body } = document;

  beforeEach(() => {
    body.innerHTML = INVALID_TEMPLATE_NO_INPUT;
  });

  afterEach(() => {
    body.textContent = "";
    DatePicker.off(body);
  });

  it('should throw an error when date picker is activated without a wrapping "usa-date-picker"', () => {
    assert.throws(() => DatePicker.on(), {
      message: ".usa-date-picker is missing inner input"
    });
  });
});
