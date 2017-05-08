'use strict';
const behavior = require('../utils/behavior');
const forEach = require('array-foreach');
const select = require('../utils/select');

const CLICK = require('../events').CLICK;
const PREFIX = require('../config').prefix;

const CONTEXT = 'header';
const NAV = `.${PREFIX}-nav`;
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
