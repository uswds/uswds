const keymap = require("receptor/keymap");
const select = require("../utils/select");
const behavior = require("../utils/behavior");
const { prefix: PREFIX } = require("../config");
const { CLICK } = require("../events");

const BODY = "body";
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

const isPrintableKeyCode = (keyCode) => {
  return (
    (keyCode > 47 && keyCode < 58) || // number keys
    keyCode === 32 ||
    keyCode === 8 || // spacebar or backspace
    (keyCode > 64 && keyCode < 91) || // letter keys
    (keyCode > 95 && keyCode < 112) || // numpad keys
    (keyCode > 185 && keyCode < 193) || // ;=,-./` (in order)
    (keyCode > 218 && keyCode < 223) // [\]' (in order)
  );
}

const getComboBoxElements = (el) => {
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
  const currentOptionEl = comboBoxEl.querySelector(LIST_OPTION_FOCUSED);

  return { comboBoxEl, selectEl, inputEl, listEl, statusEl, currentOptionEl };
};

/**
 * Enhance the combo box element
 *
 * @param {Element} el The initial element within the combobox component
 */
const enhanceComboBox = el => {
  const { comboBoxEl, selectEl } = getComboBoxElements(el);

  const selectId = selectEl.id;
  const isRequired = selectEl.required;
  const listId = `${selectId}--list`;
  const assistiveHintID = `${selectId}--assistiveHint`;

  comboBoxEl.insertAdjacentHTML(
    "beforeend",
    [
      `<input
        aria-owns="${listId}"
        aria-autocomplete="list"
        aria-describedby="${assistiveHintID}"
        aria-expanded="false"
        autocapitalize="off" 
        autocomplete="off"
        id="${selectId}" 
        class="${INPUT_CLASS}"
        type="text" 
        role="combobox"
        ${isRequired ? 'required' : ''}
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

  selectEl.setAttribute("aria-hidden", "true");
  selectEl.setAttribute("tabindex", "-1");
  selectEl.removeAttribute("required");
  selectEl.classList.add("usa-sr-only");
  selectEl.id = "";
};

const displayList = el => {
  const { selectEl, inputEl, listEl, statusEl } = getComboBoxElements(el);

  const listOptionBaseId = `${listEl.id}--option-`;

  const inputValue = (inputEl.value || "").toLowerCase();

  let optionEl;
  const options = [];
  for (let i = 0, len = selectEl.options.length; i < len; i += 1) {
    optionEl = selectEl.options[i];
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
    : 'No results.';
};

const hideList = el => {
  const { inputEl, listEl, statusEl } = getComboBoxElements(el);

  statusEl.innerHTML = "";

  inputEl.setAttribute("aria-expanded", "false");
  inputEl.setAttribute("aria-activedescendant", "");

  listEl.innerHTML = "";
  listEl.hidden = true;
};

const selectItem = listOptionEl => {
  const { comboBoxEl, selectEl, inputEl } = getComboBoxElements(listOptionEl);

  selectEl.value = listOptionEl.getAttribute("data-option-value");
  inputEl.value = listOptionEl.textContent;
  hideList(comboBoxEl);
  inputEl.focus();
};

const handlePrintableKey = input => {
  displayList(input);
};

const completeSelection = el => {
  const { selectEl, inputEl, statusEl, currentOptionEl } = getComboBoxElements(el);

  statusEl.textContent = "";

  if (currentOptionEl) {
    selectEl.value = currentOptionEl.getAttribute("data-option-value");
    inputEl.value = currentOptionEl.textContent;
    return;
  }

  const inputValue = (inputEl.value || "").toLowerCase();

  if (inputValue) {
    let optionEl;
    for (let i = 0, len = selectEl.options.length; i < len; i += 1) {
      optionEl = selectEl.options[i];
      if (optionEl.text.toLowerCase() === inputValue) {
        selectEl.value = optionEl.value;
        inputEl.value = optionEl.text;
        return;
      }
    }
  }

  selectEl.value = "";
  inputEl.value = "";
};

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

const handleEnter = (event) => {
  const { comboBoxEl, inputEl, listEl } = getComboBoxElements(event.target);
  const listShown = !listEl.hidden;

  completeSelection(comboBoxEl);

  if (listShown) {
    hideList(comboBoxEl);
    inputEl.focus();
    event.preventDefault();
  }
};

const handleEscape = (event) => {
  const { comboBoxEl, inputEl } = getComboBoxElements(event.target);
  hideList(comboBoxEl);
  inputEl.focus();
};

const handleUp = (event) => {
  const { comboBoxEl, listEl, currentOptionEl } = getComboBoxElements(event.target);
  const nextOptionEl = currentOptionEl && currentOptionEl.previousSibling;
  const listShown = !listEl.hidden;

  highlightOption(comboBoxEl, currentOptionEl, nextOptionEl);

  if (listShown) {
    event.preventDefault();
  }

  if (!nextOptionEl) {
    hideList(comboBoxEl);
  }
};

const handleDown = (event) => {
  const { comboBoxEl, listEl, currentOptionEl } = getComboBoxElements(event.target);

  if (listEl.hidden) {
    displayList(comboBoxEl);
  }

  const nextOptionEl = currentOptionEl
    ? currentOptionEl.nextSibling
    : listEl.querySelector(LIST_OPTION);

  if (nextOptionEl) {
    highlightOption(comboBoxEl, currentOptionEl, nextOptionEl);
  }

  event.preventDefault();
};

const handleTab = (event) => {
  const { comboBoxEl } = getComboBoxElements(event.target);

  completeSelection(comboBoxEl);
  hideList(comboBoxEl);
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
      [BODY](event) {
        select(COMBO_BOX).forEach(comboBoxEl => {
          if (!comboBoxEl.contains(event.target)) {
            completeSelection(comboBoxEl);
            hideList(comboBoxEl);
          }
        });
      }
    },
    keydown: {
      [COMBO_BOX]: keymap({
        ArrowUp: handleUp,
        ArrowDown: handleDown,
        Escape: handleEscape,
        Enter: handleEnter,
        Tab: handleTab
      })
    },
    keyup: {
      [INPUT](event) {
        if (isPrintableKeyCode(event.keyCode)) {
          handlePrintableKey(this);
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
