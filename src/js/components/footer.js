'use strict';
const accordion = require('./accordion');
const behavior = require('../utils/behavior');
const debounce = require('lodash.debounce');
const forEach = require('array-foreach');
const select = require('../utils/select');

const PREFIX = require('../config').prefix;
const HIDDEN = 'hidden';
const SCOPE = `.${PREFIX}-footer-big`;
const NAV = `${SCOPE} nav`;
const BUTTON = `${NAV} .${PREFIX}-footer-primary-link`;
const LIST = `${NAV} ul`;

const HIDE_MAX_WIDTH = 600;
const DEBOUNCE_RATE = 180;

const showPanel = function () {
  const list = this.closest(LIST);
  list.classList.remove(HIDDEN);

  const lists = list.closest(NAV)
    .querySelectorAll('ul');

  forEach(lists, el => {
    if (el !== list) {
      el.classList.add(HIDDEN);
    }
  });
};

const resize = debounce(() => {
  const hidden = window.innerWidth < HIDE_MAX_WIDTH;
  select(LIST).forEach(list => {
    list.classList.toggle(HIDDEN, hidden);
  });
}, DEBOUNCE_RATE);

module.exports = behavior({
  'click': {
    [ BUTTON ]: showPanel,
  },
}, {
  // export for use elsewhere
  HIDE_MAX_WIDTH,
  DEBOUNCE_RATE,

  init: target => {
    resize();
    window.addEventListener('resize', resize);
  },

  teardown: target => {
    window.removeEventListener('resize', resize);
  },
});
