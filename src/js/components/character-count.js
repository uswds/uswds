const select = require("../utils/select");
const behavior = require("../utils/behavior");
const { prefix: PREFIX } = require("../config");

const CHARACTER_COUNT = `.${PREFIX}-character-count`;
const INPUT = `.${PREFIX}-character-count__input`;
const MESSAGE = `.${PREFIX}-character-count__message`;
const VALIDATION_MESSAGE = "The content is too long.";
const INVALID_CLASS = `${PREFIX}-character-count--invalid`;

/**
 * The elements within the character count.
 * @typedef {Object} CharacterCountElements
 * @property {HTMLDivElement} characterCount
 * @property {HTMLSpanElement} message
 */

/**
 * Returns the root and message element
 * for an character count input
 *
 * @param {HTMLInputElement|HTMLTextAreaElement} input The character count input element
 * @returns {CharacterCountElements} elements The root and message element.
 */
const getCharacterCountElements = input => {
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
 * @param {HTMLInputElement|HTMLTextAreaElement} input The character count input element
 */
const updateCountMessage = input => {
  const { characterCount, message } = getCharacterCountElements(input);

  const maxlength = parseInt(characterCount.getAttribute("data-maxlength"), 10);

  if (!maxlength) return;

  let newMessage = '';
  const currentLength = input.value.length;
  const isOverLimit = currentLength && currentLength > maxlength;

  if (currentLength === 0) {
    newMessage = `${maxlength} characters allowed`;
  } else {
    const difference = Math.abs(maxlength - currentLength);
    const characters = `character${difference === 1 ? "" : "s"}`;
    const guidance = isOverLimit ? "over limit" : "left";

    newMessage = `${difference} ${characters} ${guidance}`;
  }

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
 * @param {HTMLInputElement|HTMLTextAreaElement} input The character count input element
 */
const setupAttributes = input => {
  const { characterCount } = getCharacterCountElements(input);

  const maxlength = input.getAttribute("maxlength");

  if (!maxlength) return;

  input.removeAttribute("maxlength");
  characterCount.setAttribute("data-maxlength", maxlength);
};

const characterCount = behavior(
  {
    input: {
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
    VALIDATION_MESSAGE
  }
);

module.exports = characterCount;
