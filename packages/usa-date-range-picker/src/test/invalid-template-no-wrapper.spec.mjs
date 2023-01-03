import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import assert from "assert";
import DatePicker from "../../../usa-date-picker/src/index.mjs";
import DateRangePicker from "../index.mjs";
import EVENTS from "./events.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    window.onerror = (message) => {
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
    assert.strictEqual(error, expectedError, "caught the error");
  });

  it('should throw an error when the range end value is changed without a wrapping "usa-date-range-picker"', () => {
    expectedError = "Element is missing outer .usa-date-range-picker";
    rangeEndInputEl.value = "12/12/2020";
    EVENTS.input(rangeEndInputEl);
    assert.strictEqual(error, expectedError, "caught the error");
  });
});
