'use strict';
const accordion = require('../../../src/js/components/accordion');
const assert = require('assert');
const fs = require('fs');

const TEMPLATE = fs.readFileSync(__dirname + '/template.html');

// `aria` prefixed attributes
const EXPANDED = 'aria-expanded';
const CONTROLS = 'aria-controls';
const HIDDEN   = 'aria-hidden';

describe('accordion component', function () {
  const body = document.body;

  let root;
  let button;
  let content;

  beforeEach(function () {
    body.innerHTML = TEMPLATE;
    accordion.on(body);

    root = body.querySelector('.usa-accordion');
    button = root.querySelector('.usa-accordion-button');
    content = document.getElementById(
      button.getAttribute(CONTROLS)
    );
  });

  afterEach(function () {
    body.innerHTML = '';
    accordion.off(body);
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
        accordion.hide(button);
        accordion.show(button);
      });

      it('toggles button aria-expanded="true"', function () {
        assert.equal(button.getAttribute(EXPANDED), 'true');
      });

      it('toggles content aria-hidden="false"', function () {
        assert.equal(content.getAttribute(HIDDEN), 'false');
      });
    });

    describe('accordion.hide()', function () {
      beforeEach(function () {
        accordion.show(button);
        accordion.hide(button);
      });

      it('toggles button aria-expanded="false"', function () {
        assert.equal(button.getAttribute(EXPANDED), 'false');
      });

      it('toggles content aria-hidden="true"', function () {
        assert.equal(content.getAttribute(HIDDEN), 'true');
      });
    });
  });
});
