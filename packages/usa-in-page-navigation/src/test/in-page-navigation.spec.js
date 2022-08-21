const assert = require("assert");
const fs = require("fs");
const path = require("path");
const sinon = require("sinon");
const { default: matchMediaPolyfill } = require("mq-polyfill");
const behavior = require("../index");

const HIDE_MAX_WIDTH = 768;
const TEMPLATE = fs.readFileSync(path.join(__dirname, "/template.html"));
const STYLES = fs.readFileSync(
  `${__dirname}/../../../../dist/css/uswds.min.css`
);

const PRIMARY_CONTENT_SELECTOR =
  ".usa-in-page-nav-container .usa-in-page-nav .usa-in-page-nav-list";
const IN_PAGE_NAV_SELECTOR = ".usa-in-page-nav__link";

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
  console.log(">> element:", el);
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
  describe.only(`in page navigation initialized at ${name}`, () => {
    const { body } = document;
    // const windowIntersectionObserver = window.IntersectionObserver;

    document.head.insertAdjacentHTML("beforeend", `<style>${STYLES}</style>`);

    let theLinks;
    let theList;
    let sandbox;

    before(() => {
      const observe = sinon.spy();
      const mockIntersectionObserver = sinon.stub().returns({ observe });
      // mockIntersectionObserver.mockReturnValue({
      //   observe,
      // });
      window.IntersectionObserver = mockIntersectionObserver;
      matchMediaPolyfill(window);
    });

    beforeEach(() => {
      body.innerHTML = TEMPLATE;

      theList = document.querySelector(PRIMARY_CONTENT_SELECTOR);
      theLinks = () => document.querySelectorAll(IN_PAGE_NAV_SELECTOR);

      window.innerWidth = 400;
      behavior.on(containerSelector());
    });

    afterEach(() => {
      behavior.off(containerSelector(body));
      body.innerHTML = "";
      // window.IntersectionObserver = windowIntersectionObserver;
    });

    it("hides at small screens", () => {
      resizeTo(400);

      assertHidden(theList, true);
    });

    /* it("defines a max width", () => {
      assert(typeof HIDE_MAX_WIDTH === "number", "no value defined");
    });

     it("hides at small screens", () => {
      resizeTo(400);
      assertHidden(theList[0], true);
    });

    it("hides then shows again on larger screens", () => {
      resizeTo(400);
      resizeTo(1024);
      assertHidden(theList[0], false);
    });

    it("navigates to section when clicked", () => {
      resizeTo(400);
      theLinks()[0].click();
      assertHidden(theList[0], false);
    }); */
  });
});
