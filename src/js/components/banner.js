const behavior = require("../utils/behavior");
const { CLICK } = require("../events");
const { prefix: PREFIX } = require("../config");

const HEADER = `.${PREFIX}-banner__header`;
const EXPANDED_CLASS = `${PREFIX}-banner__header--expanded`;

function toggleBanner(event) {
  const checkbox = event.target;
  checkbox.setAttribute('aria-expanded', checkbox.checked ? 'true' : 'false');
  this.closest(HEADER).classList.toggle(EXPANDED_CLASS);
};

module.exports = behavior({
  [CLICK]: {
    [`${HEADER} [aria-controls]`]: toggleBanner,
  },
});
