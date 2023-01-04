import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import assert from "assert";
import DatePicker from "../../../usa-date-picker/src/index.mjs";
import DateRangePicker from "../index.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        ".usa-date-range-picker is missing inner two '.usa-date-picker' elements",
    });
  });
});
