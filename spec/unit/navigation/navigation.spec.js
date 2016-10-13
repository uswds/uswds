var assert = require('assert');
var fs = require('fs');
var path = require('path');

var navigation = require('../../../src/js/components/navigation');
var TEMPLATE = fs.readFileSync(path.join(__dirname, 'template.html'));

describe('navigation toggle', function () {
  var nav;
  var overlay;
  var closeButton;
  var menuButton;

  var isVisible = function (el) {
    return el.classList.contains('is-visible');
  };

  beforeEach(function () {
    document.body.innerHTML = TEMPLATE;
    nav = document.querySelector('.usa-nav');
    overlay = document.querySelector('.usa-overlay');
    closeButton = document.querySelector('.usa-nav-close');
    menuButton = document.querySelector('.usa-menu-btn');
    navigation();
  });

  afterEach(function () {
    nav = overlay = closeButton = undefined;
    navigation.off();
  });

  it('shows the nav when the menu button is clicked', function () {
    menuButton.click();
    assert.equal(isVisible(nav), true);
    assert.equal(isVisible(overlay), true);
  });

  it('hides the nav when the close button is clicked', function () {
    menuButton.click();
    closeButton.click();
    assert.equal(isVisible(nav), false);
    assert.equal(isVisible(overlay), false);
  });

  it('hides the nav when the overlay is clicked', function () {
    menuButton.click();
    overlay.click();
    assert.equal(isVisible(nav), false);
    assert.equal(isVisible(overlay), false);
  });

  describe('off()', function () {
  });

});
