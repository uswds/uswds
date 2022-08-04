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
const HEADER = `.${PREFIX}-header`;
const LANGUAGE = `.${PREFIX}-language`;
const LANGUAGE_PRIMARY = `.${PREFIX}-language__primary`;
const LANGUAGE_PRIMARY_ITEM = `.${PREFIX}-language__primary-item`;
const LANGUAGE_CONTROL = `button.${PREFIX}-language__link`;
const LANGUAGE_LINKS = `${LANGUAGE} a`;
const NON_LANGUAGE_HIDDEN_ATTRIBUTE = `data-nav-hidden`;
const OPENERS = `.${PREFIX}-language-btn`;
const CLOSE_BUTTON = `.${PREFIX}-language__close`;
const OVERLAY = `.${PREFIX}-overlay`;
const CLOSERS = `${CLOSE_BUTTON}, .${PREFIX}-overlay`;
const TOGGLES = [LANGUAGE, OVERLAY].join(", ");
const NON_LANGUAGE_ELEMENTS = `body > *:not(${HEADER}):not([aria-hidden])`;
const NON_LANGUAGE_HIDDEN = `[${NON_LANGUAGE_HIDDEN_ATTRIBUTE}]`;

const ACTIVE_CLASS = "usa-js-mobile-nav--active";
const VISIBLE_CLASS = "is-visible";

let languageSelector;
let languageActive;
let nonLanguageElements;

const isActive = () => document.body.classList.contains(ACTIVE_CLASS);
const SCROLLBAR_WIDTH = ScrollBarWidth();
const INITIAL_PADDING = window
  .getComputedStyle(document.body)
  .getPropertyValue("padding-right");
const TEMPORARY_PADDING = `${
  parseInt(INITIAL_PADDING.replace(/px/, ""), 10) +
  parseInt(SCROLLBAR_WIDTH.replace(/px/, ""), 10)
}px`;

const hideNonLanguageItems = () => {
  nonLanguageElements = document.querySelectorAll(NON_LANGUAGE_ELEMENTS);

  nonLanguageElements.forEach((nonLanguageElement) => {
    nonLanguageElement.setAttribute("aria-hidden", true);
    nonLanguageElement.setAttribute(NON_LANGUAGE_HIDDEN_ATTRIBUTE, "");
  });
};

const showNonLanguageItems = () => {
  nonLanguageElements = document.querySelectorAll(NON_LANGUAGE_HIDDEN);

  if (!nonLanguageElements) {
    return;
  }

  // Remove aria-hidden from non-header elements
  nonLanguageElements.forEach((nonLanguageElement) => {
    nonLanguageElement.removeAttribute("aria-hidden");
    nonLanguageElement.removeAttribute(NON_LANGUAGE_HIDDEN_ATTRIBUTE);
  });
};

const toggleNonLanguageItems = (active) => {
  if (active) {
    hideNonLanguageItems();
  } else {
    showNonLanguageItems();
  }
};

const toggleLanguage = (active) => {
  const { body } = document;
  const safeActive = typeof active === "boolean" ? active : !isActive();

  body.classList.toggle(ACTIVE_CLASS, safeActive);

  select(TOGGLES).forEach((el) =>
    el.classList.toggle(VISIBLE_CLASS, safeActive)
  );

  languageSelector.focusTrap.update(safeActive);

  const closeButton = body.querySelector(CLOSE_BUTTON);
  const languageButton = document.querySelector(OPENERS);

  body.style.paddingRight =
    body.style.paddingRight === TEMPORARY_PADDING
      ? INITIAL_PADDING
      : TEMPORARY_PADDING;

  toggleNonLanguageItems(safeActive);

  if (safeActive && closeButton) {
    // The language selector was just activated. Focus on the close button, which is
    // just before all the nav elements in the tab order.
    closeButton.focus();
  } else if (
    !safeActive &&
    document.activeElement === closeButton &&
    languageButton
  ) {
    // The language selector was just deactivated, and focus was on the close
    // button, which is no longer visible. We don't want the focus to
    // disappear into the void, so focus on the language button if it's
    // visible (this may have been what the user was just focused on,
    // if they triggered the language selector by mistake).
    languageButton.focus();
  }

  return safeActive;
};

const resize = () => {
  const closer = document.body.querySelector(CLOSE_BUTTON);

  if (isActive() && closer && closer.getBoundingClientRect().width === 0) {
    // When the language selector is active, and the close box isn't visible,
    // we know the user's viewport has been resized to be larger.
    // Let's make the page state consistent by deactivating the language selector.
    languageSelector.toggleLanguage.call(closer, false);
  }
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
        // If another nav is open, close it
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
        // A language link has been clicked! We want to collapse any
        // hierarchical language UI it's a part of, so that the user
        // can focus on whatever they've just selected.

        // Some language links are inside accordions; when they're
        // clicked, we want to collapse those accordions.
        const acc = this.closest(accordion.ACCORDION);

        if (acc) {
          accordion.getButtons(acc).forEach((btn) => accordion.hide(btn));
        }

        // If the mobile language language is active, we want to hide it.
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
      const trapContainer = root.matches(LANGUAGE)
        ? root
        : root.querySelector(LANGUAGE);

      if (trapContainer) {
        languageSelector.focusTrap = FocusTrap(trapContainer, {
          Escape: onLanguageClose,
        });
      }

      resize();
      window.addEventListener("resize", resize, false);
    },
    teardown() {
      window.removeEventListener("resize", resize, false);
      languageActive = false;
    },
    focusTrap: null,
    toggleLanguage,
  }
);

module.exports = languageSelector;
