'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const Accordion = require('../../src/js/components/accordion');

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, '../unit/accordion/template.html')
).toString();

const CONTROLS = 'aria-controls';
const EXPANDED = 'aria-expanded';
const HIDDEN = 'hidden';

describe('1.x accordion component', function () {

  let accordion;
  let button;
  let content;

  beforeEach(function () {
    const el = document.createElement('div');
    document.body.innerHTML = TEMPLATE;
    const root = document.querySelector('.usa-accordion');
    accordion = new Accordion(root);
    button = root.querySelector('button');
    content = document.getElementById(button.getAttribute(CONTROLS));
  });

  afterEach(function () {
    accordion.remove();
    accordion = undefined;
  });

  it('has a root', function () {
    assert(accordion.root);
  });

  it('has an "aria-expanded" attribute', function () {
    assert(button.hasAttribute(EXPANDED));
  });

  it('has an "aria-controls" attribute', function () {
    assert(button.hasAttribute(CONTROLS));
  });

  describe('when show is triggered', function () {
    beforeEach(function () {
      accordion.show(button);
    });

    afterEach(function () {
      accordion.hide(button);
    });

    it('toggles "aria-expanded" to true', function () {
      assert.equal(button.getAttribute(EXPANDED), 'true');
    });

    it('toggles "hidden" off', function () {
      assert(content.hasAttribute(HIDDEN) != 'true');
    });
  });

  describe('when hide is triggered', function () {
    beforeEach(function () {
      accordion.show(button);
      accordion.hide(button);
    });

    it('toggles "aria-expanded" to false', function () {
      assert.equal(button.getAttribute(EXPANDED), 'false');
    });

    it('toggles "hidden" on', function () {
      assert(content.hasAttribute(HIDDEN));
    });
  });

  it('sets up the DOM correctly', function () {
    const buttons = Array.from(document.querySelectorAll('button'));
    buttons.forEach(button => {
      assert.equal(button.getAttribute(EXPANDED), 'false');
      const content = document.getElementById(
        button.getAttribute(CONTROLS)
      );
      assert(content.hasAttribute(HIDDEN));
    });
  });

  it('can show buttons', function () {
    accordion.show(button);
    assert.equal(button.getAttribute(EXPANDED), 'true');
    assert(content.getAttribute(HIDDEN) != 'true');
  });

  it('can hide buttons', function () {
    accordion.hide(button);
    assert.equal(button.getAttribute(EXPANDED), 'false');
    assert(content.hasAttribute(HIDDEN));
  });

});
