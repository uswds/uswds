const behavior = require("../../uswds-core/src/js/utils/behavior");
const { CLICK } = require("../../uswds-core/src/js/events");
const { prefix: PREFIX } = require("../../uswds-core/src/js/config");
// const select = require("../../uswds-core/src/js/utils/select");
const accordion = require("../../usa-accordion/src/index");

const HEADER = `.${PREFIX}-banner__header`;
const EXPANDED_CLASS = `${PREFIX}-banner__header--expanded`;
// const EXPANDED = "aria-expanded";
// const BUTTON = `.${PREFIX}-banner__button[aria-controls]`;

const toggleBanner = function toggleEl(event) {
  event.preventDefault();
  this.closest(HEADER).classList.toggle(EXPANDED_CLASS);
};

const banner = behavior(
  {
    [CLICK]: {
      [`${HEADER} [aria-controls]`]: toggleBanner,
    },
  },
  {
    init(root) {
      accordion.on(root);
    }
  }
);

module.exports = banner;
