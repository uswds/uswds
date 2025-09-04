const sinon = require("sinon");
const assert = require("assert");
const behavior = require("../behavior");

describe("behavior", () => {
  it("returns an object", () => {
    const component = behavior({});
    assert(component && typeof component === "object");
  });

  it("has on(), off(), add(), remove() functions", () => {
    const component = behavior({});
    assert.strictEqual(typeof component.on, "function");
    assert.strictEqual(typeof component.off, "function");
    assert.strictEqual(typeof component.add, "function");
    assert.strictEqual(typeof component.remove, "function");
  });

  it("includes additional properties from given arguments", () => {
    const component = behavior({}, { extra: true });

    assert.strictEqual(component.extra, true);
  });

  it("calls event handlers as function", () => {
    const click = sinon.stub();
    const component = behavior({ click });
    component.on();
    const event = new Event("click", { bubbles: true });
    document.body.dispatchEvent(event);

    assert(click.calledOnceWithExactly(event));
    assert.strictEqual(click.getCall(0).thisValue, document.body);
  });

  it("scopes event handling by the given target", () => {
    const click = sinon.stub();
    const component = behavior({ click });
    const event = new Event("click", { bubbles: true });
    const div = document.createElement("div");
    document.body.appendChild(div);
    component.on(div);
    document.body.dispatchEvent(event);

    assert(click.notCalled);
    div.dispatchEvent(event);

    assert(click.calledOnceWithExactly(event));
    assert.strictEqual(click.getCall(0).thisValue, div);
  });

  it("calls event handlers as object for matched selector", () => {
    const divClick = sinon.stub();
    const spanClick = sinon.stub();
    const component = behavior({ click: { div: divClick, span: spanClick } });
    const event = new Event("click", { bubbles: true });
    const div = document.createElement("div");
    const span = document.createElement("span");
    document.body.appendChild(div);
    document.body.appendChild(span);
    component.on();
    div.dispatchEvent(event);

    assert(divClick.calledOnceWithExactly(event));
    assert.strictEqual(divClick.getCall(0).thisValue, div);
    assert(spanClick.notCalled);
  });

  it("calls event handlers as object for matched ancestor selector", () => {
    const bodyClick = sinon.stub();
    const component = behavior({ click: { body: bodyClick } });
    const event = new Event("click", { bubbles: true });
    const div = document.createElement("div");
    document.body.appendChild(div);
    component.on();
    div.dispatchEvent(event);

    assert(bodyClick.calledOnceWithExactly(event));
    assert.strictEqual(bodyClick.getCall(0).thisValue, document.body);
  });

  it("calls event handlers as object for multiple matches", () => {
    const bodyClick = sinon.stub();
    const divClick = sinon.stub();
    const component = behavior({ click: { div: divClick, body: bodyClick } });
    const event = new Event("click", { bubbles: true });
    const div = document.createElement("div");
    document.body.appendChild(div);
    component.on();
    div.dispatchEvent(event);

    assert(divClick.calledOnceWithExactly(event));
    assert.strictEqual(divClick.getCall(0).thisValue, div);
    assert(bodyClick.calledOnceWithExactly(event));
    assert.strictEqual(bodyClick.getCall(0).thisValue, document.body);
  });

  it("skips other event handlers once one returns false", () => {
    const bodyClick = sinon.stub();
    const divClick = sinon.stub().returns(false);
    const component = behavior({ click: { div: divClick, body: bodyClick } });
    const event = new Event("click", { bubbles: true });
    const div = document.createElement("div");
    document.body.appendChild(div);
    component.on();
    div.dispatchEvent(event);

    assert(divClick.calledOnceWithExactly(event));
    assert.strictEqual(divClick.getCall(0).thisValue, div);
    assert(bodyClick.notCalled);
  });

  it("calls event handlers with space separated event names", () => {
    const click = sinon.stub();
    const component = behavior({ "keydown click": click });
    component.on();
    const event = new Event("click", { bubbles: true });
    document.body.dispatchEvent(event);

    assert(click.calledOnceWithExactly(event));
    assert.strictEqual(click.getCall(0).thisValue, document.body);
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

    it("binds events", () => {
      const sandbox = sinon.createSandbox();
      sandbox.spy(document.body, "addEventListener");
      const component = behavior({ click() {} });
      component.on();

      assert(document.body.addEventListener.calledOnceWith("click"));

      sandbox.restore();
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

    it("removes event bindings", () => {
      const sandbox = sinon.createSandbox();
      sandbox.spy(document.body, "removeEventListener");
      const component = behavior({ click() {} });
      component.on();
      component.off();

      assert(document.body.removeEventListener.calledOnceWith("click"));

      sandbox.restore();
    });
  });
});
