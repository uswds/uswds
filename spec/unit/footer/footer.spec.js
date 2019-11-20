const assert = require("assert");
const fs = require("fs");
const path = require("path");
const behavior = require("../../../src/js/components/footer");

const TEMPLATE = fs.readFileSync(path.join(__dirname, "/template.html"));

const { DEBOUNCE_RATE } = behavior;
const HIDDEN = "hidden";
const PRIMARY_CONTENT_SELECTOR =
  ".usa-footer--big .usa-footer__primary-content--collapsible";
const BUTTON_SELECTOR = ".usa-footer__primary-link";

/**
 * Resize the window's width, then dispatch a
 * 'resize' event after the debounce rate elapses.
 * Returns a promise so that you can return it in a
 * test, and mocha will wait until it's resolved.
 *
 * @param {number} width
 * @return {Promise}
 */
const resizeTo = width =>
  new Promise(resolve => {
    if (width !== window.innerWidth) {
      window.innerWidth = width;
      window.dispatchEvent(new CustomEvent("resize"));
    }
    setTimeout(resolve, DEBOUNCE_RATE + 10);
  });

const assertHidden = (el, hidden) => {
  assert.equal(
    el.classList.contains(HIDDEN),
    hidden,
    `not hidden: ${el.nodeName} (${el.className})`
  );
};

describe("big footer accordion", () => {
  const { body } = document;
  let buttons;
  let lists;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;

    lists = document.querySelectorAll(PRIMARY_CONTENT_SELECTOR);
    buttons = document.querySelectorAll(BUTTON_SELECTOR);

    window.innerWidth = 1024;
    behavior.on(body);
  });

  afterEach(() => {
    body.innerHTML = "";
    behavior.off(body);
  });

  it("defines a max. width", () => {
    assert(typeof behavior.HIDE_MAX_WIDTH === "number", "no value defined");
  });

  it("collapses at small screens", () => {
    return resizeTo(400).then(() => {
      assertHidden(lists[0], true);
    });
  });

  it("collapses then expands again on larger screens", () => {
    return resizeTo(400)
      .then(() => resizeTo(1024))
      .then(() => {
        assertHidden(lists[0], false);
      });
  });

  it("opens panel when clicked", () => {
    return resizeTo(400).then(() => {
      buttons[0].click();
      assertHidden(lists[0], false);
    });
  });

  it("does not open panels when clicked on larger screens", () => {
    buttons[0].click();
    assertHidden(lists[0], false);
  });

  it("closes panel on subsequent click", () => {
    return resizeTo(800)
      .then(() => resizeTo(400))
      .then(() => {
        buttons[0].click();
        assertHidden(lists[0], false);
        buttons[0].click();
        assertHidden(lists[0], true);
      });
  });

  it("closes other panels on small screens", () => {
    return resizeTo(800)
      .then(() => resizeTo(400))
      .then(() => {
        buttons[0].click();
        assertHidden(lists[0], false);
        assertHidden(lists[1], true);
        assertHidden(lists[2], true);

        buttons[1].click();
        assertHidden(lists[0], true);
        assertHidden(lists[1], false);
        assertHidden(lists[2], true);
      });
  });

  it("does not close other panels on larger screens", () => {
    buttons[0].click();
    assertHidden(lists[0], false);
    assertHidden(lists[1], false);
    assertHidden(lists[2], false);
  });
});
