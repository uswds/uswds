const assert = require("assert");
const fs = require("fs");
const path = require("path");
const tooltip = require("../../../src/js/components/tooltip");

const TEMPLATE = fs.readFileSync(path.join(__dirname, "/template.html"));

const tests = [
  { name: "document.body", selector: () => document.body },
  { name: "tooltip", selector: () => document.querySelector(".usa-tooltip") }
];

tests.forEach(({name, selector: containerSelector}) => {
  describe(`tooltips initialized at ${name}`, () => {
    const { body } = document;
    let tooltipBody;
    let tooltipTrigger;

    beforeEach(() => {
      body.innerHTML = TEMPLATE;
      tooltip.on(containerSelector());
      tooltipBody = body.querySelector(".usa-tooltip__body");
      tooltipTrigger = body.querySelector(".usa-tooltip__trigger");
    });

    afterEach(() => {
      tooltip.off(containerSelector());
      body.textContent = "";
    });

    it("trigger is created", () => {
      assert.strictEqual(
        tooltipTrigger.getAttribute("class"),
        "usa-button usa-tooltip__trigger"
      );
    });

    it("title attribute on trigger is cleared", () => {
      assert.strictEqual(tooltipTrigger.getAttribute("title"), "");
    });

    it("tooltip body is created", () => {
      assert.strictEqual(tooltipBody.innerHTML, "This is a tooltip");
    });

    it("tooltip is visible on focus", () => {
      tooltipTrigger.focus();
      assert.strictEqual(tooltipBody.classList.contains("is-set"), true);
    });

    it("tooltip is hidden on blur", () => {
      tooltipTrigger.blur();
      assert.strictEqual(tooltipBody.classList.contains("is-set"), false);
    });
  });
});
