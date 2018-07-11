const assert = require('assert');
const fs = require('fs');
const path = require('path');
const navigation = require('../../src/js/components/navigation');

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, '../unit/navigation/template.html'),
);

describe('1.x navigation component', () => {
  let nav;
  let overlay;
  let closeButton;
  let menuButton;

  const isVisible = el => el.classList.contains('is-visible');

  beforeEach(() => {
    document.body.innerHTML = TEMPLATE;
    nav = document.querySelector('.usa-nav');
    overlay = document.querySelector('.usa-overlay');
    closeButton = document.querySelector('.usa-nav-close');
    menuButton = document.querySelector('.usa-menu-btn');
    navigation();
  });

  afterEach(() => {
    navigation.off();
  });

  it('shows the nav when the menu button is clicked', () => {
    menuButton.click();
    assert.equal(isVisible(nav), true);
    assert.equal(isVisible(overlay), true);
  });

  it('hides the nav when the close button is clicked', () => {
    menuButton.click();
    closeButton.click();
    assert.equal(isVisible(nav), false);
    assert.equal(isVisible(overlay), false);
  });

  it('hides the nav when the overlay is clicked', () => {
    menuButton.click();
    overlay.click();
    assert.equal(isVisible(nav), false);
    assert.equal(isVisible(overlay), false);
  });

  describe('off()', () => {
    it('removes event listeners', () => {
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
      navigation();
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
