const assert = require("assert");
const fs = require("fs");
const path = require("path");
const behavior = require("../index");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/in-page-navigation-minimum-heading.template.html"),
);
const THE_NAV = ".usa-in-page-nav";

const tests = [
  { name: "document.body", selector: () => document.body },
  {
    name: "in page nav",
    selector: () => document.querySelector(".usa-in-page-nav"),
  },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe("Minimum heading count tests", () => {
    const { body } = document;

    let theNav;

    beforeEach(() => {
      body.innerHTML = TEMPLATE;
      theNav = document.querySelector(THE_NAV);
    });

    afterEach(() => {
      body.innerHTML = "";
    });

    it("does render the in-page navigation when set minimum heading count of 1 has been reached", () => {
      theNav.setAttribute("data-minimum-heading-count", "1");
      behavior.off(containerSelector(body));
      behavior.on(containerSelector(body));
      assert.strictEqual(
        theNav.hasChildNodes(),
        true,
        "In-page navigation should have child nodes when the custom set minimum heading count of 1 has been reached",
      );
    });

    it("does not render the in-page navigation when custom set minimum heading count of 4 has not been reached", () => {
      theNav.setAttribute("data-minimum-heading-count", "4");
      behavior.off(containerSelector(body));
      behavior.on(containerSelector(body));
      assert.strictEqual(
        theNav.hasChildNodes(),
        false,
        "In-page navigation should not have child nodes when the custom set heading count is lower than the minimum of 4",
      );
    });

    it("does render the in-page navigation when default heading count of 2 has been reached", () => {
      behavior.off(containerSelector(body));
      behavior.on(containerSelector(body));
      assert.strictEqual(
        theNav.hasChildNodes(),
        true,
        "In-page navigation should have child nodes when the default minimum heading count of 2 has not been reached",
      );
    });
  });
});
