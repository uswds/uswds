const assert = require("assert");
const fs = require("fs");
const Accordion = require("../index");

const TEMPLATE = fs.readFileSync(`${__dirname}/template.html`);

// `aria` prefixed attributes
const EXPANDED = "aria-expanded";
const CONTROLS = "aria-controls";
const HIDDEN = "hidden";
const MULTISELECTABLE = "data-allow-multiple";

const accordionSelector = () => document.querySelector(".usa-accordion");
const tests = [
  { name: "document.body", selector: () => document.body },
  { name: "accordion", selector: accordionSelector },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`Accordion behavior when initialized at ${name}`, () => {
    const { body } = document;

    let root;
    let button;
    let buttons;
    let content;

    beforeEach(() => {
      body.innerHTML = TEMPLATE;
      Accordion.on(containerSelector());

      root = accordionSelector();
      buttons = root.querySelectorAll(".usa-accordion__button");
      /* eslint-disable */
      button = buttons[0];
      /* eslint-enable */
      content = document.getElementById(button.getAttribute(CONTROLS));
    });

    afterEach(() => {
      Accordion.off(containerSelector());
      body.innerHTML = "";
    });

    describe("DOM state", () => {
      it('has an "aria-expanded" attribute', () => {
        assert(button.getAttribute(EXPANDED));
      });

      it('has an "aria-controls" attribute', () => {
        assert(button.getAttribute(CONTROLS));
      });

      describe("accordion.show()", () => {
        beforeEach(() => {
          Accordion.hide(button);
          Accordion.show(button);
        });

        it('toggles button aria-expanded="true"', () => {
          assert.strictEqual(button.getAttribute(EXPANDED), "true");
        });

        it('toggles content "hidden" off', () => {
          assert(content.getAttribute(HIDDEN) !== true);
        });
      });

      describe("accordion.hide()", () => {
        beforeEach(() => {
          Accordion.show(button);
          Accordion.hide(button);
        });

        it('toggles button aria-expanded="false"', () => {
          assert.strictEqual(button.getAttribute(EXPANDED), "false");
        });

        it('toggles content "hidden" on', () => {
          assert(content.hasAttribute(HIDDEN));
        });
      });
    });

    describe("interaction", () => {
      it("shows the second item when clicked", () => {
        const second = buttons[1];
        const target = document.getElementById(second.getAttribute(CONTROLS));
        second.click();
        // first button and section should be collapsed
        assert.strictEqual(button.getAttribute(EXPANDED), "false");
        assert(content.hasAttribute(HIDDEN));
        // second should be expanded
        assert.strictEqual(second.getAttribute(EXPANDED), "true");
        assert(target.getAttribute(HIDDEN) !== true);
      });

      it("keeps multiple sections open with data-allow-multiple", () => {
        root.setAttribute(MULTISELECTABLE, "");

        const second = buttons[1];
        second.click();
        button.click();

        assert.strictEqual(button.getAttribute(EXPANDED), "true");
        assert(content.getAttribute(HIDDEN) !== true);
        // second should be expanded
        assert.strictEqual(second.getAttribute(EXPANDED), "true");
        assert(content.getAttribute(HIDDEN) !== true);
      });
    });
  });
});
