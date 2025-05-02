const fs = require("fs");
const path = require("path");
const assert = require("assert");
const range = require("../index");

const TEMPLATE = fs.readFileSync(path.join(__dirname, "./template.html"));

const EVENTS = {};

/**
 * send a change event
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
  describe(`Range slider with span initialized at ${name}`, () => {
    describe("range slider component", () => {
      const { body } = document;

      let slider;
      let spanElement;
      let wrapperDiv;

      beforeEach(() => {
        body.innerHTML = TEMPLATE;
        range.on(containerSelector());

        slider = rangeSliderSelector();
        // get the closest slider with class .usa-range__wrapper
        wrapperDiv = slider.closest(".usa-range__wrapper");
        spanElement = wrapperDiv.querySelector(".usa-range__value");
      });

      afterEach(() => {
        body.textContent = "";
      });

      it("check that the wrapper div and the span element are added and that they match the slider.", () => {
        assert.ok(wrapperDiv, "wrapperDiv was created.");
        assert.ok(spanElement, "SPAN was created");
        assert.strictEqual(
          spanElement.textContent,
          slider.value,
          "the span does not match the range slider value.",
        );
      });

      it("Updates span element to match new slider value on change", () => {
        slider.value = "40";
        EVENTS.change(slider);
        assert.strictEqual(
          slider.value,
          "40",
          "range slider value is not set to the value in the test.",
        );

        // change the span element, make sure it updated and that the span and the range are equal.
        assert.strictEqual(
          slider.value,
          spanElement.textContent,
          "slider value does not match span value",
        );
      });
    });
  });
});
