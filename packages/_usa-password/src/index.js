import behavior from "../../uswds-core/src/js/utils/behavior";
import toggleFormInput from "../../uswds-core/src/js/utils/toggle-form-input";
import { CLICK } from "../../uswds-core/src/js/events";
import { prefix as PREFIX } from "../../uswds-core/src/js/config";

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
