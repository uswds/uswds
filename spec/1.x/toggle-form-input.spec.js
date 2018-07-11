const $ = require('jquery');
const fs = require('fs');
const path = require('path');
const ToggleFormInput = require('../../src/js/components/toggle-form-input');

const template = fs.readFileSync(
  path.join(__dirname, '../unit/toggle-fields/template.html'),
).toString();

/**
 * Fire an addEventListener()-added click event in jsdom
 * See http://stackoverflow.com/a/27557936/9070
 */
const click = (jqEl) => {
  const el = jqEl.get(0);
  const evt = document.createEvent('HTMLEvents');
  evt.initEvent('click', false, true);
  el.dispatchEvent(evt);
};

const CONTROL_SELECTOR = '.usa-show_multipassword';
const PASSWORD_SELECTOR = '#password';
const CONFIRM_SELECTOR = '#confirmPassword';
const SHOW_TEXT = 'Show my typing';
const HIDE_TEXT = 'Hide my typing';

describe('ToggleFormInput', () => {
  let $maskControl;
  let $password;
  let $confirmPassword;

  beforeEach(() => {
    const $component = $(template);
    $('body').append($component);

    $maskControl = $component.find(CONTROL_SELECTOR);
    $password = $component.find(PASSWORD_SELECTOR);
    $confirmPassword = $component.find(CONFIRM_SELECTOR);

    ToggleFormInput($maskControl.get(0), SHOW_TEXT, HIDE_TEXT);
  });

  afterEach(() => {
    document.body.textContent = '';
  });

  it('defaults to masked', () => {
    $password.attr('type').should.equal('password');
    $maskControl.text().should.equal(SHOW_TEXT);
  });

  it('switches type of inputs from password to text when true', () => {
    click($maskControl);
    $password.attr('type').should.equal('text');
    $confirmPassword.attr('type').should.equal('text');
  });

  it('changes text of mask control element to match show/hide text', () => {
    click($maskControl);
    $maskControl.text().should.equal(HIDE_TEXT);

    click($maskControl);
    $maskControl.text().should.equal(SHOW_TEXT);
  });
});
