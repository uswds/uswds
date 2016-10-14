var $ = require('jquery');
var should = require('should');
var ToggleFormInput = require('../../../src/js/components/toggle-form-input');
var template = require('./template.js');

var CONTROL_SELECTOR = '.usa-show_multipassword';
var PASSWORD_SELECTOR = '#password';
var CONFIRM_SELECTOR = '#confirmPassword';
var SHOW_TEXT = 'Show my typing';
var HIDE_TEXT = 'Hide my typing';

describe('ToggleFormInput', function () {
  var $maskControl;
  var $password;
  var $confirmPassword;

  beforeEach(function () {
    var $component = $(template);
    $('body').append($component);

    $maskControl = $component.find(CONTROL_SELECTOR);
    $password = $component.find(PASSWORD_SELECTOR);
    $confirmPassword = $component.find(CONFIRM_SELECTOR);

    ToggleFormInput($maskControl.get(0), SHOW_TEXT, HIDE_TEXT);
  });

  afterEach(function () {
    document.body.textContent = '';
  });

  it('defaults to masked', function () {
    $password.attr('type').should.equal('password');
    $maskControl.text().should.equal(SHOW_TEXT);
  });

  it('switches type of inputs from password to text when true', function () {
    click($maskControl);
    $password.attr('type').should.equal('text');
    $confirmPassword.attr('type').should.equal('text');
  });

  it('changes text of mask control element to match show/hide text', function () {
    click($maskControl);
    $maskControl.text().should.equal(HIDE_TEXT);

    click($maskControl);
    $maskControl.text().should.equal(SHOW_TEXT);
  });
});

/**
 * Fire an addEventListener()-added click event in jsdom
 * See http://stackoverflow.com/a/27557936/9070
 */
function click (jqEl) {
  var el = jqEl.get(0);
  var evt = document.createEvent('HTMLEvents');
  evt.initEvent('click', false, true);
  el.dispatchEvent(evt);
}
