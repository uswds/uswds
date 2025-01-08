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

let lastValueLength;
let keyPressed;
const validKeys = /[a-zA-Z0-9]/;

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
  const errorMsg = inputEl.getAttribute("data-errorMessage");
  const errorMsgAlpha = inputEl.getAttribute("data-errorMessageAlphabetical");
  const errorMsgNum = inputEl.getAttribute("data-errorMessageNumerical");
  const errorMsgFull = inputEl.getAttribute("data-errorMessageInputFull");
  const errorMsgSrOnly = inputEl.getAttribute("data-errorMessageSrOnly");
  const errorMsgAlphaSrOnly = inputEl.getAttribute(
    "data-errorMessageAlphabeticalSrOnly",
  );
  const errorMsgNumSrOnly = inputEl.getAttribute(
    "data-errorMessageNumericalSrOnly",
  );
  const errorMsgFullSrOnly = inputEl.getAttribute(
    "data-errorMessageInputFullSrOnly",
  );

  return {
    inputEl,
    errorId,
    inputId,
    errorMsg,
    errorMsgAlpha,
    errorMsgNum,
    errorMsgFull,
    errorMsgSrOnly,
    errorMsgAlphaSrOnly,
    errorMsgNumSrOnly,
    errorMsgFullSrOnly,
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
    errorMsg,
    errorMsgNum,
    errorMsgAlpha,
    errorMsgFull,
    errorMsgSrOnly,
    errorMsgNumSrOnly,
    errorMsgAlphaSrOnly,
    errorMsgFullSrOnly,
  } = getMaskInputContext(inputEl);

  // check if the new character was a format character added by the mask
  const lastChar = newValue.charAt(newValue.length - 1);
  const formatCharAdded = lastChar === keyPressed;

  // create visual error message and add to DOM, remove first if it already exists
  if (document.getElementById(errorId)) {
    document.getElementById(errorId).remove();
  }
  const errorMsgSpan = document.createElement("span");
  errorMsgSpan.setAttribute("id", errorId);
  errorMsgSpan.setAttribute("class", ERROR_MESSAGE_CLASS);
  errorMsgSpan.setAttribute("aria-hidden", "true");
  inputEl.parentNode.appendChild(errorMsgSpan);
  const errorMessageEl = document.getElementById(errorId);

  // create sr only error message and add to DOM, remove first if it already exists
  if (document.getElementById(`${errorId}SrOnly`)) {
    document.getElementById(`${errorId}SrOnly`).remove();
  }
  const errorMsgSpanSrOnly = document.createElement("span");
  errorMsgSpanSrOnly.setAttribute("id", `${errorId}SrOnly`);
  errorMsgSpanSrOnly.setAttribute("class", SR_ONLY_CLASS);
  errorMsgSpanSrOnly.setAttribute("role", "alert");
  inputEl.parentNode.appendChild(errorMsgSpanSrOnly);
  const errorMessageSrOnlyEl = document.getElementById(`${errorId}SrOnly`);

  const messageType = maxLengthReached ? "input full" : matchType;

  // hide or show error message
  if (maxLengthReached) {
    // max length reached
    errorMessageEl.hidden = false;
    srUpdateErrorStatus(errorMessageSrOnlyEl, false);
  } else if (keyPressed === "Backspace") {
    // clear error
    errorMessageEl.hidden = true;
    srUpdateErrorStatus(errorMessageSrOnlyEl, true);
  } else if (valueAttempt.length === newValue.length && !formatCharAdded) {
    // input rejected but a format character was added
    errorMessageEl.hidden = false;
    srUpdateErrorStatus(errorMessageSrOnlyEl, false);
  } else if (valueAttempt.length > newValue.length) {
    // input rejected and no character was added
    errorMessageEl.hidden = false;
    srUpdateErrorStatus(errorMessageSrOnlyEl, false);
  } else if (valueAttempt.length <= newValue.length) {
    // input accepted with new character added
    errorMessageEl.hidden = true;
    srUpdateErrorStatus(errorMessageSrOnlyEl, true);
  }

  // set error messages text
  switch (messageType) {
    case "letter":
      errorMessageEl.textContent = errorMsgAlpha;
      srUpdateErrorMsg(errorMessageSrOnlyEl, errorMsgAlphaSrOnly);
      break;
    case "number":
      errorMessageEl.textContent = errorMsgNum;
      srUpdateErrorMsg(errorMessageSrOnlyEl, errorMsgNumSrOnly);
      break;
    case "input full":
      errorMessageEl.textContent = errorMsgFull;
      srUpdateErrorMsg(errorMessageSrOnlyEl, errorMsgFullSrOnly);
      break;
    default:
      errorMessageEl.textContent = errorMsg;
      srUpdateErrorMsg(errorMessageSrOnlyEl, errorMsgSrOnly);
  }
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
  const validKeyPress = validKeys.test(keyPressed);

  // record potential new value before new character is accepted or rejected
  const valueAttempt = inputEl.value;

  // check if max character count has been reached
  if (keyPressed !== "Backspace") {
    maxLengthReached = lastValueLength === inputEl.maxLength;
  } else {
    maxLengthReached = false;
  }

  // get processed new value and expected character type
  const { newValue, matchType } = handleCurrentValue(inputEl, validKeyPress);
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
  if (e.key !== "CapsLock" && e.location === 0) {
    handleValueChange(e);
  }
};

const inputMaskEvents = {
  keyup: {
    [MASKED](e) {
      keyUpCheck(e);
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
