var mocha = require('mocha');
var should = require('should');
var modAttr = require('../../../src/js/utils/mod-attr');
var jsdom = require('jsdom').jsdom;
var select = require('../../../src/js/utils/select');

describe('mod-attr', function () {

  var oldDocument = global.document;

  before(function () {

    global.document = jsdom('<html><body><p id="id1" class="firstclass">first text</p><p id="id2"><div class="firstclass"></div><div class="secondclass"></div></p></body></html>');
    global.window = document.defaultView;

  });

  after(function () {
    global.document = oldDocument;
    global.window = document.defaultView;
  });

  it('returns the element passed into it', function () {

    modAttr(select('#id1'))

  });

  it('modifies a boolean attribute of a given element', function () {

    modAttr(select('#id2'), 'class', 'add', 'butts');

  });

  it('adds to a attribute of a given element non-destructively', function () {});

  it('removes from a attribute of a given element non-destructively', function () {});

});
