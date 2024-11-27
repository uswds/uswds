const assert = require("assert");
const fs = require("fs");
const path = require("path");
const behavior = require("../index");

const TEMPLATE = fs.readFileSync(path.join(__dirname, "/template.html"));
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

    it("does not render the in-page navigation when minimum heading count of 20 has not been reached", () => {
      theNav.setAttribute("data-minimum-heading-count", "20");
      behavior.off(containerSelector(body));
      behavior.on(containerSelector(body));
      assert.strictEqual(
        theNav.hasChildNodes(),
        false,
        "In-page navigation should not have child nodes when the heading count is lower than the minimum of 20",
      );
    });

    it("does render the in-page navigation when default minimum heading count of 3 has not been reached", () => {
      theNav.setAttribute("data-minimum-heading-count", "3");
      behavior.off(containerSelector(body));
      behavior.on(containerSelector(body));
      assert.strictEqual(
        theNav.hasChildNodes(),
        true,
        "In-page navigation should have child nodes when the minimum heading count of 3 has not been reached",
      );
    });
  });
});
