const assert = require("assert");
const fs = require("fs");
const path = require("path");
const sinon = require("sinon");
const behavior = require("../index");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/in-page-navigation-custom-heading.template.html")
);
const THE_NAV = ".usa-in-page-nav";
const PRIMARY_CONTENT_SELECTOR =
  ".usa-in-page-nav-container .usa-in-page-nav .usa-in-page-nav__list";

const tests = [
  { name: "document.body", selector: () => document.body },
  {
    name: "in page nav",
    selector: () => document.querySelector(".usa-in-page-nav"),
  },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`in-page navigation pulls from custom header list in ${name}`, () => {
    const { body } = document;

    let theNav;
    let navList;
    let navListLinks;
    let dataHeadingSelector;
    let selectedHeadingList;

    before(() => {
      const observe = sinon.spy();
      const mockIntersectionObserver = sinon.stub().returns({ observe });
      window.IntersectionObserver = mockIntersectionObserver;
    });

    beforeEach(() => {
      body.innerHTML = TEMPLATE;

      behavior.on(containerSelector());

      theNav = document.querySelector(THE_NAV);
      dataHeadingSelector = theNav.getAttribute("data-heading-selector");

      navList = document.querySelector(PRIMARY_CONTENT_SELECTOR);
      navListLinks = Array.from(navList.getElementsByTagName("a"));
      selectedHeadingList = document
        .querySelector("main")
        .querySelectorAll(dataHeadingSelector);
    });

    afterEach(() => {
      behavior.off(containerSelector(body));
      body.innerHTML = "";
      window.location.hash = "";
    });

    it("pulls only the heading types listed in data-heading-selector", () => {
      assert.equal(selectedHeadingList.length === navListLinks.length, true);
    });

    it("creates a link in the nav list for the designated header", () => {
      const h2Link = navListLinks.filter((link) =>
        link.href.includes(`#${dataHeadingSelector}-heading`)
      );
      assert.equal(h2Link.length === 1, true);
    });

    it("does not create a link in the nav list for the h3 header", () => {
      const h3link = navListLinks.filter((link) =>
        link.href.includes("#h3-heading")
      );
      assert.equal(h3link.length === 0, true);
    });
  });
});
