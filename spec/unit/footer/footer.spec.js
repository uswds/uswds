const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { default: matchMediaPolyfill } = require("mq-polyfill");
const behavior = require("../../../src/js/components/footer");

const TEMPLATE = fs.readFileSync(path.join(__dirname, "/template.html"));

const HIDDEN = "hidden";
const PRIMARY_CONTENT_SELECTOR =
  ".usa-footer--big .usa-footer__primary-content--collapsible";
const BUTTON_SELECTOR = ".usa-footer__primary-link";

/**
 * Resize the window's width, then dispatch a 'resize' event
 *
 * @param {number} width
 */
function resizeTo(width) {
  if (width !== window.innerWidth) {
    window.innerWidth = width;
    window.dispatchEvent(new window.Event("resize"));
  }
}

const assertHidden = (el, hidden) => {
  assert.strictEqual(
    el.classList.contains(HIDDEN),
    hidden,
    `not hidden: ${el.nodeName} (${el.className})`
  );
};

describe("big footer accordion", () => {
  const { body } = document;
  let buttons;
  let lists;

  before(() => {
    matchMediaPolyfill(window);
  });

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
    resizeTo(400);
    assertHidden(lists[0], true);
  });

  it("collapses then expands again on larger screens", () => {
    resizeTo(400);
    resizeTo(1024);
    assertHidden(lists[0], false);
  });

  it("opens panel when clicked", () => {
    resizeTo(400);
    buttons[0].click();
    assertHidden(lists[0], false);
  });

  it("does not open panels when clicked on larger screens", () => {
    buttons[0].click();
    assertHidden(lists[0], false);
  });

  it("closes panel on subsequent click", () => {
    resizeTo(800);
    resizeTo(400);
    buttons[0].click();
    assertHidden(lists[0], false);
    buttons[0].click();
    assertHidden(lists[0], true);
  });

  it("closes other panels on small screens", () => {
    resizeTo(800);
    resizeTo(400);
    buttons[0].click();
    assertHidden(lists[0], false);
    assertHidden(lists[1], true);
    assertHidden(lists[2], true);
    buttons[1].click();
    assertHidden(lists[0], true);
    assertHidden(lists[1], false);
    assertHidden(lists[2], true);
  });

  it("does not close other panels on larger screens", () => {
    buttons[0].click();
    assertHidden(lists[0], false);
    assertHidden(lists[1], false);
    assertHidden(lists[2], false);
  });
});
