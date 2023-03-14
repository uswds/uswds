const sinon = require("sinon");
const assert = require("assert");
const behavior = require("../behavior");

describe("behavior", () => {
  it("returns an object", () => {
    const component = behavior({});
    assert(component && typeof component === "object");
  });

  it("has on() and off() methods", () => {
    const component = behavior({});
    assert.strictEqual(typeof component.on, "function");
    assert.strictEqual(typeof component.off, "function");
  });

  describe("behavior.on()", () => {
    it("calls init()", () => {
      const init = sinon.spy();
      behavior({}, { init }).on();
      assert(init.calledOnce);
    });

    it("passes document.body if no target is provided", () => {
      const init = sinon.spy();
      behavior({}, { init }).on();
      assert(init.calledWithExactly(document.body));
    });

    it("passes the right element if a target is provided", () => {
      const init = sinon.spy();
      const el = document.createElement("div");
      behavior({}, { init }).on(el);
      assert(init.calledWithExactly(el));
    });
  });

  describe("behavior.off()", () => {
    it("calls teardown()", () => {
      const teardown = sinon.spy();
      behavior({}, { teardown }).off();
      assert(teardown.calledOnce);
    });

    it("passes document.body if no target is provided", () => {
      const teardown = sinon.spy();
      behavior({}, { teardown }).off();
      assert(teardown.calledWithExactly(document.body));
    });

    it("passes the right element if a target is provided", () => {
      const teardown = sinon.spy();
      const el = document.createElement("div");
      behavior({}, { teardown }).off(el);
      assert(teardown.calledWithExactly(el));
    });
  });
});
