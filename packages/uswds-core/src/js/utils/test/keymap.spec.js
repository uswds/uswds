const sinon = require("sinon");
const assert = require("assert");
const keymap = require("../keymap");

describe("keymap", () => {
  it("does not call handler if keypress is not for the mapped key", () => {
    const onTab = sinon.stub();
    const handler = keymap({ Tab: onTab });
    document.body.addEventListener("keydown", handler);
    const event = new KeyboardEvent("keydown", { key: "Escape" });
    document.body.dispatchEvent(event);

    assert(onTab.notCalled);
  });

  it("calls handler if combo does not include modifier and neither does keypress", () => {
    const onTab = sinon.stub();
    const handler = keymap({ Tab: onTab });
    document.body.addEventListener("keydown", handler);
    const event = new KeyboardEvent("keydown", { key: "Tab" });
    document.body.dispatchEvent(event);

    assert(onTab.calledOnceWithExactly(event));
  });

  it("does not call handler if combo does not include modifier from keypress", () => {
    const onTab = sinon.stub();
    const handler = keymap({ Tab: onTab });
    document.body.addEventListener("keydown", handler);
    const event = new KeyboardEvent("keydown", { key: "Tab", shiftKey: true });
    document.body.dispatchEvent(event);

    assert(onTab.notCalled);
  });

  it("calls handler if all modifiers in combo are pressed", () => {
    const onTab = sinon.stub();
    const handler = keymap({ "Shift+Tab": onTab });
    document.body.addEventListener("keydown", handler);
    const event = new KeyboardEvent("keydown", { key: "Tab", shiftKey: true });
    document.body.dispatchEvent(event);

    assert(onTab.calledOnceWithExactly(event));
  });

  it("does not call handler if some but not all modifiers in combo are pressed", () => {
    const onTab = sinon.stub();
    const handler = keymap({ "Shift+Ctrl+Tab": onTab });
    document.body.addEventListener("keydown", handler);
    const event = new KeyboardEvent("keydown", { key: "Tab", shiftKey: true });
    document.body.dispatchEvent(event);

    assert(onTab.notCalled);
  });

  it("does not call handler if event has modifiers but combo does not", () => {
    const onTab = sinon.stub();
    const handler = keymap({ Tab: onTab });
    document.body.addEventListener("keydown", handler);
    const event = new KeyboardEvent("keydown", { key: "Tab", shiftKey: true });
    document.body.dispatchEvent(event);

    assert(onTab.notCalled);
  });
});
