const behavior = require("../utils/behavior");
const select = require("../utils/select");
const toggle = require("../utils/toggle");
const FocusTrap = require("../utils/focus-trap");

const { CLICK } = require("../events");
const { prefix: PREFIX } = require("../config");

const MODAL = `.${PREFIX}-modal`;

const CLOSE_BUTTON = `.${PREFIX}-modal__close`;
const OVERLAY = `.${PREFIX}-overlay`;
const OPENERS = `.${PREFIX}-modal-btn[aria-controls]`;
const CLOSERS = `${CLOSE_BUTTON}, .${PREFIX}-modal__scrim`;
const TOGGLES = [MODAL, OVERLAY].join(", ");

const ACTIVE_CLASS = "usa-js-mobile-nav--active";
const VISIBLE_CLASS = "is-visible";

let modal;

const isActive = () => document.body.classList.contains(ACTIVE_CLASS);

function toggleModal(active) {
  const { body } = document;
  const safeActive = typeof active === "boolean" ? active : !isActive();
  const modalId = typeof this.getAttribute !== "function" ? false : this.getAttribute("aria-controls");
  const targetModal = modalId != false ? document.getElementById(modalId) : body.querySelector(".usa-modal.is-visible");

  body.classList.toggle(ACTIVE_CLASS, safeActive);

  if (modalId) {
    targetModal.classList.toggle(VISIBLE_CLASS, safeActive);
  }
  else {
    select(TOGGLES).forEach((el) => {
      el.classList.toggle(VISIBLE_CLASS, safeActive)
      }
    );
  }

  if (targetModal) {
    modal.focusTrap = FocusTrap(targetModal, {
      Escape: onMenuClose,
    });


    modal.focusTrap.update(safeActive);
  
    const closeButton = targetModal.querySelector(CLOSE_BUTTON);
    const returnFocus = body.querySelector(`[aria-controls="${targetModal.getAttribute("id")}"]`)
    const menuButton = body.querySelector(OPENERS);

    if (safeActive && closeButton) {
      // The mobile nav was just activated, so focus on the close button,
      // which is just before all the nav elements in the tab order.
      closeButton.focus();
    } else if (
      !safeActive &&
      menuButton &&
      returnFocus
    ) {
      // The mobile nav was just deactivated, and focus was on the close
      // button, which is no longer visible. We don't want the focus to
      // disappear into the void, so focus on the menu button if it's
      // visible (this may have been what the user was just focused on,
      // if they triggered the mobile nav by mistake).
      returnFocus.focus();
    }
  }
  return safeActive;
};

const setUpAttributes = (modalWindow) => {
  const modalContent = modalWindow.innerHTML;
  const wrappedContent = `<div class="usa-modal__inner">${modalContent}</div><div class="usa-modal__close usa-modal__scrim"></div>`;
  const modalID = modalWindow.getAttribute("id");
  modalWindow.innerHTML = wrappedContent;
  const modalClosers = modalWindow.querySelectorAll(CLOSERS);
  modalWindow.setAttribute("role", "dialog");

  modalClosers.forEach((el) => {
    el.setAttribute("aria-controls", modalID);
    }
  );
}

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
      select(MODAL, root).forEach((modalWindow) => {
        setUpAttributes(modalWindow);
      });
    },
    focusTrap: null,
    toggleModal,
  }
);

module.exports = modal;