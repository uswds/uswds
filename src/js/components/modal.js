const behavior = require("../utils/behavior");
const select = require("../utils/select");
const FocusTrap = require("../utils/focus-trap");

const { CLICK } = require("../events");
const { prefix: PREFIX } = require("../config");

const MODAL = `.${PREFIX}-modal`;

const CLOSE_BUTTON = `.${PREFIX}-modal__close`;
const OVERLAY = `.${PREFIX}-overlay`;
const OPENERS = `.${PREFIX}-modal-btn[aria-controls]`;
const CLOSERS = `${CLOSE_BUTTON}, .${PREFIX}-modal__scrim`;
const TOGGLES = [MODAL, OVERLAY].join(", ");
const INNERDIV = `.${PREFIX}-modal__inner`;

const ACTIVE_CLASS = "usa-js-mobile-nav--active";
const VISIBLE_CLASS = "is-visible";

let modal;

const isActive = () => document.body.classList.contains(ACTIVE_CLASS);

function toggleModal(active) {
  const clickedElement = event.target;
  const { body } = document;
  const safeActive = typeof active === "boolean" ? active : !isActive();

  // This is weird because can't do getAttribute on esc key
  const modalId = typeof this.getAttribute !== "function" ? false : this.getAttribute("aria-controls");
  const targetModal = modalId != false ? document.getElementById(modalId) : body.querySelector(".usa-modal.is-visible");
 
  // This basically stops the propagation by determining if
  // the clicked element is not a child element in the modal
  // and is also not a close button
  if ( clickedElement && targetModal && (clickedElement == targetModal.querySelector(INNERDIV) || clickedElement.closest(".usa-modal__inner") == targetModal.querySelector(INNERDIV))) {

    if (clickedElement.classList.contains("usa-modal__close")) {
      // do nothing. move on.
    }
    else {
      //event.stopPropagation();
      return false;
    }
    
  }

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
    
    //modal.focusTrap = FocusTrap(targetModal, {
    //  Escape: onMenuClose,
    //});

    modal.focusTrap = FocusTrap(targetModal);
  
    
    modal.focusTrap.update(safeActive);
    
    const closeButton = targetModal.querySelector(CLOSE_BUTTON);
    const returnFocus = body.querySelector(`[aria-controls="${targetModal.getAttribute("id")}"]`)
    const menuButton = body.querySelector(OPENERS);

    if (safeActive && closeButton) {
      // The modal window is opened. Focus is set to close button.
      closeButton.focus();
      document.addEventListener('keydown', function(event){    
        if(event.key === "Escape"){
          onMenuClose();
        }
      }, { once: false });
    } else if (
      !safeActive &&
      menuButton &&
      returnFocus
    ) {
      // The modal window is closed.
      // Focus is returned to the opener 
      returnFocus.focus();
    }
  }
  return safeActive;
};

const setUpAttributes = (baseElement) => {
  const modalContent = baseElement;
  const outerDiv = document.createElement('div');
  const overlayDiv = document.createElement('div');

  // Rebuild the modal element
  modalContent.parentNode.insertBefore(outerDiv, modalContent);
  outerDiv.appendChild(modalContent);
  modalContent.parentNode.insertBefore(overlayDiv, modalContent);
  overlayDiv.appendChild(modalContent);

  // Add classes and attributes
  outerDiv.classList.add("usa-modal");
  overlayDiv.classList.add("usa-modal__scrim");
  modalContent.classList.remove("usa-modal");
  modalContent.classList.add("usa-modal__inner");
  const modalID = baseElement.getAttribute("id");
  const modalClosers = outerDiv.querySelectorAll(CLOSERS);
  outerDiv.setAttribute("role", "dialog");
  outerDiv.setAttribute("id", modalID);
  baseElement.removeAttribute("id");

  // Add aria-controls
  modalClosers.forEach((el) => {
    el.setAttribute("aria-controls", modalID);
    }
  );
}

const onMenuClose = () => {
  console.log("eeee");
  modal.toggleModal.call(modal, false);
};

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