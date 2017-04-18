'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const search = require('../../../src/js/components/search');
const TEMPLATE = fs.readFileSync(path.join(__dirname, 'template.html'));
const VISUALLY_HIDDEN = 'usa-sr-only';

const isVisuallyHidden = el => {
  return el.classList.contains(VISUALLY_HIDDEN);
};

describe('search toggle', function () {
  let button;
  let form;

  const body = document.body;

  beforeEach(function () {
    body.innerHTML = TEMPLATE;
    button = body.querySelector('.js-search-button');
    form = body.querySelector('.js-search-form');
    search.on();
  });

  afterEach(function () {
    body.innerHTML = '';
    search.off();
  });

  it('initializes the form as visually hidden, button visible', function () {
    assert.equal(button.hidden, false, 'button is hidden');
    assert.equal(isVisuallyHidden(form), true, 'form is still visible');
  });

  it('reveals the search form on click', function () {
    button.click();
    assert.equal(button.hidden, true, 'button is still visible');
    assert.equal(isVisuallyHidden(form), false, 'form is not hidden');
  });

  it('hides the search form on second click', function () {
    button.click();
    body.click();
    assert.equal(button.hidden, false, 'button is hidden');
    assert.equal(isVisuallyHidden(form), true, 'form is still visible');
  });

  it('does not hide the search form when clicked directly', function () {
    button.click();
    form.click();
    assert.equal(button.hidden, true, 'button is still visible');
    assert.equal(isVisuallyHidden(form), false, 'form is not hidden');
  });

  it('hides the search form after clicking in the form', function () {
    button.click();
    form.click();
    assert.equal(button.hidden, true, 'button is not hidden');
    assert.equal(isVisuallyHidden(form), false, 'form is hidden');
    body.click();
    assert.equal(button.hidden, false, 'button is still visible');
    assert.equal(isVisuallyHidden(form), true, 'form is not hidden');
  });

  describe('off()', function () {
    it('removes click handlers', function () {
      search.off();
      button.click();
      assert.equal(button.hidden, false, 'button is hidden');
      assert.equal(isVisuallyHidden(form), true, 'form is still visible');
    });
  });

});
