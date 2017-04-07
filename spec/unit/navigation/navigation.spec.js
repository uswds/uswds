'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const navigation = require('../../../src/js/components/navigation');

const TEMPLATE = fs.readFileSync(path.join(__dirname, 'template.html'));

describe('navigation toggle', function () {
  const body = document.body;

  let nav;
  let overlay;
  let closeButton;
  let menuButton;

  const isVisible = (el) => {
    return el.classList.contains('is-visible');
  };

  beforeEach(function () {
    body.innerHTML = TEMPLATE;
    navigation.on();
    nav = body.querySelector('.usa-nav');
    overlay = body.querySelector('.usa-overlay');
    closeButton = body.querySelector('.usa-nav-close');
    menuButton = body.querySelector('.usa-menu-btn');
  });

  afterEach(function () {
    body.innerHTML = '';
    body.className = '';
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
    it('removes event listeners', function () {
      assert.equal(isVisible(nav), false);
      assert.equal(isVisible(overlay), false);

      // remove event listeners, then click the button,
      // and confirm that the nav is still hidden
      navigation.off();
      menuButton.click();
      assert.equal(isVisible(nav), false);
      assert.equal(isVisible(overlay), false);

      // next, re-enable the event listeners, click the button,
      // and confirm that the nav is visible again
      navigation.on();
      menuButton.click();
      assert.equal(isVisible(nav), true);
      assert.equal(isVisible(overlay), true);

      // again, remove the event listeners, click the close button,
      // and confirm that everything is still visible
      navigation.off();
      closeButton.click();
      assert.equal(isVisible(nav), true);
      assert.equal(isVisible(overlay), true);
    });
  });

});
