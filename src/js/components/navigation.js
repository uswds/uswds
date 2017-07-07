'use strict';
const behavior = require('../utils/behavior');
const forEach = require('array-foreach');
const select = require('../utils/select');
const accordion = require('./accordion');

const CLICK = require('../events').CLICK;
const PREFIX = require('../config').prefix;

const CONTEXT = 'header';
const NAV = `.${PREFIX}-nav`;
const NAV_LINKS = `${NAV} a`;
const OPENERS = `.${PREFIX}-menu-btn`;
const CLOSE_BUTTON = `.${PREFIX}-nav-close`;
const OVERLAY = `.${PREFIX}-overlay`;
const CLOSERS = `${CLOSE_BUTTON}, .${PREFIX}-overlay`;
const TOGGLES = [ NAV, OVERLAY ].join(', ');

const ACTIVE_CLASS = 'usa-mobile_nav-active';
const VISIBLE_CLASS = 'is-visible';

const toggleNav = function (active) {
  const body = document.body;
  if (typeof active !== 'boolean') {
    active = !body.classList.contains(ACTIVE_CLASS);
  }
  body.classList.toggle(ACTIVE_CLASS, active);

  const context = this.closest(CONTEXT);
  forEach(select(TOGGLES), el => {
    el.classList.toggle(VISIBLE_CLASS);
  });

  if (active && context) {
    const closeButton = context.querySelector(CLOSE_BUTTON);
    if (closeButton) {
      closeButton.focus();
    }
  }
  return active;
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
      if (document.body.classList.contains(ACTIVE_CLASS)) {
        toggleNav.call(this);
      }
    },
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
