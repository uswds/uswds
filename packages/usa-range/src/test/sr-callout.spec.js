const fs = require("fs");
const path = require("path");
const assert = require("assert");
const range = require("../index");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "./sr-callout.spec.html"),
);

const EVENTS = {};

/**
 * send an change event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.change = (el) => {
  el.dispatchEvent(new KeyboardEvent("change", { bubbles: true }));
};

const rangeSliderSelector = () => document.querySelector(".usa-range");

const tests = [
  { name: "document.body", selector: () => document.body },
  { name: "range slider", selector: rangeSliderSelector },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`Range slider with aria-valuetext initialized at ${name}`, () => {
    describe("range slider component", () => {
      const { body } = document;

      let slider;
      let valueText;

      beforeEach(() => {
        body.innerHTML = TEMPLATE;
        range.on(containerSelector());

        slider = rangeSliderSelector();
        valueText = slider.getAttribute("aria-valuetext");
      });

      afterEach(() => {
        body.textContent = "";
      });

      it("adds aria-valuetext attribute", () => {
        assert.ok(valueText, "aria-valuetext attribute is added");
        assert.strictEqual(
          valueText,
          "20 percent of 100",
          "initial value is incorrect",
        );
      });

      it("updates aria-valuetext to match new slider value on change", () => {
        slider.value = "30";
        EVENTS.change(slider);

        assert.strictEqual(slider.value, "30");

        valueText = slider.getAttribute("aria-valuetext");
        assert.strictEqual(
          valueText,
          "30 percent of 100",
          "Screen reader value does not match range value",
        );
      });
    });
  });
});
