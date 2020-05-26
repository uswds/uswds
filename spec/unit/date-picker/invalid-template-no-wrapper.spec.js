const fs = require("fs");
const path = require("path");
const assert = require("assert");
const DatePicker = require("../../../src/js/components/date-picker");
const EVENTS = require("./events");

const INVALID_TEMPLATE_NO_WRAPPER = fs.readFileSync(
  path.join(__dirname, "/invalid-template-no-wrapper.template.html")
);

describe("Date picker button without wrapping element", () => {
  const { body } = document;
  let button;
  let error;
  let expectedError;

  beforeEach(() => {
    body.innerHTML = INVALID_TEMPLATE_NO_WRAPPER;
    DatePicker.on();
    button = body.querySelector(".usa-date-picker__button");
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
  });

  it('should throw an error when a toggle button is clicked without a wrapping "usa-date-picker"', () => {
    expectedError = "Element is missing outer .usa-date-picker";
    EVENTS.click(button);
    assert.equal(error, expectedError, "caught the error");
  });
});
