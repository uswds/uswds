const fs = require("fs");
const path = require("path");
const assert = require("assert");
const DatePicker = require("../index");

const INVALID_TEMPLATE_NO_INPUT = fs.readFileSync(
  path.join(__dirname, "/invalid-template-no-input.template.html"),
);

const datePickerSelector = () => document.querySelector(".usa-date-picker");
const tests = [
  { name: "document.body", selector: () => document.body },
  { name: "date picker", selector: datePickerSelector },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`Date picker without input initialized at ${name}`, () => {
    const { body } = document;

    beforeEach(() => {
      body.innerHTML = INVALID_TEMPLATE_NO_INPUT;
    });

    afterEach(() => {
      DatePicker.off(containerSelector());
      body.textContent = "";
    });

    it('should throw an error when date picker is activated without a wrapping "usa-date-picker"', () => {
      assert.throws(() => DatePicker.on(containerSelector()), {
        message: ".usa-date-picker is missing inner input",
      });
    });
  });
});
