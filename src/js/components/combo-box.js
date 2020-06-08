const keymap = require("receptor/keymap");
const select = require("../utils/select");
const behavior = require("../utils/behavior");
const { prefix: PREFIX } = require("../config");
const { CLICK } = require("../events");

const COMBO_BOX_CLASS = `${PREFIX}-combo-box`;
const COMBO_BOX_PRISTINE_CLASS = `${COMBO_BOX_CLASS}--pristine`;
const SELECT_CLASS = `${COMBO_BOX_CLASS}__select`;
const INPUT_CLASS = `${COMBO_BOX_CLASS}__input`;
const CLEAR_INPUT_BUTTON_CLASS = `${COMBO_BOX_CLASS}__clear-input`;
const CLEAR_INPUT_BUTTON_WRAPPER_CLASS = `${CLEAR_INPUT_BUTTON_CLASS}__wrapper`;
const INPUT_BUTTON_SEPARATOR_CLASS = `${COMBO_BOX_CLASS}__input-button-separator`;
const TOGGLE_LIST_BUTTON_CLASS = `${COMBO_BOX_CLASS}__toggle-list`;
const TOGGLE_LIST_BUTTON_WRAPPER_CLASS = `${TOGGLE_LIST_BUTTON_CLASS}__wrapper`;
const LIST_CLASS = `${COMBO_BOX_CLASS}__list`;
const LIST_OPTION_CLASS = `${COMBO_BOX_CLASS}__list-option`;
const LIST_OPTION_FOCUSED_CLASS = `${LIST_OPTION_CLASS}--focused`;
const LIST_OPTION_SELECTED_CLASS = `${LIST_OPTION_CLASS}--selected`;
const STATUS_CLASS = `${COMBO_BOX_CLASS}__status`;

const COMBO_BOX = `.${COMBO_BOX_CLASS}`;
const SELECT = `.${SELECT_CLASS}`;
const INPUT = `.${INPUT_CLASS}`;
const CLEAR_INPUT_BUTTON = `.${CLEAR_INPUT_BUTTON_CLASS}`;
const LIST = `.${LIST_CLASS}`;
const LIST_OPTION = `.${LIST_OPTION_CLASS}`;
const LIST_OPTION_FOCUSED = `.${LIST_OPTION_FOCUSED_CLASS}`;
const STATUS = `.${STATUS_CLASS}`;

/**
 * set the value of the element and dispatch a change event
 *
 * @param {HTMLInputElement|HTMLSelectElement} el The element to update
 * @param {string} value The new value of the element
 */
const changeElementValue = (el, value = "") => {
  const elementToChange = el;
  elementToChange.value = value;

  const event = new CustomEvent("change", {
    bubbles: true,
    cancelable: true,
    detail: { value }
  });
  elementToChange.dispatchEvent(event);
};

/**
 * The elements within the combo box.
 * @typedef {Object} ComboBoxContext
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
 * @returns {ComboBoxContext} elements
 */
const getComboBoxContext = el => {
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

  const isPristine = comboBoxEl.classList.contains(COMBO_BOX_PRISTINE_CLASS);

  return {
    comboBoxEl,
    selectEl,
    inputEl,
    listEl,
    statusEl,
    focusedOptionEl,
    isPristine
  };
};

/**
 * Enhance a select element into a combo box component.
 *
 * @param {HTMLElement} el The initial element within the combo box component
 */
const enhanceComboBox = el => {
  const comboBoxEl = el.closest(COMBO_BOX);

  if (!comboBoxEl) {
    throw new Error(`Element is missing outer ${COMBO_BOX}`);
  }

  const selectEl = comboBoxEl.querySelector(SELECT);

  if (!selectEl) {
    throw new Error(`${COMBO_BOX} is missing inner ${SELECT}`);
  }

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
      `<span class="${CLEAR_INPUT_BUTTON_WRAPPER_CLASS}" tabindex="-1">
        <button type="button" class="${CLEAR_INPUT_BUTTON_CLASS}">&nbsp;</button>
      </span>`,
      `<span class="${INPUT_BUTTON_SEPARATOR_CLASS}">&nbsp;</span>`,
      `<span class="${TOGGLE_LIST_BUTTON_WRAPPER_CLASS}" tabindex="-1">
        <button type="button" class="${TOGGLE_LIST_BUTTON_CLASS}">&nbsp;</button>
      </span>`,
      `<ul
        tabindex="-1"
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
    const { inputEl } = getComboBoxContext(el);
    changeElementValue(selectEl, selectedOption.value);
    changeElementValue(inputEl, selectedOption.text);
  }
};

/**
 * Manage the focused element within the list options when
 * navigating via keyboard.
 *
 * @param {HTMLElement} el An element within the combo box component
 * @param {HTMLElement} currentEl An element within the combo box component
 * @param {HTMLElement} nextEl An element within the combo box component
 * @param {boolean} skipFocus skip focus of highlighted item
 */
const highlightOption = (el, currentEl, nextEl, skipFocus) => {
  const { inputEl, listEl } = getComboBoxContext(el);

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

    if (!skipFocus) nextEl.focus();
  } else {
    inputEl.setAttribute("aria-activedescendant", "");
    inputEl.focus();
  }
};

/**
 * Display the option list of a combo box component.
 *
 * @param {HTMLElement} el An element within the combo box component
 */
const displayList = el => {
  const {
    selectEl,
    inputEl,
    listEl,
    statusEl,
    isPristine
  } = getComboBoxContext(el);
  let selectedItemId;

  const listOptionBaseId = `${listEl.id}--option-`;

  const inputValue = (inputEl.value || "").toLowerCase();

  const options = [];
  for (let i = 0, len = selectEl.options.length; i < len; i += 1) {
    const optionEl = selectEl.options[i];
    if (
      optionEl.value &&
      (isPristine ||
        !inputValue ||
        optionEl.text.toLowerCase().indexOf(inputValue) !== -1)
    ) {
      if (selectEl.value && optionEl.value === selectEl.value) {
        selectedItemId = `#${listOptionBaseId}${options.length}`;
      }

      options.push(optionEl);
    }
  }

  const numOptions = options.length;
  const optionHtml = options
    .map((option, index) => {
      const optionId = `${listOptionBaseId}${index}`;
      const classes = [LIST_OPTION_CLASS];

      if (optionId === selectedItemId) {
        classes.push(LIST_OPTION_SELECTED_CLASS);
      }

      return `<li
          aria-selected="false"
          aria-setsize="${options.length}"
          aria-posinset="${index + 1}"
          id="${optionId}"
          class="${classes.join(" ")}"
          tabindex="-1"
          role="option"
          data-value="${option.value}"
        >${option.text}</li>`;
    })
    .join("");

  const noResults = `<li class="${LIST_OPTION_CLASS}--no-results">No results found</li>`;

  listEl.hidden = false;
  listEl.innerHTML = numOptions ? optionHtml : noResults;

  inputEl.setAttribute("aria-expanded", "true");

  statusEl.innerHTML = numOptions
    ? `${numOptions} result${numOptions > 1 ? "s" : ""} available.`
    : "No results.";

  if (isPristine && selectedItemId) {
    highlightOption(listEl, null, listEl.querySelector(selectedItemId), true);
  }
};

/**
 * Hide the option list of a combo box component.
 *
 * @param {HTMLElement} el An element within the combo box component
 */
const hideList = el => {
  const { inputEl, listEl, statusEl, focusedOptionEl } = getComboBoxContext(el);

  statusEl.innerHTML = "";

  inputEl.setAttribute("aria-expanded", "false");
  inputEl.setAttribute("aria-activedescendant", "");

  if (focusedOptionEl) {
    focusedOptionEl.classList.remove(LIST_OPTION_FOCUSED_CLASS);
  }

  listEl.scrollTop = 0;
  listEl.hidden = true;
};

/**
 * Select an option list of the combo box component.
 *
 * @param {HTMLElement} listOptionEl The list option being selected
 */
const selectItem = listOptionEl => {
  const { comboBoxEl, selectEl, inputEl } = getComboBoxContext(listOptionEl);

  changeElementValue(selectEl, listOptionEl.dataset.value);
  changeElementValue(inputEl, listOptionEl.textContent);
  comboBoxEl.classList.add(COMBO_BOX_PRISTINE_CLASS);
  hideList(comboBoxEl);
  inputEl.focus();
};

/**
 * Clear the input of the combobox
 *
 * @param {HTMLButtonElement} clearButtonEl The clear input button
 */
const clearInput = clearButtonEl => {
  const { comboBoxEl, selectEl, inputEl } = getComboBoxContext(clearButtonEl);

  inputEl.focus();
  selectEl.value = "";
  inputEl.value = "";
  comboBoxEl.classList.remove(COMBO_BOX_PRISTINE_CLASS);
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
  const {
    comboBoxEl,
    selectEl,
    inputEl,
    statusEl,
    focusedOptionEl
  } = getComboBoxContext(el);

  statusEl.textContent = "";

  if (focusedOptionEl) {
    changeElementValue(selectEl, focusedOptionEl.dataset.value);
    changeElementValue(inputEl, focusedOptionEl.textContent);
    comboBoxEl.classList.add(COMBO_BOX_PRISTINE_CLASS);
    return;
  }

  const inputValue = (inputEl.value || "").toLowerCase();

  if (inputValue) {
    for (let i = 0, len = selectEl.options.length; i < len; i += 1) {
      const optionEl = selectEl.options[i];
      if (optionEl.text.toLowerCase() === inputValue) {
        changeElementValue(selectEl, optionEl.value);
        changeElementValue(inputEl, optionEl.text);
        comboBoxEl.classList.add(COMBO_BOX_PRISTINE_CLASS);
        return;
      }
    }
  }

  if (selectEl.value) {
    changeElementValue(selectEl);
  }

  if (inputEl.value) {
    changeElementValue(inputEl);
  }
};

/**
 * Handle the enter event within the combo box component.
 *
 * @param {KeyboardEvent} event An event within the combo box component
 */
const handleEnter = event => {
  const { comboBoxEl, inputEl, listEl } = getComboBoxContext(event.target);
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
  const { comboBoxEl, inputEl } = getComboBoxContext(event.target);

  hideList(comboBoxEl);
  inputEl.focus();
};

/**
 * Handle the up event within the combo box component.
 *
 * @param {KeyboardEvent} event An event within the combo box component
 */
const handleUp = event => {
  const { comboBoxEl, listEl, focusedOptionEl } = getComboBoxContext(
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
  const { comboBoxEl, listEl, focusedOptionEl } = getComboBoxContext(
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
      },
      [CLEAR_INPUT_BUTTON]() {
        clearInput(this);
      }
    },
    focusout: {
      [COMBO_BOX](event) {
        const { comboBoxEl } = getComboBoxContext(event.target);
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
    input: {
      [INPUT]() {
        const comboBoxEl = this.closest(COMBO_BOX);
        comboBoxEl.classList.remove(COMBO_BOX_PRISTINE_CLASS);
        displayList(this);
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
