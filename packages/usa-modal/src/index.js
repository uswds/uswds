const selectOrMatches = require("../../uswds-core/src/js/utils/select-or-matches");
const FocusTrap = require("../../uswds-core/src/js/utils/focus-trap");
const ScrollBarWidth = require("../../uswds-core/src/js/utils/scrollbar-width");
const behavior = require("../../uswds-core/src/js/utils/behavior");

const { prefix: PREFIX } = require("../../uswds-core/src/js/config");

const MODAL_CLASSNAME = `${PREFIX}-modal`;
const OVERLAY_CLASSNAME = `${MODAL_CLASSNAME}-overlay`;
const WRAPPER_CLASSNAME = `${MODAL_CLASSNAME}-wrapper`;
const OPENER_ATTRIBUTE = "data-open-modal";
const CLOSER_ATTRIBUTE = "data-close-modal";
const FORCE_ACTION_ATTRIBUTE = "data-force-action";
const NON_MODAL_HIDDEN_ATTRIBUTE = `data-modal-hidden`;
const MODAL = `.${MODAL_CLASSNAME}`;
const INITIAL_FOCUS = `.${WRAPPER_CLASSNAME} *[data-focus]`;
const CLOSE_BUTTON = `${WRAPPER_CLASSNAME} *[${CLOSER_ATTRIBUTE}]`;
const OPENERS = `*[${OPENER_ATTRIBUTE}][aria-controls]`;
const CLOSERS = `${CLOSE_BUTTON}, .${OVERLAY_CLASSNAME}:not([${FORCE_ACTION_ATTRIBUTE}])`;
const NON_MODALS = `body > *:not(.${WRAPPER_CLASSNAME}):not([aria-hidden])`;
const NON_MODALS_HIDDEN = `[${NON_MODAL_HIDDEN_ATTRIBUTE}]`;

const ACTIVE_CLASS = "usa-js-modal--active";
const PREVENT_CLICK_CLASS = "usa-js-no-click";
const VISIBLE_CLASS = "is-visible";
const HIDDEN_CLASS = "is-hidden";

let modal;

const isActive = () => document.body.classList.contains(ACTIVE_CLASS);
const SCROLLBAR_WIDTH = ScrollBarWidth();
const INITIAL_PADDING = window
  .getComputedStyle(document.body)
  .getPropertyValue("padding-right");
const TEMPORARY_PADDING = `${
  parseInt(INITIAL_PADDING.replace(/px/, ""), 10) +
  parseInt(SCROLLBAR_WIDTH.replace(/px/, ""), 10)
}px`;

/**
 *  Is bound to escape key, closes modal when
 */
const onMenuClose = () => {
  modal.toggleModal.call(modal, false);
};

/**
 *  Toggle the visibility of a modal window
 *
 * @param {KeyboardEvent} event the keydown event
 * @returns {boolean} safeActive if mobile is open
 */
function toggleModal(event) {
  let originalOpener;
  let clickedElement = event.target;
  const { body } = document;
  const safeActive = !isActive();
  const modalId = clickedElement
    ? clickedElement.getAttribute("aria-controls")
    : document.querySelector(".usa-modal-wrapper.is-visible");
  const targetModal = safeActive
    ? document.getElementById(modalId)
    : document.querySelector(".usa-modal-wrapper.is-visible");

  // if there is no modal we return early
  if (!targetModal) {
    return false;
  }

  const openFocusEl = targetModal.querySelector(INITIAL_FOCUS)
    ? targetModal.querySelector(INITIAL_FOCUS)
    : targetModal.querySelector(".usa-modal");
  const returnFocus = document.getElementById(
    targetModal.getAttribute("data-opener")
  );
  const menuButton = body.querySelector(OPENERS);
  const forceUserAction = targetModal.getAttribute(FORCE_ACTION_ATTRIBUTE);

  // Sets the clicked element to the close button
  // so esc key always closes modal
  if (event.type === "keydown" && targetModal !== null) {
    clickedElement = targetModal.querySelector(CLOSE_BUTTON);
  }

  // When we're not hitting the escape key…
  if (clickedElement) {
    // Make sure we click the opener
    // If it doesn't have an ID, make one
    // Store id as data attribute on modal
    if (clickedElement.hasAttribute(OPENER_ATTRIBUTE)) {
      if (this.getAttribute("id") === null) {
        originalOpener = `modal-${Math.floor(Math.random() * 900000) + 100000}`;
        this.setAttribute("id", originalOpener);
      } else {
        originalOpener = this.getAttribute("id");
      }
      targetModal.setAttribute("data-opener", originalOpener);
    }

    // This basically stops the propagation if the element
    // is inside the modal and not a close button or
    // element inside a close button
    if (clickedElement.closest(`.${MODAL_CLASSNAME}`)) {
      if (
        clickedElement.hasAttribute(CLOSER_ATTRIBUTE) ||
        clickedElement.closest(`[${CLOSER_ATTRIBUTE}]`)
      ) {
        // do nothing. move on.
      } else {
        return false;
      }
    }
  }

  body.classList.toggle(ACTIVE_CLASS, safeActive);
  targetModal.classList.toggle(VISIBLE_CLASS, safeActive);
  targetModal.classList.toggle(HIDDEN_CLASS, !safeActive);

  // If user is forced to take an action, adding
  // a class to the body that prevents clicking underneath
  // overlay
  if (forceUserAction) {
    body.classList.toggle(PREVENT_CLICK_CLASS, safeActive);
  }

  // Account for content shifting from body overflow: hidden
  // We only check paddingRight in case apps are adding other properties
  // to the body element
  body.style.paddingRight =
    body.style.paddingRight === TEMPORARY_PADDING
      ? INITIAL_PADDING
      : TEMPORARY_PADDING;

  // Handle the focus actions
  if (safeActive && openFocusEl) {
    // The modal window is opened. Focus is set to close button.

    // Binds escape key if we're not forcing
    // the user to take an action
    if (forceUserAction) {
      modal.focusTrap = FocusTrap(targetModal);
    } else {
      modal.focusTrap = FocusTrap(targetModal, {
        Escape: onMenuClose,
      });
    }

    // Handles focus setting and interactions
    modal.focusTrap.update(safeActive);
    openFocusEl.focus();

    // Hides everything that is not the modal from screen readers
    document.querySelectorAll(NON_MODALS).forEach((nonModal) => {
      nonModal.setAttribute("aria-hidden", "true");
      nonModal.setAttribute(NON_MODAL_HIDDEN_ATTRIBUTE, "");
    });
  } else if (!safeActive && menuButton && returnFocus) {
    // The modal window is closed.
    // Non-modals now accesible to screen reader
    document.querySelectorAll(NON_MODALS_HIDDEN).forEach((nonModal) => {
      nonModal.removeAttribute("aria-hidden");
      nonModal.removeAttribute(NON_MODAL_HIDDEN_ATTRIBUTE);
    });

    // Focus is returned to the opener
    returnFocus.focus();
    modal.focusTrap.update(safeActive);
  }

  return safeActive;
}

/**
 * 
 * @param {HTMLElement} baseComponent - Modal HTML from the DOM
 * @returns {HTMLElement} Placeholder to append modal content to
 */
const createPlaceHolder = (baseComponent) => {
  const modalID = baseComponent.getAttribute("id");
  const originalLocationPlaceHolder = document.createElement("div");
  originalLocationPlaceHolder.setAttribute(`data-placeholder-for`, modalID);
  originalLocationPlaceHolder.style.display = "none";
  originalLocationPlaceHolder.setAttribute("aria-hidden", "true");

  // TODO: Refactor this ↓↓↓
  for (
    let attributeIndex = 0;
    attributeIndex < baseComponent.attributes.length;
    attributeIndex += 1
  ) {
    const attribute = baseComponent.attributes[attributeIndex];
    originalLocationPlaceHolder.setAttribute(
      `data-original-${attribute.name}`,
      attribute.value
    );
  }

  return originalLocationPlaceHolder;
}

const setModalAttributes = (baseComponent, targetWrapper) => {
  const modalID = baseComponent.getAttribute("id");
  const ariaLabelledBy = baseComponent.getAttribute("aria-labelledby");
  const ariaDescribedBy = baseComponent.getAttribute("aria-describedby");
  const forceUserAction = baseComponent.hasAttribute(FORCE_ACTION_ATTRIBUTE);

  // Set attributes
  targetWrapper.setAttribute("role", "dialog");
  targetWrapper.setAttribute("id", modalID);

  // ? More intuitive 
  if (ariaLabelledBy) {
    targetWrapper.setAttribute("aria-labelledby", ariaLabelledBy);
  }

  if (ariaDescribedBy) {
    targetWrapper.setAttribute("aria-describedby", ariaDescribedBy);
  }

  if (forceUserAction) {
    targetWrapper.setAttribute(FORCE_ACTION_ATTRIBUTE, forceUserAction);
  }

  // Add aria-controls
  const modalClosers = targetWrapper.querySelectorAll(CLOSERS);
  modalClosers.forEach((el) => {
    el.setAttribute("aria-controls", modalID);
  });

  // Update the base element HTML
  baseComponent.removeAttribute("id");
  baseComponent.removeAttribute("aria-labelledby");
  baseComponent.removeAttribute("aria-describedby");
  baseComponent.setAttribute("tabindex", "-1");

  return targetWrapper
}

const rebuildModal = (baseComponent) => {
  const modalContent = baseComponent;
  const modalWrapper = document.createElement("div");
  const overlayDiv = document.createElement("div");

  // ? Seperate wrapper and modal?
  // Rebuild the modal element
  modalContent.parentNode.insertBefore(modalWrapper, modalContent);
  modalWrapper.appendChild(modalContent);
  modalContent.parentNode.insertBefore(overlayDiv, modalContent);
  overlayDiv.appendChild(modalContent);

  // Add classes
  modalWrapper.classList.add(HIDDEN_CLASS);
  modalWrapper.classList.add(WRAPPER_CLASSNAME);
  overlayDiv.classList.add(OVERLAY_CLASSNAME);

  // Add attributes
  setModalAttributes(modalContent, modalWrapper);

  return modalWrapper;
}

/**
 *  Builds modal window from base HTML
 *
 * @param {HTMLElement} baseComponent the modal html in the DOM
 */
const setUpModal = (baseComponent) => {
  const modalID = baseComponent.getAttribute("id");

  if (!modalID) {
    throw new Error(`Modal markdown is missing ID`);
  }

  // Create placeholder where modal is for cleanup
  const originalLocationPlaceHolder = createPlaceHolder(baseComponent);
  baseComponent.after(originalLocationPlaceHolder);

  // Build modal component
  const modalComponent = rebuildModal(baseComponent);

  // Move all modals to the end of the DOM. Doing this allows us to
  // more easily find the elements to hide from screen readers
  // when the modal is open.
  document.body.appendChild(modalComponent);
};

const cleanUpModal = (baseComponent) => {
  const modalContent = baseComponent;
  const modalWrapper = modalContent.parentElement.parentElement;
  const modalID = modalWrapper.getAttribute("id");

  const originalLocationPlaceHolder = document.querySelector(
    `[data-placeholder-for="${modalID}"]`
  );
  if (originalLocationPlaceHolder) {
    for (
      let attributeIndex = 0;
      attributeIndex < originalLocationPlaceHolder.attributes.length;
      attributeIndex += 1
    ) {
      const attribute = originalLocationPlaceHolder.attributes[attributeIndex];
      if (attribute.name.startsWith("data-original-")) {
        // data-original- is 14 long
        modalContent.setAttribute(attribute.name.substr(14), attribute.value);
      }
    }

    originalLocationPlaceHolder.after(modalContent);
    originalLocationPlaceHolder.parentElement.removeChild(
      originalLocationPlaceHolder
    );
  }

  modalWrapper.parentElement.removeChild(modalWrapper);
};

modal = behavior(
  {},
  {
    init(root) {
      selectOrMatches(MODAL, root).forEach((modalWindow) => {
        const modalId = modalWindow.id;

        setUpModal(modalWindow);

        // Query all openers and closers including the overlay
        selectOrMatches(`[aria-controls="${modalId}"]`, document).forEach((modalTrigger) => {
          // If modalTrigger is an anchor...
          if (modalTrigger.nodeName === "A") {
            // Turn anchor links into buttons for screen readers
            modalTrigger.setAttribute("role", "button");

            // Prevent modal triggers from acting like links
            modalTrigger.addEventListener("click", (e) => e.preventDefault());
          }

          // Can uncomment when aria-haspopup="dialog" is supported
          // https://a11ysupport.io/tech/aria/aria-haspopup_attribute
          // Most screen readers support aria-haspopup, but might announce
          // as opening a menu if "dialog" is not supported.
          // modalTrigger.setAttribute("aria-haspopup", "dialog");

          modalTrigger.addEventListener("click", toggleModal);
        });
      });
    },
    teardown(root) {
      selectOrMatches(MODAL, root).forEach((modalWindow) => {
        const modalId = modalWindow.id;
        if (!modalId) {
          return;
        }
        cleanUpModal(modalWindow);

        selectOrMatches(`[aria-controls="${modalId}"]`, document)
          .forEach((modalTrigger) => modalTrigger.removeEventListener("click", toggleModal));
      });
    },
    focusTrap: null,
    toggleModal,
  }
);

module.exports = modal;
