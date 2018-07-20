const assign = require('object-assign');
const filter = require('array-filter');
const forEach = require('array-foreach');
const behavior = require('../utils/behavior');
const toggle = require('../utils/toggle');
const isElementInViewport = require('../utils/is-in-viewport');
const select = require('../utils/select')
const { CLICK } = require('../events');
const { prefix: PREFIX } = require('../config');

// XXX match .usa-accordion and .usa-accordion-bordered
const ACCORDION = `.${PREFIX}-accordion, .${PREFIX}-accordion-bordered`;
const BUTTON = `.${PREFIX}-accordion-button[aria-controls]`;
const CONTENT = `.${PREFIX}-accordion-content`;
const EXPANDED = 'aria-expanded';
const MULTISELECTABLE = 'aria-multiselectable';

/**
 * Get an Array of button elements belonging directly to the given
 * accordion element.
 * @param {HTMLElement} accordion
 * @return {array<HTMLButtonElement>}
 */
const getAccordionButtons = (accordion) => {
  const buttons = accordion.querySelectorAll(BUTTON);

  return filter(buttons, button => button.closest(ACCORDION) === accordion);
};

const getAccordionContents = accordion => select(CONTENT, accordion);

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
  const accordion = button.closest(ACCORDION);
  let safeExpanded = expanded;
  if (!accordion) {
    throw new Error(`${BUTTON} is missing outer ${ACCORDION}`);
  }

  safeExpanded = toggle(button, expanded);

  // XXX multiselectable is opt-in, to preserve legacy behavior
  const multiselectable = accordion.getAttribute(MULTISELECTABLE) === 'true';

  if (safeExpanded && !multiselectable) {
    forEach(getAccordionButtons(accordion), (other) => {
      if (other !== button) {
        toggle(other, false);
      }
    });
  }
};

/**
 * @param {HTMLButtonElement} button
 * @return {boolean} true
 */
const showButton = button => toggleButton(button, true);

/**
 * @param {HTMLButtonElement} button
 * @return {boolean} false
 */
const hideButton = button => toggleButton(button, false);

const accordion = behavior({
  [CLICK]: {
    [BUTTON](event) {
      event.preventDefault();
      toggleButton(this);

      if (this.getAttribute(EXPANDED) === 'true') {
        // We were just expanded, but if another accordion was also just
        // collapsed, we may no longer be in the viewport. This ensures
        // that we are still visible, so the user isn't confused.
        if (!isElementInViewport(this)) this.scrollIntoView();
      }
    },
  },
}, {
  init(root) {
    /**
     * get all accordions here with selector of accordion
     * register all with hash change object
     *  - hash change object should have a Set, so functions can only be 
     *    registered once + shared ?
     * 
     */
    const accordions = select(ACCORDION, root);

    forEach(root.querySelectorAll(BUTTON), (button) => {
      const expanded = button.getAttribute(EXPANDED) === 'true';
      toggleButton(button, expanded);
    });

    const getHash = function(root) {
      let hash;
      
      try {
        const url = new URL(window.location);
        hash = url.hash;
      } catch(error) {
        hash = location.hash ? location.hash : null;
      } 

      return hash.replace('#', '');
    };

    const hash = getHash(window);

    window.addEventListener('hashchange', function handleHashChange(event) {
      const nextHash = getHash(window);

      if (!nextHash) {
        return;
      }
      
      accordions.forEach((accordion) => {
        const buttons = getAccordionButtons(accordion);

        for (var i = 0; i < buttons.length; i++) {
          const button = buttons[i];
          
          if (button.getAttribute('aria-controls') === nextHash) {
            button.click();
            break;
          }
          
          window.location.hash = '';
        }
      });
    });
  },
  ACCORDION,
  BUTTON,
  show: showButton,
  hide: hideButton,
  toggle: toggleButton,
  getButtons: getAccordionButtons,
});

/**
 * TODO: for 2.0, remove everything below this comment and export the
 * behavior directly:
 *
 * module.exports = behavior({...});
 */
const Accordion = function (root) {
  this.root = root;
  accordion.on(this.root);
};

// copy all of the behavior methods and props to Accordion
assign(Accordion, accordion);

Accordion.prototype.show = showButton;
Accordion.prototype.hide = hideButton;

Accordion.prototype.remove = function () {
  accordion.off(this.root);
};

module.exports = Accordion;
