const assign = require('object-assign');
const forEach = require('array-foreach');
const behavior = require('../utils/behavior');
const select = require('../utils/select');
const FocusTrap = require('../utils/focus-trap');
const accordion = require('./accordion');

const { CLICK } = require('../events');
const { prefix: PREFIX } = require('../config');

const NAV = `.${PREFIX}-nav`;
const NAV_LINKS = `${NAV} a`;
const OPENERS = `.${PREFIX}-menu-btn`;
const CLOSE_BUTTON = `.${PREFIX}-nav-close`;
const OVERLAY = `.${PREFIX}-overlay`;
const CLOSERS = `${CLOSE_BUTTON}, .${PREFIX}-overlay`;
const TOGGLES = [NAV, OVERLAY].join(', ');

const ACTIVE_CLASS = 'usa-mobile_nav-active';
const VISIBLE_CLASS = 'is-visible';

let navigation;

const isActive = () => document.body.classList.contains(ACTIVE_CLASS);

const toggleNav = function (active) {
  const { body } = document;
  const safeActive = typeof active === 'boolean' ? active : !isActive();

  body.classList.toggle(ACTIVE_CLASS, safeActive);

  forEach(select(TOGGLES), el => el.classList.toggle(VISIBLE_CLASS, safeActive));

  navigation.focusTrap.update(safeActive);

  const closeButton = body.querySelector(CLOSE_BUTTON);
  const menuButton = body.querySelector(OPENERS);

  if (safeActive && closeButton) {
    // The mobile nav was just activated, so focus on the close button,
    // which is just before all the nav elements in the tab order.
    closeButton.focus();
  } else if (!safeActive && document.activeElement === closeButton && menuButton) {
    // The mobile nav was just deactivated, and focus was on the close
    // button, which is no longer visible. We don't want the focus to
    // disappear into the void, so focus on the menu button if it's
    // visible (this may have been what the user was just focused on,
    // if they triggered the mobile nav by mistake).
    menuButton.focus();
  }

  return safeActive;
};

const resize = () => {
  const closer = document.body.querySelector(CLOSE_BUTTON);

  if (isActive() && closer && closer.getBoundingClientRect().width === 0) {
    // The mobile nav is active, but the close box isn't visible, which
    // means the user's viewport has been resized so that it is no longer
    // in mobile mode. Let's make the page state consistent by
    // deactivating the mobile nav.
    navigation.toggleNav.call(closer, false);
  }
};

const onMenuClose = () => navigation.toggleNav.call(navigation, false);

navigation = behavior({
  [CLICK]: {
    [OPENERS]: toggleNav,
    [CLOSERS]: toggleNav,
    [NAV_LINKS]() {
      // A navigation link has been clicked! We want to collapse any
      // hierarchical navigation UI it's a part of, so that the user
      // can focus on whatever they've just selected.

      // Some navigation links are inside accordions; when they're
      // clicked, we want to collapse those accordions.
      const acc = this.closest(accordion.ACCORDION);

      if (acc) {
        accordion.getButtons(acc).forEach(btn => accordion.hide(btn));
      }

      // If the mobile navigation menu is active, we want to hide it.
      if (isActive()) {
        navigation.toggleNav.call(navigation, false);
      }
    },
  },
}, {
  init() {
    const trapContainer = document.querySelector(NAV);

    if (trapContainer) {
      navigation.focusTrap = FocusTrap(trapContainer, {
        Escape: onMenuClose,
      });
    }

    resize();
    window.addEventListener('resize', resize, false);
  },
  teardown() {
    window.removeEventListener('resize', resize, false);
  },
  focusTrap: null,
  toggleNav,
});

/**
 * TODO for 2.0, remove this statement and export `navigation` directly:
 *
 * module.exports = behavior({...});
 */
module.exports = assign(
  el => navigation.on(el),
  navigation
);
