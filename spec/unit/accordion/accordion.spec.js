const Accordion = require("../../../src/js/components/accordion");
const assert = require("assert");
const fs = require("fs");

const TEMPLATE = fs.readFileSync(`${__dirname}/template.html`);

// `aria` prefixed attributes
const EXPANDED = "aria-expanded";
const CONTROLS = "aria-controls";
const HIDDEN = "hidden";
const MULTISELECTABLE = "aria-multiselectable";

describe("accordion behavior", () => {
  const { body } = document;

  let root;
  let button;
  let buttons;
  let content;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    Accordion.on();

    root = body.querySelector(".usa-accordion");
    buttons = root.querySelectorAll(".usa-accordion__button");
    /* eslint-disable */
    button = buttons[0];
    /* eslint-enable */
    content = document.getElementById(button.getAttribute(CONTROLS));
  });

  afterEach(() => {
    body.innerHTML = "";
    Accordion.off();
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
        assert.equal(button.getAttribute(EXPANDED), "true");
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
        assert.equal(button.getAttribute(EXPANDED), "false");
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
      assert.equal(button.getAttribute(EXPANDED), "false");
      assert(content.hasAttribute(HIDDEN));
      // second should be expanded
      assert.equal(second.getAttribute(EXPANDED), "true");
      assert(target.getAttribute(HIDDEN) !== true);
    });

    it('keeps multiple sections open with aria-multiselectable="true"', () => {
      root.setAttribute(MULTISELECTABLE, true);

      const second = buttons[1];
      second.click();
      button.click();

      assert.equal(button.getAttribute(EXPANDED), "true");
      assert(content.getAttribute(HIDDEN) !== true);
      // second should be expanded
      assert.equal(second.getAttribute(EXPANDED), "true");
      assert(content.getAttribute(HIDDEN) !== true);
    });
  });
});
