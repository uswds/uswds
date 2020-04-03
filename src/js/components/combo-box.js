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

const SELECT = `.${PREFIX}-combo-box__select`;
const INPUT = `.${INPUT_CLASS}`;
const LIST = `.${LIST_CLASS}`;
const LIST_OPTION = `.${LIST_OPTION_CLASS}`;
const STATUS = `.${STATUS_CLASS}`;

function isPrintableKeyCode(keyCode) {
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

/**
 * Enhance the combo box element
 *
 * @param {Element} selectEl The initial select element
 */
const enhanceComboBox = selectEl => {
  const comboBoxEl = selectEl.closest(COMBO_BOX);

  if (!comboBoxEl) {
    throw new Error(`${INPUT} is missing outer ${COMBO_BOX}`);
  }

  const selectId = selectEl.id;
  const listId = `${selectId}--list`;
  const assistiveHintID = `${selectId}--assistiveHint`;

  comboBoxEl.insertAdjacentHTML(
    "beforeend",
    [
      `<input 
        id="${selectId}" 
        class="${INPUT_CLASS}"
        role='combobox'
        autocapitalize="none" 
        autocomplete="off"
        type="text" 
        aria-owns="${listId}"
        aria-autocomplete="list" 
        aria-expanded="false"
        aria-describedby="${assistiveHintID}"
      >`,
      `<ul 
        id="${listId}" 
        class="${LIST_CLASS}" 
        role="listbox"
        hidden>
      </ul>`,
      `<div 
        class="${STATUS_CLASS} usa-sr-only"
        role="status"
        aria-live="polite">
      </div>`,
      `<span id="${assistiveHintID}" class="usa-sr-only">
        When autocomplete results are available use up and down arrows to review and enter to select.
        Touch device users, explore by touch or with swipe gestures.
      </span>`
    ].join("")
  );

  selectEl.setAttribute("aria-hidden", "true");
  selectEl.setAttribute("tabindex", "-1");
  selectEl.classList.add("usa-sr-only");
  // eslint-disable-next-line no-param-reassign
  selectEl.id = "";
};

const displayList = inputEl => {
  const comboBoxEl = inputEl.closest(COMBO_BOX);
  const selectEl = comboBoxEl.querySelector(SELECT);
  const listEl = comboBoxEl.querySelector(LIST);
  const statusEl = comboBoxEl.querySelector(STATUS);

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
      id="${listOptionBaseId}${index}"
      class="${LIST_OPTION_CLASS}"
      tabindex="-1"
      role=option
      aria-selected="false"
      aria-setsize="${options.length}" 
      aria-posinset="${index + 1}"
      data-option-value="${option.value}"
    >${option.text}</li>`
    )
    .join("");

  const noResults = `<li class="${LIST_OPTION_CLASS}--no-results">No results found</li>`;

  listEl.innerHTML = numOptions ? optionHtml : noResults;
  inputEl.setAttribute("aria-expanded", "true");
  listEl.hidden = false;

  statusEl.innerHTML = numOptions
    ? `${numOptions} result${numOptions > 1 ? "s" : ""} available.`
    : '"No results.';
};

const hideList = comboBoxEl => {
  const listEl = comboBoxEl.querySelector(LIST);
  const statusEl = comboBoxEl.querySelector(STATUS);
  const inputEl = comboBoxEl.querySelector(INPUT);

  statusEl.innerHTML = "";

  inputEl.setAttribute("aria-expanded", "false");

  listEl.innerHTML = "";
  listEl.hidden = true;
};

const selectItem = listOptionEl => {
  const comboBoxEl = listOptionEl.closest(COMBO_BOX);
  const selectEl = comboBoxEl.querySelector(SELECT);
  const inputEl = comboBoxEl.querySelector(INPUT);

  selectEl.value = listOptionEl.getAttribute("data-option-value");
  inputEl.value = listOptionEl.textContent;
  hideList(comboBoxEl);
  inputEl.focus();
};

const handlePrintableKey = input => {
  displayList(input);
};

const completeSelection = comboBoxEl => {
  const selectEl = comboBoxEl.querySelector(SELECT);
  const inputEl = comboBoxEl.querySelector(INPUT);
  const currentOptionEl = comboBoxEl.querySelector(
    `${LIST_OPTION}[aria-selected=true]`
  );

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
        // eslint-disable-next-line no-param-reassign
        inputEl.value = optionEl.text;
        return;
      }
    }
  }

  selectEl.value = "";
  // eslint-disable-next-line no-param-reassign
  inputEl.value = "";
};

const highlightOption = (currentEl, nextEl, inputEl, listEl) => {
  if (currentEl) {
    currentEl.setAttribute("aria-selected", "false");
  }
  if (nextEl) {
    inputEl.setAttribute("aria-activedescendant", nextEl.id);
    nextEl.setAttribute("aria-selected", "true");

    const optionBottom = nextEl.offsetTop + nextEl.offsetHeight;
    const currentBottom = listEl.scrollTop + listEl.offsetHeight;

    if (optionBottom > currentBottom) {
      // eslint-disable-next-line no-param-reassign
      listEl.scrollTop = optionBottom - listEl.offsetHeight;
    }
    if (nextEl.offsetTop < listEl.scrollTop) {
      // eslint-disable-next-line no-param-reassign
      listEl.scrollTop = nextEl.offsetTop;
    }
  } else {
    inputEl.removeAttribute("aria-activedescendant");
  }
};

function handleEnter(event) {
  const inputEl = event.target;
  const comboBoxEl = inputEl.closest(COMBO_BOX);
  const listEl = comboBoxEl.querySelector(LIST);

  if (!listEl.hidden) {
    event.preventDefault();
    completeSelection(comboBoxEl);
    hideList(comboBoxEl);
  }
}

function handleEscape(event) {
  const inputEl = event.target;
  const comboBoxEl = inputEl.closest(COMBO_BOX);
  hideList(comboBoxEl);
  inputEl.focus();
}

function handleUp(event) {
  event.preventDefault();
  const inputEl = event.target;
  const comboBoxEl = inputEl.closest(COMBO_BOX);
  const listEl = comboBoxEl.querySelector(LIST);
  const currentOptionEl = listEl.querySelector(
    `${LIST_OPTION}[aria-selected=true]`
  );
  const nextOptionEl = currentOptionEl && currentOptionEl.previousSibling;
  highlightOption(currentOptionEl, nextOptionEl, inputEl, listEl);

  if (currentOptionEl && !nextOptionEl) {
    hideList(comboBoxEl);
    inputEl.focus();
  }
}

function handleDown(event) {
  event.preventDefault();
  const inputEl = event.target;
  const comboBoxEl = inputEl.closest(COMBO_BOX);
  const listEl = comboBoxEl.querySelector(LIST);

  if (listEl.hidden) {
    displayList(inputEl);
  }

  const currentOptionEl = listEl.querySelector(
    `${LIST_OPTION}[aria-selected=true]`
  );
  const nextOptionEl = currentOptionEl
    ? currentOptionEl.nextSibling
    : listEl.querySelector(`${LIST_OPTION}`);
  if (nextOptionEl) {
    highlightOption(currentOptionEl, nextOptionEl, inputEl, listEl);
  }
}

function handleTab(event) {
  const inputEl = event.target;
  const comboBoxEl = inputEl.closest(COMBO_BOX);

  completeSelection(comboBoxEl);
  hideList(comboBoxEl);
}

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
      [INPUT]: keymap({
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
