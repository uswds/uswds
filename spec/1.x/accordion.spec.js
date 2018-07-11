const assert = require('assert');
const fs = require('fs');
const path = require('path');
const Accordion = require('../../src/js/components/accordion');

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, '../unit/accordion/template.html'),
).toString();

const CONTROLS = 'aria-controls';
const EXPANDED = 'aria-expanded';
const HIDDEN = 'aria-hidden';

describe('1.x accordion component', () => {
  let accordion;
  let button;
  let content;

  beforeEach(() => {
    document.body.innerHTML = TEMPLATE;
    const root = document.querySelector('.usa-accordion');
    accordion = new Accordion(root);
    button = root.querySelector('button');
    content = document.getElementById(button.getAttribute(CONTROLS));
  });

  afterEach(() => {
    accordion.remove();
    accordion = undefined;
  });

  it('has a root', () => {
    assert(accordion.root);
  });

  it('has an "aria-expanded" attribute', () => {
    assert(button.hasAttribute(EXPANDED));
  });

  it('has an "aria-controls" attribute', () => {
    assert(button.hasAttribute(CONTROLS));
  });

  describe('when show is triggered', () => {
    beforeEach(() => {
      accordion.show(button);
    });

    afterEach(() => {
      accordion.hide(button);
    });

    it('toggles "aria-expanded" to true', () => {
      assert.equal(button.getAttribute(EXPANDED), 'true');
    });

    it('toggles "aria-hidden" to false', () => {
      assert.equal(content.getAttribute(HIDDEN), 'false');
    });
  });

  describe('when hide is triggered', () => {
    beforeEach(() => {
      accordion.show(button);
      accordion.hide(button);
    });

    it('toggles "aria-expanded" to false', () => {
      assert.equal(button.getAttribute(EXPANDED), 'false');
    });

    it('toggles "aria-hidden" to true', () => {
      assert.equal(content.getAttribute(HIDDEN), 'true');
    });
  });

  it('sets up the DOM correctly', () => {
    const buttons = Array.from(document.querySelectorAll('button'));
    buttons.forEach((buttonEl) => {
      assert.equal(buttonEl.getAttribute(EXPANDED), 'false');
      const contentEl = document.getElementById(
        button.getAttribute(CONTROLS),
      );
      assert.equal(contentEl.getAttribute(HIDDEN), 'true');
    });
  });

  it('can show buttons', () => {
    accordion.show(button);
    assert.equal(button.getAttribute(EXPANDED), 'true');
    assert.equal(content.getAttribute(HIDDEN), 'false');
  });

  it('can hide buttons', () => {
    accordion.hide(button);
    assert.equal(button.getAttribute(EXPANDED), 'false');
    assert.equal(content.getAttribute(HIDDEN), 'true');
  });
});
