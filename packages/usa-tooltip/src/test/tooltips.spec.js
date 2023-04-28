const assert = require("assert");
const fs = require("fs");
const path = require("path");
const tooltip = require("../index");

const TEMPLATE = fs.readFileSync(path.join(__dirname, "/template.html"));

const tests = [
  { name: "document.body", selector: () => document.body },
  { name: "tooltip", selector: () => document.querySelector(".usa-tooltip") },
];

tests.forEach(({ name, selector: containerSelector }) => {
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

    it("title attribute on trigger is removed", () => {
      assert.strictEqual(tooltipTrigger.hasAttribute("title"), false);
    });

    it("tooltip body is created", () => {
      assert.strictEqual(tooltipBody.innerHTML, "This is a tooltip");
    });

    it("tooltip is visible on focus", () => {
      tooltipTrigger.focus();
      assert.strictEqual(tooltipBody.classList.contains("is-set"), true);
    });

    it("tooltip is visible when mousing over", () => {
      const event = new MouseEvent("mouseover", { bubbles: true });
      tooltipTrigger.dispatchEvent(event);
      assert.strictEqual(tooltipBody.classList.contains("is-set"), true);
    });

    it("tooltip is visible when mousing over child", () => {
      const icon = document.createElement("img");
      tooltipTrigger.appendChild(icon);
      const event = new MouseEvent("mouseover", { bubbles: true });
      icon.dispatchEvent(event);
      assert.strictEqual(tooltipBody.classList.contains("is-set"), true);
    });

    it("tooltip is hidden on blur", () => {
      tooltipTrigger.blur();
      assert.strictEqual(tooltipBody.classList.contains("is-set"), false);
    });

    it("tooltip is hidden when mousing out", () => {
      const mouseOverEvent = new MouseEvent("mouseover", { bubbles: true });
      const mouseOutEvent = new MouseEvent("mouseout", { bubbles: true });
      tooltipTrigger.dispatchEvent(mouseOverEvent);
      tooltipTrigger.dispatchEvent(mouseOutEvent);
      assert.strictEqual(tooltipBody.classList.contains("is-set"), false);
    });

    it("should not allow for innerHTML of child elements ", () => {
      // override the template
      body.innerHTML = `<button class="usa-button usa-tooltip" title="Apricot &lt;img src='' onerror=alert('ouch')&gt;">Button</button>`;
      tooltip.on();
      tooltipBody = body.querySelector(".usa-tooltip__body");
      tooltipTrigger = body.querySelector(".usa-tooltip__trigger");
      tooltip.on(body);

      // confirm we are not on the original template
      assert.notStrictEqual(tooltipBody.innerHTML, "This is a tooltip");

      Array.from(tooltipBody.childNodes).forEach((childNode) => {
        assert.strictEqual(childNode.nodeType, Node.TEXT_NODE);
      });
    });
  });
});
