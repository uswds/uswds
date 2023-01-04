import behavior from "../../uswds-core/src/js/utils/behavior.mjs";
import toggleFormInput from "../../uswds-core/src/js/utils/toggle-form-input.mjs";
import { CLICK } from "../../uswds-core/src/js/events.mjs";
import { prefix as PREFIX } from "../../uswds-core/src/js/config.mjs";

const LINK = `.${PREFIX}-show-password`;

function toggle(event) {
  event.preventDefault();
  toggleFormInput(this);
}

export default behavior({
  [CLICK]: {
    [LINK]: toggle,
  },
});
