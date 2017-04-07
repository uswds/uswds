'use strict';
const behavior = require('../utils/behavior');
const select = require('../utils/select');
const receptor = require('receptor');

const PREFIX = 'usa';
const BUTTON = '.js-search-button';
const FORM = '.js-search-form';
const INPUT = '[type=search]';
const CONTEXT = 'header'; // XXX
const VISUALLY_HIDDEN = `${PREFIX}-sr-only`;

let lastButton;

const showSearch = function (event) {
  toggleSearch(this, true);
  lastButton = this;
};

const hideSearch = function (event) {
  toggleSearch(this, false);
  lastButton = undefined;
};

const toggleSearch = (button, active) => {
  const form = getForm(button);
  if (!form) {
    throw new Error(`No ${FORM} found for search toggle in ${CONTEXT}!`);
  }

  button.hidden = active;
  form.classList.toggle(VISUALLY_HIDDEN, !active);

  if (active) {
    const input = form.querySelector(INPUT);
    if (input) {
      input.focus();
    }
    const listener = receptor.ignore(
      form,
      e => {
        lastButton && hideSearch.call(lastButton);
        document.body.removeEventListener(CLICK, listener);
      }
    );
    document.body.addEventListener(CLICK, listener);
  }
};

const getForm = button => {
  const context = button.closest(CONTEXT);
  return context ? context.querySelector(FORM) : undefined;
};

const CLICK = ('ontouchstart' in document.documentElement)
  ? 'touchstart'
  : 'click';

module.exports = behavior({
  [ CLICK ]: {
    [ BUTTON ]: showSearch,
  },
}, {
  init: (target) => {
    select(BUTTON, target).forEach(button => {
      toggleSearch(button, false);
    });
  },
  teardown: (target) => {
    // forget the last button clicked
    lastButton = undefined;
  },
});
