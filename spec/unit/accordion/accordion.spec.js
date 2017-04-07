var fs = require('fs');
var assert = require('assert');
var template = fs.readFileSync(
  __dirname + '/template.html'
).toString();
var accordion = require('../../../src/js/components/accordion');

// `aria` prefixed attributes
var EXPANDED = 'aria-expanded';
var CONTROLS = 'aria-controls';
var HIDDEN   = 'aria-hidden';

describe('accordion component', function () {
  var root;
  var button;
  var content;

  var body = document.body;

  beforeEach(function () {
    body.innerHTML = template;
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
