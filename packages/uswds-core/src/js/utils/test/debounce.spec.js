const sinon = require("sinon");
const assert = require("assert");
const debounce = require("../debounce");

describe("debounce", () => {
  let clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers({ shouldClearNativeTimers: true });
  });

  afterEach(() => {
    clock.restore();
  });

  it("calls the callback once after the delay with the latest arguments", () => {
    const callback = sinon.stub();
    const debounced = debounce(callback, 200);

    debounced("first");
    debounced("second");
    clock.tick(199);

    assert(callback.notCalled);

    clock.tick(1);

    assert(callback.calledOnceWithExactly("second"));
  });

  it("uses a 500ms delay by default", () => {
    const callback = sinon.stub();
    const debounced = debounce(callback);

    debounced();
    clock.tick(499);

    assert(callback.notCalled);

    clock.tick(1);

    assert(callback.calledOnce);
  });

  it("does not call the callback after cancel", () => {
    const callback = sinon.stub();
    const debounced = debounce(callback, 200);

    debounced("pending");
    debounced.cancel();
    clock.tick(200);

    assert(callback.notCalled);
  });

  it("can be called again after cancel", () => {
    const callback = sinon.stub();
    const debounced = debounce(callback, 200);

    debounced("cancelled");
    debounced.cancel();
    debounced("after cancel");
    clock.tick(200);

    assert(callback.calledOnceWithExactly("after cancel"));
  });

  it("preserves call-site this when invoking the callback", () => {
    const callback = sinon.stub();
    const debounced = debounce(callback, 200);
    const context = { id: "call-site" };

    debounced.call(context, "arg");
    clock.tick(200);

    assert(callback.calledOnceWithExactly("arg"));
    assert.strictEqual(callback.getCall(0).thisValue, context);
  });
});
