const ignore = require("receptor/ignore");
const behavior = require("../../uswds-core/src/js/utils/behavior");
const select = require("../../uswds-core/src/js/utils/select");

const { CLICK } = require("../../uswds-core/src/js/events");

const BUTTON = ".js-search-button";
const FORM = ".js-search-form";
const INPUT = "[type=search]";
const CONTEXT = "header"; // XXX

let lastButton;

const getForm = (button) => {
  const context = button.closest(CONTEXT);
  return context ? context.querySelector(FORM) : document.querySelector(FORM);
};

const toggleSearch = (button, active) => {
  const form = getForm(button);

  if (!form) {
    throw new Error(`No ${FORM} found for search toggle in ${CONTEXT}!`);
  }

  /* eslint-disable no-param-reassign */
  button.hidden = active;
  form.hidden = !active;
  /* eslint-enable */

  if (!active) {
    return;
  }

  const input = form.querySelector(INPUT);

  if (input) {
    input.focus();
  }
  // when the user clicks _outside_ of the form w/ignore(): hide the
  // search, then remove the listener
  const listener = ignore(form, () => {
    if (lastButton) {
      hideSearch.call(lastButton); // eslint-disable-line no-use-before-define
    }

    document.body.removeEventListener(CLICK, listener);
  });

  // Normally we would just run this code without a timeout, but
  // IE11 and Edge will actually call the listener *immediately* because
  // they are currently handling this exact type of event, so we'll
  // make sure the browser is done handling the current click event,
  // if any, before we attach the listener.
  setTimeout(() => {
    document.body.addEventListener(CLICK, listener);
  }, 0);
};

function showSearch() {
  toggleSearch(this, true);
  lastButton = this;
}

function hideSearch() {
  toggleSearch(this, false);
  lastButton = undefined;
}

const search = behavior(
  {
    [CLICK]: {
      [BUTTON]: showSearch,
    },
  },
  {
    init(target) {
      select(BUTTON, target).forEach((button) => {
        toggleSearch(button, false);
      });
    },
    teardown() {
      // forget the last button clicked
      lastButton = undefined;
    },
  },
);

module.exports = search;
