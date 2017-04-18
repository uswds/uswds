'use strict';
const behavior = require('../utils/behavior');
const filter = require('array-filter');
const forEach = require('array-foreach');
const select = require('../utils/select');
const toggle = require('../utils/toggle');

const CLICK = require('../events').CLICK;
const PREFIX = require('../config').prefix;

// XXX match .usa-accordion and .usa-accordion-bordered
const ACCORDION = `.${PREFIX}-accordion, .${PREFIX}-accordion-bordered`;
const BUTTON = `.${PREFIX}-accordion-button[aria-controls]`;
const EXPANDED = 'aria-expanded';
const MULTISELECTABLE = 'aria-multiselectable';

/**
 * Toggle a button's "pressed" state, optionally providing a target
 * state.
 *
 * @param {HTMLButtonElement} button
 * @param {boolean?} expanded If no state is provided, the current
 * state will be toggled (from false to true, and vice-versa).
 * @return {boolean} the resulting state
 */
const toggleButton = (button, expanded) => {
  var accordion = button.closest(ACCORDION);
  if (!accordion) {
    throw new Error(`${BUTTON} is missing outer ${ACCORDION}`);
  }

  expanded = toggle(button, expanded);
  // XXX multiselectable is opt-in, to preserve legacy behavior
  const multiselectable = accordion.getAttribute(MULTISELECTABLE) === 'true';

  if (expanded && !multiselectable) {
    forEach(getAccordionButtons(accordion), other => {
      if (other !== button) {
        toggle(other, false);
      }
    });
  }
};

/**
 * Get an Array of button elements belonging directly to the given
 * accordion element.
 * @param {HTMLElement} accordion
 * @return {array<HTMLButtonElement>}
 */
const getAccordionButtons = accordion => {
  return filter(select(BUTTON, accordion), button => {
    return button.closest(ACCORDION) === accordion;
  });
};

module.exports = behavior({
  [ CLICK ]: {
    [ BUTTON ]: function (event) {
      event.preventDefault();
      return toggleButton(this);
    },
  },
}, {
  init: root => {
    forEach(select(BUTTON, root), button => {
      const expanded = button.getAttribute(EXPANDED) === 'true';
      toggleButton(button, expanded);
    });
  },
  ACCORDION,
  BUTTON,
  show: button => toggleButton(button, true),
  hide: button => toggleButton(button, false),
  toggle: toggleButton,
  getButtons: getAccordionButtons,
});
