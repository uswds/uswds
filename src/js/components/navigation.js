'use strict';
const behavior = require('../utils/behavior');
const select = require('../utils/select');

const PREFIX = 'usa';
const CONTEXT = 'header';
const NAV = `.${PREFIX}-nav`;
const OPENERS = `.${PREFIX}-menu-btn`;
const CLOSE_BUTTON = `.${PREFIX}-nav-close`;
const OVERLAY = `.${PREFIX}-overlay`;
const CLOSERS = `${CLOSE_BUTTON}, .${PREFIX}-overlay`;
const TOGGLES = [NAV, OVERLAY].join(', ');

const ACTIVE_CLASS = 'usa-mobile_nav-active';
const VISIBLE_CLASS = 'is-visible';

const toggleNav = function(active) {
  const body = document.body;
  if (typeof active !== 'boolean') {
    active = !body.classList.contains(ACTIVE_CLASS);
  }
  body.classList.toggle(ACTIVE_CLASS, active);

  const context = this.closest(CONTEXT);
  select(TOGGLES).forEach(el => {
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

const CLICK = ('ontouchstart' in document.documentElement)
  ? 'touchstart'
  : 'click';

module.exports = behavior({
  [CLICK]: {
    [OPENERS]: toggleNav,
    [CLOSERS]: toggleNav,
  }
});
