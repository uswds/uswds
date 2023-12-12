const assert = require("assert");
const fs = require("fs");
const banner = require("../index");

const TEMPLATE = fs.readFileSync(`${__dirname}/template.html`);
const EXPANDED = "aria-expanded";
const EXPANDED_CLASS = "usa-banner__header--expanded";
const HIDDEN = "hidden";

const tests = [
  { name: "document.body", selector: () => document.body },
  { name: "banner", selector: () => document.querySelector(".usa-banner") },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`Banner initialized at ${name}`, () => {
    const { body } = document;

    let header;
    let button;
    let content;

    beforeEach(() => {
      body.innerHTML = TEMPLATE;
      header = body.querySelector(".usa-banner__header");
      button = body.querySelector(".usa-banner__button");
      content = body.querySelector(".usa-banner__content");
      banner.on(containerSelector());
    });

    afterEach(() => {
      banner.off(containerSelector());
      body.innerHTML = "";
    });

    it("initializes closed", () => {
      assert.strictEqual(header.classList.contains(EXPANDED_CLASS), false);
      assert.strictEqual(button.getAttribute(EXPANDED), "false");
      assert(content.hasAttribute(HIDDEN));
    });

    it("opens when you click the button", () => {
      button.click();
      assert.strictEqual(header.classList.contains(EXPANDED_CLASS), true);
      assert.strictEqual(button.getAttribute(EXPANDED), "true");
      assert(content.getAttribute(HIDDEN) !== true);
    });

    it("closes when you click the button again", () => {
      button.click();
      button.click();
      assert.strictEqual(header.classList.contains(EXPANDED_CLASS), false);
      assert.strictEqual(button.getAttribute(EXPANDED), "false");
      assert(content.hasAttribute(HIDDEN));
    });
  });
});
