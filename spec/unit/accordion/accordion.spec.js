'use strict';
const Accordion = require('../../../src/js/components/accordion');
const assert = require('assert');
const fs = require('fs');

const TEMPLATE = fs.readFileSync(__dirname + '/template.html');

// `aria` prefixed attributes
const EXPANDED = 'aria-expanded';
const CONTROLS = 'aria-controls';
const HIDDEN   = 'hidden';
const MULTISELECTABLE = 'aria-multiselectable';

describe('accordion behavior', function () {
  const body = document.body;

  let root;
  let button;
  let buttons;
  let content;

  beforeEach(function () {
    body.innerHTML = TEMPLATE;
    Accordion.on();

    root = body.querySelector('.usa-accordion');
    buttons = root.querySelectorAll('.usa-accordion-button');
    button = buttons[ 0 ];
    content = document.getElementById(
      button.getAttribute(CONTROLS)
    );
  });

  afterEach(function () {
    body.innerHTML = '';
    Accordion.off();
  });

  describe('DOM state', function () {
    it('has an "aria-expanded" attribute', function () {
      assert(button.getAttribute(EXPANDED));
    });

    it('has an "aria-controls" attribute', function () {
      assert(button.getAttribute(CONTROLS));
    });

    describe('accordion.show()', function () {
      beforeEach(function () {
        Accordion.hide(button);
        Accordion.show(button);
      });

      it('toggles button aria-expanded="true"', function () {
        assert.equal(button.getAttribute(EXPANDED), 'true');
      });

      it('toggles content "hidden" off', function () {
        assert(content.hasAttribute(HIDDEN) != 'true');
      });
    });

    describe('accordion.hide()', function () {
      beforeEach(function () {
        Accordion.show(button);
        Accordion.hide(button);
      });

      it('toggles button aria-expanded="false"', function () {
        assert.equal(button.getAttribute(EXPANDED), 'false');
      });

      it('toggles content "hidden" on', function () {
        assert(content.hasAttribute(HIDDEN));
      });
    });
  });

  describe('interaction', function () {

    it('shows the second item when clicked', function () {
      const second = buttons[ 1 ];
      const target = document.getElementById(
        second.getAttribute(CONTROLS)
      );
      second.click();
      // first button and section should be collapsed
      assert.equal(button.getAttribute(EXPANDED), 'false');
      assert(content.hasAttribute(HIDDEN));
      // second should be expanded
      assert.equal(second.getAttribute(EXPANDED), 'true');
      assert(target.getAttribute(HIDDEN) != 'true');
    });

    it('keeps multiple sections open with aria-multiselectable="true"', function () {
      root.setAttribute(MULTISELECTABLE, true);

      const second = buttons[ 1 ];
      const target = document.getElementById(
        second.getAttribute(CONTROLS)
      );
      second.click();
      button.click();

      assert.equal(button.getAttribute(EXPANDED), 'true');
      assert(content.hasAttribute(HIDDEN) != 'true');
      // second should be expanded
      assert.equal(second.getAttribute(EXPANDED), 'true');
      assert(content.hasAttribute(HIDDEN) != 'true');
    });


  });
});
