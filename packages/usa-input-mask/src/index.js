const selectOrMatches = require("../../uswds-core/src/js/utils/select-or-matches");
const behavior = require("../../uswds-core/src/js/utils/behavior");
const { prefix: PREFIX } = require("../../uswds-core/src/js/config");
const { CLICK } = require("../../uswds-core/src/js/events");

const MASKED_CLASS = `${PREFIX}-masked`;
const MASKED = `.${MASKED_CLASS}`;
const MASK_CHAR = "_";

const DATA_MASK_ATTRIBUTE = "data-mask";
const DATA_MASK_START_ATTRIBUTE = "data-mask-start";

const KEY_DELETE = "Delete";
const KEY_BACKSPACE = "Backspace";
const KEY_ARROW_UP = "ArrowUp";
const KEY_ARROW_DOWN = "ArrowDown";
const KEY_ARROW_LEFT = "ArrowLeft";
const KEY_ARROW_RIGHT = "ArrowRight";
const KEY_TAB = "Tab";

/**
 * Check if a character is a number
 *
 * @param {number} theNum the key to check
 */
const isNum = (theNum) =>
  !Number.isNaN(theNum) && !Number.isNaN(parseInt(theNum, 10));

/**
 * Check if the key is a delete or backspace key
 *
 * @param {string} theKey the key to check
 */
const isDeletionKey = (theKey) =>
  theKey === KEY_DELETE || theKey === KEY_BACKSPACE;

/**
 * Check if the key is a navigation key
 *
 * @param {string} theKey the key to check
 */
const isDirectionKey = (theKey) =>
  theKey === KEY_ARROW_UP ||
  theKey === KEY_ARROW_DOWN ||
  theKey === KEY_ARROW_LEFT ||
  theKey === KEY_ARROW_RIGHT ||
  theKey === KEY_TAB;

const isPlaceholder = (theMask) => theMask === MASK_CHAR;

/**
 * Find the first position of the mask character in a string.
 *
 * @param {HTMLElement} inputEl an input element
 * @param {string} charReplace the character to replace the position with
 */
const placeholderPosition = (inputEl, charReplace) =>
  inputEl.value.indexOf(charReplace);

/**
 * Set the max length to the length of the mask
 *
 * @param {HTMLElement} inputEl an input element
 * @param {string} theMask the mask to set the max length to
 */
const setMaxLength = (inputEl, theMask) => {
  const currentElement = inputEl;
  currentElement.maxLength = theMask.length;
};

/**
 * Set the value of the input element to the mask
 *
 * @param {HTMLElement} inputEl an input element
 * @param {string} theMask the mask to set the value to
 */
const setInputValue = (inputEl, theMask) => {
  const currentElement = inputEl;
  currentElement.value = theMask;
};

/**
 * Set the character start position based on the mask pattern
 *
 * @param {HTMLElement} inputEl an input element
 */
const setStartPosition = (inputEl) => {
  const start = placeholderPosition(inputEl, MASK_CHAR) - 1;
  inputEl.setAttribute(DATA_MASK_START_ATTRIBUTE, start);
};

/**
 * Set up the mask on an input element
 *
 * @param {HTMLElement} inputEl an input element
 * @param {string} theMask the mask to set the value to
 */
const setUpMasks = (inputEl, theMask) => {
  setMaxLength(inputEl, theMask);
  setInputValue(inputEl, theMask);
  setStartPosition(inputEl, theMask);
};

/**
 * Handle the focus event
 *
 * @param {HTMLElement} el an input element
 */
const focused = (theEl) => {
  const currentElement = theEl;
  const placeholderPos = placeholderPosition(currentElement, MASK_CHAR);
  currentElement.selectionStart = placeholderPos;
  currentElement.selectionEnd = placeholderPos;
};

/**
 * Replace a character at a given position in a string
 *
 * @param {string} theMask the mask to set the value to
 * @param {number} thePosition the position to replace the character at
 * @param {string} charTyped the character to replace the position with
 * @returns {string} the html string
 */
const replaceAt = (theMask, thePosition, charTyped) => {
  let thePos = thePosition;
  const theReplacement =
    theMask.substring(0, thePos) + charTyped + theMask.substring((thePos += 1));
  return theReplacement;
};

/**
 * Change the character at a given position in a string
 *
 * @param {HTMLElement} el an input element
 * @param {string} charTyped the character to replace the position with
 * @param {number} maskLength The length of the mask
 * @param {number} forwardOrBack The direction of the cursor in the mask
 */
const changeChar = (el, charTyped, maskLength, forwardOrBack = 1) => {
  const theEl = el;
  const theValue = theEl.value;
  let currentPosition;
  currentPosition =
    forwardOrBack > 0 ? theEl.selectionStart : theEl.selectionStart - 1;
  let currentValue = "";
  if (currentPosition === maskLength) {
    return false;
  }
  if (
    !isNum(theValue[currentPosition]) &&
    !isPlaceholder(theValue[currentPosition])
  ) {
    do {
      currentPosition += forwardOrBack;
      if (currentPosition === maskLength) {
        return false;
      }
    } while (
      !isNum(theValue[currentPosition]) &&
      !isPlaceholder(theValue[currentPosition])
    );
  }
  currentValue = replaceAt(theValue, currentPosition, charTyped);
  theEl.value = currentValue;
  if (forwardOrBack > 0) {
    currentPosition += forwardOrBack;
  }
  theEl.selectionStart = currentPosition;
  theEl.selectionEnd = currentPosition;

  return null;
};

/**
 * Handle the typed key event
 *
 * @param {KeyboardEvent} event the key event
 * @param {HTMLElement} el an input element
 */
const input = (event, el) => {
  const theMask = el.getAttribute(DATA_MASK_ATTRIBUTE);
  const theStart = el.getAttribute(DATA_MASK_START_ATTRIBUTE);
  if ((isDirectionKey(event.key) || event.preventDefault(), isNum(event.key))) {
    changeChar(el, event.key, theMask.length);
  } else if (isDeletionKey(event.key)) {
    if (event.key === KEY_BACKSPACE) {
      changeChar(el, MASK_CHAR, parseInt(theStart, 10), -1);
    } else {
      changeChar(el, MASK_CHAR, theMask.length);
    }
  }
};

const inputMaskEvents = {
  [CLICK]: {},
  focusin: {
    [MASKED]() {
      focused(this);
    },
  },
  keydown: {
    [MASKED](event) {
      input(event, this);
    },
  },
};

const inputMask = behavior(inputMaskEvents, {
  init(root) {
    selectOrMatches(MASKED, root).forEach((maskedInput) => {
      setUpMasks(
        maskedInput,
        maskedInput.getAttribute(DATA_MASK_ATTRIBUTE),
        MASK_CHAR
      );
    });
  },
});

module.exports = inputMask;
