'use strict';
const behavior = require('../utils/behavior');
const forEach = require('array-foreach');
const select = require('../utils/select');
const accordion = require('./accordion');

const CLICK = require('../events').CLICK;
const PREFIX = require('../config').prefix;

const NAV = `.${PREFIX}-nav`;
const NAV_LINKS = `${NAV} a`;
const OPENERS = `.${PREFIX}-menu-btn`;
const CLOSE_BUTTON = `.${PREFIX}-nav-close`;
const OVERLAY = `.${PREFIX}-overlay`;
const CLOSERS = `${CLOSE_BUTTON}, .${PREFIX}-overlay`;
const TOGGLES = [ NAV, OVERLAY ].join(', ');

const ACTIVE_CLASS = 'usa-mobile_nav-active';
const VISIBLE_CLASS = 'is-visible';

const isActive = () => document.body.classList.contains(ACTIVE_CLASS);

const _focusTrap = (trapContainer) => {
  // Find all focusable children
  const focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
  const focusableElements = trapContainer.querySelectorAll(focusableElementsString);
  const firstTabStop = focusableElements[ 0 ];
  const lastTabStop = focusableElements[ focusableElements.length - 1 ];

  function trapTabKey (e) {
    // Check for TAB key press
    if (e.keyCode === 9) {

      // SHIFT + TAB
      if (e.shiftKey) {
        if (document.activeElement === firstTabStop) {
          e.preventDefault();
          lastTabStop.focus();
        }

      // TAB
      } else {
        if (document.activeElement === lastTabStop) {
          e.preventDefault();
          firstTabStop.focus();
        }
      }
    }

    // ESCAPE
    if (e.keyCode === 27) {
      toggleNav.call(this, false);
    }
  }

  // Focus first child
  firstTabStop.focus();

  return {
    enable () {
      // Listen for and trap the keyboard
      trapContainer.addEventListener('keydown', trapTabKey);
    },

    release () {
      trapContainer.removeEventListener('keydown', trapTabKey);
    },
  };
};

let focusTrap;

const toggleNav = function (active) {
  const body = document.body;
  if (typeof active !== 'boolean') {
    active = !isActive();
  }
  body.classList.toggle(ACTIVE_CLASS, active);

  forEach(select(TOGGLES), el => {
    el.classList.toggle(VISIBLE_CLASS, active);
  });

  if (active) {
    focusTrap.enable();
  } else {
    focusTrap.release();
  }

  const closeButton = body.querySelector(CLOSE_BUTTON);
  const menuButton = body.querySelector(OPENERS);

  if (active && closeButton) {
    // The mobile nav was just activated, so focus on the close button,
    // which is just before all the nav elements in the tab order.
    closeButton.focus();
  } else if (!active && document.activeElement === closeButton &&
             menuButton) {
    // The mobile nav was just deactivated, and focus was on the close
    // button, which is no longer visible. We don't want the focus to
    // disappear into the void, so focus on the menu button if it's
    // visible (this may have been what the user was just focused on,
    // if they triggered the mobile nav by mistake).
    menuButton.focus();
  }

  return active;
};

const resize = () => {
  const closer = document.body.querySelector(CLOSE_BUTTON);

  if (isActive() && closer && closer.getBoundingClientRect().width === 0) {
    // The mobile nav is active, but the close box isn't visible, which
    // means the user's viewport has been resized so that it is no longer
    // in mobile mode. Let's make the page state consistent by
    // deactivating the mobile nav.
    toggleNav.call(closer, false);
  }
};

const navigation = behavior({
  [ CLICK ]: {
    [ OPENERS ]: toggleNav,
    [ CLOSERS ]: toggleNav,
    [ NAV_LINKS ]: function () {
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
        toggleNav.call(this, false);
      }
    },
  },
}, {
  init () {
    const trapContainer = document.querySelector(NAV);

    if (trapContainer) {
      focusTrap = _focusTrap(trapContainer);
    }

    resize();
    window.addEventListener('resize', resize, false);
  },
  teardown () {
    window.removeEventListener('resize', resize, false);
  },
});

/**
 * TODO for 2.0, remove this statement and export `navigation` directly:
 *
 * module.exports = behavior({...});
 */
const assign = require('object-assign');
module.exports = assign(
  el => navigation.on(el),
  navigation
);
