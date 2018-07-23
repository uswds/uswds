const assert = require('assert');
const fs = require('fs');
const Accordion = require('../../../src/js/components/accordion');

const TEMPLATE = fs.readFileSync(`${__dirname}/template.html`);
// `aria` prefixed attributes
const EXPANDED = 'aria-expanded';
const CONTROLS = 'aria-controls';
const HIDDEN = 'aria-hidden';
const MULTISELECTABLE = 'aria-multiselectable';

describe('accordion behavior', () => {
  const { body } = document;

  let root;
  let button;
  let buttons;
  let content;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    Accordion.on();

    root = body.querySelector('.usa-accordion');
    buttons = root.querySelectorAll('.usa-accordion-button');
    button = buttons[ 0 ]; // eslint-disable-line
    content = document.getElementById(button.getAttribute(CONTROLS));
  });

  afterEach(() => {
    body.innerHTML = '';
    Accordion.off();
  });

  describe('DOM state', () => {
    it('has an "aria-expanded" attribute', () => {
      assert(button.getAttribute(EXPANDED));
    });

    it('has an "aria-controls" attribute', () => {
      assert(button.getAttribute(CONTROLS));
    });

    describe('accordion.show()', () => {
      beforeEach(() => {
        Accordion.hide(button);
        Accordion.show(button);
      });

      it('toggles button aria-expanded="true"', () => {
        assert.equal(button.getAttribute(EXPANDED), 'true');
      });

      it('toggles content aria-hidden="false"', () => {
        assert.equal(content.getAttribute(HIDDEN), 'false');
      });
    });

    describe('accordion.hide()', () => {
      beforeEach(() => {
        Accordion.show(button);
        Accordion.hide(button);
      });

      it('toggles button aria-expanded="false"', () => {
        assert.equal(button.getAttribute(EXPANDED), 'false');
      });

      it('toggles content aria-hidden="true"', () => {
        assert.equal(content.getAttribute(HIDDEN), 'true');
      });
    });
  });

  describe('interaction', () => {
    it('shows the second item when clicked', () => {
      const second = buttons[1];
      const target = document.getElementById(second.getAttribute(CONTROLS));
      second.click();
      // first button and section should be collapsed
      assert.equal(button.getAttribute(EXPANDED), 'false');
      assert.equal(content.getAttribute(HIDDEN), 'true');
      // second should be expanded
      assert.equal(second.getAttribute(EXPANDED), 'true');
      assert.equal(target.getAttribute(HIDDEN), 'false');
    });

    it('keeps multiple sections open with aria-multiselectable="true"', () => {
      root.setAttribute(MULTISELECTABLE, true);

      const second = buttons[1];
      const target = document.getElementById(second.getAttribute(CONTROLS));
      second.click();
      button.click();

      assert.equal(button.getAttribute(EXPANDED), 'true');
      assert.equal(content.getAttribute(HIDDEN), 'false');
      // second should be expanded
      assert.equal(second.getAttribute(EXPANDED), 'true');
      assert.equal(target.getAttribute(HIDDEN), 'false');
    });
  });
});
