const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { default: matchMediaPolyfill } = require("mq-polyfill");
const behavior = require("../index");

const TEMPLATE = fs.readFileSync(path.join(__dirname, "/template.html"));
const STYLES = fs.readFileSync(
  `${__dirname}/../../../../dist/css/uswds.min.css`,
);

const PRIMARY_CONTENT_SELECTOR =
  ".usa-footer--big .usa-footer__primary-content--collapsible .usa-list";
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
    window.getComputedStyle(el).display === "none",
    hidden,
    `not hidden: ${el.nodeName} (${el.className})`,
  );
};

const tests = [
  { name: "document.body", selector: () => document.body },
  { name: "footer", selector: () => document.querySelector(".usa-footer") },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`big footer accordion initialized at ${name}`, () => {
    const { body } = document;

    document.head.insertAdjacentHTML("beforeend", `<style>${STYLES}</style>`);

    let buttons;
    let lists;

    before(() => {
      matchMediaPolyfill(window);
    });

    beforeEach(() => {
      body.innerHTML = TEMPLATE;

      lists = document.querySelectorAll(PRIMARY_CONTENT_SELECTOR);
      buttons = () => document.querySelectorAll(BUTTON_SELECTOR);

      window.innerWidth = 1024;
      behavior.on(containerSelector());
    });

    afterEach(() => {
      behavior.off(containerSelector(body));
      body.innerHTML = "";
    });

    it("defines a max width", () => {
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
      buttons()[0].click();
      assertHidden(lists[0], false);
    });

    it("does not open panels when clicked on larger screens", () => {
      buttons()[0].click();
      assertHidden(lists[0], false);
    });

    it("closes panel on subsequent click", () => {
      resizeTo(800);
      resizeTo(400);
      buttons()[0].click();
      assertHidden(lists[0], false);
      buttons()[0].click();
      assertHidden(lists[0], true);
    });

    it("closes other panels on small screens", () => {
      resizeTo(800);
      resizeTo(400);
      buttons()[0].click();
      assertHidden(lists[0], false);
      assertHidden(lists[1], true);
      assertHidden(lists[2], true);
      buttons()[1].click();
      assertHidden(lists[0], true);
      assertHidden(lists[1], false);
      assertHidden(lists[2], true);
    });

    it("does not close other panels on larger screens", () => {
      buttons()[0].click();
      assertHidden(lists[0], false);
      assertHidden(lists[1], false);
      assertHidden(lists[2], false);
    });

    it("preserves html tag on resize", () => {
      const initialHtmlTag = buttons()[0].tagName;
      assert.strictEqual(initialHtmlTag, "H4");
      assert.strictEqual(buttons()[0].getAttribute("data-tag"), null);
      resizeTo(400);
      assert.strictEqual(buttons()[0].tagName, "BUTTON");
      assert.strictEqual(buttons()[0].getAttribute("data-tag"), initialHtmlTag);
      resizeTo(1024);
      assert.strictEqual(buttons()[0].tagName, initialHtmlTag);
      assert.strictEqual(buttons()[0].getAttribute("data-tag"), null);
    });
  });
});
