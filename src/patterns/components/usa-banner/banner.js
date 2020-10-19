'use strict';

const { behavior } = require('../../../utils');
const { prefix: PREFIX } = require('../../../config');

const CLICK = 'click';

const HEADER = `.${PREFIX}-banner__header`;
const EXPANDED_CLASS = `${PREFIX}-banner__header--expanded`;

const toggleBanner = function toggleEl(event) {
  event.preventDefault();
  this.closest(HEADER).classList.toggle(EXPANDED_CLASS);
};

module.exports = behavior({
  [CLICK]: {
    [`${HEADER} [aria-controls]`]: toggleBanner
  }
});
