'use strict';
const behavior = require('../utils/behavior');
const receptor = require('receptor');
const select = require('../utils/select');
const toggle = require('./toggle');

const PREFIX = 'usa';
const ACCORDION = `.${PREFIX}-accordion`;
const BUTTON = `.${PREFIX}-accordion-button`;
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
  const multiselectable = accordion.getAttribute(MULTISELECTABLE) === 'true';

  if (multiselectable) {
    // do nothing
  } else if (expanded) {
    getAccordionButtons(accordion)
      .forEach(other => {
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
  return select(BUTTON, accordion)
    .filter(button => {
      return button.closest(ACCORDION) === accordion;
    });
};

module.exports = behavior({
  'click': {
    [ `${BUTTON}[aria-controls]` ]: function (event) {
      event.preventDefault();
      return toggleButton(this);
    },
  },
}, {
  init: root => {
    select(`${ACCORDION} ${BUTTON}`, root)
      .forEach(button => {
        const expanded = button.getAttribute(EXPANDED) === 'true';
        toggleButton(button, expanded);
      });
  },
  toggle: toggleButton,
  show: button => toggleButton(button, true),
  hide: button => toggleButton(button, false),
});
