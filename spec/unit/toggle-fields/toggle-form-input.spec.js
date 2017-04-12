'use strict';
const fs = require('fs');
const $ = require('jquery');
const should = require('should');
const toggleFormInput = require('../../../src/js/utils/toggle-form-input');
const TEMPLATE = fs.readFileSync(__dirname + '/template.html').toString();

const CONTROL_SELECTOR = '.usa-show_multipassword';
const PASSWORD_SELECTOR = '#password';
const CONFIRM_SELECTOR = '#confirmPassword';
const HIDE_TEXT = 'Hide my typing';
const SHOW_TEXT = 'Show my typing';

describe('toggleFormInput', function () {
  let maskControl;
  let $password;
  let $confirmPassword;

  beforeEach(function () {
    const $body = $('body').html(TEMPLATE);

    maskControl = $body.find(CONTROL_SELECTOR).get(0);
    $password = $body.find(PASSWORD_SELECTOR);
    $confirmPassword = $body.find(CONFIRM_SELECTOR);
  });

  afterEach(function () {
    document.body.textContent = '';
  });

  it('defaults to masked', function () {
    $password.attr('type').should.equal('password');
    maskControl.textContent.should.equal(SHOW_TEXT);
  });

  it('switches type of inputs from password to text when true', function () {
    toggleFormInput(maskControl);
    $password.attr('type').should.equal('text');
    $confirmPassword.attr('type').should.equal('text');
  });

  it('changes text of mask control element to match show/hide text', function () {
    toggleFormInput(maskControl);
    maskControl.textContent.should.equal(HIDE_TEXT);

    toggleFormInput(maskControl);
    maskControl.textContent.should.equal(SHOW_TEXT);
  });
});
