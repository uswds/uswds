const assert = require("assert");
const isInViewport = require("../../../src/js/utils/is-in-viewport");

function fakeEl(rect) {
  return {
    getBoundingClientRect() {
      return rect;
    }
  };
}

describe("isInViewport", () => {
  it("works when window.innerHeight/innerWidth is set", () => {
    const el = fakeEl({ top: 5, left: 5, bottom: 6, right: 6 });

    assert(isInViewport(el, { innerHeight: 10, innerWidth: 10 }));
    assert(!isInViewport(el, { innerHeight: 5, innerWidth: 5 }));
  });

  it("works when <html> clientHeight/clientWidth is set", () => {
    const el = fakeEl({ top: 5, left: 5, bottom: 6, right: 6 });

    assert(isInViewport(el, {}, { clientHeight: 10, clientWidth: 10 }));
    assert(!isInViewport(el, {}, { clientHeight: 5, clientWidth: 5 }));
  });

  it("returns false when rect.top < 0", () => {
    assert(!isInViewport(fakeEl({ top: -1, left: 5, bottom: 6, right: 6 })));
  });

  it("returns false when rect.left < 0", () => {
    assert(!isInViewport(fakeEl({ top: 5, left: -1, bottom: 6, right: 6 })));
  });
});
