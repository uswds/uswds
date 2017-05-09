'use strict';
const assert = require('assert');

const toggleFieldMask = require('../../../src/js/utils/toggle-field-mask');

const fromHTML = html => {
  const el = document.createElement('div');
  el.innerHTML = html;
  return el.querySelector('*');
};

describe('toggleFieldMask()', function () {

  it('switches the type of an input from text to password when true', function () {
    const text = fromHTML(
      '<input type="text" autocapitalize="on" autocorrect="on">'
    );
    toggleFieldMask(text, true);
    assert.equal(text.getAttribute('type'), 'password');
  });

  it('switches the type of an input from password to text when false', function () {
    const password = fromHTML(
      '<input type="password" autocapitalize="on" autocorrect="on">'
    );
    toggleFieldMask(password, false);
    assert.equal(password.getAttribute('type'), 'text');
  });
});

