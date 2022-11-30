// const keymap = require("receptor/keymap");
const selectOrMatches = require("../../uswds-core/src/js/utils/select-or-matches");
const behavior = require("../../uswds-core/src/js/utils/behavior");
const debounce = require("../../uswds-core/src/js/utils/debounce");
const { prefix: PREFIX } = require("../../uswds-core/src/js/config");

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
];

const maskedNumber = "_dDmMyY9";
const maskedLetter = "A";
const MASK_CHARACTERS = ["A", "9", "*"];
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
};

/**
 * Replace each masked input with a shell containing the input and it's mask.
 *
 * @param {HTMLInputElement} inputEl The masked input element
 */
const createMaskedInputShell = (inputEl) => {
  const placeholder = inputEl.getAttribute(`${PLACEHOLDER}`);
  if (placeholder) {
    inputEl.setAttribute("maxlength", placeholder.length);
    inputEl.setAttribute("data-placeholder", placeholder);
    inputEl.removeAttribute(`${PLACEHOLDER}`);
  } else {
    return;
  }

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
  // inputEl.closest(MASKED).insertBefore(shell, inputEl);
  shell.appendChild(inputEl);
};

/**
 * Get the cursor position
 *
 * @param {HTMLDivElement} inputEl - Input with `.usa-masked__field` class
 * @returns {number} - Cursor position
 */
const getCursorPosition = (inputEl) => {
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
};

/**
 * Check if character is valid and matches mask
 *
 * @param {number} keyCode - Key code
 * @param {string | number} maskCharacter - Mask character
 */
const isValidCharacter = (keyCode, maskCharacter) => {
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
 * Set cursor position
 *
 * @param {HTMLInputElement} inputEl - Input with `.usa-masked__field` class
 * @param {number} cursorPos - Cursor position
 */
const setCursorPosition = (inputEl, cursorPos) => {
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

/**
 * Check and insert masked characters
 *
 * @param {HTMLInputElement} inputEl - Input with `.usa-masked__field` class
 * @param {number} cursorPos - Cursor position
 */
const checkAndInsertMaskCharacters = (inputEl, cursorPos) => {
  const el = inputEl;
  let i = cursorPos;
  while (true) {
    const isMaskCharacter = FORMAT_CHARACTERS.indexOf(MASK[i]) > -1;
    const maskAlreadyThere = el.value.charAt(i) === MASK[i];

    if (isMaskCharacter && !maskAlreadyThere) {
      insertCharacterAtIndex(el, i, MASK[i]);
    } else {
      return;
    }

    i += 1;
  }
};

/**
 * Check and remove masked characters
 *
 * @param {HTMLInputElement} inputEl - Input with `.usa-masked__field` class
 * @param {number} cursorPos - Cursor position
 * @param {number} keyCode - The key number code
 */
const checkAndRemoveMaskCharacters = (inputEl, cursorPos, keyCode) => {
  let i = cursorPos;
  if (inputEl.value.length > 0) {
    while (inputEl.value.length) {
      const character = inputEl.value.charAt(i);

      const isMaskCharacter = FORMAT_CHARACTERS.indexOf(character) > -1;

      if (!isMaskCharacter || i === 0 || i === inputEl.value.length) {
        return;
      }

      removeCharacterAtIndex(inputEl, i);

      if (keyCode === KEYS.backSpace) {
        i -= 1;
      }

      if (keyCode === KEYS.delete) {
        i += 1;
      }
    }
  }
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
  if (el.value.length > 0) {
    /* if (el.value.length !== MASK.length) {
      el.value = "";

      return;
    } */
    /* for (let i = 0; i < el.value; i += 1) {
      const elementCharacter = el.value.charAt(i);
      const maskCharacter = MASK[i];

      if (MASK_CHARACTERS.indexOf(maskCharacter) > -1) {
        if (
          elementCharacter !== maskCharacter ||
          maskCharacter.charCodeAt(0) !== KEYS.asterisk
        ) {
          el.value = "";

          return;
        }
      } else if (maskCharacter.charCodeAt(0) === KEYS.a) {
        if (
          elementCharacter.charCodeAt(0) <= KEYS.a ||
          elementCharacter >= KEYS.z
        ) {
          el.value = "";

          return;
        }
      } else if (maskCharacter.charCodeAt(0) === KEYS.nine) {
        if (
          elementCharacter.charCodeAt(0) <= KEYS.zero ||
          elementCharacter >= KEYS.nine
        ) {
          el.value = "";

          return;
        }
      }
    } */
    /* if (VALIDATE_DATA_TYPE && DATA_TYPE) {
      validateDataEqualsDataType(element);
    } */
  }
};

/**
 * Returns the root and message element for a maskedinput
 *
 * @param {HTMLInputElement} inputEl - The maskedinput element
 * @returns {MaskedElements} - The root and message elements
 */
const getMaskedElements = (inputEl) => {
  const maskedEl = inputEl.closest(MASKED);

  if (!maskedEl) {
    throw new Error(`${INPUT} is missing outer ${MASKED}`);
  }

  const messageEl = maskedEl.querySelector(MESSAGE);

  if (!messageEl) {
    throw new Error(`${MASKED} is missing inner ${MESSAGE}`);
  }

  return { maskedEl, messageEl };

  /* const el = inputEl;
  const { value } = el;

  // el.value = "";

  if (value != null && value !== "") {
    handlePaste(el, null, value);
  } */
};

/**
 * Returns message
 *
 * @param {number} keyCode - The current character key number code
 * @param {string} validCharType - The type of characters allowed
 * @returns {string} A string description notifying the user if the
 * character is valid or not
 */
const getMaskMessage = (inputEl, keyCode) => {
  let currentStatusMessage = "";
  let invalidCharType = false;

  const isNumber =
    (keyCode >= KEYS.zero && keyCode <= KEYS.nine) ||
    (keyCode >= KEYS.numberPadZero && keyCode <= KEYS.numberPadNine);
  const theCharType = isNumber ? "letter" : "number";

  if (isValidCharacter(keyCode, MASK[getCursorPosition(inputEl)])) {
    currentStatusMessage = "";
    invalidCharType = false;
  } else {
    currentStatusMessage = `A ${theCharType} ${DEFAULT_STATUS_LABEL}`;
    invalidCharType = true;
  }

  return { currentStatusMessage, invalidCharType };
};

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

/**
 * On input, it will update visual status, screenreader
 * status and update input validation (if invalid character is entered).
 *
 * @param {HTMLInputElement} inputEl The masked input element
 * @param {number} keyCode The key number code
 */
const updateMaskMessage = (inputEl, keyCode) => {
  const { maskedEl } = getMaskedElements(inputEl);
  const statusMessage = maskedEl.querySelector(STATUS_MESSAGE);
  const srStatusMessage = maskedEl.querySelector(STATUS_MESSAGE_SR_ONLY);
  const { currentStatusMessage, invalidCharType } = getMaskMessage(
    inputEl,
    keyCode
  );

  statusMessage.textContent = currentStatusMessage;
  srUpdateStatus(srStatusMessage, currentStatusMessage);

  statusMessage.classList.toggle(MESSAGE_INVALID_CLASS, invalidCharType);
};







const strippedValue = (isCharsetPresent, value) =>
  isCharsetPresent ? value.replace(/\W/g, "") : value.replace(/\D/g, "");

const isInteger = (value) => !Number.isNaN(parseInt(value, 10));

const isLetter = (value) => (value ? value.match(/[A-Z]/i) : false);

const handleCurrentValue = (el) => {
  const isCharsetPresent = el.dataset.charset;
  const placeholder = isCharsetPresent || el.dataset.placeholder;
  console.log("placeholder", placeholder);
  const { value } = el;
  console.log("value", value);
  const len = placeholder.length;
  let newValue = "";
  let i;
  let charIndex;

  const strippedVal = strippedValue(isCharsetPresent, value);
  console.log("strippedVal", strippedVal);
  for (i = 0, charIndex = 0; i < len; i += 1) {
    console.log("strippedVal[charIndex]", strippedVal[charIndex]);
    const isInt = isInteger(strippedVal[charIndex]);
    const isLet = isLetter(strippedVal[charIndex]);
    const matchesNumber = maskedNumber.indexOf(placeholder[i]) >= 0;
    const matchesLetter = maskedLetter.indexOf(placeholder[i]) >= 0;
    console.log("matchesNumber", matchesNumber);
    console.log("matchesLetter", matchesLetter);
    if (
      (matchesNumber && isInt) ||
      (isCharsetPresent && matchesLetter && isLet)
    ) {
      console.log("newValue += strippedVal[charIndex]", newValue += strippedVal[charIndex]);
      console.log("charIndex += 1", charIndex += 1);
      newValue += strippedVal[charIndex];
      charIndex += 1;
    } else if (
      (!isCharsetPresent && !isInt && matchesNumber) ||
      (isCharsetPresent &&
        ((matchesLetter && !isLet) || (matchesNumber && !isInt)))
    ) {
      console.log("inside else if: newValue", newValue);
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
 * On init this function will create elements and update any
 * attributes so it can validate user input.
 *
 * @param {HTMLInputElement} inputEl the components input
 */
const setValueOfMask = (inputEl) => {
  const { value } = inputEl;
  const placeholderVal = `${inputEl.dataset.placeholder.substr(value.length)}`;
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
  const el = inputEl;
  const id = el.getAttribute("id");
  el.value = handleCurrentValue(el);

  const maskVal = setValueOfMask(el);
  const maskEl = document.getElementById(`${id}Mask`);
  maskEl.textContent = "";
  maskEl.replaceChildren(maskVal[0], maskVal[1]);
};



/**
 * Handles the keydown event
 *
 * @param {HTMLElement} inputEl - The maskedinput element
 * @param {event} event - The event object
 */
 const handlePasteMask = (inputEl, event) => {
  const el = inputEl;
  let keyCode = event.which;
  const copyCutPasteKeys =
    [KEYS.v, KEYS.c, KEYS.x].indexOf(keyCode) > -1 &&
    (KEYS.command || event.ctrlKey);
  const movementKeys = [KEYS.left, KEYS.right, KEYS.tab].indexOf(keyCode) > -1;
  const modifierKeys = event.ctrlKey || event.shiftKey;

  /* if (copyCutPasteKeys || movementKeys || modifierKeys) {
    return true;
  } */

  if (movementKeys || modifierKeys) {
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
    if (keyCode === KEYS.backSpace) {
      checkAndRemoveMaskCharacters(el, getCursorPosition(el) - 1, keyCode);
      removeCharacterAtIndex(el, getCursorPosition(el) - 1);
    }

    if (keyCode === KEYS.delete) {
      checkAndRemoveMaskCharacters(el, getCursorPosition(el), keyCode);
      removeCharacterAtIndex(el, getCursorPosition(el));
    }

    // handleValueChange(el);

    event.preventDefault();

    return false;
  }

  if (el.value.length === MASK.length) {
    event.preventDefault();

    return false;
  }

  updateMaskMessage(el, keyCode);

  if (HAS_MASK) {
    checkAndInsertMaskCharacters(el, getCursorPosition(el));
  }

  if (isValidCharacter(keyCode, MASK[getCursorPosition(el)])) {
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
 * Handles the keydown event
 *
 * @param {HTMLElement} inputEl - The maskedinput element
 * @param {event} event - The event object
 */
const handleKeyDown = (inputEl, event) => {
  const el = inputEl;
  let keyCode = event.which;
  const copyCutPasteKeys =
    [KEYS.v, KEYS.c, KEYS.x].indexOf(keyCode) > -1 &&
    (KEYS.command || event.ctrlKey);
  const movementKeys = [KEYS.left, KEYS.right, KEYS.tab].indexOf(keyCode) > -1;
  const modifierKeys = event.ctrlKey || event.shiftKey;

  /* if (copyCutPasteKeys || movementKeys || modifierKeys) {
    return true;
  } */

  if (movementKeys || modifierKeys) {
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
    if (keyCode === KEYS.backSpace) {
      checkAndRemoveMaskCharacters(el, getCursorPosition(el) - 1, keyCode);
      removeCharacterAtIndex(el, getCursorPosition(el) - 1);
    }

    if (keyCode === KEYS.delete) {
      checkAndRemoveMaskCharacters(el, getCursorPosition(el), keyCode);
      removeCharacterAtIndex(el, getCursorPosition(el));
    }

    handleValueChange(el);

    event.preventDefault();

    return false;
  }

  if (el.value.length === MASK.length) {
    event.preventDefault();

    return false;
  }

  updateMaskMessage(el, keyCode);

  if (HAS_MASK) {
    checkAndInsertMaskCharacters(el, getCursorPosition(el));
  }

  if (isValidCharacter(keyCode, MASK[getCursorPosition(el)])) {
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
 * Handles the paste event
 *
 * @param {HTMLElement} inputEl - The maskedinput element
 * @param {event} event - The event object
 * @param {object} data - The data object
 */
const handlePaste = (inputEl, event, data) => {
  let pastedText = "";

  if (data != null && data !== "") {
    pastedText = data;
  } else if (
    event != null &&
    window.clipboardData &&
    window.clipboardData.getData
  ) {
    pastedText = window.clipboardData.getData("text");
  } else if (
    event != null &&
    event.clipboardData &&
    event.clipboardData.getData
  ) {
    pastedText = event.clipboardData.getData("text/plain");
  }
console.log("pastedText", pastedText);

  if (pastedText != null && pastedText !== "") {
    for (let j = 0; j < FORMAT_CHARACTERS.length; j += 1) {
      pastedText.replace(FORMAT_CHARACTERS[j], "");
    }
    for (let i = 0; i < pastedText.length; i += 1) {
      if (FORMAT_CHARACTERS.indexOf(pastedText[i]) > -1) {
        continue;
      }
      const keyDownEvent = document.createEventObject
        ? document.createEventObject()
        : document.createEvent("Events");

        console.log("keyDownEvent", keyDownEvent);
      /* if (keyDownEvent.initEvent) {
        console.log("keyDownEvent.initEvent");
        keyDownEvent.initEvent("keydown", true, true);
      } */

      keyDownEvent.keyCode = pastedText[i].charCodeAt(0);
      keyDownEvent.which = pastedText[i].charCodeAt(0);
      
      handlePasteMask(inputEl, keyDownEvent);
    }
  }

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
