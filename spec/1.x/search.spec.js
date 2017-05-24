var assert = require('assert');
var fs = require('fs');
var path = require('path');

var search = require('../../src/js/components/search');
var TEMPLATE = fs.readFileSync(
  path.join(__dirname, '../unit/search/template.html')
);

var isVisuallyHidden = function (el) {
  return el.classList.contains('usa-sr-only');
};

describe('search toggle', function () {
  var button;
  var form;

  beforeEach(function () {
    document.body.innerHTML = TEMPLATE;
    button = document.querySelector('.js-search-button');
    form = document.querySelector('.js-search-form');
    search();
  });

  afterEach(function () {
    search.off();
  });

  it('initializes the form as visually hidden, button visible', function () {
    assert.equal(button.hidden, false);
    assert.equal(isVisuallyHidden(form), true);
  });

  it('reveals the search form on click', function () {
    button.click();
    assert.equal(button.hidden, true);
    assert.equal(isVisuallyHidden(form), false);
  });

  it('hides the search form on second click', function () {
    button.click();
    document.body.click();
    assert.equal(button.hidden, false);
    assert.equal(isVisuallyHidden(form), true);
  });

  it('does not hide the search form when clicked directly', function () {
    button.click();
    form.click();
    assert.equal(button.hidden, true);
    assert.equal(isVisuallyHidden(form), false);
  });

  describe('off()', function () {
    it('removes click handlers', function () {
      search.off();
      button.click();
      assert.equal(button.hidden, false);
      assert.equal(isVisuallyHidden(form), true);
    });
  });

});
