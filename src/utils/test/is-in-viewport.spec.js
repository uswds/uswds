const assert = require("assert");
const { isElementInViewport } = require('../index')

function fakeEl(rect) {
  return {
    getBoundingClientRect() {
      return rect;
    },
  };
}

describe("isElementInViewport", () => {
  it("works when window.innerHeight/innerWidth is set", () => {
    const el = fakeEl({ top: 5, left: 5, bottom: 6, right: 6 });

    assert(isElementInViewport(el, { innerHeight: 10, innerWidth: 10 }));
    assert(!isElementInViewport(el, { innerHeight: 5, innerWidth: 5 }));
  });

  it("works when <html> clientHeight/clientWidth is set", () => {
    const el = fakeEl({ top: 5, left: 5, bottom: 6, right: 6 });

    assert(isElementInViewport(el, {}, { clientHeight: 10, clientWidth: 10 }));
    assert(!isElementInViewport(el, {}, { clientHeight: 5, clientWidth: 5 }));
  });

  it("returns false when rect.top < 0", () => {
    assert(!isElementInViewport(fakeEl({ top: -1, left: 5, bottom: 6, right: 6 })));
  });

  it("returns false when rect.left < 0", () => {
    assert(!isElementInViewport(fakeEl({ top: 5, left: -1, bottom: 6, right: 6 })));
  });
});
