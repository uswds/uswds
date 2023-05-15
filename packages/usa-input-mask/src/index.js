const selectOrMatches = require("../../uswds-core/src/js/utils/select-or-matches");
const behavior = require("../../uswds-core/src/js/utils/behavior");
const debounce = require("../../uswds-core/src/js/utils/debounce");
const { prefix: PREFIX } = require("../../uswds-core/src/js/config");

const MASKED_INPUT_CLASS = `${PREFIX}-input-mask`;
const MASKED_INPUT = `.${MASKED_INPUT_CLASS}`;
const MASKED_INPUT_SHELL_CLASS = `${MASKED_INPUT_CLASS}__shell`;
const MASKED_INPUT_CONTENT_CLASS = `${MASKED_INPUT_CLASS}__content`;
const PLACEHOLDER = "placeholder";

const MESSAGE_INVALID_CLASS = `${PREFIX}-error-message`;
const STATUS_MESSAGE_CLASS = `${MASKED_INPUT_CLASS}__status`;
const STATUS_MESSAGE_SR_ONLY_CLASS = `${PREFIX}-sr-only`;
const FORMAT_CHARACTERS = [
  "-",
  "_",
  "(",
  ")",
  "[",
  "]",
  ":",
  ".",
  ",",
  "$",
  "%",
  "@",
  "*",
  "/",
  " ",
];

const KEYS = {
  a: 65,
  asterisk: 42,
  backSpace: 8,
  c: 67,
  command: 91,
  control: 17,
  delete: 46,
  down: 40,
  end: 35,
  enter: 13,
  escape: 27,
  home: 36,
  left: 37,
  nine: 57,
  numberPadNine: 105,
  numberPadZero: 96,
  parenthesisLeft: 57,
  parenthesisRight: 48,
  right: 39,
  shift: 16,
  tab: 9,
  up: 38,
  v: 86,
  x: 88,
  z: 90,
  zero: 48,
};

const INPUT_PROPERTIES = {};

/**
 * Sets the value of a specified property in the MASKED_INPUT object
 *
 * @param {string} id - The MASKED_INPUT id
 * @param {string} key - The key of a specified property in MASKED_INPUT object
 * @param {*} value - The new value for the specified key
 */
const setPropertyValue = (inputID, key, updatedValue) => {
  const hasNoProperties = Object.keys(INPUT_PROPERTIES).indexOf(inputID) === -1;
  if (hasNoProperties) {
    INPUT_PROPERTIES[inputID] = {};
  }

  INPUT_PROPERTIES[inputID][key] = updatedValue;
};

/**
 * Gets the value of a specified property key in the MASKED_INPUT object
 *
 * @param {string} inputID - The MASKED_INPUT id
 * @param {string} key - The key of a specified property in MASKED_INPUT object
 * @param {any} [defaultVal=null] - The default value to return if no property value is found.
 * @return {any} Returns either the value of the specified property key (if found) OR the given default value (if not found).
 */
const getPropertyValue = (inputID, key, defaultVal = null) => {
  const inputPropertyValue = INPUT_PROPERTIES[inputID][key];
  if (inputPropertyValue) {
    return inputPropertyValue;
  }

  return defaultVal;
};

/**
 * Checks if the mask contains any alphabetic characters.
 *
 * @returns {boolean} True if the mask contains at least one alphabetic character, false otherwise.
 */
const checkMaskForLetters = (inputId) => {
  if (INPUT_PROPERTIES[inputId] && INPUT_PROPERTIES[inputId].MASK) {
    return INPUT_PROPERTIES[inputId].MASK.some(
      (char) => char !== char.toLowerCase()
    );
  }

  return false;
};

/**
 * Removes format characters from a string.
 *
 * @param {string} string - The input string to process.
 * @returns {string} The string without format characters
 */
const removeFormatCharacters = (string) => {
  if (!string) {
    return "";
  }

  let newString = string;
  for (let i = 0; i < FORMAT_CHARACTERS.length; i += 1) {
    newString = newString.replaceAll(FORMAT_CHARACTERS[i], "");
  }

  return newString;
};

/**
 * Returns the current cursor position in the input element.
 *
 * @param {HTMLElement} inputEl - The input element.
 * @returns {number} The current cursor position.
 */
const getCursorPosition = (inputEl) => {
  if (document.selection) {
    inputEl.focus();
    const selectRange = document.selection.createRange();
    selectRange.moveStart("character", -inputEl.value.length);
    return selectRange.text.length;
  }
  return inputEl.selectionStart || 0;
};

/**
 * Sets the cursor position of the given `inputEl` element to the specified `cursorPos` position.
 *
 * @param {HTMLInputElement} inputEl - The input element whose cursor position is to be set.
 * @param {number} cursorPos - The position to set the cursor to.
 */
const setCursorPosition = (inputEl, cursorPos, isFocus = true) => {
  if (inputEl == null) return;
  if (inputEl.createTextRange) {
    const range = inputEl.createTextRange();
    range.move("character", cursorPos);
    range.select();
  } else if (inputEl.selectionStart) {
    if (isFocus) {
      inputEl.focus();
    }
    inputEl.setSelectionRange(cursorPos, cursorPos);
  } else {
    if (inputEl.value !== undefined && cursorPos <= inputEl.value.length) {
      inputEl.setSelectionRange(cursorPos, cursorPos);
    }

    if (isFocus) {
      inputEl.focus();
    }
  }
};

/**
 * Inserts a mask until the first numeric character is found at the given `curPos` position in the `inputEl` element.
 *
 * @param {HTMLInputElement} inputEl - The input element where the mask is to be inserted.
 * @param {number} curPos - The current cursor position in the input element.
 */
const insertMaskUntilNumber = (inputEl, curPos) => {
  const el = inputEl;
  let strAddVal = "";

  let newPos = curPos;

  const MASK = getPropertyValue(el.id, "MASK", []);

  const maxLength =
    curPos > el.value.length - 1 ? MASK.length : el.value.length;

  for (let i = curPos; i < maxLength; i += 1) {
    if (FORMAT_CHARACTERS.indexOf(MASK[i]) === -1) {
      newPos = i;
      break;
    } else {
      strAddVal += MASK[i];
    }
  }

  if (strAddVal !== "" && curPos > el.value.length - 1) {
    el.value += strAddVal;
  }

  if (el.value.length > MASK.length) {
    el.value = el.value.slice(0, MASK.length);
  }

  if (newPos !== curPos) {
    setCursorPosition(inputEl, newPos);
  }
};

/**
 * Checks whether or not the given key code is valid for the given mask character.
 *
 * @param {number} keyCode - The key code of the key that was pressed.
 * @param {string} maskCharacter - The mask character to check against.
 * @returns {boolean} True if the key code is valid for the mask character, false otherwise.
 */
const isValidCharacter = (keyCode, maskCharacter) => {
  if (!maskCharacter) {
    return false;
  }
  const maskCharacterCode = maskCharacter.charCodeAt(0);
  const isNumber =
    (keyCode >= KEYS.zero && keyCode <= KEYS.nine) ||
    (keyCode >= KEYS.numberPadZero && keyCode <= KEYS.numberPadNine);

  if (maskCharacterCode === KEYS.nine && isNumber) {
    return true;
  }

  if (maskCharacterCode === KEYS.a && keyCode >= KEYS.a && keyCode <= KEYS.z) {
    return true;
  }

  return false;
};

/**
 * Inserts a character at a specified position in the input element.
 *
 * @param {HTMLElement} inputEl - The input element.
 * @param {number} cursorPos - The position at which to insert the character.
 * @param {string} character - The character to insert.
 */
const insertCharacterAtIndex = (inputEl, cursorPos, character) => {
  const el = inputEl;
  const newElementValue =
    el.value.slice(0, cursorPos) + character + el.value.slice(cursorPos);

  el.value = newElementValue;

  if (el.value.length > 0) {
    setCursorPosition(el, cursorPos + 1);
  } else {
    el.focus();
  }
};

/**
 * Returns the initial mask value for a given mask.
 *
 * @return {string} The initial mask value.
 */
const getInitMaskValue = (inputId) => {
  let strInitVal = "";
  const MASK = getPropertyValue(inputId, "MASK", []);

  for (let i = 0; i < MASK.length; i += 1) {
    if (FORMAT_CHARACTERS.indexOf(MASK[i]) === -1) {
      break;
    } else {
      strInitVal += MASK[i];
    }
  }

  return strInitVal;
};

/**
 * Sets the initial mask value for a given input element.
 *
 * @param {HTMLElement} inputEl - The input element to set the initial mask value for.
 */
const setInitMask = (inputEl, isFocus = true) => {
  const el = inputEl;
  let position = 0;
  let strInitVal = "";
  const MASK = getPropertyValue(el.id, "MASK", []);
  for (let i = 0; i < MASK.length; i += 1) {
    if (FORMAT_CHARACTERS.indexOf(MASK[i]) === -1) {
      position = i;
      break;
    } else {
      strInitVal += MASK[i];
    }
  }

  el.value = strInitVal;
  setCursorPosition(inputEl, position, isFocus);
};

/**
 * Check and insert masked characters
 *
 * @param {HTMLInputElement} inputEl - Input with `.usa-masked__field` class
 * @param {number} cursorPos - Cursor position
 */
const changeValue = (inputEl) => {
  const el = inputEl;
  const strValue = removeFormatCharacters(el.value);

  let newValue = "";
  let index = 0;

  const MASK = getPropertyValue(el.id, "MASK", []);

  for (let i = 0; i < MASK.length; i += 1) {
    if (index >= strValue.length) {
      break;
    }

    if (FORMAT_CHARACTERS.indexOf(MASK[i]) > -1) {
      newValue += MASK[i];
    } else if (strValue.length > index) {
      newValue += strValue.charAt(index);
      index += 1;
    }
  }

  el.value = newValue;

  const strNumber = removeFormatCharacters(newValue);
  if (strNumber === "") {
    setInitMask(inputEl);
  }
};

/**
 * Modifies the value and cursor position of the given input element according to certain rules.
 * If the input element has a value, the mask is inserted until a number is reached.
 * If the input element has no value, it is given focus.
 *
 * @param {HTMLElement} inputEl - The input element to be modified.
 * @param {number} cursorPos - The position of the cursor in the input element.
 */
const checkAndInsertMaskCharacters = (inputEl, cursorPos) => {
  const el = inputEl;

  changeValue(inputEl, cursorPos);

  setCursorPosition(inputEl, cursorPos);

  if (el.value.length > 0) {
    insertMaskUntilNumber(inputEl, cursorPos);
  } else {
    el.focus();
  }
};

/**
 * Creates and appends two new elements to the given element:
 *
 * 1. A visual status message.
 * 2. A screen reader only status message element.
 *
 * Both elements have the same default text content and their own specific
 * classes and attributes.
 *
 * @param {HTMLElement} maskedEl - The element to which the new status message elements will be appended.
 * @param {String} randomID - A string passed to ensure the Screen reader message ID is unique.
 */
const createStatusMessages = (maskedEl, randomID) => {
  const visibleStatusEl = document.createElement("div");
  const srStatusEl = document.createElement("div");
  const srStatusID = randomID || Math.floor(Math.random() * 900000) + 100000;
  const srStatusElID = `input-mask-status-${srStatusID}`;
  let maskedElAriaDescribedBy = maskedEl.getAttribute("aria-describedby");

  if (maskedElAriaDescribedBy) {
    maskedElAriaDescribedBy = `${srStatusElID} ${maskedElAriaDescribedBy}`;
  } else {
    maskedElAriaDescribedBy = srStatusElID;
  }

  maskedEl.setAttribute("aria-describedby", maskedElAriaDescribedBy);
  visibleStatusEl.classList.add(`${STATUS_MESSAGE_CLASS}`);
  srStatusEl.classList.add(`${STATUS_MESSAGE_SR_ONLY_CLASS}`);
  visibleStatusEl.setAttribute("aria-hidden", true);
  srStatusEl.setAttribute("aria-live", "polite");
  srStatusEl.setAttribute("id", srStatusElID);

  maskedEl.insertAdjacentElement("afterend", visibleStatusEl);
  visibleStatusEl.insertAdjacentElement("afterend", srStatusEl);
};

/**
 * Extracts the valid text from a given string of pasted text, regardless of
 * cursor position.
 *
 * @param {HTMLInputElement} inputEl - The masks input element.
 * @param {string} pastedText - The pasted text string.
 * @param {curPos} curPos - The users cursor position on paste.
 * @return {string} - The extracted, valid text.
 */
const getValidPastedText = (inputEl, pastedText = "", curPos = 0) => {
  const strPastedtext = removeFormatCharacters(pastedText);
  const startingPoint = curPos;
  let strRes = "";

  let mask = getPropertyValue(inputEl.id, "MASK", []);
  const inputMaxLength = Number(inputEl.getAttribute("maxLength"));

  // ! Placement matters for slicing array
  // Maybe start at 1 for alphanumeric
  if (startingPoint > 0) {
    mask = mask.slice(startingPoint);
  }

  // Convert mask into string and remove formatted characters.
  mask = removeFormatCharacters(mask.join(""));
  const maskLimit = mask.length < inputMaxLength ? mask.length : inputMaxLength;

  // Compare pasted text is bigger than mask limit.
  const maxLength =
    strPastedtext.length > maskLimit ? maskLimit : strPastedtext.length;

  // ! Need a way to match current cursor position with mask position.
  const isNumber = /[0-9]/;
  // Loop through pasted text and validate each character. Only keep valid.
  // Maybe maxLength also needs to start at cursor position.

  // ! Need to find way to get mask to reset.
  for (let j = 0; j < maxLength; j += 1) {
    // On phone numbers the first `(` will cut off last number in `@@@@@123`
    if (
      // Compare current pasted string to mask expected character
      (isNumber.test(strPastedtext[j]) && isNumber.test(mask[j])) ||
      (!isNumber.test(strPastedtext[j]) && !isNumber.test(mask[j]))
    ) {
      strRes += strPastedtext[j];
    } else {
      strRes = "";
    }
  }

  return strRes;
};

/**
 * On init this function will create elements and update any
 * attributes so it can validate user input.
 *
 * @param {HTMLInputElement} inputEl the components input
 */
const setValueOfMask = (inputEl) => {
  const { value } = inputEl;
  const placeholderVal = `${inputEl.dataset.placeholder.slice(value.length)}`;
  const theIEl = document.createElement("span");
  theIEl.textContent = value;
  return [theIEl, placeholderVal];
};

/**
 * On init this function will create elements and update any
 * attributes so it can validate user input.
 *
 * @param {HTMLInputElement} inputEl the components input
 */
const handleValueChange = (inputEl) => {
  const el = inputEl;
  const id = el.getAttribute("id");

  const maskVal = setValueOfMask(el);
  const maskEl = document.getElementById(`${id}Mask`);
  maskEl.textContent = "";
  maskEl.replaceChildren(maskVal[0], maskVal[1]);
};

/**
 * Paste text into an input element at a specific cursor position.
 *
 * @param {HTMLElement} inputEl - The input element.
 * @param {string} pastedText - The text to be pasted.
 * @param {number} curPos - The cursor position where the text will be pasted.
 */
const pasteTextToInput = (inputEl, pastedText, curPos) => {
  const el = inputEl;
  if (pastedText !== "") {
    let oldText = "";
    if (curPos > 0) {
      oldText = el.value.slice(0, curPos);
    }

    const newText = oldText + pastedText;

    el.value = newText;

    changeValue(inputEl, curPos);

    setCursorPosition(inputEl, el.value.length);

    handleValueChange(inputEl);
  }
};

/**
 * Removes a value from the input element based on the given position and whether or not the backspace key was pressed.
 * @param {HTMLInputElement} inputEl - The input element to remove the value from.
 * @param {number} curPos - The current position in the input element.
 * @param {boolean} [isBackspace=true] - Indicates whether the backspace key was pressed (true) or not (false).
 */
const checkRemoveValue = (inputEl, curPos, isBackspace = true) => {
  const el = inputEl;
  if (isBackspace) {
    const strVal = el.value.slice(0, curPos);
    const strNumberVal = removeFormatCharacters(strVal);
    if (strNumberVal === "" || curPos < 1) {
      return;
    }

    const prevCharater = el.value.charAt(curPos - 1);

    let startPos = curPos - 1;

    for (let i = startPos; i >= 0; i -= 1) {
      if (FORMAT_CHARACTERS.indexOf(el.value.charAt(i)) === -1) {
        startPos = i;
        break;
      }
    }

    const bEnd = curPos > el.value.length - 1;

    el.value =
      el.value.slice(0, startPos) + el.value.slice(curPos, el.value.length);

    if (FORMAT_CHARACTERS.indexOf(prevCharater) === -1 && bEnd) {
      setCursorPosition(inputEl, curPos - 1);
      return;
    }

    changeValue(inputEl, curPos);
    setCursorPosition(inputEl, startPos);
  } else {
    const strVal = el.value.slice(curPos, el.value.length);
    const strNumberVal = removeFormatCharacters(strVal);
    if (strNumberVal === "" || curPos > el.value.length - 1) {
      return;
    }

    let endPos = curPos + 1;
    for (let i = endPos; i < el.value.length; i += 1) {
      if (FORMAT_CHARACTERS.indexOf(el.value.charAt(i)) === -1) {
        endPos = i;
        break;
      }
    }

    el.value =
      el.value.slice(0, curPos) + el.value.slice(endPos, el.value.length);

    changeValue(inputEl);
    setCursorPosition(inputEl, curPos);
  }
};

/**
 * Creates and inserts a new shell element around the given input element, and
 * sets various attributes and properties for the input element and shell element.
 *
 * The shell element consists of a content element with a placeholder text taken
 * from the input element's `PLACEHOLDER` attribute.
 *
 * The `setInitMask` and `handleValueChange` functions are also called with the
 * input element as an argument.
 *
 * @param {HTMLElement} inputEl - The input element to be wrapped in a shell element.
 */
const createMaskedInputShell = (inputEl) => {
  const placeholder = inputEl.getAttribute(`${PLACEHOLDER}`);
  if (!placeholder) return;

  inputEl.setAttribute("maxlength", placeholder.length);
  inputEl.setAttribute("data-placeholder", placeholder);
  inputEl.removeAttribute(`${PLACEHOLDER}`);

  const shell = document.createElement("span");
  shell.classList.add(MASKED_INPUT_SHELL_CLASS);
  shell.setAttribute("data-mask", placeholder);

  const content = document.createElement("span");
  content.classList.add(MASKED_INPUT_CONTENT_CLASS);
  content.setAttribute("aria-hidden", "true");
  content.id = `${inputEl.id}Mask`;
  content.textContent = placeholder;

  shell.appendChild(content);
  inputEl.parentNode.insertBefore(shell, inputEl);
  shell.appendChild(inputEl);
};

/**
 * Returns an object containing the current status message and whether or not the
 * character type is valid.
 * @param {HTMLElement} inputEl - The input element.
 * @param {number} keyCode - The key code of the key that was pressed.
 * @param {string} key - The character that was entered.
 * @param {number} curPos - The current position in the input field.
 * @returns {{currentStatusMessage: string, currentSRStatusMessage: string, invalidCharType: boolean}} An object containing the current status message and whether or not the character type is valid.
 */
const getMaskMessage = (inputEl, keyCode, key, curPos) => {
  const isNumber = /^\d+$/.test(key);
  const invalidAlpha = inputEl.getAttribute("data-invalid-alpha-text")
    ? inputEl.getAttribute("data-invalid-alpha-text")
    : "Please enter a letter character here";
  const invalidNumeric = inputEl.getAttribute("data-invalid-numeric-text")
    ? inputEl.getAttribute("data-invalid-numeric-text")
    : "Please enter a number character here";
  const invalidStatusMessage = !isNumber ? invalidNumeric : invalidAlpha;
  const invalidCharacter = inputEl.getAttribute("data-invalid-character")
    ? inputEl.getAttribute("data-invalid-character")
    : "Invalid character";
  const invalidSRStatusMessage = `${invalidCharacter}. ${invalidStatusMessage}.`;

  const MASK = getPropertyValue(inputEl.id, "MASK", []);

  if (isValidCharacter(keyCode, MASK[curPos])) {
    return {
      currentStatusMessage: "",
      currentSRStatusMessage: "",
      invalidCharType: false,
    };
  }

  return {
    currentStatusMessage: invalidStatusMessage,
    currentSRStatusMessage: invalidSRStatusMessage,
    invalidCharType: true,
  };
};

/**
 * Updates the character count status for screen readers after a 200ms delay.
 *
 * @param {HTMLElement} msgEl - The screen reader status message element
 * @param {string} statusMessage - A string of the current character status
 */
const srUpdateStatus = debounce((msgEl, statusMessage) => {
  const srStatusEl = msgEl;
  srStatusEl.textContent = statusMessage;
}, 1000);

/**
 * Hides a status message by setting its text content and screen-reader-only status message element's text content to an empty string, and removing the `MESSAGE_INVALID_CLASS` class from the status message element.
 *
 * @param {HTMLElement} inputEl - The input element associated with the status message to be hidden.
 */
const hideMessage = (inputEl) => {
  const parent = inputEl.closest(`.${MASKED_INPUT_SHELL_CLASS}`);
  const visibleStatusEl = parent.querySelector(`.${STATUS_MESSAGE_CLASS}`);
  const srStatusEl = parent.querySelector(`.${STATUS_MESSAGE_SR_ONLY_CLASS}`);

  visibleStatusEl.textContent = "";
  srUpdateStatus(srStatusEl, " ");
  visibleStatusEl.classList.toggle(MESSAGE_INVALID_CLASS, false);
};

/**
 * On input, it will update visual status, screen reader
 * status, and update input validation (if invalid character is entered).
 *
 * @param {HTMLInputElement} inputEl The masked input element
 * @param {number} keyCode The key number code
 */
const updateMaskMessage = (inputEl, keyCode, key, curPos) => {
  const MASK = getPropertyValue(inputEl.id, "MASK", []);
  const parent = inputEl.closest(`.${MASKED_INPUT_SHELL_CLASS}`);
  const visibleStatusEl = parent.querySelector(`.${STATUS_MESSAGE_CLASS}`);
  const srStatusEl = parent.querySelector(`.${STATUS_MESSAGE_SR_ONLY_CLASS}`);

  if (
    (curPos < MASK.length && FORMAT_CHARACTERS.indexOf(MASK[curPos]) > -1) ||
    curPos >= MASK.length
  ) {
    return;
  }

  const { currentStatusMessage, currentSRStatusMessage, invalidCharType } =
    getMaskMessage(inputEl, keyCode, key, curPos);

  visibleStatusEl.textContent = currentStatusMessage;
  srUpdateStatus(srStatusEl, currentSRStatusMessage);

  visibleStatusEl.classList.toggle(MESSAGE_INVALID_CLASS, invalidCharType);
};

/**
 * Check if there is an available character to the left of the current position in the mask.
 *
 * @param {number} curPos - The current position in the mask.
 * @returns {boolean} - `true` if there is an available character to the left, `false` otherwise.
 */
const checkAvailableLeft = (inputEl, curPos) => {
  if (curPos === 0) {
    return true;
  }

  let result = false;
  const MASK = getPropertyValue(inputEl.id, "MASK", []);

  for (let i = curPos - 1; i >= 0; i -= 1) {
    if (FORMAT_CHARACTERS.indexOf(MASK[i]) === -1) {
      result = true;
      break;
    }
  }

  return result;
};

/**
 * Handles a paste event on the given input element by inserting the pasted
 * text at the current cursor position.
 * @param {HTMLInputElement} inputEl - The input element to insert the pasted text into.
 * @param {Event} event - The paste event.
 */
const handlePaste = (inputEl, event) => {
  const clipboardData = event.clipboardData || window.clipboardData;
  const curPos = getCursorPosition(inputEl);
  let pastedText = clipboardData.getData("text/plain") || "";
  pastedText = pastedText.trim();

  event.preventDefault();

  const validPastedText = getValidPastedText(inputEl, pastedText, curPos);

  if (!validPastedText) {
    updateMaskMessage(inputEl);
  } else {
    hideMessage(inputEl);
  }

  pasteTextToInput(inputEl, validPastedText, curPos);

  return false;
};

/**
 * Handle the `keyup` event for an input element.
 *
 * @param {HTMLElement} inputEl - The input element.
 * @param {Event} event - The `keyup` event object.
 * @returns {boolean} - `false` if the event is handled, `true` otherwise.
 */
const handleKeyUp = (inputEl, event) => {
  const keyCode = event.which;
  const el = inputEl;

  if (keyCode === undefined && el.value.length > 0) {
    const pastedText = getValidPastedText(inputEl, el.value);
    el.value = "";
    pasteTextToInput(inputEl, pastedText, 0);

    if (pastedText === "") {
      setInitMask(inputEl);
    }
    event.preventDefault();
    return false;
  }
  return true;
};

const getAvailablePos = (inputEl, curPos) => {
  let res = curPos + 1;
  const el = inputEl;
  for (let i = curPos + 1; i < el.value.length; i += 1) {
    const MASK = getPropertyValue(inputEl.id, "MASK", []);
    if (FORMAT_CHARACTERS.indexOf(MASK[i]) === -1) {
      res = i;
      break;
    }
  }
  return res;
};

const handleFocus = (inputEl, event) => {
  event.preventDefault();

  const el = inputEl;
  if (el.value === undefined || el.value === "") {
    setInitMask(el);
  } else {
    setCursorPosition(inputEl, el.value.length);
  }
};

/**
 * Handles a click on an input element
 * @param {HTMLElement} inputEl - The HTML element that was clicked
 * @param {Event} event - The click event
 */
const handleClick = (inputEl, event) => {
  const el = inputEl;
  event.preventDefault();

  const curPos = getCursorPosition(el);

  if (curPos === 0) {
    const MASK = getPropertyValue(inputEl.id, "MASK", []);

    if (FORMAT_CHARACTERS.indexOf(MASK[curPos]) > -1) {
      if (el.value === "") {
        setInitMask(el);
      } else {
        setCursorPosition(inputEl, getAvailablePos(el, curPos));
      }
    }
  }
};

/**
 * Handles the key down event for the input element.
 *
 * @param {HTMLElement} inputEl - The input element.
 * @param {Event} event - The event object.
 * @returns {boolean} Whether or not the event should be propagated.
 */
const handleKeyDown = (inputEl, event) => {
  const el = inputEl;

  let keyCode = event.which;

  let curPos = getCursorPosition(el);

  const MASK = getPropertyValue(el.id, "MASK", []);
  if (keyCode === undefined) {
    return true;
  }

  if (keyCode === KEYS.command || event.ctrlKey || keyCode === KEYS.shift) {
    return true;
  }
  const copyCutPasteKeys =
    [KEYS.v, KEYS.c, KEYS.x].indexOf(keyCode) > -1 &&
    (keyCode === KEYS.command || event.ctrlKey);

  if (copyCutPasteKeys) {
    return true;
  }

  if (event.metaKey && [KEYS.v, KEYS.c, KEYS.x, KEYS.a].indexOf(keyCode) > -1) {
    return true;
  }
  const movementKeys =
    [KEYS.left, KEYS.right, KEYS.up, KEYS.down, KEYS.tab].indexOf(keyCode) > -1;

  if (movementKeys) {
    if (keyCode === KEYS.left && !checkAvailableLeft(inputEl, curPos)) {
      event.preventDefault();
      return false;
    }

    return true;
  }

  if (el.selectionStart === 0 && el.selectionEnd === el.value.length) {
    setPropertyValue(inputEl.id, "ORIGINAL_VALUE", el.value);

    el.value = getInitMaskValue(el.id);
    setCursorPosition(inputEl, el.value.length);
  }

  if (keyCode === KEYS.escape) {
    const ORIGINAL_VALUE = getPropertyValue(inputEl.id, "ORIGINAL_VALUE", "");
    if (ORIGINAL_VALUE !== "") {
      el.value = ORIGINAL_VALUE;
    }

    return true;
  }

  if (keyCode === KEYS.backSpace || keyCode === KEYS.delete) {
    curPos = getCursorPosition(el);
    if (curPos < el.value.length) {
      if (checkMaskForLetters(inputEl.id)) {
        event.preventDefault();
        return false;
      }
    }

    if (keyCode === KEYS.backSpace) {
      checkRemoveValue(inputEl, getCursorPosition(el));
      hideMessage(inputEl);
    }

    if (keyCode === KEYS.delete) {
      checkRemoveValue(inputEl, getCursorPosition(el), false);
      hideMessage(inputEl);
    }

    handleValueChange(el);

    event.preventDefault();

    return false;
  }

  curPos = getCursorPosition(el);

  if (
    curPos === 0 &&
    FORMAT_CHARACTERS.indexOf(MASK[curPos]) > -1 &&
    el.value === getInitMaskValue(inputEl.id)
  ) {
    const lastPosition = el.value.length;

    updateMaskMessage(el, keyCode, event.key, el.value.length);
    if (isValidCharacter(keyCode, MASK[lastPosition])) {
      if (keyCode >= KEYS.numberPadZero && keyCode <= KEYS.numberPadNine) {
        keyCode -= 48;
      }

      let keyVal = event.key;

      if (getPropertyValue(inputEl.id, "FORCE_UPPER", false)) {
        keyVal = keyVal.toUpperCase();
      }

      if (getPropertyValue(inputEl.id, "FORCE_LOWER", false)) {
        keyVal = keyVal.toLowerCase();
      }

      insertCharacterAtIndex(el, lastPosition, keyVal);

      const HAS_MASK = getPropertyValue(inputEl.id, "HAS_MASK", false);
      if (HAS_MASK) {
        checkAndInsertMaskCharacters(el, lastPosition);
      }
    }

    setCursorPosition(el, el.value.length);
    handleValueChange(el);

    event.preventDefault();
    return false;
  }

  if (curPos < el.value.length) {
    if (
      FORMAT_CHARACTERS.indexOf(MASK[curPos]) > -1 ||
      checkMaskForLetters(inputEl.id)
    ) {
      setCursorPosition(inputEl, el.value.length);
      event.preventDefault();
      return false;
    }
  }

  updateMaskMessage(el, keyCode, event.key, getCursorPosition(inputEl));

  if (isValidCharacter(keyCode, MASK[getCursorPosition(el)])) {
    if (keyCode >= KEYS.numberPadZero && keyCode <= KEYS.numberPadNine) {
      keyCode -= 48;
    }

    let temp = event.key;

    const FORCE_UPPER = getPropertyValue(inputEl.id, "FORCE_UPPER", false);

    if (FORCE_UPPER) {
      temp = temp.toUpperCase();
    }

    const FORCE_LOWER = getPropertyValue(inputEl.id, "FORCE_LOWER", false);

    if (FORCE_LOWER) {
      temp = temp.toLowerCase();
    }

    insertCharacterAtIndex(el, getCursorPosition(el), temp);

    const HAS_MASK = getPropertyValue(inputEl.id, "HAS_MASK", false);
    if (HAS_MASK) {
      checkAndInsertMaskCharacters(el, getCursorPosition(el));
    }
  }

  handleValueChange(el);

  event.preventDefault();

  return false;
};

/**
 * On init this function will create elements and update any
 * attributes so it can validate user input.
 *
 * @param {HTMLInputElement} inputEl the components input
 * @param {HTMLInputElement.dataset} options the components input attributes
 */
const enhanceInputMask = (inputEl) => {
  const attrs = inputEl.attributes;
  const inputId = inputEl.id;

  if (!attrs.mask) {
    throw new Error(
      `${MASKED_INPUT_CLASS} is missing the mask attribute. Learn more at http://designsystem.digital.gov/components/input-mask/#available-attributes.`
    );
  }
  if (!attrs.placeholder) {
    throw new Error(
      `${MASKED_INPUT_CLASS} is missing the placeholder attribute. Learn more at http://designsystem.digital.gov/components/input-mask/#available-attributes.`
    );
  }

  if (attrs.mask && attrs.mask.value.length > 0) {
    setPropertyValue(inputId, "MASK", attrs.mask.value.split(""));
    setPropertyValue(inputId, "HAS_MASK", true);
  }

  if (attrs.forceupper && attrs.forceupper.value === "true") {
    setPropertyValue(inputId, "FORCE_UPPER", true);
  }

  if (attrs.forcelower && attrs.forcelower.value === "true") {
    setPropertyValue(inputId, "FORCE_LOWER", true);
  }

  createMaskedInputShell(inputEl);
  createStatusMessages(inputEl);
};

const inputMaskEvents = {
  click: {
    [MASKED_INPUT](event) {
      handleClick(this, event);
    },
  },
  focusin: {
    [MASKED_INPUT](event) {
      handleFocus(this, event);
    },
  },
  keydown: {
    [MASKED_INPUT](event) {
      handleKeyDown(this, event);
    },
  },
  keyup: {
    [MASKED_INPUT](event) {
      handleKeyUp(this, event);
    },
  },
  paste: {
    [MASKED_INPUT](event) {
      handlePaste(this, event, null);
    },
  },
};

const inputMask = behavior(inputMaskEvents, {
  init(root) {
    selectOrMatches(MASKED_INPUT, root).forEach((maskedInput) => {
      enhanceInputMask(maskedInput);
    });
  },
});

module.exports = inputMask;
