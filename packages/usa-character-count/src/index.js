const select = require("../../uswds-core/src/js/utils/select");
const behavior = require("../../uswds-core/src/js/utils/behavior");
const { prefix: PREFIX } = require("../../uswds-core/src/js/config");

const CHARACTER_COUNT_CLASS = `${PREFIX}-character-count`;
const CHARACTER_COUNT = `.${CHARACTER_COUNT_CLASS}`;
const INPUT = `.${PREFIX}-character-count__field`;
const MESSAGE = `.${PREFIX}-character-count__message`;
const VALIDATION_MESSAGE = "The content is too long.";
const MESSAGE_INVALID_CLASS = `${PREFIX}-character-count__message--invalid`;
const STATUS_MESSAGE_CLASS = `${CHARACTER_COUNT_CLASS}__status`;
const STATUS_MESSAGE_SR_ONLY_CLASS = `${CHARACTER_COUNT_CLASS}__sr-status`;
const STATUS_MESSAGE = `.${STATUS_MESSAGE_CLASS}`;
const STATUS_MESSAGE_SR_ONLY = `.${STATUS_MESSAGE_SR_ONLY_CLASS}`;

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
  messageEl.textContent = newMessage;

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

/**
 * Create two status messages for current characters left;
 * one visual status and another for screenreaders
 *
 * @param {htmlDivElement} characterCountEl
 */
const createStatusMessages = (characterCountEl) => {
  const statusMessage = document.createElement("div");
  const srStatusMessage = document.createElement("div");

  statusMessage.classList.add(`${STATUS_MESSAGE_CLASS}`, "usa-hint");
  srStatusMessage.classList.add(
    `${STATUS_MESSAGE_SR_ONLY_CLASS}`,
    "usa-sr-only"
  );

  statusMessage.setAttribute("aria-hidden", true);
  srStatusMessage.setAttribute("aria-live", "polite");

  updateCountMessage(characterCountEl);

  characterCountEl.append(statusMessage, srStatusMessage);
};

const enhanceCharacterCount = (inputEl) => {
  const { characterCountEl } = getCharacterCountElements(inputEl);

  setupAttributes(inputEl);
  createStatusMessages(characterCountEl);
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
      select(INPUT, root).forEach((input) => enhanceCharacterCount(input));
    },
    MESSAGE_INVALID_CLASS,
    VALIDATION_MESSAGE,
  }
);

module.exports = characterCount;
