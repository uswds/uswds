'use strict';
const $ = require('jquery');

const toggleFieldMask = require('../../../src/js/utils/toggle-field-mask');

describe('toggleFieldMask()', function () {
  const $text = $('<input type="text" autocapitalize="on" autocorrect="on">');
  const $password = $('<input type="password" autocapitalize="on" autocorrect="on">');

  it('switches the type of an input from text to password when true', function () {
    toggleFieldMask($text.get(0), true);
    $text.attr('type').should.equal('password');
  });

  it('switches the type of an input from password to text when false', function () {
    toggleFieldMask($password.get(0), false);
    $password.attr('type').should.equal('text');
  });
});

