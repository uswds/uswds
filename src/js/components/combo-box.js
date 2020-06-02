const keymap = require("receptor/keymap");
const select = require("../utils/select");
const behavior = require("../utils/behavior");
const { prefix: PREFIX } = require("../config");
const { CLICK } = require("../events");

const COMBO_BOX_CLASS = `${PREFIX}-combo-box`;
const SELECT_CLASS = `${COMBO_BOX_CLASS}__select`;
const INPUT_CLASS = `${COMBO_BOX_CLASS}__input`;
const INPUT_DIRTY_CLASS = `${INPUT_CLASS}--dirty`;
const CLEAR_INPUT_BUTTON_CLASS = `${COMBO_BOX_CLASS}__clear-input`;
const LIST_CLASS = `${COMBO_BOX_CLASS}__list`;
const LIST_OPTION_CLASS = `${COMBO_BOX_CLASS}__list-option`;
const LIST_OPTION_FOCUSED_CLASS = `${LIST_OPTION_CLASS}--focused`;
const STATUS_CLASS = `${COMBO_BOX_CLASS}__status`;

const COMBO_BOX = `.${COMBO_BOX_CLASS}`;
const SELECT = `.${SELECT_CLASS}`;
const INPUT = `.${INPUT_CLASS}`;
const LIST = `.${LIST_CLASS}`;
const LIST_OPTION = `.${LIST_OPTION_CLASS}`;
const LIST_OPTION_FOCUSED = `.${LIST_OPTION_FOCUSED_CLASS}`;
const STATUS = `.${STATUS_CLASS}`;

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

  const isPristine = !inputEl.classList.contains(INPUT_DIRTY_CLASS);

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
      `<button class="${CLEAR_INPUT_BUTTON_CLASS}" hidden></button>`,
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
  const {
    selectEl,
    inputEl,
    listEl,
    statusEl,
    isPristine
  } = getComboBoxContext(el);
  let optionToHighlightId;

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
      if (isPristine && inputValue && inputValue === optionEl.value) {
        optionToHighlightId = `#${listOptionBaseId}${options.length}`;
      }

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

  if (optionToHighlightId) {
    highlightOption(listEl, null, listEl.querySelector(optionToHighlightId));
  }
};

/**
 * Hide the option list of a combo box component.
 *
 * @param {HTMLElement} el An element within the combo box component
 */
const hideList = el => {
  const { inputEl, listEl, statusEl } = getComboBoxContext(el);

  statusEl.innerHTML = "";

  inputEl.setAttribute("aria-expanded", "false");
  inputEl.setAttribute("aria-activedescendant", "");
  inputEl.classList.remove(INPUT_DIRTY_CLASS);

  listEl.hidden = true;
  listEl.innerHTML = "";
};

/**
 * Select an option list of the combo box component.
 *
 * @param {HTMLElement} listOptionEl The list option being selected
 */
const selectItem = listOptionEl => {
  const { comboBoxEl, selectEl, inputEl } = getComboBoxContext(listOptionEl);

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
  const { selectEl, inputEl, statusEl, focusedOptionEl } = getComboBoxContext(
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
        this.classList.add(INPUT_DIRTY_CLASS);
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
