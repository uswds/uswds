'use strict';
const assert = require('assert');
const fs = require('fs');
const toggleFormInput = require('../../../src/js/utils/toggle-form-input');

const TEMPLATE = fs.readFileSync(__dirname + '/template.html').toString();

const CONTROL_SELECTOR = '.usa-show_multipassword';
const PASSWORD_SELECTOR = '#password';
const CONFIRM_SELECTOR = '#confirmPassword';
const HIDE_TEXT = 'Hide my typing';
const SHOW_TEXT = 'Show my typing';

describe('toggleFormInput', function () {
  const body = document.body;
  let maskControl;
  let password;
  let confirmPassword;

  beforeEach(function () {
    body.innerHTML = TEMPLATE;

    maskControl = body.querySelector(CONTROL_SELECTOR);
    password = body.querySelector(PASSWORD_SELECTOR);
    confirmPassword = body.querySelector(CONFIRM_SELECTOR);
  });

  afterEach(function () {
    body.textContent = '';
  });

  it('defaults to masked', function () {
    assert.equal(password.type, 'password');
    assert.equal(maskControl.textContent, SHOW_TEXT);
  });

  it('switches type of inputs from password to text when true', function () {
    toggleFormInput(maskControl);
    assert.equal(password.type, 'text');
    assert.equal(confirmPassword.type, 'text');
  });

  it('changes text of mask control element to match show/hide text', function () {
    toggleFormInput(maskControl);
    assert.equal(maskControl.textContent, HIDE_TEXT);

    toggleFormInput(maskControl);
    assert.equal(maskControl.textContent, SHOW_TEXT);
  });
});
