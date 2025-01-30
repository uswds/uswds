const assert = require("assert");
const fs = require("fs");
const path = require("path");
const behavior = require("../index");

const TEMPLATE = fs.readFileSync(
  path.join(
    __dirname,
    "/in-page-navigation-minimum-heading-default.template.html",
  ),
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

    it("does not render the in-page navigation when default heading count of 2 has not been reached", () => {
      behavior.off(containerSelector(body));
      behavior.on(containerSelector(body));
      assert.strictEqual(
        theNav.hasChildNodes(),
        false,
        "In-page navigation should not have child nodes when the default minimum heading count of 2 has been reached",
      );
    });
  });
});
