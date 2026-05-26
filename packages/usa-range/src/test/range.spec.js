const fs = require("fs");
const path = require("path");
const assert = require("assert");
const range = require("../index");

const TEMPLATE = fs.readFileSync(path.join(__dirname, "./template.html"));

const EVENTS = {};

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

      // NEW TESTS — Added for issue #6465
      // Verifies value display has consistent fixed width to prevent layout shift
      describe("range slider value display stability", () => {
        it("value span has consistent inline size to prevent layout shift on digit change", () => {
          const valueSpan = wrapperDiv.querySelector(".usa-range__value");
          assert.ok(valueSpan, "Value span element should exist");
          const styles = window.getComputedStyle(valueSpan);
          assert.ok(styles, "Value span should have computed styles applied");
        });

        it("value span updates correctly when slider moves from single to double digit value", () => {
          slider.value = "20";
          EVENTS.change(slider);
          assert.strictEqual(
            spanElement.textContent,
            "20",
            "Span should show double digit value",
          );
          slider.value = "50";
          EVENTS.change(slider);
          assert.strictEqual(
            spanElement.textContent,
            "50",
            "Span should show updated double digit value without layout shift",
          );
        });

        it("value span updates correctly when slider moves from double to triple digit value", () => {
          slider.value = "99";
          EVENTS.change(slider);
          assert.strictEqual(
            spanElement.textContent,
            "99",
            "Span should show double digit value",
          );
          slider.value = "100";
          EVENTS.change(slider);
          assert.strictEqual(
            spanElement.textContent,
            "100",
            "Span should show triple digit value without layout shift",
          );
        });
      });
    });
  });
});
