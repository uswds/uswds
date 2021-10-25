const assert = require("assert");
const fs = require("fs");
const path = require("path");
const tooltip = require("../../../src/js/components/tooltip");

const TEMPLATE = fs.readFileSync(path.join(__dirname, "/template.html"));

describe("tooltips", () => {
  const { body } = document;
  let tooltipBody;
  let tooltipTrigger;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    tooltip.on();
    tooltipBody = body.querySelector(".usa-tooltip__body");
    tooltipTrigger = body.querySelector(".usa-tooltip__trigger");
    tooltip.on(body);
  });

  afterEach(() => {
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
