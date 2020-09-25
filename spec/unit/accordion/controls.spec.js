const Accordion = require("../../../src/js/components/accordion");
const assert = require("assert");
const fs = require("fs");
const { it } = require("mocha");

const TEMPLATE = fs.readFileSync(`${__dirname}/controls-template.html`);

// `aria` prefixed attributes
const EXPANDED = "aria-expanded";
const CONTROLS = "aria-controls";
const HIDDEN = "hidden";
const MULTISELECTABLE = "aria-multiselectable";

// Accordion expand/collapse control classes
const EXPANDBUTTON = 'usa-accordion__controls--expand-all';
const COLLAPSEBUTTON = 'usa-accordion__controls--collapse-all';

describe("accordion controls behavior", () => {
  const { body } = document;

  let root;
  let controls;
  let button;
  let buttons;
  let content;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    Accordion.on();

    root = body.querySelector(".usa-accordion");
    controls = root.querySelectorAll(".usa-accordion__controls")[0];
    expandAllBtn = root.querySelectorAll(`.${EXPANDBUTTON}`);
    collapseAllBtn = root.querySelectorAll(`.${COLLAPSEBUTTON}`);
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
    it('Controls has an "aria-expanded" attribute', () => {
      assert(controls.getAttribute(EXPANDED));
    });
    it('Has a "Expand All" button', () => {
      assert(expandAllBtn);
    });
    it('Has a "Collapse All" button', () => {
      assert(collapseAllBtn);
    });
    it('All items collapsed by default', () => {
      buttons.forEach((button) => {
        assert.strictEqual(button.getAttribute(EXPANDED), 'false');
      });
    })
  });

  describe("interaction", () => {
    it("Expands all accordions on click", () => {
      expandAllBtn[0].click();
      buttons.forEach((button) => {
        assert.strictEqual(button.getAttribute(EXPANDED), 'true');
      });
    });
    it("Collapses all accordions on click", () => {
      collapseAllBtn[0].click();
      buttons.forEach((button) => {
        assert.strictEqual(button.getAttribute(EXPANDED), 'false');
      });
    });
  });
});
