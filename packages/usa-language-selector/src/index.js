const keymap = require("receptor/keymap");
const behavior = require("../../uswds-core/src/js/utils/behavior");
const select = require("../../uswds-core/src/js/utils/select");
const toggle = require("../../uswds-core/src/js/utils/toggle");
const FocusTrap = require("../../uswds-core/src/js/utils/focus-trap");
const accordion = require("../../usa-accordion/src/index");
const ScrollBarWidth = require("../../uswds-core/src/js/utils/scrollbar-width");

const { CLICK } = require("../../uswds-core/src/js/events");
const { prefix: PREFIX } = require("../../uswds-core/src/js/config");

const BODY = "body";
const LANGUAGE = `.${PREFIX}-language`;
const LANGUAGE_SUB = `.${PREFIX}-language__submenu`;
const LANGUAGE_PRIMARY = `.${PREFIX}-language__primary`;
const LANGUAGE_PRIMARY_ITEM = `.${PREFIX}-language__primary-item`;
const LANGUAGE_CONTROL = `button.${PREFIX}-language__link`;
const LANGUAGE_LINKS = `${LANGUAGE} a`;
const OPENERS = `.${PREFIX}-language-btn`;
const OVERLAY = `.${PREFIX}-overlay`;
const CLOSERS = `.${PREFIX}-overlay`;
const TOGGLES = [LANGUAGE, OVERLAY].join(", ");

const ACTIVE_CLASS = "usa-js-mobile-nav--active";
const VISIBLE_CLASS = "is-visible";

let languageSelector;
let languageActive;

const isActive = () => document.body.classList.contains(ACTIVE_CLASS);
const SCROLLBAR_WIDTH = ScrollBarWidth();
const INITIAL_PADDING = window
  .getComputedStyle(document.body)
  .getPropertyValue("padding-right");
const TEMPORARY_PADDING = `${
  parseInt(INITIAL_PADDING.replace(/px/, ""), 10) +
  parseInt(SCROLLBAR_WIDTH.replace(/px/, ""), 10)
}px`;

const toggleLanguage = (active) => {
  const { body } = document;
  const safeActive = typeof active === "boolean" ? active : !isActive();

  body.classList.toggle(ACTIVE_CLASS, safeActive);

  select(TOGGLES).forEach((el) =>
    el.classList.toggle(VISIBLE_CLASS, safeActive)
  );

  languageSelector.focusTrap.update(safeActive);

  const languageButton = document.querySelector(OPENERS);

  body.style.paddingRight =
    body.style.paddingRight === TEMPORARY_PADDING
      ? INITIAL_PADDING
      : TEMPORARY_PADDING;

  if (safeActive) {
    languageButton.focus();
  }

  return safeActive;
};

const onLanguageClose = () =>
  languageSelector.toggleLanguage.call(languageSelector, false);

const hideActiveLanguageDropdown = () => {
  if (!languageActive) {
    return;
  }

  toggle(languageActive, false);
  languageActive = null;
};

const focusLanguageButton = (event) => {
  const parentLanguageItem = event.target.closest(LANGUAGE_PRIMARY_ITEM);

  // Only shift focus if within dropdown
  if (!event.target.matches(LANGUAGE_CONTROL)) {
    parentLanguageItem.querySelector(LANGUAGE_CONTROL).focus();
  }
};

const handleEscape = (event) => {
  hideActiveLanguageDropdown();
  focusLanguageButton(event);
};

languageSelector = behavior(
  {
    [CLICK]: {
      [LANGUAGE_CONTROL]() {
        if (languageActive !== this) {
          hideActiveLanguageDropdown();
        }
        // store a reference to the last clicked language link element, so we
        // can hide the dropdown if another element on the page is clicked
        if (!languageActive) {
          languageActive = this;
          toggle(languageActive, true);
        }

        // Do this so the event handler on the body doesn't fire
        return false;
      },
      [BODY]: hideActiveLanguageDropdown,
      [OPENERS]: toggleLanguage,
      [CLOSERS]: toggleLanguage,
      [LANGUAGE_LINKS]() {
        const acc = this.closest(accordion.ACCORDION);

        if (acc) {
          accordion.getButtons(acc).forEach((btn) => accordion.hide(btn));
        }

        if (isActive()) {
          languageSelector.toggleLanguage.call(languageSelector, false);
        }
      },
    },
    keydown: {
      [LANGUAGE_PRIMARY]: keymap({ Escape: handleEscape }),
    },
    focusout: {
      [LANGUAGE_PRIMARY](event) {
        const language = event.target.closest(LANGUAGE_PRIMARY);

        if (!language.contains(event.relatedTarget)) {
          hideActiveLanguageDropdown();
        }
      },
    },
  },
  {
    init(root) {
      const trapContainer = root.matches(LANGUAGE_SUB)
        ? root
        : root.querySelector(LANGUAGE_SUB);

      if (trapContainer) {
        languageSelector.focusTrap = FocusTrap(trapContainer, {
          Escape: onLanguageClose,
        });
      }
    },
    teardown() {
      languageActive = false;
    },
    focusTrap: null,
    toggleLanguage,
  }
);

module.exports = languageSelector;
