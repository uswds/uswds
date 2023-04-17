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
const DEFAULT_STATUS_LABEL = `character is required here`;

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

const MASK_INFO = {};

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

/**
 * Updates the key value pair of the mask info object
 * @param {string} id - the key of the mask info object
 * @param {string} key - the key of the value pair to be updated
 * @param {*} value - the new value for the specified key
 */
const setMaskInfo = (id, key, value) => {
  const idKeys = Object.keys(MASK_INFO);
  if (idKeys.indexOf(id) === -1) {
    MASK_INFO[id] = {};
  }

  MASK_INFO[id][key] = value;
};

/**
 * Gets the value of the specified key in the MASK_INFO object for a given id.
 *
 * @param {string} id - The id to get the mask info from.
 * @param {string} key - The key to get the value of.
 * @param {any} [defaultVal=null] - The default value to return if no value is found.
 *
 * @return {any} The value of the specified key in the MASK_INFO object or the given default value if not found.
 */
const getMaskInfo = (id, key, defaultVal = null) => {
  if (MASK_INFO[id] && MASK_INFO[id][key]) {
    return MASK_INFO[id][key];
  }

  return defaultVal;
};

/**
 * Checks if the mask contains any alphabetic characters.
 *
 * @returns {boolean} True if the mask contains at least one alphabetic character, false otherwise.
 */
const checkMaskForLetters = (inputId) => {
  if (MASK_INFO[inputId] && MASK_INFO[inputId].MASK) {
    return MASK_INFO[inputId].MASK.some((char) => char !== char.toLowerCase());
  }

  return false;
};

/**
 * Extracts the numeric characters from a string.
 *
 * @param {string} strVal - The input string to process.
 * @returns {string} The numeric characters from the input string.
 */
const getMatchValue = (strVal) => {
  if (!strVal) {
    return "";
  }

  let newValue = strVal;
  for (let i = 0; i < FORMAT_CHARACTERS.length; i += 1) {
    newValue = newValue.replaceAll(FORMAT_CHARACTERS[i], "");
  }

  return newValue;
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

  const MASK = getMaskInfo(el.id, "MASK", []);

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
  const MASK = getMaskInfo(inputId, "MASK", []);

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
  const MASK = getMaskInfo(el.id, "MASK", []);
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
  const strValue = getMatchValue(el.value);

  let newValue = "";
  let index = 0;

  const MASK = getMaskInfo(el.id, "MASK", []);

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

  const strNumber = getMatchValue(newValue);
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
 * Creates and appends two new elements to the given element: a visible status message element and a screen-reader-only status message element.
 * Both elements have the same default text content and are given specific classes and attributes.
 *
 * @param {HTMLElement} maskedEl - The element to which the new status message elements will be appended.
 */
const createStatusMessages = (maskedEl) => {
  const statusMessageEl = document.createElement("div");
  const srStatusMessageEl = document.createElement("div");

  statusMessageEl.classList.add(`${STATUS_MESSAGE_CLASS}`);
  srStatusMessageEl.classList.add(
    `${STATUS_MESSAGE_SR_ONLY_CLASS}`,
    "usa-sr-only"
  );

  statusMessageEl.setAttribute("aria-hidden", true);
  srStatusMessageEl.setAttribute("aria-live", "assertive");

  maskedEl.insertAdjacentElement("afterend", statusMessageEl);
  statusMessageEl.insertAdjacentElement("afterend", srStatusMessageEl);
};

/**
 * Extracts the valid text from a given string of pasted text, based on the current mask.
 * @param {string} pastedText - The string of pasted text to extract from.
 * @return {string} The extracted, valid text.
 */
const getPastedText = (inputEl, pastedText) => {
  let strRes = "";
  let strPastedtext = "";

  for (let i = 0; i < pastedText.length; i += 1) {
    if (FORMAT_CHARACTERS.indexOf(pastedText[i]) === -1) {
      strPastedtext += pastedText[i];
    }
  }

  let strMask = "";

  const MASK = getMaskInfo(inputEl.id, "MASK", []);

  for (let i = 0; i < MASK.length; i += 1) {
    if (FORMAT_CHARACTERS.indexOf(MASK[i]) === -1) {
      strMask += MASK[i];
    }
  }

  const minLength =
    strPastedtext.length > strMask.length
      ? strMask.length
      : strPastedtext.length;

  const isNumber = /[0-9]/;
  for (let i = 0; i < minLength; i += 1) {
    if (
      (isNumber.test(strPastedtext[i]) && isNumber.test(strMask[i])) ||
      (!isNumber.test(strPastedtext[i]) && !isNumber.test(strMask[i]))
    ) {
      strRes += strPastedtext[i];
    } else {
      return "";
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
 * Handles a paste event on the given input element by inserting the pasted text at the current cursor position.
 * @param {HTMLInputElement} inputEl - The input element to insert the pasted text into.
 * @param {Event} event - The paste event.
 */
const handlePaste = (inputEl, event) => {
  let pastedText = "";

  const clipboardData = event.clipboardData || window.clipboardData;
  pastedText = clipboardData.getData("text/plain");
  const el = inputEl;

  pastedText = pastedText.trim();
  pastedText = getPastedText(inputEl, pastedText);

  const curPos = getCursorPosition(el);

  pasteTextToInput(inputEl, pastedText, curPos);

  event.preventDefault();
  return false;
};

/**
 * Finds and returns the closest ancestor element with the `MASKED` class and the first descendant element with the `MESSAGE` class.
 * Throws an error if either element is not found. If the `onlyElement` argument is `false`, the `handlePaste` function is called with the input element and its value as arguments.
 *
 * @param {HTMLElement} inputEl - The input element from which to start searching for the masked and message elements.
 * @param {boolean} [onlyElement=false] - A flag indicating whether to only return the elements or to also call the `handlePaste` function.
 * @returns {Object} An object containing the `maskedEl` element.
 * @throws {Error} If the `maskedEl` element is not found.
 */
const getMaskedElements = (inputEl, onlyElement = false) => {
  const maskedEl = inputEl;
  const el = inputEl;
  const { value } = el;

  if (onlyElement === false && value != null && value !== "") {
    handlePaste(el, null, value);
  }
  return { maskedEl };
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
    const strNumberVal = getMatchValue(strVal);
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
    const strNumberVal = getMatchValue(strVal);
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
 * Creates and inserts a new shell element around the given input element, and sets various attributes and properties for the input element and shell element.
 * The shell element consists of a content element with a placeholder text taken from the input element's `PLACEHOLDER` attribute.
 * The `setInitMask` and `handleValueChange` functions are also called with the input element as an argument.
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
 * @returns {{currentStatusMessage: string, invalidCharType: boolean}} An object containing the current status message and whether or not the character type is valid.
 */
const getMaskMessage = (inputEl, keyCode, key, curPos) => {
  const isNumber = /^\d+$/.test(key);
  const theCharType = !isNumber ? "number" : "letter";

  const MASK = getMaskInfo(inputEl.id, "MASK", []);

  if (isValidCharacter(keyCode, MASK[curPos])) {
    return { currentStatusMessage: "", invalidCharType: false };
  }

  return {
    currentStatusMessage: `A ${theCharType} ${DEFAULT_STATUS_LABEL}`,
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
  const srStatusMessageEl = msgEl;
  srStatusMessageEl.textContent = statusMessage;
}, 200);

/**
 * Hides a status message by setting its text content and screen-reader-only status message element's text content to an empty string, and removing the `MESSAGE_INVALID_CLASS` class from the status message element.
 *
 * @param {HTMLElement} inputEl - The input element associated with the status message to be hidden.
 */
const hideMessage = (inputEl, statusMessageEl, srStatusMessageEl) => {
  const statusEl = statusMessageEl;

  statusEl.textContent = "";
  srUpdateStatus(srStatusMessageEl, "");
  statusMessageEl.classList.toggle(MESSAGE_INVALID_CLASS, false);
};

/**
 * On input, it will update visual status, screenreader
 * status and update input validation (if invalid character is entered).
 *
 * @param {HTMLInputElement} inputEl The masked input element
 * @param {number} keyCode The key number code
 */
const updateMaskMessage = (inputEl, statusMessageEl, srStatusMessageEl, keyCode, key, curPos) => {
  const MASK = getMaskInfo(inputEl.id, "MASK", []);
  const statusEl = statusMessageEl;

  if (
    (curPos < MASK.length && FORMAT_CHARACTERS.indexOf(MASK[curPos]) > -1) ||
    curPos >= MASK.length
  ) {
    return;
  }

  const { currentStatusMessage, invalidCharType } = getMaskMessage(
    inputEl,
    keyCode,
    key,
    curPos
  );

  statusEl.textContent = currentStatusMessage;
  srUpdateStatus(srStatusMessageEl, currentStatusMessage);

  statusEl.classList.toggle(MESSAGE_INVALID_CLASS, invalidCharType);
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
  const MASK = getMaskInfo(inputEl.id, "MASK", []);

  for (let i = curPos - 1; i >= 0; i -= 1) {
    if (FORMAT_CHARACTERS.indexOf(MASK[i]) === -1) {
      result = true;
      break;
    }
  }

  return result;
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
    const pastedText = getPastedText(inputEl, el.value);
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
    const MASK = getMaskInfo(inputEl.id, "MASK", []);
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
    const MASK = getMaskInfo(inputEl.id, "MASK", []);

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
  const inputElContainer = inputEl.parentNode;
  const statusMessageEl = inputElContainer.querySelector(`.${STATUS_MESSAGE_CLASS}`);
  const srStatusMessageEl = inputElContainer.querySelector(`.${STATUS_MESSAGE_SR_ONLY_CLASS}`);

  let keyCode = event.which;

  let curPos = getCursorPosition(el);

  const MASK = getMaskInfo(el.id, "MASK", []);
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
    if (checkMaskForLetters(inputEl.id)) {
      event.preventDefault();
      return false;
    }

    if (keyCode === KEYS.left && !checkAvailableLeft(inputEl, curPos)) {
      event.preventDefault();
      return false;
    }

    return true;
  }

  if (el.selectionStart === 0 && el.selectionEnd === el.value.length) {
    setMaskInfo(inputEl.id, "ORIGINAL_VALUE", el.value);

    el.value = getInitMaskValue(el.id);
    setCursorPosition(inputEl, el.value.length);
  }

  if (keyCode === KEYS.escape) {
    const ORIGINAL_VALUE = getMaskInfo(inputEl.id, "ORIGINAL_VALUE", "");
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
      hideMessage(inputEl, statusMessageEl, srStatusMessageEl);
    }

    if (keyCode === KEYS.delete) {
      checkRemoveValue(inputEl, getCursorPosition(el), false);
      hideMessage(inputEl, statusMessageEl, srStatusMessageEl);
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

    updateMaskMessage(el, statusMessageEl, srStatusMessageEl, keyCode, event.key, el.value.length);
    if (isValidCharacter(keyCode, MASK[lastPosition])) {
      if (keyCode >= KEYS.numberPadZero && keyCode <= KEYS.numberPadNine) {
        keyCode -= 48;
      }

      let keyVal = event.key;

      if (getMaskInfo(inputEl.id, "FORCE_UPPER", false)) {
        keyVal = keyVal.toUpperCase();
      }

      if (getMaskInfo(inputEl.id, "FORCE_LOWER", false)) {
        keyVal = keyVal.toLowerCase();
      }

      insertCharacterAtIndex(el, lastPosition, keyVal);

      const HAS_MASK = getMaskInfo(inputEl.id, "HAS_MASK", false);
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

  updateMaskMessage(el, statusMessageEl, srStatusMessageEl, keyCode, event.key, getCursorPosition(inputEl));

  if (isValidCharacter(keyCode, MASK[getCursorPosition(el)])) {
    if (keyCode >= KEYS.numberPadZero && keyCode <= KEYS.numberPadNine) {
      keyCode -= 48;
    }

    let temp = event.key;

    const FORCE_UPPER = getMaskInfo(inputEl.id, "FORCE_UPPER", false);

    if (FORCE_UPPER) {
      temp = temp.toUpperCase();
    }

    const FORCE_LOWER = getMaskInfo(inputEl.id, "FORCE_LOWER", false);

    if (FORCE_LOWER) {
      temp = temp.toLowerCase();
    }

    insertCharacterAtIndex(el, getCursorPosition(el), temp);

    const HAS_MASK = getMaskInfo(inputEl.id, "HAS_MASK", false);
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
const enhanceInputMask = (inputEl, options) => {
  if (!inputEl || !options) {
    throw new Error(`${MASKED_INPUT_CLASS} is missing correct attributes`);
  }
  const { value } = inputEl;
  const { maskedEl } = getMaskedElements(inputEl);

  const el = inputEl;
  const inputId = el.id;

  if (options.mask && options.mask.length > 0) {
    setMaskInfo(inputId, "MASK", options.mask.split(""));
    setMaskInfo(inputId, "HAS_MASK", true);
  }

  if (options.forceupper && options.forceupper === "true") {
    setMaskInfo(inputId, "FORCE_UPPER", true);
  }

  if (options.forcelower && options.forcelower === "true") {
    setMaskInfo(inputId, "FORCE_LOWER", true);
  }

  const HAS_MASK = getMaskInfo(inputId, "HAS_MASK", false);

  if (value.length > 0 && HAS_MASK) {
    handlePaste(inputEl, null, value);
  }

  createMaskedInputShell(inputEl);
  createStatusMessages(maskedEl);
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
      const nodes = [];
      const values = [];
      const options = {};
      for (
        let attr, i = 0, attrs = maskedInput.attributes, n = attrs.length;
        i < n;
        i += 1
      ) {
        attr = attrs[i];
        nodes.push(attr.nodeName);
        values.push(attr.nodeValue);
      }

      for (let i = 0; i < nodes.length; i += 1) {
        options[nodes[i]] = values[i];
      }
      enhanceInputMask(maskedInput, options);
    });
  },
});

module.exports = inputMask;
