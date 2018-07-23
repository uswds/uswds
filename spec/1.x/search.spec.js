const assert = require('assert');
const fs = require('fs');
const path = require('path');
const search = require('../../src/js/components/search');

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, '../unit/search/template.html'),
);

const isVisuallyHidden = el => el.hidden;

describe('search toggle', () => {
  let button;
  let form;

  beforeEach(() => {
    document.body.innerHTML = TEMPLATE;
    button = document.querySelector('.js-search-button');
    form = document.querySelector('.js-search-form');
    search();
  });

  afterEach(() => {
    search.off();
  });

  it('initializes the form as visually hidden, button visible', () => {
    assert.equal(button.hidden, false);
    assert.equal(isVisuallyHidden(form), true);
  });

  it('reveals the search form on click', () => {
    button.click();
    assert.equal(button.hidden, true);
    assert.equal(isVisuallyHidden(form), false);
  });

  it('hides the search form on second click', (done) => {
    button.click();
    setTimeout(() => {
      document.body.click();
      assert.equal(button.hidden, false);
      assert.equal(isVisuallyHidden(form), true);
      done();
    }, 0);
  });

  it('does not hide the search form when clicked directly', () => {
    button.click();
    form.click();
    assert.equal(button.hidden, true);
    assert.equal(isVisuallyHidden(form), false);
  });

  describe('off()', () => {
    it('removes click handlers', () => {
      search.off();
      button.click();
      assert.equal(button.hidden, false);
      assert.equal(isVisuallyHidden(form), true);
    });
  });
});
