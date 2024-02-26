const assert = require("assert");
const fs = require("fs");
const path = require("path");
const sinon = require("sinon");
const behavior = require("../index");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/in-page-navigation-custom-content.template.html"),
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
  describe(`in-page navigation pulls in headers from the custom content region at ${name}`, () => {
    const { body } = document;

    let navList;
    let navListLinks;
    let customContentSelector;
    let customContentHeaderList;

    before(() => {
      const observe = sinon.spy();
      const mockIntersectionObserver = sinon.stub().returns({ observe });
      window.IntersectionObserver = mockIntersectionObserver;
    });

    beforeEach(() => {
      body.innerHTML = TEMPLATE;

      behavior.on(containerSelector());

      navList = document.querySelector(PRIMARY_CONTENT_SELECTOR);
      navListLinks = Array.from(navList.getElementsByTagName("a"));
      customContentSelector = document
        .querySelector(THE_NAV)
        .getAttribute("data-main-content-selector");
      customContentHeaderList = document
        .querySelector(customContentSelector)
        .querySelectorAll("h2, h3");
    });

    afterEach(() => {
      behavior.off(containerSelector(body));
      body.innerHTML = "";
      window.location.hash = "";
    });

    it("pulls the headers from the designated custom content region into the nav list", () => {
      assert.equal(
        customContentHeaderList.length === navListLinks.length,
        true,
      );
    });

    it("creates a link in the nav list for the header that is inside the custom content region", () => {
      const customRegionLink = navListLinks.filter((link) =>
        link.href.includes("#header-in-content-region"),
      );
      assert.equal(customRegionLink.length === 1, true);
    });

    it("does not create a link in the nav list for the header that is outside the custom content region", () => {
      const mainRegionLink = navListLinks.filter((link) =>
        link.href.includes("#header-not-in-content-region"),
      );
      assert.equal(mainRegionLink.length === 0, true);
    });
  });
});
