// const keymap = require("receptor/keymap");
const selectOrMatches = require("../../uswds-core/src/js/utils/select-or-matches");
const behavior = require("../../uswds-core/src/js/utils/behavior");
const debounce = require("../../uswds-core/src/js/utils/debounce");
const { prefix: PREFIX } = require("../../uswds-core/src/js/config");

const MASKED_CLASS = `${PREFIX}-masked`;
const MASKED = `.${MASKED_CLASS}`;
const INPUT = `${MASKED}__field`;
const MESSAGE = `${MASKED}__message`;
// const VALIDATION_MESSAGE = "The content is too long.";
const MESSAGE_INVALID_CLASS = `${MASKED_CLASS}__status--invalid`;
const STATUS_MESSAGE_CLASS = `${MASKED_CLASS}__status`;
const STATUS_MESSAGE_SR_ONLY_CLASS = `${MASKED_CLASS}__sr-status`;
const STATUS_MESSAGE = `.${STATUS_MESSAGE_CLASS}`;
const STATUS_MESSAGE_SR_ONLY = `.${STATUS_MESSAGE_SR_ONLY_CLASS}`;
const DEFAULT_STATUS_LABEL = `Only number characters allowed`;

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

// const MASK_CHARACTERS = ["A", "9", "*"];
let ORIGINAL_VALUE = "";
let MASK = null;
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
 * Check if character is valid
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
  // const maxLength = maskedEl.dataset.maxlength;
  const defaultMessage = `${DEFAULT_STATUS_LABEL}`;

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
const getMaskMessage = (keyCode) => {
  let newMessage = "";

  if (keyCode >= KEYS.numberPadZero && keyCode <= KEYS.numberPadNine) {
    // key -= 48;
    newMessage = `${DEFAULT_STATUS_LABEL}`;
  } else {
    newMessage = `${DEFAULT_STATUS_LABEL}`;
  }

  /* if (currentChar === 0) {
    newMessage = `${maxLength} ${DEFAULT_STATUS_LABEL}`;
  } else {
    const difference = Math.abs(maxLength - currentLength);
    const characters = `character${difference === 1 ? "" : "s"}`;
    const guidance = currentLength > maxLength ? "over limit" : "left";

    newMessage = `${difference} ${characters} ${guidance}`;
  } */

  return newMessage;
};

/**
 * Updates the character count status for screen readers after a 1000ms delay.
 *
 * @param {HTMLElement} msgEl - The screen reader status message element
 * @param {string} statusMessage - A string of the current character status
 */
const srUpdateStatus = debounce((msgEl, statusMessage) => {
  const srStatusMessage = msgEl;
  srStatusMessage.textContent = statusMessage;
}, 1000);

/**
 * On input, it will update visual status, screenreader
 * status and update input validation (if invalid character is entered).
 *
 * @param {HTMLInputElement} inputEl The masked input element
 * @param {number} keyCode The key number code
 */
const updateMaskMessage = (inputEl, keyCode) => {
  const validCharType = "number";
  const { maskedEl } = getMaskedElements(inputEl);
  // const currentLength = inputEl.value.length;
  // const maxLength = parseInt(maskedEl.getAttribute("data-maxlength"), 10);
  const statusMessage = maskedEl.querySelector(STATUS_MESSAGE);
  const srStatusMessage = maskedEl.querySelector(STATUS_MESSAGE_SR_ONLY);
  const currentStatusMessage = getMaskMessage(keyCode, validCharType);

  const isNumber =
    (keyCode >= KEYS.zero && keyCode <= KEYS.nine) ||
    (keyCode >= KEYS.numberPadZero && keyCode <= KEYS.numberPadNine);

  const isInvalidChar = !isNumber;

  statusMessage.textContent = currentStatusMessage;
  srUpdateStatus(srStatusMessage, currentStatusMessage);

  statusMessage.classList.toggle(MESSAGE_INVALID_CLASS, isInvalidChar);

  /* if (!maxLength) return;

  const isOverLimit = currentLength && currentLength > maxLength;

  statusMessage.textContent = currentStatusMessage;
  srUpdateStatus(srStatusMessage, currentStatusMessage);

  if (isOverLimit && !inputEl.validationMessage) {
    inputEl.setCustomValidity(VALIDATION_MESSAGE);
  }

  if (!isOverLimit && inputEl.validationMessage === VALIDATION_MESSAGE) {
    inputEl.setCustomValidity("");
  }

  statusMessage.classList.toggle(MESSAGE_INVALID_CLASS, isOverLimit); */
};

/**
 * Handles the keydown event
 *
 * @param {HTMLElement} inputEl - The maskedinput element
 * @param {event} event - The event object
 */
const handleKeyDown = (inputEl, event) => {
  const el = inputEl;
  let key = event.which;
  const copyCutPasteKeys =
    [KEYS.v, KEYS.c, KEYS.x].indexOf(key) > -1 &&
    (KEYS.command || event.ctrlKey);
  const movementKeys = [KEYS.left, KEYS.right, KEYS.tab].indexOf(key) > -1;
  const modifierKeys = event.ctrlKey || event.shiftKey;

  updateMaskMessage(el, key);

  if (copyCutPasteKeys || movementKeys || modifierKeys) {
    return true;
  }

  if (el.selectionStart === 0 && el.selectionEnd === el.value.length) {
    ORIGINAL_VALUE = el.value;

    el.value = "";
  }

  if (key === KEYS.escape) {
    if (ORIGINAL_VALUE !== "") {
      el.value = ORIGINAL_VALUE;
    }

    return true;
  }

  if (key === KEYS.backSpace || key === KEYS.delete) {
    if (key === KEYS.backSpace) {
      checkAndRemoveMaskCharacters(el, getCursorPosition(el) - 1, key);
      removeCharacterAtIndex(el, getCursorPosition(el) - 1);
    }

    if (key === KEYS.delete) {
      checkAndRemoveMaskCharacters(el, getCursorPosition(el), key);
      removeCharacterAtIndex(el, getCursorPosition(el));
    }

    event.preventDefault();

    return false;
  }

  if (el.value.length === MASK.length) {
    event.preventDefault();

    return false;
  }

  if (HAS_MASK) {
    checkAndInsertMaskCharacters(el, getCursorPosition(el));
  }

  if (isValidCharacter(key, MASK[getCursorPosition(el)])) {
    if (key >= KEYS.numberPadZero && key <= KEYS.numberPadNine) {
      key -= 48;
    }

    const character = event.shiftKey
      ? String.fromCharCode(key).toUpperCase()
      : String.fromCharCode(key).toLowerCase();

    insertCharacterAtIndex(el, getCursorPosition(el), character);

    if (HAS_MASK) {
      checkAndInsertMaskCharacters(el, getCursorPosition(el));
    }
  }

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

  if (pastedText != null && pastedText !== "") {
    for (let j = 0; j < FORMAT_CHARACTERS.length; j += 1) {
      pastedText.replace(FORMAT_CHARACTERS[j], "");
    }

    for (let i = 0; i < pastedText.length; i += 1) {
      while (FORMAT_CHARACTERS.indexOf(pastedText[i]) > -1) {
        const keyDownEvent = document.createEventObject
          ? document.createEventObject()
          : document.createEvent("Events");

        if (keyDownEvent.initEvent) {
          keyDownEvent.initEvent("keydown", true, true);
        }

        // keyDownEvent.keyCode = keyDownEvent.which = pastedText[i].charCodeAt(0);

        keyDownEvent.keyCode = pastedText[i].charCodeAt(0);
        keyDownEvent.which = pastedText[i].charCodeAt(0);

        handleKeyDown(inputEl, keyDownEvent);
      }

      /* if (FORMAT_CHARACTERS.indexOf(pastedText[i]) > -1) {
        continue;
      }

      const keyDownEvent = document.createEventObject
        ? document.createEventObject()
        : document.createEvent("Events");

      if (keyDownEvent.initEvent) {
        keyDownEvent.initEvent("keydown", true, true);
      }

      keyDownEvent.keyCode = keyDownEvent.which = pastedText[i].charCodeAt(0);

      handleKeyDown(element, keyDownEvent); */
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

  createStatusMessages(maskedEl);

  if (options.mask && options.mask.length > 0) {
    MASK = options.mask.split("");
    HAS_MASK = true;
  }

  if (value.length > 0 && HAS_MASK) {
    handlePaste(inputEl, null, value);
  }
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
