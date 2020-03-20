const select = require("../utils/select");
const behavior = require("../utils/behavior");
const { prefix: PREFIX } = require("../config");

const CHARACTER_COUNT = `.${PREFIX}-character-count`;
const INPUT = `.${PREFIX}-character-count__input`;
const MESSAGE = `.${PREFIX}-character-count__message`;
const VALIDATION_MESSAGE = "The content is too long.";
const INVALID_CLASS = `${PREFIX}-character-count--invalid`;
const WARNING_CLASS = `${PREFIX}-character-count--warning`;

/**
 * Returns the root and message element
 * for an character count input
 *
 * @param {Element} input The character count input element
 * @returns {Object} elements The root and message element.
 * @returns {HTMLElement} elements.characterCount The root character count element
 * @returns {HTMLElement} elements.messages The message objects
 */
const getElements = input => {
  const characterCount = input.closest(CHARACTER_COUNT);

  if (!characterCount) {
    throw new Error(`${INPUT} is missing outer ${CHARACTER_COUNT}`);
  }

  const message = characterCount.querySelector(MESSAGE);

  if (!message) {
    throw new Error(`${CHARACTER_COUNT} is missing inner ${MESSAGE}`);
  }

  return { characterCount, message };
};

/**
 * Update the character count component
 *
 * @param {Element} input The character count input element
 */
const updateCountMessage = input => {
  const { characterCount, message } = getElements(input);

  const maxlength = characterCount.getAttribute("data-maxlength");

  if (!maxlength) return;

  const currentLength = input.value.length;
  let newMessage;

  if (currentLength === 0) {
    newMessage = `${maxlength} characters allowed`;
  } else if (maxlength - currentLength === 1) {
    newMessage = `1 character left`;
  } else if (maxlength - currentLength === -1) {
    newMessage = `1 character over limit`;
  } else if (currentLength <= maxlength) {
    newMessage = `${maxlength - currentLength} characters left`;
  } else {
    newMessage = `${currentLength - maxlength} characters over limit`;
  }

  const isOverLimit = currentLength && currentLength > maxlength;
  const isCloseToLimit = currentLength && currentLength > maxlength - 10;
  characterCount.classList.toggle(WARNING_CLASS, isCloseToLimit);
  characterCount.classList.toggle(INVALID_CLASS, isOverLimit);

  message.innerHTML = newMessage;

  if (isOverLimit && !input.validationMessage) {
    input.setCustomValidity(VALIDATION_MESSAGE);
  }
  if (!isOverLimit && input.validationMessage === VALIDATION_MESSAGE) {
    input.setCustomValidity("");
  }
};

/**
 * Setup the character count component
 *
 * @param {Element} input The character count input element
 */
const setupAttributes = input => {
  const { characterCount } = getElements(input);

  const maxlength = input.getAttribute("maxlength");

  if (!maxlength) return;

  input.removeAttribute("maxlength");
  characterCount.setAttribute("data-maxlength", maxlength);
};

const characterCount = behavior(
  {
    "input change paste keyup mouseup": {
      [INPUT]() {
        updateCountMessage(this);
      }
    }
  },
  {
    init(root) {
      select(INPUT, root).forEach(input => {
        setupAttributes(input);
        updateCountMessage(input);
      });
    },
    INVALID_CLASS,
    WARNING_CLASS,
    VALIDATION_MESSAGE
  }
);

module.exports = characterCount;
