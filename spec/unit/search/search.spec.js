const assert = require('assert');
const fs = require('fs');
const path = require('path');
const search = require('../../../src/js/components/search');

const TEMPLATE = fs.readFileSync(path.join(__dirname, 'template.html'));

const isVisuallyHidden = el => el.hidden;

describe('search toggle', () => {
  const { body } = document;

  let button;
  let form;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    button = body.querySelector('.js-search-button');
    form = body.querySelector('.js-search-form');
    search.on();
  });

  afterEach(() => {
    body.innerHTML = '';
    search.off();
  });

  it('initializes the form as visually hidden, button visible', () => {
    assert.equal(button.hidden, false, 'button is hidden');
    assert.equal(isVisuallyHidden(form), true, 'form is still visible');
  });

  it('reveals the search form on click', () => {
    button.click();
    assert.equal(button.hidden, true, 'button is still visible');
    assert.equal(isVisuallyHidden(form), false, 'form is not hidden');
  });

  it('hides the search form on second click', (done) => {
    button.click();
    setTimeout(() => {
      body.click();
      assert.equal(button.hidden, false, 'button is hidden');
      assert.equal(isVisuallyHidden(form), true, 'form is still visible');
      done();
    }, 0);
  });

  it('does not hide the search form when clicked directly', () => {
    button.click();
    form.click();
    assert.equal(button.hidden, true, 'button is still visible');
    assert.equal(isVisuallyHidden(form), false, 'form is not hidden');
  });

  it('hides the search form after clicking in the form', (done) => {
    button.click();
    form.click();
    assert.equal(button.hidden, true, 'button is not hidden');
    assert.equal(isVisuallyHidden(form), false, 'form is hidden');
    setTimeout(() => {
      body.click();
      assert.equal(button.hidden, false, 'button is still visible');
      assert.equal(isVisuallyHidden(form), true, 'form is not hidden');
      done();
    }, 0);
  });

  describe('off()', () => {
    it('removes click handlers', () => {
      search.off();
      button.click();
      assert.equal(button.hidden, false, 'button is hidden');
      assert.equal(isVisuallyHidden(form), true, 'form is still visible');
    });
  });
});
