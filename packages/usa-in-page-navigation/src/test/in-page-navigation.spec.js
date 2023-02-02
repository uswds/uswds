const assert = require("assert");
const fs = require("fs");
const path = require("path");
const sinon = require("sinon");
const InPageNav = require("../index");

const HIDE_MAX_WIDTH = 639;
const TEMPLATE = fs.readFileSync(path.join(__dirname, "/template.html"));
const STYLES = fs.readFileSync(
  `${__dirname}/../../../../dist/css/uswds.min.css`
);
const THE_MAIN_CONTENT = ".usa-in-page-nav__main";
const THE_NAV_CONTAINER = ".usa-in-page-nav__container";
const THE_NAV_LIST =
  ".usa-in-page-nav .usa-in-page-nav__container .usa-in-page-nav__list";

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

const inPageNavSelector = () => document.querySelector(".usa-in-page-nav");

const tests = [
  { name: "document.body", selector: () => document.body },
  {
    name: "in-page nav",
    selector: inPageNavSelector,
  },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`in-page navigation initialized at ${name}`, () => {
    const { body } = document;
    document.head.insertAdjacentHTML("beforeend", `<style>${STYLES}</style>`);

    let root;
    let theMainContent;
    let theNavContainer;
    let theNavList;

    before(() => {
      const observe = sinon.spy();
      const mockIntersectionObserver = sinon.stub().returns({ observe });
      window.IntersectionObserver = mockIntersectionObserver;
    });

    beforeEach(() => {
      body.innerHTML = TEMPLATE;
      InPageNav.on(containerSelector());

      root = inPageNavSelector();

      theMainContent = root.querySelector(THE_MAIN_CONTENT);
      theNavContainer = root.querySelector(THE_NAV_CONTAINER);
      theNavList = root.querySelector(THE_NAV_LIST);

      window.innerWidth = 1024;
    });

    afterEach(() => {
      InPageNav.off(containerSelector(body));
      body.innerHTML = "";
    });

    it("defines a max width", () => {
      assert(typeof HIDE_MAX_WIDTH === "number", "no value defined");
    });

    it("hides on small screens", () => {
      resizeTo(400);
      assertHidden(theNavContainer, true);
    });

    it("shows on larger screens", () => {
      resizeTo(400);
      resizeTo(1024);
      assertHidden(theNavList, false);
    });

    it("sets the in-page nav h4 title tag text to 'On this page'", () => {
      assert.strictEqual(
        theNavContainer.querySelector("h4").textContent,
        "On this page"
      );
    });

    it("checks the first in-page nav item text is 'Section 1'", () => {
      assert.strictEqual(
        theNavList.querySelector(".usa-in-page-nav__item").textContent,
        "Section 1"
      );
    });

    it("checks that the first h2 tag in the main content section contains an anchor tag with id 'section_0'", () => {
      assert.strictEqual(
        theMainContent.querySelector("h2 > a").id,
        "section_0"
      );
    });
  });
});
