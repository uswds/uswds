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
        assert.strictEqual(
          slider.value,
          spanElement.textContent,
          "slider value does not match span value",
        );
      });

      // NEW TEST — Added for issue - 6614
      // Verifies visual hint is present for sighted users
      it("displays a visual hint to guide sighted users on how to operate the slider", () => {
        const hint = body.querySelector(".usa-hint");
        assert.ok(
          hint,
          "Visual hint element (.usa-hint) should exist in the range slider component",
        );
        assert.strictEqual(
          hint.textContent.trim(),
          "Move the slider to change the value",
          "Visual hint text should read: 'Move the slider to change the value'",
        );
      });
    });
  });
});
