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
    var element = document.body;
    var flag = false;
    var listener = function (e) { flag = true; };
    var dispatcher = dispatch(element, 'click', listener);
    click(element);
    flag.should.equal(true);
    dispatcher.off();
  });

  describe('it returns an object which', function () {
    it('contains an "off" method for detaching the listener', function () {
      // confirm that the listener has been added
      var element = document.body;
      var flag = false;
      var listener = function (e) { flag = true; };
      var dispatcher = dispatch(element, 'click', listener);
      click(element);
      flag.should.equal(true);
      // now detach it
      flag = false;
      dispatcher.off();
      click(element);
      flag.should.equal(false);
    });

    it('contains a "trigger" method for calling the listener', function () {
      var element = document.body;
      var flag = false;
      var listener = function (e) { flag = true; };
      var dispatcher = dispatch(element, 'click', listener);
      dispatcher.trigger();
      flag.should.equal(true);
      dispatcher.off();      
    });
  });
});

function click(el) {
  var evt = document.createEvent("HTMLEvents");
  evt.initEvent("click", false, true);
  el.dispatchEvent(evt);
}
