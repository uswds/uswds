const assert = require("assert");
const fs = require("fs");
const path = require("path");
const sinon = require("sinon");
const behavior = require("../index");

const HIDE_MAX_WIDTH = 639;
const TEMPLATE = fs.readFileSync(path.join(__dirname, "/template.html"));
const STYLES = fs.readFileSync(
  `${__dirname}/../../../../dist/css/uswds.min.css`
);
const THE_NAV = ".usa-in-page-nav";
const PRIMARY_CONTENT_SELECTOR =
  ".usa-in-page-nav-container .usa-in-page-nav .usa-in-page-nav__list";

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
    `not hidden: ${el.nodeName} (${el.className})`
  );
};

const tests = [
  { name: "document.body", selector: () => document.body },
  {
    name: "in page nav",
    selector: () => document.querySelector(".usa-in-page-nav"),
  },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`in-page navigation initialized at ${name}`, () => {
    const { body } = document;
    document.head.insertAdjacentHTML("beforeend", `<style>${STYLES}</style>`);

    let theNav;
    let theList;

    before(() => {
      const observe = sinon.spy();
      const mockIntersectionObserver = sinon.stub().returns({ observe });
      window.IntersectionObserver = mockIntersectionObserver;
    });

    beforeEach(() => {
      body.innerHTML = TEMPLATE;

      theNav = document.querySelector(THE_NAV);
      theList = document.querySelector(PRIMARY_CONTENT_SELECTOR);

      window.innerWidth = 1024;
      behavior.on(containerSelector());
    });

    afterEach(() => {
      behavior.off(containerSelector(body));
      body.innerHTML = "";
    });

    it("defines a max width", () => {
      assert(typeof HIDE_MAX_WIDTH === "number", "no value defined");
    });

    it("hides at small screens", () => {
      resizeTo(400);
      assertHidden(theNav, true);
    });

    it("show on larger screens", () => {
      resizeTo(400);
      resizeTo(1024);
      assertHidden(theList, false);
    });
  });
});
