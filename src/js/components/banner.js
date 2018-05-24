'use strict';
const behavior = require('../utils/behavior');
const toggle = require('../utils/toggle');

const CLICK = require('../events').CLICK;
const PREFIX = require('../config').prefix;

const HEADER = `.${PREFIX}-banner-header`;
const EXPANDED_CLASS = `${PREFIX}-banner-header-expanded`;

const toggleBanner = function (event) {
  event.preventDefault();
  this.closest(HEADER).classList.toggle(EXPANDED_CLASS);
  return false;
};

module.exports = behavior({
  [ CLICK ]: {
    [ `${HEADER} [aria-controls]` ]: toggleBanner,
  },
});
