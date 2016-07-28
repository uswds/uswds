var mocha = require('mocha');
var should = require('should');
var dispatch = require('../../../src/js/utils/dispatch');
var sinon = require('sinon');
var jsdom = require('jsdom').jsdom;

describe('dispatch', function () {

  var oldDocument = global.document;

  after(function () {
    global.document = oldDocument;
    global.window = document.defaultView;
  });

  it('attaches an event to an element', function () {
    var element = dispatch('#butts', 'click', function (e) {
      e.preventDefault();

    });

  });

  it('detaches an event from an element', function () {});

  it('attaches an event to an element', function () {});

  it('attaches an event to an element', function () {});

  it('attaches an event to an element', function () {});

});
