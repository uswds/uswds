const selectOrMatches = require("../../uswds-core/src/js/utils/select-or-matches");
const behavior = require("../../uswds-core/src/js/utils/behavior");
const debounce = require("../../uswds-core/src/js/utils/debounce");
const { prefix: PREFIX } = require("../../uswds-core/src/js/config");

const MASKED_CLASS = `${PREFIX}-masked`;
const MASKED = `.${MASKED_CLASS}`;
const MASK = `${PREFIX}-input-mask`;
const MASK_CONTENT = `${MASK}--content`;
const PLACEHOLDER = "placeholder";
const SR_ONLY_CLASS = `${PREFIX}-sr-only`;
const ERROR_MESSAGE_CLASS = `${PREFIX}-error-message`;
const ERROR_MESSAGE_DEFAULT = "Error: please enter a valid character";
const ERROR_MESSAGE_SR_DEFAULT = "Error: please enter a valid character";
const ERROR_MESSAGE_FULL_DEFAULT = "Maximum character count reached";
const ERROR_MESSAGE_FULL_SR_DEFAULT = "Maximum character count reached";
const ERROR_MESSAGE_PASTE_DEFAULT =
  "Error: Input was not accepted or partially accepted.";
const ERROR_MESSAGE_PASTE_SR_DEFAULT =
  "Error: Input was not accepted or partially accepted.";
const ERROR_MESSAGE_ALPHA_DEFAULT = "Error: please enter a letter";
const ERROR_MESSAGE_ALPHA_SR_DEFAULT = "Error: please enter a letter";
const ERROR_MESSAGE_NUMERIC_DEFAULT = "Error: please enter a number";
const ERROR_MESSAGE_NUMERIC_SR_DEFAULT = "Error: please enter a number";

let errorMessageSrOnlyEl;
let lastValueLength;
let keyPressed;
let shiftComboPressed;
let inputAddedByPaste;
let clipboardData = "";
let backspacePressed;

// User defined Values
const maskedNumber = "_#dDmMyY9";
const maskedLetter = "A";

const getMaskInputContext = (el) => {
  const inputEl = el;

  if (!inputEl) {
    throw new Error(`Element is missing outer ${inputEl}`);
  }

  const inputId = inputEl.id;
  const errorId = `${inputId}Error`;
  const errorMsgDefault =
    inputEl.getAttribute("data-errorMessage") || ERROR_MESSAGE_DEFAULT;
  const errorMsgAlpha =
    inputEl.getAttribute("data-errorMessageAlphabetical") ||
    ERROR_MESSAGE_ALPHA_DEFAULT;
  const errorMsgNum =
    inputEl.getAttribute("data-errorMessageNumerical") ||
    ERROR_MESSAGE_NUMERIC_DEFAULT;
  const errorMsgFull =
    inputEl.getAttribute("data-errorMessageInputFull") ||
    ERROR_MESSAGE_FULL_DEFAULT;
  const errorMsgPaste =
    inputEl.getAttribute("data-errorMessagePaste") ||
    ERROR_MESSAGE_PASTE_DEFAULT;
  const errorMsgDefaultSrOnly =
    inputEl.getAttribute("data-errorMessageSrOnly") || ERROR_MESSAGE_SR_DEFAULT;
  const errorMsgAlphaSrOnly =
    inputEl.getAttribute("data-errorMessageAlphabeticalSrOnly") ||
    ERROR_MESSAGE_ALPHA_SR_DEFAULT;
  const errorMsgNumSrOnly =
    inputEl.getAttribute("data-errorMessageNumericalSrOnly") ||
    ERROR_MESSAGE_NUMERIC_SR_DEFAULT;
  const errorMsgFullSrOnly =
    inputEl.getAttribute("data-errorMessageInputFullSrOnly") ||
    ERROR_MESSAGE_FULL_SR_DEFAULT;
  const errorMsgPasteSrOnly =
    inputEl.getAttribute("data-errorMessagePasteSrOnly") ||
    ERROR_MESSAGE_PASTE_SR_DEFAULT;

  return {
    inputEl,
    errorId,
    inputId,
    errorMsgDefault,
    errorMsgAlpha,
    errorMsgNum,
    errorMsgFull,
    errorMsgPaste,
    errorMsgDefaultSrOnly,
    errorMsgAlphaSrOnly,
    errorMsgNumSrOnly,
    errorMsgFullSrOnly,
    errorMsgPasteSrOnly,
  };
};

/**
 *  Replaces each masked input with a shell containing the input and it's mask.
 *
 * @param {HTMLElement} input - The input element
 */
const createMaskedInputShell = (input) => {
  const placeholder = input.getAttribute(`${PLACEHOLDER}`);
  if (placeholder) {
    input.setAttribute("maxlength", placeholder.length);
    input.setAttribute("data-placeholder", placeholder);
    input.removeAttribute(`${PLACEHOLDER}`);
    input.addEventListener("paste", (e) => {
      inputAddedByPaste = true;
      clipboardData = e.clipboardData.getData("text");
    });
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
 *  Returns a combination of the input value and what is left of the placeholder inside the new element.
 *
 * @param {HTMLElement} inputEl - The input element
 */
const setValueOfMask = (el) => {
  const { value } = el;
  const placeholderVal = `${el.dataset.placeholder.substr(value.length)}`;
  const inputValueLength = placeholderVal.length + value.length;

  const theIEl = document.createElement("i");
  theIEl.textContent = value;

  return [theIEl, placeholderVal, inputValueLength];
};

const strippedValue = (isCharsetPresent, value) =>
  isCharsetPresent ? value.replace(/\W/g, "") : value.replace(/\D/g, "");

const isInteger = (value) => !Number.isNaN(parseInt(value, 10));

const isLetter = (value) => (value ? value.match(/[A-Z]/i) : false);

/**
 *  Creates an array of what the required character type is expected to be for each character in the complete input value.
 *  Checks what the current index is to return the current required character type.
 *
 * @param {string} placeholder - String of placeholder letters or numbers that defines what the mask is expecting
 * @param {string} value - Input mask value (including the newest input attempt even if it will be rejected)
 */
const checkMaskType = (placeholder, value) => {
  const array = [];
  const valueLength = value.length;
  let matchType;

  for (let i = 0; i < placeholder.length; i += 1) {
    const matchesNumber = maskedNumber.indexOf(placeholder[i]) >= 0;
    const matchesLetter = maskedLetter.indexOf(placeholder[i]) >= 0;

    if (matchesNumber) {
      array.push("number");
    } else if (matchesLetter) {
      array.push("letter");
    } else {
      // keep note of where format characters are (hyphens, spaces, etc) so index is always accurate
      array.push("format character");
    }
  }

  matchType = array[valueLength - 1];

  // if index lands on a "format character" forward to next matchType in array
  if (matchType === "format character") {
    matchType = array[valueLength];
  }

  return { matchType };
};

/**
 *  Checks if the new input character meets mask requirement.
 *  Returns the new input value with the new character added if it's accepted.
 *
 * @param {HTMLElement} el - The input element
 */
const handleCurrentValue = (el) => {
  const isCharsetPresent = el.dataset.charset;
  const placeholder = isCharsetPresent || el.dataset.placeholder;
  const { value } = el;
  const len = placeholder.length;
  const { matchType } = checkMaskType(placeholder, value);
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
      return { newValue, matchType };
    } else {
      newValue += placeholder[i];
    }
    // break if no characters left and the pattern is non-special character
    if (strippedVal[charIndex] === undefined) {
      break;
    }
  }
  return { newValue, matchType };
};

/**
 * Creates the SR only and visual error messages and adds them to the DOM
 *
 * @param {string} errorId - The ID of the error message element
 * @param {string} inputEl - The input element
 */
const createErrorMessageEl = (errorId, inputEl) => {
  // visual error message
  const errorMsgSpan = document.createElement("span");
  errorMsgSpan.setAttribute("id", errorId);
  errorMsgSpan.setAttribute("class", ERROR_MESSAGE_CLASS);
  errorMsgSpan.setAttribute("aria-hidden", "true");
  inputEl.parentNode.appendChild(errorMsgSpan);

  // SR only error message
  const errorMsgSpanSrOnly = document.createElement("span");
  errorMsgSpanSrOnly.setAttribute("id", `${errorId}SrOnly`);
  errorMsgSpanSrOnly.setAttribute("class", SR_ONLY_CLASS);
  errorMsgSpanSrOnly.setAttribute("role", "alert");
  inputEl.parentNode.appendChild(errorMsgSpanSrOnly);
  errorMessageSrOnlyEl = document.getElementById(`${errorId}SrOnly`);
};

/**
 * Triggers the error message announcement for screen readers after a 1000ms delay.
 *
 * @param {HTMLElement} msgEl - The screen reader error message element
 * @param {boolean} status - A boolean of error's hidden status
 */
const srUpdateErrorStatus = debounce((msgEl, status) => {
  const srStatusMessage = msgEl;
  srStatusMessage.hidden = status;
}, 1000);

/**
 * Updates the error message text content for screen readers after a 1000ms delay.
 *
 * @param {HTMLElement} msgEl - The screen reader error message element
 * @param {string} errorMsg - A string of the error message
 */
const srUpdateErrorMsg = debounce((msgEl, errorMsg) => {
  const srStatusMessage = msgEl;
  srStatusMessage.textContent = errorMsg;
}, 1000);

/**
 * Creates the sr only and visual error messages, handles their hidden status and content.
 *
 * @param {string} valueAttempt - The input value before the new character is accepted or rejected
 * @param {string} newValue - The input value after the new character is accepted or rejected
 * @param {string} matchType - The character type that the input should be to be accepted
 * @param {HTMLElement} inputEl - The input element
 * @param {boolean} maxLengthReached - Returns true when the input mask is at max length
 */
const handleErrorState = (
  valueAttempt,
  newValue,
  matchType,
  inputEl,
  maxLengthReached,
) => {
  const {
    errorId,
    errorMsgDefault,
    errorMsgNum,
    errorMsgAlpha,
    errorMsgFull,
    errorMsgPaste,
    errorMsgDefaultSrOnly,
    errorMsgNumSrOnly,
    errorMsgAlphaSrOnly,
    errorMsgFullSrOnly,
    errorMsgPasteSrOnly,
  } = getMaskInputContext(inputEl);

  // create visual and SR only error message elements and add to DOM
  if (!document.getElementById(errorId)) {
    createErrorMessageEl(errorId, inputEl);
  }

  // check if value attempt was accepted or rejected
  const strippedValueAttempt = strippedValue(true, valueAttempt);
  const strippedNewValue = strippedValue(true, newValue);
  const strippedClipboard = strippedValue(true, clipboardData);
  const valueAccepted = strippedValueAttempt === strippedNewValue;

  // check if the new character was a format character added by the mask
  const lastChar = newValue.charAt(newValue.length - 1);
  const formatCharAdded = lastChar !== keyPressed;

  // set default messages as failsafe
  let errorTextContent = errorMsgDefault;
  let errorMessageSrOnly = errorMsgDefaultSrOnly;
  let hiddenStatus = false;

  // set error message content
  if (matchType === "letter") {
    errorTextContent = errorMsgAlpha;
    errorMessageSrOnly = errorMsgAlphaSrOnly;
  } else if (matchType === "number") {
    errorTextContent = errorMsgNum;
    errorMessageSrOnly = errorMsgNumSrOnly;
  }

  // update error message hidden status
  // backspacing clears error
  if (backspacePressed) {
    hiddenStatus = true;

    // max length reached
  } else if (maxLengthReached) {
    hiddenStatus = false;
    // set error message content
    errorTextContent = errorMsgFull;
    errorMessageSrOnly = errorMsgFullSrOnly;

    // hides error when input should be a letter and key combo is a letter
  } else if (matchType === "letter" && shiftComboPressed) {
    hiddenStatus = true;

    // input accepted when added with copy/paste
  } else if (inputAddedByPaste && strippedNewValue === strippedClipboard) {
    hiddenStatus = true;
    // reset inputAddedByPaste
    inputAddedByPaste = false;

    // only part or none of input was added with copy/paste
  } else if (
    (inputAddedByPaste && strippedNewValue !== strippedClipboard) ||
    (!valueAccepted && inputAddedByPaste)
  ) {
    hiddenStatus = false;
    // set error message content
    errorTextContent = errorMsgPaste;
    errorMessageSrOnly = errorMsgPasteSrOnly;
    // reset inputAddedByPaste
    inputAddedByPaste = false;

    // new character rejected
  } else if (!valueAccepted) {
    hiddenStatus = false;

    // valueAccepted returned true because a format character was added
    // but last character attempt was rejected
  } else if (valueAccepted && formatCharAdded) {
    hiddenStatus = false;

    // new character accepted, hide error
  } else if (valueAccepted) {
    hiddenStatus = true;
  }

  // update visual error message content and status
  const errorMessageEl = document.getElementById(errorId);
  errorMessageEl.hidden = hiddenStatus;
  errorMessageEl.textContent = errorTextContent;

  // update SR only error message content and status
  srUpdateErrorStatus(errorMessageSrOnlyEl, hiddenStatus);
  srUpdateErrorMsg(errorMessageSrOnlyEl, errorMessageSrOnly);
};

/**
 *  Gets the processed input value and puts it inside the mask element.
 *  Triggers error handling.
 *
 * @param {HTMLElement} e - The input element
 */
const handleValueChange = (e) => {
  keyPressed = e.key;
  let maxLengthReached;
  const inputEl = e.srcElement;

  // record potential new value before new character is accepted or rejected
  const valueAttempt = inputEl.value;

  // check if max character count has been reached
  if (!backspacePressed) {
    maxLengthReached = lastValueLength === inputEl.maxLength;
  } else {
    maxLengthReached = false;
  }

  // get processed new value and expected character type
  const { newValue, matchType } = handleCurrentValue(inputEl);
  inputEl.value = newValue;

  // save new value length as lastValueLength for next input check
  lastValueLength = newValue.length;

  const maskVal = setValueOfMask(inputEl);
  const maskEl = document.getElementById(`${inputEl.id}Mask`);
  maskEl.textContent = "";
  maskEl.replaceChildren(maskVal[0], maskVal[1]);

  handleErrorState(
    valueAttempt,
    newValue,
    matchType,
    inputEl,
    maxLengthReached,
  );
};

const keyUpCheck = (e) => {
  // run handleValueChange() only when backspacing, clearing input, or pressing a non-CapsLock key
  // at a standard location, to avoid errors from CapsLock or Shift key combos triggering the function twice
  if (backspacePressed) {
    handleValueChange(e);
  } else if (e.key !== "CapsLock" && e.location === 0) {
    handleValueChange(e);
  }
};

const keyDownCheck = (e) => {
  if (e.shiftKey && /^[a-zA-Z]$/.test(e.key)) {
    shiftComboPressed = true;
  } else {
    shiftComboPressed = false;
  }

  if (e.key === "Backspace" || (e.metaKey && e.key === "Backspace")) {
    backspacePressed = true;
  } else {
    backspacePressed = false;
  }
};

const inputMaskEvents = {
  keyup: {
    [MASKED](e) {
      keyUpCheck(e);
    },
  },
  keydown: {
    [MASKED](e) {
      keyDownCheck(e);
    },
  },
};

const inputMask = behavior(inputMaskEvents, {
  init(root) {
    selectOrMatches(MASKED, root).forEach((maskedInput) => {
      createMaskedInputShell(maskedInput);
    });
  },
});

module.exports = inputMask;
