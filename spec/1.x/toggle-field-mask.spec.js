const $ = require('jquery');
const ToggleFieldMask = require('../../src/js/components/toggle-field-mask');

const $text = $('<input type="text" autocapitalize="on" autocorrect="on">');
const $password = $('<input type="password" autocapitalize="on" autocorrect="on">');

describe('ToggleFieldMask', () => {
  it('switches the type of an input from text to password when true', () => {
    ToggleFieldMask($text.get(), true);
    $text.attr('type').should.equal('password');
  });

  it('switches the type of an input from password to text when false', () => {
    ToggleFieldMask($password.get(), false);
    $password.attr('type').should.equal('text');
  });
});
