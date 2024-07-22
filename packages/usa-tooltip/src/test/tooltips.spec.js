const assert = require("assert");
const fs = require("fs");
const path = require("path");
const tooltip = require("../index");

const TEMPLATE = fs.readFileSync(path.join(__dirname, "/template.html"));

const tests = [
  { name: "document.body", selector: () => document.body },
  { name: "tooltip", selector: () => document.querySelector(".usa-tooltip") },
];

const EVENTS = {
  mouseover(el) {
    const mouseoverEvent = new Event("mouseover", {
      bubbles: true,
      cancelable: true,
    });

    el.dispatchEvent(mouseoverEvent);
  },
  mouseleave(el) {
    const mouseleaveEvent = new Event("mouseleave", {
      cancelable: true,
    });

    el.dispatchEvent(mouseleaveEvent);
  },
  escape(el) {
    const escapeKeyEvent = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
    });

    el.dispatchEvent(escapeKeyEvent);
  },
};

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`tooltips initialized at ${name}`, () => {
    const { body } = document;
    let tooltipBody;
    let tooltipTrigger;
    let tooltipWrapper;

    beforeEach(() => {
      body.innerHTML = TEMPLATE;
      tooltip.on(containerSelector());
      tooltipBody = body.querySelector(".usa-tooltip__body");
      tooltipTrigger = body.querySelector(".usa-tooltip__trigger");
      tooltipWrapper = body.querySelector(".usa-tooltip");
    });

    afterEach(() => {
      tooltip.off(containerSelector());
      body.textContent = "";
    });

    it("trigger is created", () => {
      assert.strictEqual(
        tooltipTrigger.getAttribute("class"),
        "usa-button usa-tooltip__trigger",
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

    it("tooltip is hidden on blur", () => {
      tooltipTrigger.blur();
      assert.strictEqual(tooltipBody.classList.contains("is-set"), false);
    });

    it("tooltip is visible on mouseover", () => {
      EVENTS.mouseover(tooltipTrigger);
      assert.strictEqual(tooltipBody.classList.contains("is-set"), true);
    });

    it("tooltip is hidden on mouseleave", () => {
      EVENTS.mouseover(tooltipTrigger);
      EVENTS.mouseleave(tooltipWrapper);
      assert.strictEqual(tooltipBody.classList.contains("is-set"), false);
    });

    it("tooltip content is hoverable", () => {
      EVENTS.mouseover(tooltipTrigger);
      EVENTS.mouseover(tooltipBody);
      assert.strictEqual(tooltipBody.classList.contains("is-set"), true);
    });

    it("tooltip is hidden on escape keydown", () => {
      tooltipTrigger.focus();
      EVENTS.escape(tooltipTrigger);
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
