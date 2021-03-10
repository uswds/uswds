/* eslint-disable */
// TODO: many of these dont test anything, use spies to ensure the methods are being called
const assert = require("assert");
const Behavior = require("../../../src/js/utils/behavior");

describe("behavior", () => {
  it("returns an object", () => {
    const behavior = Behavior({});
    assert(behavior && typeof behavior === "object");
  });

  it("has on() and off() methods", () => {
    const behavior = Behavior({});
    assert.strictEqual(typeof behavior.on, "function");
    assert.strictEqual(typeof behavior.off, "function");
  });

  describe("behavior.on()", () => {
    it("calls init()", () => {
      const behavior = Behavior({
        init() {
          done();
        },
      });
      behavior.on();
    });

    it("passes document.body if no target is provided", () => {
      const behavior = Behavior({
        init(target) {
          assert.strictEqual(target, document.body);
          done();
        },
      });
      behavior.on();
    });

    it("passes the right element if a target is provided", () => {
      const el = document.createElement("div");
      const behavior = Behavior({
        init(target) {
          assert.strictEqual(target, el);
          done();
        },
      });
      behavior.on(el);
    });
  });

  describe("behavior.off()", () => {
    it("calls teardown()", () => {
      const behavior = Behavior({
        teardown() {
          done();
        },
      });
      behavior.off();
    });

    it("passes document.body if no target is provided", () => {
      const behavior = Behavior({
        teardown(target) {
          assert.strictEqual(target, document.body);
          done();
        },
      });
      behavior.off();
    });

    it("passes the right element if a target is provided", () => {
      const el = document.createElement("div");
      const behavior = Behavior({
        teardown(target) {
          assert.strictEqual(target, el);
          done();
        },
      });
      behavior.off(el);
    });
  });
});
/** eslint-enable */
