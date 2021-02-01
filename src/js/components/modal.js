const behavior = require("../utils/behavior");
const select = require("../utils/select");
const toggle = require("../utils/toggle");
const FocusTrap = require("../utils/focus-trap");

const { CLICK } = require("../events");
const { prefix: PREFIX } = require("../config");

const MODAL = `.${PREFIX}-modal`;

const CLOSE_BUTTON = `.${PREFIX}-modal__close`;
const OVERLAY = `.${PREFIX}-overlay`;
const OPENERS = `.${PREFIX}-modal-btn`;
const CLOSERS = `${CLOSE_BUTTON}, .${PREFIX}-overlay`;
const TOGGLES = [MODAL, OVERLAY].join(", ");

const ACTIVE_CLASS = "usa-js-mobile-nav--active";
const VISIBLE_CLASS = "is-visible";

let modal;

const isActive = () => document.body.classList.contains(ACTIVE_CLASS);

const toggleModal = (active) => {
  const { body } = document;
  const safeActive = typeof active === "boolean" ? active : !isActive();

  body.classList.toggle(ACTIVE_CLASS, safeActive);

  select(TOGGLES).forEach((el) => {
    console.log(el);
    el.classList.toggle(VISIBLE_CLASS, safeActive)
    }
  );

  modal.focusTrap.update(safeActive);

  const closeButton = body.querySelector(CLOSE_BUTTON);
  const menuButton = body.querySelector(OPENERS);

  if (safeActive && closeButton) {
    // The mobile nav was just activated, so focus on the close button,
    // which is just before all the nav elements in the tab order.
    closeButton.focus();
  } else if (
    !safeActive &&
    document.activeElement === closeButton &&
    menuButton
  ) {
    // The mobile nav was just deactivated, and focus was on the close
    // button, which is no longer visible. We don't want the focus to
    // disappear into the void, so focus on the menu button if it's
    // visible (this may have been what the user was just focused on,
    // if they triggered the mobile nav by mistake).
    menuButton.focus();
  }

  return safeActive;
};

const onMenuClose = () => modal.toggleModal.call(modal, false);

modal = behavior(
  {
    [CLICK]: {
      [OPENERS]: toggleModal,
      [CLOSERS]: toggleModal,
    },
  },
  {
    init(root) {
      const trapContainer = root.querySelector(MODAL);

      if (trapContainer) {
        modal.focusTrap = FocusTrap(trapContainer, {
          Escape: onMenuClose,
        });
      }
    },
    focusTrap: null,
    toggleModal,
  }
);

module.exports = modal;