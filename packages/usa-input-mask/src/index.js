const selectOrMatches = require("../../uswds-core/src/js/utils/select-or-matches");
const behavior = require("../../uswds-core/src/js/utils/behavior");
const { prefix: PREFIX } = require("../../uswds-core/src/js/config");

const MASKED_CLASS = `${PREFIX}-masked`;
const MASKED = `.${MASKED_CLASS}`;
const MASK = `${PREFIX}-input-mask`;
const MASK_CONTENT = `${MASK}--content`;
const PLACEHOLDER = "placeholder";

// User defined Values
const maskedNumber = "_#dDmMyY9";
const maskedLetter = "A";

/**
 * Wrap an input with a visual mask derived from its placeholder.
 *
 * Moves the placeholder to data-placeholder, sets maxlength, and creates the
 * aria-hidden mask content. Inputs without a placeholder are left unchanged.
 *
 * @param {HTMLInputElement} input - Input to enhance.
 * @returns {void}
 */
const createMaskedInputShell = (input) => {
  const placeholder = input.getAttribute(`${PLACEHOLDER}`);
  if (placeholder) {
    input.setAttribute("maxlength", placeholder.length);
    input.setAttribute("data-placeholder", placeholder);
    input.removeAttribute(`${PLACEHOLDER}`);
  } else {
    return;
  }

  const shell = document.createElement("span");
  shell.classList.add(MASK);
  shell.setAttribute("data-mask", placeholder);

  const content = document.createElement("span");
  content.classList.add(MASK_CONTENT);
  content.setAttribute("aria-hidden", "true");
  content.id = `${input.id}Mask`;
  content.textContent = placeholder;

  shell.appendChild(content);
  input.parentNode.insertBefore(shell, input);
  shell.appendChild(input);
};

/**
 * Build the entered-value element and remaining placeholder text for a mask.
 *
 * @param {HTMLInputElement} el - Enhanced input with data-placeholder.
 * @returns {[HTMLElement, string]} Entered-value element and unfilled mask text.
 */
const setValueOfMask = (el) => {
  const { value } = el;
  const placeholderVal = `${el.dataset.placeholder.substr(value.length)}`;

  const theIEl = document.createElement("i");
  theIEl.textContent = value;
  return [theIEl, placeholderVal];
};

/**
 * Remove characters before matching the value against its mask.
 *
 * With a charset, preserves word characters, including underscores. Without
 * a charset, preserves only digits.
 *
 * @param {string|undefined} isCharsetPresent - The input's data-charset value.
 * @param {string} value - Current input value.
 * @returns {string} Value with nonmatching characters removed.
 */
const strippedValue = (isCharsetPresent, value) =>
  isCharsetPresent ? value.replace(/\W/g, "") : value.replace(/\D/g, "");

/**
 * Check whether a value can be parsed as a base-10 integer.
 *
 * @param {string|undefined} value - Character from the stripped input value.
 * @returns {boolean} Whether parsing produces an integer.
 */
const isInteger = (value) => !Number.isNaN(parseInt(value, 10));

/**
 * Match an ASCII letter, ignoring case.
 *
 * @param {string|undefined} value - Character from the stripped input value.
 * @returns {RegExpMatchArray|null|false} Match, null for no match, or false for an empty value.
 */
const isLetter = (value) => (value ? value.match(/[A-Z]/i) : false);

/**
 * Format the current value using data-charset or the saved placeholder.
 *
 * Copies valid digits or letters into mask positions and inserts literal mask
 * characters. Stops at the first unfilled or mismatched input position.
 *
 * @param {HTMLInputElement} el - Enhanced input to format.
 * @returns {string} Formatted value, which may fill only part of the mask.
 */
const handleCurrentValue = (el) => {
  const isCharsetPresent = el.dataset.charset;
  const placeholder = isCharsetPresent || el.dataset.placeholder;
  const { value } = el;
  const len = placeholder.length;
  let newValue = "";
  let i;
  let charIndex;

  const strippedVal = strippedValue(isCharsetPresent, value);

  for (i = 0, charIndex = 0; i < len; i += 1) {
    const isInt = isInteger(strippedVal[charIndex]);
    const isLet = isLetter(strippedVal[charIndex]);
    const matchesNumber = maskedNumber.indexOf(placeholder[i]) >= 0;
    const matchesLetter = maskedLetter.indexOf(placeholder[i]) >= 0;

    if (
      (matchesNumber && isInt) ||
      (isCharsetPresent && matchesLetter && isLet)
    ) {
      newValue += strippedVal[charIndex];
      charIndex += 1;
    } else if (
      (!isCharsetPresent && !isInt && matchesNumber) ||
      (isCharsetPresent &&
        ((matchesLetter && !isLet) || (matchesNumber && !isInt)))
    ) {
      return newValue;
    } else {
      newValue += placeholder[i];
    }
    // break if no characters left and the pattern is non-special character
    if (strippedVal[charIndex] === undefined) {
      break;
    }
  }

  return newValue;
};

/**
 * Update an input value and its associated visual mask after editing.
 *
 * @param {HTMLInputElement} el - Enhanced input with a matching mask element.
 * @returns {void}
 */
const handleValueChange = (el) => {
  const inputEl = el;
  const id = inputEl.getAttribute("id");
  inputEl.value = handleCurrentValue(inputEl);

  const maskVal = setValueOfMask(el);
  const maskEl = document.getElementById(`${id}Mask`);
  maskEl.textContent = "";
  maskEl.replaceChildren(maskVal[0], maskVal[1]);
};

const inputMaskEvents = {
  keyup: {
    /**
     * Refresh the value and visual mask after a key is released.
     *
     * @this {HTMLInputElement}
     * @returns {void}
     */
    [MASKED]() {
      handleValueChange(this);
    },
  },
};

const inputMask = behavior(inputMaskEvents, {
  /**
   * Enhance masked inputs within the root, including the root itself.
   *
   * @param {Document|HTMLElement} root - Scope supplied by the behavior lifecycle.
   * @returns {void}
   */
  init(root) {
    selectOrMatches(MASKED, root).forEach((maskedInput) => {
      createMaskedInputShell(maskedInput);
    });
  },
});

module.exports = inputMask;
