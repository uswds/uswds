import {behavior, toggleFormInput, events, config} from "../../utils"
const { CLICK } = events;
const { prefix: PREFIX } = config;
const LINK = `.${PREFIX}-show-password, .${PREFIX}-show-multipassword`;

function toggle(event) {
  event.preventDefault();
  toggleFormInput(this);
}

module.exports = behavior({
  [CLICK]: {
    [LINK]: toggle,
  },
});
