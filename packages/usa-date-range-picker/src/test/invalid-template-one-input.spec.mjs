import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import assert from "assert";
import DatePicker from "../../../usa-date-picker/src/index.mjs";
import DateRangePicker from "../index.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INVALID_TEMPLATE_ONE_INPUT = fs.readFileSync(
  path.join(__dirname, "/invalid-template-one-input.template.html")
);

const dateRangePickerSelector = () =>
  document.querySelector(".usa-date-range-picker");
const tests = [
  { name: "document.body", selector: () => document.body },
  { name: "date range picker", selector: dateRangePickerSelector },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`Date range picker without second date picker initialized at ${name}`, () => {
    const { body } = document;

    beforeEach(() => {
      body.innerHTML = INVALID_TEMPLATE_ONE_INPUT;
      DatePicker.on(containerSelector());
    });

    afterEach(() => {
      DatePicker.off(containerSelector());
      DateRangePicker.off(containerSelector());
      body.textContent = "";
    });

    it('should throw an error when a date range picker without two "usa-date-picker" elements', () => {
      assert.throws(() => DateRangePicker.on(containerSelector()), {
        message:
          ".usa-date-range-picker is missing second '.usa-date-picker' element",
      });
    });
  });
});
