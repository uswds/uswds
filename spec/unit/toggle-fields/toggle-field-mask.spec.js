'use strict';
const assert = require('assert');

const toggleFieldMask = require('../../../src/js/utils/toggle-field-mask');

const create = (name, attrs) => {
  const el = document.createElement(name);
  for (const attr in attrs) {
    el.setAttribute(attr, attrs[ attr ]);
  }
  return el;
};

describe('toggleFieldMask()', function () {

  it('switches the type of an input from text to password when true', function () {
    const text = create('input', {
      type: 'text',
      autocapitalize: 'off',
      autocorrect: 'off',
    });
    toggleFieldMask(text, true);
    assert.equal(text.getAttribute('type'), 'password');
  });

  it('switches the type of an input from password to text when false', function () {
    const password = create('input', {
      type: 'password',
      autocapitalize: 'off',
      autocorrect: 'off',
    });
    toggleFieldMask(password, false);
    assert.equal(password.getAttribute('type'), 'text');
  });
});

