const fs = require("fs");
const path = require("path");
const assert = require("assert");
const EVENTS = require("./events");
const DatePicker = require("../index");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/date-picker-disabled.template.html"),
);

const datePickerSelector = () => document.querySelector(".usa-date-picker");
const tests = [
  { name: "document.body", selector: () => document.body },
  { name: "date picker", selector: datePickerSelector },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`date picker component initialized at ${name} - disabled initialization`, () => {
    const { body } = document;

    let root;
    let button;
    const getCalendarEl = (query) =>
      root.querySelector(
        `.usa-date-picker__calendar${query ? ` ${query}` : ""}`,
      );

    beforeEach(() => {
      body.innerHTML = TEMPLATE;
      DatePicker.on(containerSelector());
      root = datePickerSelector();
      button = root.querySelector(".usa-date-picker__button");
    });

    afterEach(() => {
      DatePicker.off(containerSelector());
      window.onerror = null;
      body.textContent = "";
    });

    it("should not display the calendar when the button is clicked as it is disabled", () => {
      EVENTS.click(button);

      assert.strictEqual(
        getCalendarEl().hidden,
        true,
        "the calendar is hidden",
      );
    });

    it("should display the calendar when the button is clicked once the component is enabled", () => {
      DatePicker.enable(root);
      EVENTS.click(button);

      assert.strictEqual(
        getCalendarEl().hidden,
        false,
        "the calendar is shown",
      );
    });

    ["disable", "ariaDisable"].forEach((method) => {
      it(`closes the calendar when ${method} is called while open`, () => {
        DatePicker.enable(root);
        DatePicker.setCalendarValue(root, "2026-11-10");
        EVENTS.click(button);

        const day = getCalendarEl('button[data-value="2026-11-13"]');
        const { externalInputEl } = DatePicker.getDatePickerContext(root);
        const initialValue = externalInputEl.value;

        DatePicker[method](root);

        assert.strictEqual(getCalendarEl().hidden, true);
        EVENTS.click(day);
        assert.strictEqual(externalInputEl.value, initialValue);
      });
    });
  });
});
