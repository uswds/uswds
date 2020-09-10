const select = require("../utils/select");
const behavior = require("../utils/behavior");
const { prefix: PREFIX } = require("../config");

const CHARACTER_COUNT = `.${PREFIX}-character-count`;
const INPUT = `.${PREFIX}-character-count__field`;
const MESSAGE = `.${PREFIX}-character-count__message`;
const VALIDATION_MESSAGE = "The content is too long.";
const MESSAGE_INVALID_CLASS = `${PREFIX}-character-count__message--invalid`;

/**
 * The elements within the character count.
 * @typedef {Object} CharacterCountElements
 * @property {HTMLDivElement} characterCountEl
 * @property {HTMLSpanElement} messageEl
 */

/**
 * Returns the root and message element
 * for an character count input
 *
 * @param {HTMLInputElement|HTMLTextAreaElement} inputEl The character count input element
 * @returns {CharacterCountElements} elements The root and message element.
 */
const getCharacterCountElements = (inputEl) => {
  const characterCountEl = inputEl.closest(CHARACTER_COUNT);

  if (!characterCountEl) {
    throw new Error(`${INPUT} is missing outer ${CHARACTER_COUNT}`);
  }

  const messageEl = characterCountEl.querySelector(MESSAGE);

  if (!messageEl) {
    throw new Error(`${CHARACTER_COUNT} is missing inner ${MESSAGE}`);
  }

  return { characterCountEl, messageEl };
};

/**
 * Update the character count component
 *
 * @param {HTMLInputElement|HTMLTextAreaElement} inputEl The character count input element
 */
const updateCountMessage = (inputEl) => {
  const { characterCountEl, messageEl } = getCharacterCountElements(inputEl);

  const maxlength = parseInt(
    characterCountEl.getAttribute("data-maxlength"),
    10
  );

  if (!maxlength) return;

  let newMessage = "";
  const currentLength = inputEl.value.length;
  const isOverLimit = currentLength && currentLength > maxlength;

  if (currentLength === 0) {
    newMessage = `${maxlength} characters allowed`;
  } else {
    const difference = Math.abs(maxlength - currentLength);
    const characters = `character${difference === 1 ? "" : "s"}`;
    const guidance = isOverLimit ? "over limit" : "left";

    newMessage = `${difference} ${characters} ${guidance}`;
  }

  messageEl.classList.toggle(MESSAGE_INVALID_CLASS, isOverLimit);
  messageEl.innerHTML = newMessage;

  if (isOverLimit && !inputEl.validationMessage) {
    inputEl.setCustomValidity(VALIDATION_MESSAGE);
  }

  if (!isOverLimit && inputEl.validationMessage === VALIDATION_MESSAGE) {
    inputEl.setCustomValidity("");
  }
};

/**
 * Setup the character count component
 *
 * @param {HTMLInputElement|HTMLTextAreaElement} inputEl The character count input element
 */
const setupAttributes = (inputEl) => {
  const { characterCountEl } = getCharacterCountElements(inputEl);

  const maxlength = inputEl.getAttribute("maxlength");

  if (!maxlength) return;

  inputEl.removeAttribute("maxlength");
  characterCountEl.setAttribute("data-maxlength", maxlength);
};

const characterCount = behavior(
  {
    input: {
      [INPUT]() {
        updateCountMessage(this);
      },
    },
  },
  {
    init(root) {
      select(INPUT, root).forEach((input) => {
        setupAttributes(input);
        updateCountMessage(input);
      });
    },
    MESSAGE_INVALID_CLASS,
    VALIDATION_MESSAGE,
  }
);

module.exports = characterCount;
