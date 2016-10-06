var should = require('should');
var $ = require('jquery');
var addClass = require('../../../src/js/utils/add-class');

describe('addClass', function () {

  var oldDocument = global.document;

  after(function () {
    global.document = oldDocument;
    global.window = document.defaultView;
  });

  it('adds a class to a class-less element', function () {
    $('body').append($('<div id="id1"></div>'));
    var div = $('#id1').get(0);
    addClass(div, 'myclass');
    $('#id1').hasClass('myclass').should.be.true();
  });

  it('adds a class to an element that already has classes', function () {
    $('body').append($('<div id="id2" class="bish bosh"></div>'));
    var div = $('#id2').get(0);
    addClass(div, 'myclass');
    $('#id2').hasClass('bish').should.be.true();
    $('#id2').hasClass('bosh').should.be.true();
    $('#id2').hasClass('myclass').should.be.true();
  });

});
