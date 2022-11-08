const keymap = require("receptor/keymap");
const selectOrMatches = require("../../uswds-core/src/js/utils/select-or-matches");
const behavior = require("../../uswds-core/src/js/utils/behavior");
const { prefix: PREFIX } = require("../../uswds-core/src/js/config");

const MASKED_CLASS = `${PREFIX}-masked`;
const MASKED = `.${MASKED_CLASS}`;
const MASK1 = `${PREFIX}-input-mask`;
const MASK_CONTENT = `${MASK1}--content`;
const PLACEHOLDER = "placeholder";
const CONTEXT = "form";

const DEFAULT_DATE = "99/99/9999";
const DEFAULT_DATE_TIME = "99/99/9999 99:99:99";
const DEFAULT_DATE_TIME_SHORT = "99/99/9999 99:99";
const DEFAULT_TIME = "99:99:99";
const DEFAULT_TIME_SHORT = "99:99";
const DEFAULT_SSN = "999-99-9999";
const DEFAULT_PHONE = "(999) 999-9999";

const DATA_TYPE_DATE = 1;
const DATA_TYPE_DATE_TIME = 2;
const DATA_TYPE_DATE_TIME_SHORT = 3;
const DATA_TYPE_TIME = 4;
const DATA_TYPE_TIME_SHORT = 5;

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

const MASK_CHARACTERS = ["A", "9", "*"];
const ORIGINAL_VALUE = "";
let MASK = null;
let HAS_MASK = false;
const FORCE_UPPER = false;
const FORCE_LOWER = false;
const USE_ENTER_KEY = false;
const VALIDATE_DATA_TYPE = false;
const DATA_TYPE = null;

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
  escape: 27,
  v: 86,
  c: 67,
  x: 88,
};

const between = (x, a, b) => x && a && b && x >= a && x <= b;

const parseDate = (value) => {
  const now = new Date();

  let date = new Date(
    Date.UTC(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    )
  );

  if (value) {
    if (between(DATA_TYPE, 1, 3)) {
      const tempDate = new Date(value);

      if (!Number.isNaN(tempDate.getTime())) {
        date = new Date(
          Date.UTC(
            tempDate.getFullYear(),
            tempDate.getMonth(),
            tempDate.getDate(),
            tempDate.getHours(),
            tempDate.getMinutes(),
            tempDate.getSeconds()
          )
        );
      }
    } else {
      const timeSegments = value.split(":");

      const utcHours = timeSegments.length > 0 ? timeSegments[0] : 0;
      const utcMinutes = timeSegments.length > 1 ? timeSegments[1] : 0;
      const utcSeconds = timeSegments.length > 2 ? timeSegments[2] : 0;

      date.setUTCHours(utcHours, utcMinutes, utcSeconds);
    }
  }

  return date;
};

const getFormattedDateTime = (value) => {
  const date = parseDate(value);

  const day =
    date.getUTCDate() < 10 ? `0${date.getUTCDate()}` : date.getUTCDate();
  const month =
    date.getUTCMonth() + 1 < 10
      ? `0${date.getUTCMonth() + 1}`
      : date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();
  const hours =
    date.getUTCHours() < 10 ? `0${date.getUTCHours()}` : date.getUTCHours();
  const minutes =
    date.getUTCMinutes() < 10
      ? `0${date.getUTCMinutes()}`
      : date.getUTCMinutes();
  const seconds =
    date.getUTCSeconds() < 10
      ? `0${date.getUTCSeconds()}`
      : date.getUTCSeconds();

  switch (DATA_TYPE) {
    case 1:
      return `${month}/${day}/${year}`;
    case 2:
      return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
    case 3:
      return `${month}/${day}/${year} ${hours}:${minutes}`;
    case 4:
      return `${hours}:${minutes}:${seconds}`;
    case 5:
      return `${hours}:${minutes}`;
    default:
      return "";
  }
};

const getCursorPosition = (element) => {
  let position = 0;

  if (document.selection) {
    element.focus();

    const selectRange = document.selection.createRange();

    selectRange.moveStart("character", -element.value.length);

    position = selectRange.text.length;
  } else if (element.selectionStart || element.selectionStart === "0") {
    position = element.selectionStart;
  }

  return position;
};

const isValidCharacter = (keyCode, maskCharacter) => {
  const maskCharacterCode = maskCharacter.charCodeAt(0);

  if (maskCharacterCode === KEYS.asterisk) {
    return true;
  }

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

const setCursorPosition = (element, index) => {
  const el = element;
  if (el != null) {
    if (el.createTextRange) {
      const range = el.createTextRange();

      range.move("character", index);

      range.select();
    } else if (el.selectionStart) {
      el.focus();

      el.setSelectionRange(index, index);
    } else {
      el.focus();
    }
  }
};

const removeCharacterAtIndex = (element, index) => {
  const el = element;
  if (el.value.length > 0) {
    const newElementValue =
      el.value.slice(0, index) + el.value.slice(index + 1);

    el.value = newElementValue;

    if (el.value.length > 0) {
      setCursorPosition(el, index);
    } else {
      el.focus();
    }
  }
};

const insertCharacterAtIndex = (element, index, character) => {
  const el = element;
  const newElementValue =
    el.value.slice(0, index) + character + el.value.slice(index);

  el.value = newElementValue;

  if (el.value.length > 0) {
    setCursorPosition(el, index + 1);
  } else {
    el.focus();
  }
};

const checkAndInsertMaskCharacters = (element, index) => {
  const el = element;
  let i = index;
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

const checkAndRemoveMaskCharacters = (element, index, keyCode) => {
  let i = index;
  if (element.value.length > 0) {
    while (element.value.length) {
      const character = element.value.charAt(index);

      const isMaskCharacter = FORMAT_CHARACTERS.indexOf(character) > -1;

      if (!isMaskCharacter || index === 0 || index === element.value.length) {
        return;
      }

      removeCharacterAtIndex(element, index);

      if (keyCode === KEYS.backSpace) {
        i -= 1;
      }

      if (keyCode === KEYS.delete) {
        i += 1;
      }
    }
  }
};

const validateDataEqualsDataType = (element) => {
  const el = element;
  if (el == null || el.value === "") {
    return;
  }

  const date = parseDate(el.value);

  if (between(DATA_TYPE, 1, 3)) {
    if (Number.isNaN(date.getDate()) || date.getFullYear() <= 1000) {
      el.value = "";

      return;
    }
  }

  if (DATA_TYPE > 1) {
    if (Number.isNaN(date.getTime())) {
      el.value = "";
    }
  }
};

const onLostFocus = (element) => {
  const el = element;
  if (el.value.length > 0) {
    if (el.value.length !== MASK.length) {
      el.value = "";

      return;
    }

    for (let i = 0; i < el.value; i += 1) {
      const elementCharacter = el.value.charAt(i);
      const maskCharacter = MASK[i];

      if (MASK_CHARACTERS.indexOf(maskCharacter) > -1) {
        if (
          elementCharacter === maskCharacter ||
          maskCharacter.charCodeAt(0) === KEYS.asterisk
        ) {
          continue;
        } else {
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
    }

    if (VALIDATE_DATA_TYPE && DATA_TYPE) {
      validateDataEqualsDataType(element);
    }
  }
};

const onKeyDown = (element, event) => {
  const el = element;
  let key = event.which;
  let originalValue;
  const copyCutPasteKeys =
    [KEYS.v, KEYS.c, KEYS.x].indexOf(key) > -1 && event.ctrlKey;

  const movementKeys = [KEYS.left, KEYS.right, KEYS.tab].indexOf(key) > -1;

  const modifierKeys = event.ctrlKey || event.shiftKey;

  if (copyCutPasteKeys || movementKeys || modifierKeys) {
    return true;
  }

  if (el.selectionStart === 0 && el.selectionEnd === el.value.length) {
    originalValue = el.value;

    el.value = "";
  }

  if (key === KEYS.escape) {
    if (originalValue !== "") {
      el.value = originalValue;
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

  if (DATA_TYPE && USE_ENTER_KEY && key === KEYS.enter) {
    if (DATA_TYPE >= 1 && DATA_TYPE <= 5) {
      el.value = getFormattedDateTime();
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

    let character = event.shiftKey
      ? String.fromCharCode(key).toUpperCase()
      : String.fromCharCode(key).toLowerCase();

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

  event.preventDefault();

  return false;
};

const onPaste = (element, event, data) => {
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

        keyDownEvent.keyCode = keyDownEvent.which = pastedText[i].charCodeAt(0);

        onKeyDown(element, keyDownEvent);
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

      onKeyDown(element, keyDownEvent); */
    }
  }

  return false;
};

const formatWithMask = (element) => {
  const el = element;
  let { value } = el;

  if (between(DATA_TYPE, 1, 5)) {
    value = getFormattedDateTime(element.value);
  }

  el.value = "";

  if (value != null && value !== "") {
    onPaste(element, null, value);
  }
};

const Initialize = (elements, options) => {
  if (!elements || !options) {
    return;
  }

  if (options.mask && options.mask.length > 0) {
    MASK = options.mask.split("");
    HAS_MASK = true;
  }

  [].forEach.call(elements, (element) => {
    const el = element;
    el.onblur = () => {
      if (!el.dataset.readonly && HAS_MASK) {
        return onLostFocus(el);
      }

      return true;
    };

    el.onkeydown = (event) => {
      if (!el.dataset.readonly) {
        return onKeyDown(el, event);
      }

      return true;
    };

    el.onpaste = (event) => {
      if (!el.dataset.readonly) {
        return onPaste(el, event, null);
      }

      return true;
    };

    if (options.placeHolder) {
      el.setAttribute("placeholder", options.placeHolder);
    }

    if (el.value.length > 0 && HAS_MASK) {
      formatWithMask(el);
    }
  });

  document.documentElement.scrollTop = 0;
};

const inputMaskEvents = {
  keydown: {
    [MASKED](event) {
      onKeyDown(this, event);
    },
  },
};

const inputMask = behavior(inputMaskEvents, {
  init(root) {
    selectOrMatches(MASKED, root).forEach((maskedInput) => {
      const nodes = [];
      const values = [];
      const options = {};
      for (
        let att, i = 0, atts = maskedInput.attributes, n = atts.length;
        i < n;
        i += 1
      ) {
        att = atts[i];
        nodes.push(att.nodeName);
        values.push(att.nodeValue);
      }

      for (let i = 0; i < nodes.length; i += 1) {
        options[nodes[i]] = values[i];
      }

      Initialize(maskedInput, options);
    });
  },
});

module.exports = inputMask;
