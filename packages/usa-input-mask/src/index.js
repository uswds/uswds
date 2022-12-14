// const keymap = require("receptor/keymap");
const selectOrMatches = require("../../uswds-core/src/js/utils/select-or-matches");
const behavior = require("../../uswds-core/src/js/utils/behavior");
const debounce = require("../../uswds-core/src/js/utils/debounce");
const { prefix: PREFIX } = require("../../uswds-core/src/js/config");
const { isConstructSignatureDeclaration } = require("typescript");

const MASKED_CLASS = `${PREFIX}-input-mask`;
const MASKED = `.${MASKED_CLASS}`;
const MASK_SHELL = `${MASKED_CLASS}__shell`;
const MASK_CONTENT = `${MASKED_CLASS}__content`;
const INPUT = `${MASKED}__field`;
const MESSAGE = `${MASKED}__message`;
const PLACEHOLDER = "placeholder";
// const VALIDATION_MESSAGE = "The content is too long.";
const MESSAGE_INVALID_CLASS = `${MASKED_CLASS}__status--invalid`;
const STATUS_MESSAGE_CLASS = `${MASKED_CLASS}__status`;
const STATUS_MESSAGE_SR_ONLY_CLASS = `${MASKED_CLASS}__sr-status`;
const STATUS_MESSAGE = `.${STATUS_MESSAGE_CLASS}`;
const STATUS_MESSAGE_SR_ONLY = `.${STATUS_MESSAGE_SR_ONLY_CLASS}`;
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
  " ",
  "/",
  " ",
];

// const MASK_CHARACTERS = ["A", "9", "*"];
let ORIGINAL_VALUE = "";
let MASK = null;
let FORCE_UPPER = false;
let FORCE_LOWER = false;
let HAS_MASK = false;

const KEYS = {
  asterisk: 42,
  zero: 48,
  nine: 57,
  a: 65,
  z: 90,
  backSpace: 8,
  tab: 9,
  delete: 46,
  left: 37,
  right: 39,
  end: 35,
  home: 36,
  numberPadZero: 96,
  numberPadNine: 105,
  shift: 16,
  enter: 13,
  control: 17,
  command: 91,
  escape: 27,
  v: 86,
  c: 67,
  x: 88,
  parenthesisLeft: 57,
  parenthesisRight: 48,
};

const strLetter = "";

// Refactored
const checkMaskStatus = () =>
  MASK.some((c) => c.toUpperCase() !== c.toLowerCase());
// QQQ
/* const checkMaskStatus = () => {
  let bStatus = false;
  for (let i = 0; i < MASK.length; i += 1) {
    if (MASK[i].toUpperCase() !== MASK[i].toLowerCase()) {
      bStatus = true;
      break;
    }
  }

  return bStatus;
}; */

/**
 * Extracts the numeric characters from a string.
 *
 * @param {string} strVal - The input string to process.
 * @returns {string} The numeric characters from the input string.
 */
const getstrNumbers = (strVal) => {
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
 * Get the cursor position
 *
 * @param {HTMLDivElement} inputEl - Input with `.usa-masked__field` class
 * @returns {number} - Cursor position
 */
// Refactored
const getCursorPosition = (inputEl) => {
  if (document.selection) {
    inputEl.focus();
    const selectRange = document.selection.createRange();
    selectRange.moveStart("character", -inputEl.value.length);
    return selectRange.text.length;
  }
  return inputEl.selectionStart || 0;
};

/* const getCursorPosition = (inputEl) => {
  let position = 0;

  if (document.selection) {
    inputEl.focus();

    const selectRange = document.selection.createRange();

    selectRange.moveStart("character", -inputEl.value.length);

    position = selectRange.text.length;
  } else if (inputEl.selectionStart || inputEl.selectionStart === "0") {
    position = inputEl.selectionStart;
  }

  return position;
}; */

/**
 * Set cursor position
 *
 * @param {HTMLInputElement} inputEl - Input with `.usa-masked__field` class
 * @param {number} cursorPos - Cursor position
 */
// Refactored
const setCursorPosition = (inputEl, cursorPos) => {
  if (inputEl == null) return;
  if (inputEl.createTextRange) {
    const range = inputEl.createTextRange();
    range.move("character", cursorPos);
    range.select();
  } else if (inputEl.selectionStart) {
    inputEl.focus();
    inputEl.setSelectionRange(cursorPos, cursorPos);
  } else {


    // check here
    if (cursorPos <= inputEl.value.length) {
      inputEl.setSelectionRange(cursorPos, cursorPos);
    }

    inputEl.focus();
  }
};

/* const setCursorPosition = (inputEl, cursorPos) => {
  const el = inputEl;
  if (el != null) {
    if (el.createTextRange) {
      const range = el.createTextRange();

      range.move("character", cursorPos);

      range.select();
    } else if (el.selectionStart) {
      el.focus();

      el.setSelectionRange(cursorPos, cursorPos);
    } else {
      el.focus();
    }
  }
}; */

/**
 * Returns message
 *
 * @param {inputEl} inputEl - The current character key number code
 * @param {curPos} validCharType - The type of characters allowed
 */

const insertMaskUntilNumber = (inputEl, curPos) => {
  const el = inputEl;
  let strAddVal = "";

  let newPos = curPos;

  const maxLength =
    curPos > el.value.length - 1 ? MASK.length : el.value.length;

  for (let i = curPos; i < maxLength; i += 1) {
    if (FORMAT_CHARACTERS.indexOf(MASK[i]) === -1) {
      // means number
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
 * Check if character is valid and matches mask
 *
 * @param {number} keyCode - Key code
 * @param {string | number} maskCharacter - Mask character
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
 * Remove character at index
 *
 * @param {HTMLInputElement} inputEl - Input with `.usa-masked__field` class
 * @param {number} cursorPos - Cursor position
 */
const removeCharacterAtIndex = (inputEl, cursorPos) => {
  const el = inputEl;
  if (el.value.length > 0) {
    const newElementValue =
      el.value.slice(0, cursorPos) + el.value.slice(cursorPos + 1);

    el.value = newElementValue;

    if (el.value.length > 0) {
      setCursorPosition(el, cursorPos);
    } else {
      el.focus();
    }
  }
};

/**
 * Insert character at index
 *
 * @param {HTMLInputElement} inputEl - Input with `.usa-masked__field` class
 * @param {number} cursorPos - Cursor position
 * @param {string | number} character - Character to insert
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

// QQQ set init mask
const setInitMask = (inputEl) => {
  const el = inputEl;
  let position = 0;
  let strInitVal = "";
  for (let i = 0; i < MASK.length; i += 1) {
    if (FORMAT_CHARACTERS.indexOf(MASK[i]) === -1) {
      position = i;
      break;
    } else {
      strInitVal += MASK[i];
    }
  }

  el.value = strInitVal;
  setCursorPosition(inputEl, position);
};

/**
 * Check and insert masked characters
 *
 * @param {HTMLInputElement} inputEl - Input with `.usa-masked__field` class
 * @param {number} cursorPos - Cursor position
 */

const changeValue = (inputEl, cursorPos) => {
  const el = inputEl;
  // let i = cursorPos;

  // get only values
  const strValue = getstrNumbers(el.value);

  let newValue = "";
  let index = 0;

  for (let i = 0; i < MASK.length; i += 1) {
    if (index >= strValue.length) {
      break;
    }

    //
    if (FORMAT_CHARACTERS.indexOf(MASK[i]) > -1) {
      newValue += MASK[i];
    } else if (strValue.length > index) {
      newValue += strValue.charAt(index);
      index += 1;
    }
  }

  el.value = newValue;

  let strNumber = getstrNumbers(newValue);
  if (strNumber === "") {
    setInitMask(inputEl);
  }
};

/**
 * Insert character at index
 *
 * @param {HTMLInputElement} inputEl - Input with `.usa-masked__field` class
 * @param {number} cursorPos - Cursor position
 * @param {string | number} character - Character to insert
 */
const checkAndInsertMaskCharacters = (inputEl, cursorPos) => {
  const el = inputEl;
  // let i = cursorPos;

  // get only values
  changeValue(inputEl, cursorPos);

  //
  setCursorPosition(inputEl, cursorPos);

  if (el.value.length > 0) {
    insertMaskUntilNumber(inputEl, cursorPos);
    // setCursorPosition(el, cursorPos);

    // if (cursorPos < el.value.length - 1) {
    //   if (FORMAT_CHARACTERS.indexOf(MASK[cursorPos]) > -1) {
    //     setCursorPosition(el, cursorPos + 1);
    //   }
    // }
  } else {
    el.focus();
  }

  // while (true) {
  //   const isMaskCharacter = FORMAT_CHARACTERS.indexOf(MASK[i]) > -1;
  //   const maskAlreadyThere = el.value.charAt(i) === MASK[i];

  //   if (isMaskCharacter && !maskAlreadyThere) {
  //     insertCharacterAtIndex(el, i, MASK[i]);

  //     if (cursorPos < el.value.length - 1) {
  //       temp(inputEl, cursorPos + 1);
  //     }
  //   } else {

  //     return;
  //   }

  //   i += 1;
  // }
};

/**
 * Check and remove masked characters
 *
 * @param {HTMLInputElement} inputEl - Input with `.usa-masked__field` class
 * @param {number} cursorPos - Cursor position
 * @param {number} keyCode - The key number code
 */
const checkAndRemoveMaskCharacters = (inputEl, cursorPos, keyCode) => {
  const el = inputEl;

  let index = 0;

  if (keyCode === KEYS.backSpace) {
    if (cursorPos > 0) {
      index = cursorPos - 1;
    } else {
      return;
    }
  } else if (keyCode === KEYS.delete) {
    if (cursorPos < el.value.length - 1) {
      index = cursorPos;
    } else {
      return;
    }
  }

  el.value = el.value.slice(0, index) + el.value.slice(index + 1);

  changeValue(inputEl, cursorPos);
  setCursorPosition(inputEl, index);

  // let i = cursorPos;
  // if (inputEl.value.length > 0) {
  //   while (inputEl.value.length) {
  //     const character = inputEl.value.charAt(i);

  //     const isMaskCharacter = FORMAT_CHARACTERS.indexOf(character) > -1;

  //     if (!isMaskCharacter || i === 0 || i === inputEl.value.length) {
  //       return;
  //     }

  //     removeCharacterAtIndex(inputEl, i);

  //     if (keyCode === KEYS.backSpace) {
  //       i -= 1;
  //     }

  //     if (keyCode === KEYS.delete) {
  //       i += 1;
  //     }
  //   }
  // }
};

/**
 * Create two status messages for invalid characters;
 * one visual status and another for screen readers
 *
 * @param {HTMLDivElement} maskedEl - Div with `.usa-masked` class
 */
const createStatusMessages = (maskedEl) => {
  const statusMessage = document.createElement("div");
  const srStatusMessage = document.createElement("div");
  const defaultMessage = `Please enter a valid character`;

  statusMessage.classList.add(`${STATUS_MESSAGE_CLASS}`, "usa-hint");
  srStatusMessage.classList.add(
    `${STATUS_MESSAGE_SR_ONLY_CLASS}`,
    "usa-sr-only"
  );

  statusMessage.setAttribute("aria-hidden", true);
  srStatusMessage.setAttribute("aria-live", "assertive");

  statusMessage.textContent = defaultMessage;
  srStatusMessage.textContent = defaultMessage;

  maskedEl.append(statusMessage, srStatusMessage);
};

/**
 * Handles the blur or focusout event
 *
 * @param {HTMLElement} inputEl - The maskedinput element
 */
const handleBlur = (inputEl) => {
  const el = inputEl;
  // if (el.value.length > 0) {

  // }
};

const setPostitionToLast = (inputEl) => {
  const el = inputEl;

  const strNumber = "1234567890";

  let position = 0;
  for (let i = el.value.length - 1; i >= 0; i -= 1) {
    if (strNumber.indexOf(el.value.charAt(i)) > -1) {
      position = i + 1;
      break;
    }
  }

  if (position < el.value.length - 1) {
    if (
      FORMAT_CHARACTERS.indexOf(el.value.charAt(position)) > -1 &&
      el.value.charAt(position) !== "_"
    ) {
      position += 1;
    }
  }

  setCursorPosition(inputEl, position);
};

/**
 * Handles the paste event
 *
 * @param {HTMLElement} inputEl - The maskedinput element
 * @param {event} event - The event object
 * @param {object} data - The data object
 */

/**
 * Returns the root and message element for a maskedinput
 *
 * @param {HTMLInputElement} inputEl - The maskedinput element
 * @returns {MaskedElements} - The root and message elements
 */
const getMaskedElements = (inputEl, onlyElement = false) => {
  const maskedEl = inputEl.closest(MASKED);

  if (!maskedEl) {
    throw new Error(`${INPUT} is missing outer ${MASKED}`);
  }

  const messageEl = maskedEl.querySelector(MESSAGE);

  if (!messageEl) {
    throw new Error(`${MASKED} is missing inner ${MESSAGE}`);
  }

  const el = inputEl;
  const { value } = el;

  // el.value = "";

  if (onlyElement === false && value != null && value !== "") {
    handlePaste(el, null, value);
  }
  return { maskedEl, messageEl };
};



// QQQ check enable for Backspace or delete
const checkRemoveValue = (inputEl, curPos, isBackspace = true) => {
  const el = inputEl;
  if (isBackspace) {
    const strVal = el.value.slice(0, curPos);
    const strNumberVal = getstrNumbers(strVal);
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
    const strNumberVal = getstrNumbers(strVal);
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
 * On init this function will create elements and update any
 * attributes so it can validate user input.
 *
 * @param {HTMLInputElement} inputEl the components input
 */
const setValueOfMask = (inputEl) => {
  const { value } = inputEl;
  const placeholderVal = `${inputEl.dataset.placeholder.slice(value.length)}`;
  const theIEl = document.createElement("i");
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
  console.log("handleValueChange");
  const el = inputEl;
  const id = el.getAttribute("id");
  // el.value = handleCurrentValue(el);

  const maskVal = setValueOfMask(el);
  const maskEl = document.getElementById(`${id}Mask`);
  maskEl.textContent = "";
  maskEl.replaceChildren(maskVal[0], maskVal[1]);
};

/**
 * Replace each masked input with a shell containing the input and it's mask.
 *
 * @param {HTMLInputElement} inputEl The masked input element
 */
const createMaskedInputShell = (inputEl) => {
  const placeholder = inputEl.getAttribute(`${PLACEHOLDER}`);
  if (!placeholder) return;

  inputEl.setAttribute("maxlength", placeholder.length);
  inputEl.setAttribute("data-placeholder", placeholder);
  inputEl.removeAttribute(`${PLACEHOLDER}`);

  const shell = document.createElement("span");
  shell.classList.add(MASK_SHELL);
  shell.setAttribute("data-mask", placeholder);

  const content = document.createElement("span");
  content.classList.add(MASK_CONTENT);
  content.setAttribute("aria-hidden", "true");
  content.id = `${inputEl.id}Mask`;
  content.textContent = placeholder;

  shell.appendChild(content);
  inputEl.parentNode.insertBefore(shell, inputEl);
  shell.appendChild(inputEl);

  setInitMask(inputEl);
  handleValueChange(inputEl);
};

/**
 * Returns message
 *
 * @param {number} keyCode - The current character key number code
 * @param {string} validCharType - The type of characters allowed
 * @returns {string} A string description notifying the user if the
 * character is valid or not
 */

const getMaskMessage = (inputEl, keyCode, key) => {
  const isNumber = /^\d+$/.test(key);
  const theCharType = !isNumber ? "number" : "letter";

  if (isValidCharacter(keyCode, MASK[getCursorPosition(inputEl)])) {
    return { currentStatusMessage: "", invalidCharType: false };
  }

  return {
    currentStatusMessage: `A ${theCharType} ${DEFAULT_STATUS_LABEL}`,
    invalidCharType: true,
  };
};

/* const getMaskMessage = (inputEl, keyCode, key) => {
  let currentStatusMessage = "";
  let invalidCharType = false;

  let isNumber = false;
  if ("1234567890".indexOf(key) > -1) {
    isNumber = true;
  }

  const theCharType = !isNumber ? "number" : "letter";

  if (isValidCharacter(keyCode, MASK[getCursorPosition(inputEl)])) {
    currentStatusMessage = "";
    invalidCharType = false;
  } else {
    currentStatusMessage = `A ${theCharType} ${DEFAULT_STATUS_LABEL}`;
    invalidCharType = true;
  }

  return { currentStatusMessage, invalidCharType };
}; */

/**
 * Updates the character count status for screen readers after a 200ms delay.
 *
 * @param {HTMLElement} msgEl - The screen reader status message element
 * @param {string} statusMessage - A string of the current character status
 */
const srUpdateStatus = debounce((msgEl, statusMessage) => {
  const srStatusMessage = msgEl;
  srStatusMessage.textContent = statusMessage;
}, 200);

const hideMessage = (inputEl) => {
  const { maskedEl } = getMaskedElements(inputEl, true);
  const statusMessage = maskedEl.querySelector(STATUS_MESSAGE);
  const srStatusMessage = maskedEl.querySelector(STATUS_MESSAGE_SR_ONLY);

  statusMessage.textContent = "";
  srUpdateStatus(srStatusMessage, "");

  statusMessage.classList.toggle(MESSAGE_INVALID_CLASS, false);
};

/**
 * On input, it will update visual status, screenreader
 * status and update input validation (if invalid character is entered).
 *
 * @param {HTMLInputElement} inputEl The masked input element
 * @param {number} keyCode The key number code
 */
const updateMaskMessage = (inputEl, keyCode, key) => {

  // check here
  const curPos = getCursorPosition(inputEl);
  if ((curPos < MASK.length && FORMAT_CHARACTERS.indexOf(MASK[curPos])  > -1) || curPos >= MASK.length) {
    return;
  }

  const { maskedEl } = getMaskedElements(inputEl, true);
  const statusMessage = maskedEl.querySelector(STATUS_MESSAGE);
  const srStatusMessage = maskedEl.querySelector(STATUS_MESSAGE_SR_ONLY);
  const { currentStatusMessage, invalidCharType } = getMaskMessage(
    inputEl,
    keyCode,
    key
  );

  

  statusMessage.textContent = currentStatusMessage;
  srUpdateStatus(srStatusMessage, currentStatusMessage);

  statusMessage.classList.toggle(MESSAGE_INVALID_CLASS, invalidCharType);
};

const getPastedText = (pastedText) => {
  let strRes = "";

  let strPastedtext = "";
  for (let i = 0; i < pastedText.length; i+=1) {
    if (FORMAT_CHARACTERS.indexOf(pastedText.charAt(i)) === -1) {
      strPastedtext += pastedText.charAt[i]
    }
  }

  let strMask = "";

  for (let i = 0; i < MASK.length; i+=1) {
    if (FORMAT_CHARACTERS.indexOf(MASK[i]) === -1) {
      strMask += MASK[i]
    }
  }

  const minLength = strPastedtext.length > strMask.length ? strMask.length : strPastedtext.length;

  for (let i = 0; i < minLength; i+=1) {
    if (("0123456789".indexOf(strPastedtext[i]) > -1 && "0123456789".indexOf(strMask[i]) > -1) 
      || ("0123456789".indexOf(strPastedtext[i]) === -1 && "0123456789".indexOf(strMask[i]) === -1)
    ) {
      strRes += strPastedtext[i];
    } else {
      return "";
    }
  }

  return strRes;
}

const handlePaste = (inputEl, event, data) => {
  let pastedText = "";

  const clipboardData = event.clipboardData || window.clipboardData;
  pastedText = clipboardData.getData("text/plain");
  const el = inputEl;

  // if (!!data ) {
  //   pastedText = data;
  // } else if (clipboardData) {
  //   pastedText = clipboardData.getData('text/plain');
  // }

  // test
  // pastedText = "123yy3k";

  pastedText = pastedText.trim();

  // check here
  pastedText = getPastedText(pastedText);

  // pastedText = getstrNumbers(pastedText);

  if (pastedText !== "") {
    const curPos = getCursorPosition(el);

    let oldText = "";
    if (curPos > 0) {
      oldText = el.value.slice(0, curPos);
    }

    const newText = oldText + pastedText;

    el.value = newText;

    changeValue(inputEl, curPos);

    // setPostitionToLast(inputEl);
    setCursorPosition(inputEl, el.value.length);

    handleValueChange(inputEl);

    event.preventDefault();

    return false;
  }

  event.preventDefault();
};

/**
 * Handles the keydown event
 *
 * @param {HTMLElement} inputEl - The maskedinput element
 * @param {event} event - The event object
 */
const handleKeyDown = (inputEl, event) => {
  const el = inputEl;
  let keyCode = event.which;

  let curPos = getCursorPosition(el);

  if (keyCode === KEYS.command || event.ctrlKey) {
    return true;
  }
  const copyCutPasteKeys =
    [KEYS.v, KEYS.c, KEYS.x].indexOf(keyCode) > -1 &&
    (keyCode === KEYS.command || event.ctrlKey);

  if (copyCutPasteKeys) {
    return true;
  }

  // check for mac
  if (event.metaKey && [KEYS.v, KEYS.c, KEYS.x].indexOf(keyCode) > -1) {
    return true;
  }
  const movementKeys = [KEYS.left, KEYS.right, KEYS.tab].indexOf(keyCode) > -1;

  /* if (copyCutPasteKeys || movementKeys || modifierKeys) {
    return true;
  } */

  if (movementKeys) {
    if (checkMaskStatus()) {
      event.preventDefault();
      return false;
    }

    return true;
  }

  if (el.selectionStart === 0 && el.selectionEnd === el.value.length) {
    ORIGINAL_VALUE = el.value;

    el.value = "";
  }

  if (keyCode === KEYS.escape) {
    if (ORIGINAL_VALUE !== "") {
      el.value = ORIGINAL_VALUE;
    }

    return true;
  }

  if (keyCode === KEYS.backSpace || keyCode === KEYS.delete) {
    curPos = getCursorPosition(el);
    if (curPos < el.value.length) {
      if (checkMaskStatus()) {
        event.preventDefault();
        return false;
      }
    }

    if (keyCode === KEYS.backSpace) {
      // checkAndRemoveMaskCharacters(el, getCursorPosition(el), keyCode);
      // removeCharacterAtIndex(el, getCursorPosition(el) - 1);

      checkRemoveValue(inputEl, getCursorPosition(el));
      hideMessage(inputEl);
    }

    if (keyCode === KEYS.delete) {
      checkRemoveValue(inputEl, getCursorPosition(el), false);
      // checkAndRemoveMaskCharacters(el, getCursorPosition(el), keyCode);
      // removeCharacterAtIndex(el, getCursorPosition(el));
      hideMessage(inputEl);
    }

    handleValueChange(el);

    event.preventDefault();

    return false;
  }

  // if (el.value.length === MASK.length) {
  //   event.preventDefault();

  //   return false;
  // }

  updateMaskMessage(el, keyCode, event.key);

  // if (HAS_MASK) {
  //   checkAndInsertMaskCharacters(el, getCursorPosition(el));
  // }

  // check first
  curPos = getCursorPosition(el);

  if (curPos < el.value.length) {
    if (FORMAT_CHARACTERS.indexOf(MASK[curPos]) > -1 || checkMaskStatus()) {
      setCursorPosition(inputEl, el.value.length);
      event.preventDefault();
      return false;
    }
  }

  if (isValidCharacter(keyCode, MASK[getCursorPosition(el)])) {
    // check here
    if (keyCode >= KEYS.numberPadZero && keyCode <= KEYS.numberPadNine) {
      keyCode -= 48;
    }

    let character = event.shiftKey
      ? String.fromCharCode(keyCode).toUpperCase()
      : String.fromCharCode(keyCode).toLowerCase();

    if (FORCE_UPPER) {
      character = character.toUpperCase();
    }

    if (FORCE_LOWER) {
      character = character.toLowerCase();
    }

    insertCharacterAtIndex(el, getCursorPosition(el), character);

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
    throw new Error(`${MASKED} is missing correct attributes`);
  }
  const { value } = inputEl;
  const { maskedEl, messageEl } = getMaskedElements(inputEl);

  // Hide hint and remove aria-live for backwards compatibility
  messageEl.classList.add("usa-sr-only");
  messageEl.removeAttribute("aria-live");

  if (options.mask && options.mask.length > 0) {
    MASK = options.mask.split("");
    HAS_MASK = true;
  }

  if (options.forceupper && options.forceupper === "true") {
    FORCE_UPPER = true;
  }

  if (options.forcelower && options.forcelower === "true") {
    FORCE_LOWER = true;
  }

  if (value.length > 0 && HAS_MASK) {
    handlePaste(inputEl, null, value);
  }

  createMaskedInputShell(inputEl);
  createStatusMessages(maskedEl);
};

const inputMaskEvents = {
  focusout: {
    [INPUT]() {
      if (!this.dataset.readonly && HAS_MASK) {
        handleBlur(this);
      }
    },
  },
  keydown: {
    [INPUT](event) {
      handleKeyDown(this, event);
    },
  },
  paste: {
    [INPUT](event) {
      handlePaste(this, event, null);
    },
  },
};

const inputMask = behavior(inputMaskEvents, {
  init(root) {
    selectOrMatches(INPUT, root).forEach((maskedInput) => {
      const options = Array.from(maskedInput.attributes).reduce(
        (obj, { nodeName, nodeValue }) => ({ ...obj, [nodeName]: nodeValue }),
        {}
      );
      enhanceInputMask(maskedInput, options);
    });
  },
});

module.exports = inputMask;
