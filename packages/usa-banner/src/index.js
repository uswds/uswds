import behavior  from "../../uswds-core/src/js/utils/behavior";
import { CLICK } from "../../uswds-core/src/js/events";
import { prefix as PREFIX } from "../../uswds-core/src/js/config";

const HEADER = `.${PREFIX}-banner__header`;
const EXPANDED_CLASS = `${PREFIX}-banner__header--expanded`;

const toggleBanner = function toggleEl(event) {
  event.preventDefault();
  this.closest(HEADER).classList.toggle(EXPANDED_CLASS);
};

export default behavior({
  [CLICK]: {
    [`${HEADER} [aria-controls]`]: toggleBanner,
  },
});
