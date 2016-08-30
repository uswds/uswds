var mocha = require('mocha');
var should = require('should');
var $ = require('../setup.js');
var removeClass = require('../../../src/js/utils/remove-class');
var jsdom = require('jsdom').jsdom;

describe('removeClass', function () {

  var oldDocument = global.document;

  after(function () {
    global.document = oldDocument;
    global.window = document.defaultView;
  });

  it('removes the class from an element with one class', function () {
    $('body').append($('<div id="id1" class="myclass"></div>'));
    var div = $('#id1').get()[ 0 ];
    removeClass(div, 'myclass');
    $('#id1').hasClass('myclass').should.be.false();
  });

  it('removes a class from an element that has other classes', function () {
    $('body').append($('<div id="id2" class="bish bosh myclass"></div>'));
    var div = $('#id2').get()[ 0 ];
    removeClass(div, 'myclass');
    $('#id2').hasClass('bish').should.be.true();
    $('#id2').hasClass('bosh').should.be.true();
    $('#id2').hasClass('myclass').should.be.false();
  });

  it('removes a class that appears multiple times', function () {
    $('body').append($('<div id="id3" class="bish myclass bosh myclass"></div>'));
    var div = $('#id3').get()[ 0 ];
    removeClass(div, 'myclass');
    $('#id2').hasClass('myclass').should.be.false();
  });

});
