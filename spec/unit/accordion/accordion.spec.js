var mocha = require('mocha');
var should = require('should');
var template = require('./template.js');
var $ = require('../setup.js');
var Accordion = require('../../../src/js/components/accordion.js');

// `aria` prefixed attributes
var EXPANDED = 'aria-expanded';
var CONTROLS = 'aria-controls';
var HIDDEN   = 'aria-hidden';

describe('Accordion component', function () {
  var $el;
  var $button;
  var $content;
  var accordion;

  beforeEach(function () {
    var $component = $(template);

    $('body').append($component);

    accordion = new Accordion($component);

    $el = accordion.$root;
    $button = $el.find('button');
    $content = $el.find('#' + $button.attr(CONTROLS));
  });   

  afterEach(function () {
    document.body.textContent = '';
  });

  it('exposes its underlying html element', function () {
    $el.should.not.be.undefined();
  });

  describe('DOM state', function () {
    it('has an "aria-expanded" attribute', function () {
      $button.attr(EXPANDED).should.not.be.undefined();
    });

    it('has an "aria-controls" attribute', function () {
      $button.attr(CONTROLS).should.not.be.undefined();
    });

    describe('when show is triggered', function () {
      beforeEach(function () {
        accordion.show($button);
      });

      afterEach(function () {
        accordion.hide($button);
      });

      it('toggles "aria-expanded" to true', function () {
        $button.attr(EXPANDED).should.equal('true');
      });

      it('toggles "aria-hidden" to false', function () {
        $content.attr(HIDDEN).should.equal('false');
      });
    });

    describe('when hide is triggered', function () {
      beforeEach(function() {
        accordion.show($button);
        accordion.hide($button);
      });

      it('toggles "aria-expanded" to false', function () {
        $button.attr(EXPANDED).should.equal('false');
      });

      it('toggles "aria-hidden" to true', function () {
        $content.attr(HIDDEN).should.equal('true');
      });
    });
  });
});

