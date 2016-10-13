var assert = require('assert');
var fs = require('fs');
var path = require('path');

var search = require('../../../src/js/components/search');
var TEMPLATE = fs.readFileSync(path.join(__dirname, 'template.html'));

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
    button = form = undefined;
    search.off();
  });

  it('does not modify the elements until clicked', function () {
    assert.equal(button.hidden, false);
    assert.equal(form.hidden, false);
  });

  it('reveals the search form on click', function () {
    button.click();
    assert.equal(button.hidden, true);
    assert.equal(form.hidden, false);
  });

  it('hides the search form on second click', function () {
    button.click();
    document.body.click();
    assert.equal(button.hidden, false);
    assert.equal(form.hidden, true);
  });

  it('does not hide the search form when clicked directly', function () {
    button.click();
    form.click();
    assert.equal(button.hidden, true);
    assert.equal(form.hidden, false);
  });

  describe('off()', function () {
    it('removes click handlers', function () {
      search.off();
      button.click();
      assert.equal(button.hidden, false);
      assert.equal(form.hidden, false);
    });
  });

});
