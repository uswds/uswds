const keymap = require("receptor/keymap");
const select = require("../utils/select");
const behavior = require("../utils/behavior");
const { prefix: PREFIX } = require("../config");
const { CLICK } = require("../events");

const COMBO_BOX = `.${PREFIX}-combo-box`;

const INPUT_CLASS = `${PREFIX}-combo-box__input`;
const LIST_CLASS = `${PREFIX}-combo-box__list`;
const LIST_OPTION_CLASS = `${PREFIX}-combo-box__list-option`;
const STATUS_CLASS = `${PREFIX}-combo-box__status`;
const LIST_OPTION_FOCUSED_CLASS = `${LIST_OPTION_CLASS}--focused`;

const SELECT = `.${PREFIX}-combo-box__select`;
const INPUT = `.${INPUT_CLASS}`;
const LIST = `.${LIST_CLASS}`;
const LIST_OPTION = `.${LIST_OPTION_CLASS}`;
const LIST_OPTION_FOCUSED = `.${LIST_OPTION_FOCUSED_CLASS}`;
const STATUS = `.${STATUS_CLASS}`;

/**
 * Determine if the key code of an event is printable
 *
 * @param {number} keyCode The key code of the event
 * @returns {boolean} true is the key code is printable
 */
const isPrintableKeyCode = keyCode => {
  return (
    (keyCode > 47 && keyCode < 58) || // number keys
    keyCode === 32 || // space
    keyCode === 8 || // backspace
    (keyCode > 64 && keyCode < 91) || // letter keys
    (keyCode > 95 && keyCode < 112) || // numpad keys
    (keyCode > 185 && keyCode < 193) || // ;=,-./` (in order)
    (keyCode > 218 && keyCode < 223) // [\]' (in order)
  );
};

/**
 * The elements within the combo box.
 * @typedef {Object} ComboBoxElements
 * @property {HTMLElement} comboBoxEl
 * @property {HTMLSelectElement} selectEl
 * @property {HTMLInputElement} inputEl
 * @property {HTMLUListElement} listEl
 * @property {HTMLDivElement} statusEl
 * @property {HTMLOptionElement} focusedOptionEl
 */

/**
 * Get an object of elements belonging directly to the given
 * combo box component.
 *
 * @param {HTMLElement} el the element within the combo box
 * @returns {ComboBoxElements} elements
 */
const getComboBoxElements = el => {
  const comboBoxEl = el.closest(COMBO_BOX);

  if (!comboBoxEl) {
    throw new Error(`Element is missing outer ${COMBO_BOX}`);
  }

  const selectEl = comboBoxEl.querySelector(SELECT);

  if (!selectEl) {
    throw new Error(`${COMBO_BOX} is missing inner ${SELECT}`);
  }

  const inputEl = comboBoxEl.querySelector(INPUT);
  const listEl = comboBoxEl.querySelector(LIST);
  const statusEl = comboBoxEl.querySelector(STATUS);
  const focusedOptionEl = comboBoxEl.querySelector(LIST_OPTION_FOCUSED);

  return { comboBoxEl, selectEl, inputEl, listEl, statusEl, focusedOptionEl };
};

/**
 * Enhance a select element into a combo box component.
 *
 * @param {HTMLElement} el The initial element within the combo box component
 */
const enhanceComboBox = el => {
  const { comboBoxEl, selectEl } = getComboBoxElements(el);

  const selectId = selectEl.id;
  const listId = `${selectId}--list`;
  const assistiveHintID = `${selectId}--assistiveHint`;
  let placeholder = "";
  let selectedOption;
  const additionalAttributes = [];

  for (let i = 0, len = selectEl.options.length; i < len; i += 1) {
    const optionEl = selectEl.options[i];

    if (!placeholder && !optionEl.value) {
      placeholder = `placeholder="${optionEl.text}"`;
    }

    if (!selectedOption && optionEl.selected && optionEl.value) {
      selectedOption = optionEl;
    }

    if (placeholder && selectedOption) {
      break;
    }
  }

  selectEl.setAttribute("aria-hidden", "true");
  selectEl.setAttribute("tabindex", "-1");
  selectEl.classList.add("usa-sr-only");
  selectEl.id = "";

  ["required", "aria-label", "aria-labelledby"].forEach(name => {
    if (selectEl.hasAttribute(name)) {
      const value = selectEl.getAttribute(name);
      additionalAttributes.push(`${name}="${value}"`);
      selectEl.removeAttribute(name);
    }
  });

  comboBoxEl.insertAdjacentHTML(
    "beforeend",
    [
      `<input
        aria-owns="${listId}"
        aria-autocomplete="list"
        aria-describedby="${assistiveHintID}"
        aria-expanded="false"
        autocapitalize="off"
        ${placeholder || ""}
        autocomplete="off"
        id="${selectId}"
        class="${INPUT_CLASS}"
        type="text"
        role="combobox"
        ${additionalAttributes.join(" ")}
      >`,
      `<ul
        id="${listId}"
        class="${LIST_CLASS}"
        role="listbox"
        hidden>
      </ul>`,
      `<div class="${STATUS_CLASS} usa-sr-only" role="status">
      </div>`,
      `<span id="${assistiveHintID}" class="usa-sr-only">
        When autocomplete results are available use up and down arrows to review and enter to select.
        Touch device users, explore by touch or with swipe gestures.
      </span>`
    ].join("")
  );

  if (selectedOption) {
    const { inputEl } = getComboBoxElements(el);
    selectEl.value = selectedOption.value;
    inputEl.value = selectedOption.text;
  }
};

/**
 * Display the option list of a combo box component.
 *
 * @param {HTMLElement} el An element within the combo box component
 */
const displayList = el => {
  const { selectEl, inputEl, listEl, statusEl } = getComboBoxElements(el);

  const listOptionBaseId = `${listEl.id}--option-`;

  const inputValue = (inputEl.value || "").toLowerCase();

  const options = [];
  for (let i = 0, len = selectEl.options.length; i < len; i += 1) {
    const optionEl = selectEl.options[i];
    if (
      optionEl.value &&
      (!inputValue || optionEl.text.toLowerCase().indexOf(inputValue) !== -1)
    ) {
      options.push(optionEl);
    }
  }

  const numOptions = options.length;
  const optionHtml = options
    .map(
      (option, index) =>
        `<li
          aria-selected="false"
          aria-setsize="${options.length}"
          aria-posinset="${index + 1}"
          id="${listOptionBaseId}${index}"
          class="${LIST_OPTION_CLASS}"
          tabindex="-1"
          role="option"
          data-option-value="${option.value}"
        >${option.text}</li>`
    )
    .join("");

  const noResults = `<li class="${LIST_OPTION_CLASS}--no-results">No results found</li>`;

  listEl.hidden = false;
  listEl.innerHTML = numOptions ? optionHtml : noResults;

  inputEl.setAttribute("aria-expanded", "true");

  statusEl.innerHTML = numOptions
    ? `${numOptions} result${numOptions > 1 ? "s" : ""} available.`
    : "No results.";
};

/**
 * Hide the option list of a combo box component.
 *
 * @param {HTMLElement} el An element within the combo box component
 */
const hideList = el => {
  const { inputEl, listEl, statusEl } = getComboBoxElements(el);

  statusEl.innerHTML = "";

  inputEl.setAttribute("aria-expanded", "false");
  inputEl.setAttribute("aria-activedescendant", "");

  listEl.innerHTML = "";
  listEl.hidden = true;
};

/**
 * Select an option list of the combo box component.
 *
 * @param {HTMLElement} listOptionEl The list option being selected
 */
const selectItem = listOptionEl => {
  const { comboBoxEl, selectEl, inputEl } = getComboBoxElements(listOptionEl);

  selectEl.value = listOptionEl.getAttribute("data-option-value");
  inputEl.value = listOptionEl.textContent;
  hideList(comboBoxEl);
  inputEl.focus();
};

/**
 * Select an option list of the combo box component based off of
 * having a current focused list option or
 * having test that completely matches a list option.
 * Otherwise it clears the input and select.
 *
 * @param {HTMLElement} el An element within the combo box component
 */
const completeSelection = el => {
  const { selectEl, inputEl, statusEl, focusedOptionEl } = getComboBoxElements(
    el
  );

  statusEl.textContent = "";

  if (focusedOptionEl) {
    selectEl.value = focusedOptionEl.getAttribute("data-option-value");
    inputEl.value = focusedOptionEl.textContent;
    return;
  }

  const inputValue = (inputEl.value || "").toLowerCase();

  if (inputValue) {
    for (let i = 0, len = selectEl.options.length; i < len; i += 1) {
      const optionEl = selectEl.options[i];
      if (optionEl.text.toLowerCase() === inputValue) {
        selectEl.value = optionEl.value;
        inputEl.value = optionEl.text;
        return;
      }
    }
  }

  selectEl.value = "";

  if (inputEl.value) {
    inputEl.value = "";
  }
};

/**
 * Manage the focused element within the list options when
 * navigating via keyboard.
 *
 * @param {HTMLElement} el An element within the combo box component
 * @param {HTMLElement} currentEl An element within the combo box component
 * @param {HTMLElement} nextEl An element within the combo box component
 */
const highlightOption = (el, currentEl, nextEl) => {
  const { inputEl, listEl } = getComboBoxElements(el);

  if (currentEl) {
    currentEl.classList.remove(LIST_OPTION_FOCUSED_CLASS);
    currentEl.setAttribute("aria-selected", "false");
  }

  if (nextEl) {
    inputEl.setAttribute("aria-activedescendant", nextEl.id);
    nextEl.setAttribute("aria-selected", "true");
    nextEl.classList.add(LIST_OPTION_FOCUSED_CLASS);

    const optionBottom = nextEl.offsetTop + nextEl.offsetHeight;
    const currentBottom = listEl.scrollTop + listEl.offsetHeight;

    if (optionBottom > currentBottom) {
      listEl.scrollTop = optionBottom - listEl.offsetHeight;
    }

    if (nextEl.offsetTop < listEl.scrollTop) {
      listEl.scrollTop = nextEl.offsetTop;
    }
    nextEl.focus();
  } else {
    inputEl.setAttribute("aria-activedescendant", "");
    inputEl.focus();
  }
};

/**
 * Handle the enter event within the combo box component.
 *
 * @param {KeyboardEvent} event An event within the combo box component
 */
const handleEnter = event => {
  const { comboBoxEl, inputEl, listEl } = getComboBoxElements(event.target);
  const listShown = !listEl.hidden;

  completeSelection(comboBoxEl);

  if (listShown) {
    hideList(comboBoxEl);
    inputEl.focus();
    event.preventDefault();
  }
};

/**
 * Handle the down event within the combo box component.
 *
 * @param {KeyboardEvent} event An event within the combo box component
 */
const handleEscape = event => {
  const { comboBoxEl, inputEl } = getComboBoxElements(event.target);

  hideList(comboBoxEl);
  inputEl.focus();
};

/**
 * Handle the up event within the combo box component.
 *
 * @param {KeyboardEvent} event An event within the combo box component
 */
const handleUp = event => {
  const { comboBoxEl, listEl, focusedOptionEl } = getComboBoxElements(
    event.target
  );
  const nextOptionEl = focusedOptionEl && focusedOptionEl.previousSibling;
  const listShown = !listEl.hidden;

  highlightOption(comboBoxEl, focusedOptionEl, nextOptionEl);

  if (listShown) {
    event.preventDefault();
  }

  if (!nextOptionEl) {
    hideList(comboBoxEl);
  }
};

/**
 * Handle the down event within the combo box component.
 *
 * @param {KeyboardEvent} event An event within the combo box component
 */
const handleDown = event => {
  const { comboBoxEl, listEl, focusedOptionEl } = getComboBoxElements(
    event.target
  );

  if (listEl.hidden) {
    displayList(comboBoxEl);
  }

  const nextOptionEl = focusedOptionEl
    ? focusedOptionEl.nextSibling
    : listEl.querySelector(LIST_OPTION);

  if (nextOptionEl) {
    highlightOption(comboBoxEl, focusedOptionEl, nextOptionEl);
  }

  event.preventDefault();
};

const comboBox = behavior(
  {
    [CLICK]: {
      [INPUT]() {
        displayList(this);
      },
      [LIST_OPTION]() {
        selectItem(this);
      }
    },
    focusout: {
      [COMBO_BOX](event) {
        const { comboBoxEl } = getComboBoxElements(event.target);
        if (!comboBoxEl.contains(event.relatedTarget)) {
          completeSelection(comboBoxEl);
          hideList(comboBoxEl);
        }
      }
    },
    keydown: {
      [COMBO_BOX]: keymap({
        ArrowUp: handleUp,
        Up: handleUp,
        ArrowDown: handleDown,
        Down: handleDown,
        Escape: handleEscape,
        Enter: handleEnter
      })
    },
    keyup: {
      [INPUT](event) {
        if (isPrintableKeyCode(event.keyCode)) {
          displayList(this);
        }
      }
    }
  },
  {
    init(root) {
      select(SELECT, root).forEach(selectEl => {
        enhanceComboBox(selectEl);
      });
    }
  }
);

module.exports = comboBox;
