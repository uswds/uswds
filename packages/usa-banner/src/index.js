const behavior = require("../../uswds-core/src/js/utils/behavior");
const select = require("../../uswds-core/src/js/utils/select");
const { CLICK } = require("../../uswds-core/src/js/events");
const { prefix: PREFIX } = require("../../uswds-core/src/js/config");
const toggle = require("../../uswds-core/src/js/utils/toggle");

const HEADER = `.${PREFIX}-banner__header`;
const EXPANDED_CLASS = `${PREFIX}-banner__header--expanded`;
const BANNER_BUTTON = `${HEADER} [aria-controls]`;

/**
 * Toggle Banner display and class.
 * @param {Event} event
 */
const toggleBanner = function toggleEl(event) {
  event.preventDefault();
  const trigger = event.target.closest(BANNER_BUTTON);

  toggle(trigger);
  this.closest(HEADER).classList.toggle(EXPANDED_CLASS);
};

module.exports = behavior(
  {
    [CLICK]: {
      [BANNER_BUTTON]: toggleBanner,
    },
  },
  {
    init(root) {
      select(BANNER_BUTTON, root).forEach((button) => {
        const expanded = button.getAttribute(EXPANDED_CLASS) === "true";
        toggle(button, expanded);
      });
    },
  },
);
