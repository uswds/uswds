import keymap from "receptor/keymap/index.js";
import behavior from "../../uswds-core/src/js/utils/behavior.mjs";
import toggle from "../../uswds-core/src/js/utils/toggle.mjs";
import FocusTrap from "../../uswds-core/src/js/utils/focus-trap.mjs";
import accordion from "../../usa-accordion/src/index.mjs";

import { CLICK } from "../../uswds-core/src/js/events.mjs";
import { prefix as PREFIX } from "../../uswds-core/src/js/config.mjs";

const BODY = "body";
const LANGUAGE = `.${PREFIX}-language`;
const LANGUAGE_SUB = `.${PREFIX}-language__submenu`;
const LANGUAGE_PRIMARY = `.${PREFIX}-language__primary`;
const LANGUAGE_PRIMARY_ITEM = `.${PREFIX}-language__primary-item`;
const LANGUAGE_CONTROL = `button.${PREFIX}-language__link`;
const LANGUAGE_LINKS = `${LANGUAGE} a`;

let languageSelector;
let languageActive;

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
        if (languageActive === this) {
          hideActiveLanguageDropdown();
          return false;
        }
        if (!languageActive) {
          languageActive = this;
          toggle(languageActive, true);
        }

        return false;
      },
      [BODY]: hideActiveLanguageDropdown,
      [LANGUAGE_LINKS]() {
        const acc = this.closest(accordion.ACCORDION);

        if (acc) {
          accordion.getButtons(acc).forEach((btn) => accordion.hide(btn));
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
  }
);

export default languageSelector;
