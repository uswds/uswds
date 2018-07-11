const behavior = require('../utils/behavior');

const { CLICK } = require('../events');
const { prefix: PREFIX } = require('../config');

const HEADER = `.${PREFIX}-banner-header`;
const EXPANDED_CLASS = `${PREFIX}-banner-header-expanded`;

const toggleBanner = function toggleEl(event) {
  event.preventDefault();
  this.closest(HEADER).classList.toggle(EXPANDED_CLASS);

  return false;
};

module.exports = behavior({
  [CLICK]: {
    [`${HEADER} [aria-controls]`]: toggleBanner,
  },
});
