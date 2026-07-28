const sinon = require("sinon");
const assert = require("assert");
const keymap = require("../keymap");

describe("keymap", () => {
  it("does not call handler if incorrect key is pressed", () => {
    const onTab = sinon.stub();
    const handler = keymap({ Tab: onTab });
    document.body.addEventListener("keydown", handler);
    const event = new KeyboardEvent("keydown", { key: "Escape" });
    document.body.dispatchEvent(event);

    assert(onTab.notCalled);
  });

  it("calls handler if when no modifiers are expected or pressed", () => {
    const onTab = sinon.stub();
    const handler = keymap({ Tab: onTab });
    document.body.addEventListener("keydown", handler);
    const event = new KeyboardEvent("keydown", { key: "Tab" });
    document.body.dispatchEvent(event);

    assert(onTab.calledOnceWithExactly(event));
  });

  it("does not call handler if keypress includes unexpected modifier", () => {
    const onTab = sinon.stub();
    const handler = keymap({ Tab: onTab });
    document.body.addEventListener("keydown", handler);
    const event = new KeyboardEvent("keydown", { key: "Tab", shiftKey: true });
    document.body.dispatchEvent(event);

    assert(onTab.notCalled);
  });

  it("calls handler if all expected modifiers are pressed", () => {
    const onTab = sinon.stub();
    const handler = keymap({ "Shift+Tab": onTab });
    document.body.addEventListener("keydown", handler);
    const event = new KeyboardEvent("keydown", { key: "Tab", shiftKey: true });
    document.body.dispatchEvent(event);

    assert(onTab.calledOnceWithExactly(event));
  });

  it("does not call handler if keypress does not include all expected modifiers", () => {
    const onTab = sinon.stub();
    const handler = keymap({ "Shift+Control+Tab": onTab });
    document.body.addEventListener("keydown", handler);
    const event = new KeyboardEvent("keydown", { key: "Tab", shiftKey: true });
    document.body.dispatchEvent(event);

    assert(onTab.notCalled);
  });

  it("does not throw when event has no key property", () => {
    const onTab = sinon.stub();
    const handler = keymap({ Tab: onTab });
    document.body.addEventListener("keydown", handler);
    // Datalist selections in Chrome can dispatch events without a key property
    const event = new Event("keydown", { bubbles: true });
    assert.doesNotThrow(() => document.body.dispatchEvent(event));
    assert(onTab.notCalled);
  });

  it("does not call event if keypress contains different modifier than handler", () => {
    const onTab = sinon.stub();
    const handler = keymap({ "Control+Tab": onTab });
    document.body.addEventListener("keydown", handler);
    const event = new KeyboardEvent("keydown", { key: "Tab", shiftKey: true });
    document.body.dispatchEvent(event);

    assert(onTab.notCalled);
  });

  it("calls handler if Control modifier is pressed", () => {
    const onTab = sinon.stub();
    const handler = keymap({ "Control+Tab": onTab });
    document.body.addEventListener("keydown", handler);
    const event = new KeyboardEvent("keydown", { key: "Tab", ctrlKey: true });
    document.body.dispatchEvent(event);

    assert(onTab.calledOnceWithExactly(event));
  });
});
