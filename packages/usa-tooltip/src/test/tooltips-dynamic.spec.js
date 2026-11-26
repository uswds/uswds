const assert = require("assert");
const tooltip = require("../index");

const mouseover = (el) =>
  el.dispatchEvent(new Event("mouseover", { bubbles: true, cancelable: true }));
const mouseleave = (el) =>
  el.dispatchEvent(new Event("mouseleave", { cancelable: true }));

describe("tooltips created or changed after initialization", () => {
  const { body } = document;

  beforeEach(() => {
    body.innerHTML = "";
    tooltip.on(body);
  });

  afterEach(() => {
    tooltip.off(body);
    body.textContent = "";
  });

  const addDynamicTrigger = () => {
    body.insertAdjacentHTML(
      "beforeend",
      `<button type="button" class="usa-button usa-tooltip" title="First">Button</button>`,
    );
    return body.querySelector("button");
  };

  it("builds one tooltip for a trigger added after init", () => {
    const trigger = addDynamicTrigger();
    mouseover(trigger);

    assert.strictEqual(body.querySelectorAll(".usa-tooltip__body").length, 1);
    assert.strictEqual(
      body.querySelector(".usa-tooltip__body").textContent,
      "First",
    );
  });

  it("updates the existing tooltip when the title changes", () => {
    const trigger = addDynamicTrigger();
    mouseover(trigger);

    trigger.setAttribute("title", "Second");
    mouseover(trigger);

    const bodies = body.querySelectorAll(".usa-tooltip__body");
    assert.strictEqual(bodies.length, 1);
    assert.strictEqual(body.querySelectorAll(".usa-tooltip").length, 1);
    assert.strictEqual(bodies[0].textContent, "Second");
    assert.strictEqual(trigger.hasAttribute("title"), false);
    assert.strictEqual(
      trigger.getAttribute("aria-describedby"),
      bodies[0].getAttribute("id"),
    );
  });

  it("hides a dynamically created tooltip on mouseleave", () => {
    const trigger = addDynamicTrigger();
    mouseover(trigger);

    const tooltipBody = body.querySelector(".usa-tooltip__body");
    assert.strictEqual(tooltipBody.classList.contains("is-set"), true);

    mouseleave(body.querySelector(".usa-tooltip"));
    assert.strictEqual(tooltipBody.classList.contains("is-set"), false);
  });

  it("removes the mouseleave listener on teardown", () => {
    body.innerHTML = `<button type="button" class="usa-button usa-tooltip" title="First">Button</button>`;
    tooltip.on(body);
    tooltip.off(body);

    const tooltipBody = body.querySelector(".usa-tooltip__body");
    tooltipBody.classList.add("is-set");
    mouseleave(body.querySelector(".usa-tooltip"));

    assert.strictEqual(tooltipBody.classList.contains("is-set"), true);
  });

  it("updates a tooltip set up at init when its title changes", () => {
    body.innerHTML = `<button type="button" class="usa-button usa-tooltip" title="First">Button</button>`;
    tooltip.on(body);
    const trigger = body.querySelector("button");

    trigger.setAttribute("title", "Second");
    mouseover(trigger);

    const bodies = body.querySelectorAll(".usa-tooltip__body");
    assert.strictEqual(bodies.length, 1);
    assert.strictEqual(bodies[0].textContent, "Second");
  });
});
