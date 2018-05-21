var $ = require('jquery');
var should = require('should');

var ToggleFieldMask = require('../../src/js/components/toggle-field-mask');

var $text = $('<input type="text" autocapitalize="on" autocorrect="on">');
var $password = $('<input type="password" autocapitalize="on" autocorrect="on">');

describe('ToggleFieldMask', function () {
  it('switches the type of an input from text to password when true', function () {
    ToggleFieldMask($text.get(), true);
    $text.attr('type').should.equal('password');
  });

  it('switches the type of an input from password to text when false', function () {
    ToggleFieldMask($password.get(), false); 
    $password.attr('type').should.equal('text');
  });
});
