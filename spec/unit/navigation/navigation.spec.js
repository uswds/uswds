'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const sinon = require('sinon');
const navigation = require('../../../src/js/components/navigation');
const accordion = require('../../../src/js/components/accordion');

const TEMPLATE = fs.readFileSync(path.join(__dirname, 'template.html'));

describe('navigation toggle', function () {
  const body = document.body;

  let sandbox;
  let nav;
  let overlay;
  let closeButton;
  let menuButton;
  let accordionButton;
  let navLink;

  const isVisible = (el) => {
    return el.classList.contains('is-visible');
  };

  beforeEach(function () {
    body.innerHTML = TEMPLATE;
    accordion.on();
    navigation.on();
    nav = body.querySelector('.usa-nav');
    overlay = body.querySelector('.usa-overlay');
    closeButton = body.querySelector('.usa-nav-close');
    menuButton = body.querySelector('.usa-menu-btn');
    accordionButton = nav.querySelector('.usa-accordion-button');
    navLink = nav.querySelector('a');
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    body.innerHTML = '';
    body.className = '';
    navigation.off();
    accordion.off();
    sandbox.restore();
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

  it('hides the nav when a nav link is clicked', function () {
    menuButton.click();
    navLink.click();
    assert.equal(isVisible(nav), false);
  });

  it('focuses the close button when the menu button is clicked', function () {
    menuButton.click();
    assert.equal(document.activeElement, closeButton);
  });

  it('focuses the menu button when the close button is clicked', function () {
    menuButton.click();
    closeButton.click();
    assert.equal(document.activeElement, menuButton);
  });

  it('collapses nav if needed on window resize', function () {
    menuButton.click();
    sandbox.stub(closeButton, 'getBoundingClientRect').returns({ width: 0 });
    window.dispatchEvent(new CustomEvent('resize'));
    assert.equal(isVisible(nav), false);
  });

  it('does not collapse nav if not needed on window resize', function () {
    menuButton.click();
    sandbox.stub(closeButton, 'getBoundingClientRect').returns({ width: 100 });
    window.dispatchEvent(new CustomEvent('resize'));
    assert.equal(isVisible(nav), true);
  });

  it('does not show the nav when a nav link is clicked', function () {
    navLink.click();
    assert.equal(isVisible(nav), false);
  });

  it('collapses accordions when a nav link is clicked', function () {
    accordionButton.click();
    navLink.click();
    assert.equal(accordionButton.getAttribute('aria-expanded'), 'false');
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
