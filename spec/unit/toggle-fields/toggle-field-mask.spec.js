'use strict';
const assert = require('assert');

const toggleFieldMask = require('../../../src/js/utils/toggle-field-mask');

const fromHTML = html => {
  const el = document.createElement('div');
  el.innerHTML = html;
  return el.firstChild;
};

describe('toggleFieldMask()', function () {
  const text = fromHTML(
    '<input type="text" autocapitalize="on" autocorrect="on">'
  );
  const password = fromHTML(
    '<input type="password" autocapitalize="on" autocorrect="on">'
  );

  it('switches the type of an input from text to password when true', function () {
    toggleFieldMask(text, true);
    assert.equal(text.getAttribute('type'), 'password');
  });

  it('switches the type of an input from password to text when false', function () {
    toggleFieldMask(password, false);
    assert.equal(password.getAttribute('type'), 'text');
  });
});

