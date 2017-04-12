'use strict';
const behavior = require('../utils/behavior');
const toggle = require('./toggle');

const PREFIX = require('../config').prefix;
const HEADER = `.${PREFIX}-banner-header`;
const EXPANDED_CLASS = `${PREFIX}-banner-header-expanded`;

const toggleBanner = function (event) {
  event.preventDefault();
  this.closest(HEADER).classList.toggle(EXPANDED_CLASS);
  return false;
};

const CLICK = ('ontouchstart' in document.documentElement)
  ? 'touchstart'
  : 'click';

module.exports = behavior({
  [ CLICK ]: {
    [ `${HEADER} [aria-controls]` ]: toggleBanner,
  },
});
