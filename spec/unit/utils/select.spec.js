var should = require('should');
var select = require('../../../src/js/utils/select');
var jsdom = require('jsdom').jsdom;

describe('select', function () {

  var oldDocument = global.document;

  after(function () {
    global.document = oldDocument;
    global.window = document.defaultView;
  });

  it('returns an empty array if given a non-string selector', function () {
    select(undefined).should.be.Array().which.is.empty();
  });

  it('returns an Array of selected DOM elements', function () {

    global.document = jsdom('<html><body><p id="id1" class="firstclass">first text</p><p id="id2"><div class="firstclass"></div><div class="secondclass"></div></p></body></html>');
    global.window = document.defaultView;

    select('#id1').should.be.Array().which.has.length(1);
    select('.firstclass').should.be.Array().which.has.length(2);

  });

  it('returns an Array of selected DOM elements in a particular context', function () {

    global.document = jsdom('<html><body><p id="id1" class="firstclass">first text</p><p id="id2"><div class="firstclass"></div><div class="secondclass"></div></p></body></html>');
    global.window = document.defaultView;

    select('.secondclass', select('.firstclass')).should.be.Array().which.has.length(1);

  });

});
