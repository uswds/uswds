const fs = require("fs");
const path = require("path");
const assert = require("assert");
const range = require("../index");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "./sr-callout.spec.html")
);

const EVENTS = {};

/**
 * send a click event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.click = (el) => {
  const evt = new MouseEvent("click", {
    view: el.ownerDocument.defaultView,
    bubbles: true,
    cancelable: true,
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown ArrowLeft event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownArrowLeft = (el = document.activeElement) => {
  const evt = new KeyboardEvent("keydown", {
    bubbles: true,
    key: "ArrowLeft",
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown ArrowRight event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownArrowRight = (el = document.activeElement) => {
  const evt = new KeyboardEvent("keydown", {
    bubbles: true,
    key: "ArrowRight",
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown Tab event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownTab = (el = document) => {
  const evt = new KeyboardEvent("keydown", {
    bubbles: true,
    key: "Tab",
    keyCode: 9,
  });
  el.dispatchEvent(evt);
};

const rangeSliderSelector = () => document.querySelector(".usa-range");

const tests = [
  { name: "document.body", selector: () => document.body },
  { name: "range slider", selector: rangeSliderSelector },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`Range slider component initialized at ${name}`, () => {
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

    it("updates aria-valuenow on input", () => {
      document.getElementById("usa-range").focus();

      
      EVENTS.keydownArrowRight();
      
      assert.ok(
        document.activeElement.classList.contains("usa-range"),
        "focuses correct item"
      );
      
      assert.strictEqual(
        document.activeElement.value, 30
      )

      assert.strictEqual(valueText, "30 percent of 100");
    });
  });
});
