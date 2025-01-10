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
let INITIAL_BODY_PADDING;
let TEMPORARY_BODY_PADDING;

const isActive = () => document.body.classList.contains(ACTIVE_CLASS);
const SCROLLBAR_WIDTH = ScrollBarWidth();

/**
 *  Closes modal when bound to a button and pressed.
 */
const onMenuClose = () => {
  modal.toggleModalButton.call(modal, false);
};

/**
 * Set the value for temporary body padding that will be applied when the modal is open.
 * Value is created by checking for initial body padding and adding the width of the scrollbar.
 */
const setTemporaryBodyPadding = () => {
  INITIAL_BODY_PADDING = window
    .getComputedStyle(document.body)
    .getPropertyValue("padding-right");
  TEMPORARY_BODY_PADDING = `${
    parseInt(INITIAL_BODY_PADDING.replace(/px/, ""), 10) +
    parseInt(SCROLLBAR_WIDTH.replace(/px/, ""), 10)
  }px`;
};

/**
 *  Show modal window via javascript
 *
 * @param {string} modalEl the id or element of target modal
 */
function showModal(modalEl) {
  const targetModal =
    typeof modalEl === "string" ? document.getElementById(modalEl) : modalEl;
  const { body } = document;
  const openFocusEl = targetModal.querySelector(INITIAL_FOCUS)
    ? targetModal.querySelector(INITIAL_FOCUS)
    : targetModal.querySelector(`.${MODAL_CLASSNAME}`);
  const forceUserAction = targetModal.getAttribute(FORCE_ACTION_ATTRIBUTE);

  body.classList.add(ACTIVE_CLASS);
  targetModal.classList.add(VISIBLE_CLASS);
  targetModal.classList.remove(HIDDEN_CLASS);

  // Temporarily increase body padding to accommodate the scrollbar width
  body.style.paddingRight = TEMPORARY_BODY_PADDING;

  // Handle focus trap and interactions
  if (openFocusEl) {
    modal.focusTrap = FocusTrap(
      targetModal,
      forceUserAction ? {} : { Escape: onMenuClose },
    );
    modal.focusTrap.update(true);
    openFocusEl.focus();
  }

  // Hide non-modal elements from screen readers
  document.querySelectorAll(NON_MODALS).forEach((nonModal) => {
    nonModal.setAttribute("aria-hidden", "true");
    nonModal.setAttribute(NON_MODAL_HIDDEN_ATTRIBUTE, "");
  });
}

/**
 *  Hide modal window via javascript
 *
 * @param {string} modalEl the id or element of target modal
 */
function hideModal(modalEl) {
  const { body } = document;
  const targetModal =
    typeof modalEl === "string" ? document.getElementById(modalEl) : modalEl;
  const returnFocus = document.getElementById(
    targetModal.getAttribute("data-opener"),
  );

  // Remove active state from modal and body
  body.classList.remove(ACTIVE_CLASS);
  targetModal.classList.remove(VISIBLE_CLASS);
  targetModal.classList.add(HIDDEN_CLASS);

  // Reset body padding
  body.style.removeProperty("padding-right");

  // Show non-modal elements to screen readers again
  document.querySelectorAll(NON_MODALS_HIDDEN).forEach((nonModal) => {
    nonModal.removeAttribute("aria-hidden");
    nonModal.removeAttribute(NON_MODAL_HIDDEN_ATTRIBUTE);
  });

  // Return focus to the element that opened the modal
  if (returnFocus) {
    returnFocus.focus();
  }

  // Update focus trap status
  modal.focusTrap.update(false);
}

/**
 *  Toggle the visibility of a modal window via javascript
 *
 * @param {string} modalId the id of target modal
 * @returns {boolean} safeActive if mobile is open
 */
function toggleModal(modalId) {
  // Find the modal element by its id
  const targetModal = document.getElementById(modalId);

  // If there is no modal we return early
  if (!targetModal) {
    return false;
  }

  const safeActive = !targetModal.classList.contains(VISIBLE_CLASS);

  // If the modal is active, hide it, otherwise show it
  if (safeActive) {
    showModal(targetModal);
  } else {
    hideModal(targetModal);
  }

  return safeActive;
}

/**
 *  Toggle the visibility of a modal window via an event listener
 *
 * @param {KeyboardEvent} event the keydown event.
 * @returns {boolean} safeActive if mobile is open.
 */
function toggleModalButton(event) {
  let originalOpener;
  let clickedElement = event.target;
  const { body } = document;
  const safeActive = !isActive();
  const modalId = clickedElement
    ? clickedElement.getAttribute("aria-controls")
    : document.querySelector(`.${WRAPPER_CLASSNAME}.${VISIBLE_CLASS}`);
  const targetModal = safeActive
    ? document.getElementById(modalId)
    : document.querySelector(`.${WRAPPER_CLASSNAME}.${VISIBLE_CLASS}`);

  // if there is no modal we return early
  if (!targetModal) {
    return false;
  }

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

  // Toggle visibility
  if (safeActive) {
    showModal(targetModal);
  } else {
    hideModal(targetModal);
  }

  // If user is forced to take an action, adding
  // a class to the body that prevents clicking underneath
  // overlay
  if (forceUserAction) {
    body.classList.toggle(PREVENT_CLICK_CLASS, safeActive);
  }

  return safeActive;
}

/**
 * Creates a placeholder with data attributes for cleanup function.
 * The cleanup function uses this placeholder to easily restore the original Modal HTML on teardown.
 *
 * @param {HTMLDivElement} baseComponent - Modal HTML from the DOM.
 * @returns {HTMLDivElement} Placeholder used for cleanup function.
 */
const createPlaceHolder = (baseComponent) => {
  const modalID = baseComponent.getAttribute("id");
  const originalLocationPlaceHolder = document.createElement("div");
  const modalAttributes = Array.from(baseComponent.attributes);

  setTemporaryBodyPadding();

  originalLocationPlaceHolder.setAttribute(`data-placeholder-for`, modalID);
  originalLocationPlaceHolder.style.display = "none";
  originalLocationPlaceHolder.setAttribute("aria-hidden", "true");

  modalAttributes.forEach((attribute) => {
    originalLocationPlaceHolder.setAttribute(
      `data-original-${attribute.name}`,
      attribute.value,
    );
  });

  return originalLocationPlaceHolder;
};

/**
 * Moves necessary attributes from Modal HTML to wrapper element.
 *
 * @param {HTMLDivElement} baseComponent - Modal HTML in the DOM.
 * @param {HTMLDivElement} modalContentWrapper - Modal component wrapper element.
 * @returns Modal wrapper with correct attributes.
 */
const setModalAttributes = (baseComponent, modalContentWrapper) => {
  const modalID = baseComponent.getAttribute("id");
  const ariaLabelledBy = baseComponent.getAttribute("aria-labelledby");
  const ariaDescribedBy = baseComponent.getAttribute("aria-describedby");
  const forceUserAction = baseComponent.hasAttribute(FORCE_ACTION_ATTRIBUTE);

  if (!ariaLabelledBy)
    throw new Error(`${modalID} is missing aria-labelledby attribute`);

  if (!ariaDescribedBy)
    throw new Error(`${modalID} is missing aria-desribedby attribute`);

  // Set attributes
  modalContentWrapper.setAttribute("role", "dialog");
  modalContentWrapper.setAttribute("id", modalID);
  modalContentWrapper.setAttribute("aria-labelledby", ariaLabelledBy);
  modalContentWrapper.setAttribute("aria-describedby", ariaDescribedBy);

  if (forceUserAction) {
    modalContentWrapper.setAttribute(FORCE_ACTION_ATTRIBUTE, forceUserAction);
  }

  // Add aria-controls
  const modalClosers = modalContentWrapper.querySelectorAll(CLOSERS);
  modalClosers.forEach((el) => {
    el.setAttribute("aria-controls", modalID);
  });

  // Update the base element HTML
  baseComponent.removeAttribute("id");
  baseComponent.removeAttribute("aria-labelledby");
  baseComponent.removeAttribute("aria-describedby");
  baseComponent.setAttribute("tabindex", "-1");

  return modalContentWrapper;
};

/**
 * Creates a hidden modal content wrapper.
 * Rebuilds the original Modal HTML in the new wrapper and adds a page overlay.
 * Then moves original Modal HTML attributes to the new wrapper.
 *
 * @param {HTMLDivElement} baseComponent - Original Modal HTML in the DOM.
 * @returns Modal component - Modal wrapper w/ nested Overlay and Modal Content.
 */
const rebuildModal = (baseComponent) => {
  const modalContent = baseComponent;
  const modalContentWrapper = document.createElement("div");
  const overlayDiv = document.createElement("div");

  // Add classes
  modalContentWrapper.classList.add(HIDDEN_CLASS, WRAPPER_CLASSNAME);
  overlayDiv.classList.add(OVERLAY_CLASSNAME);

  // Rebuild the modal element
  modalContentWrapper.append(overlayDiv);
  overlayDiv.append(modalContent);

  // Add attributes
  setModalAttributes(modalContent, modalContentWrapper);

  return modalContentWrapper;
};

/**
 *  Builds modal window from base HTML and appends to the end of the DOM.
 *
 * @param {HTMLDivElement} baseComponent - The modal div element in the DOM.
 */
const setUpModal = (baseComponent) => {
  const modalID = baseComponent.getAttribute("id");

  if (!modalID) {
    throw new Error(`Modal markup is missing ID`);
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

/**
 * Removes dynamically created Modal and Wrapper elements and restores original Modal HTML.
 *
 * @param {HTMLDivElement} baseComponent - The modal div element in the DOM.
 */
const cleanUpModal = (baseComponent) => {
  const modalContent = baseComponent;
  const modalContentWrapper = modalContent.parentElement.parentElement;
  const modalID = modalContentWrapper.getAttribute("id");

  // if there is no modalID, return early
  if (!modalID) {
    return;
  }

  const originalLocationPlaceHolder = document.querySelector(
    `[data-placeholder-for="${modalID}"]`,
  );

  if (originalLocationPlaceHolder) {
    const modalAttributes = Array.from(originalLocationPlaceHolder.attributes);
    modalAttributes.forEach((attribute) => {
      if (attribute.name.startsWith("data-original-")) {
        // data-original- is 14 long
        modalContent.setAttribute(attribute.name.substr(14), attribute.value);
      }
    });

    originalLocationPlaceHolder.after(modalContent);
    originalLocationPlaceHolder.parentElement.removeChild(
      originalLocationPlaceHolder,
    );
  }

  modalContentWrapper.parentElement.removeChild(modalContentWrapper);
};

modal = behavior(
  {},
  {
    init(root) {
      selectOrMatches(MODAL, root).forEach((modalWindow) => {
        const modalId = modalWindow.id;

        setUpModal(modalWindow);

        // Query all openers and closers including the overlay
        selectOrMatches(`[aria-controls="${modalId}"]`, document).forEach(
          (modalTrigger) => {
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

            modalTrigger.addEventListener("click", toggleModalButton);
          },
        );
      });
    },
    teardown(root) {
      selectOrMatches(MODAL, root).forEach((modalWindow) => {
        const modalId = modalWindow.id;
        cleanUpModal(modalWindow);

        selectOrMatches(`[aria-controls="${modalId}"]`, document).forEach(
          (modalTrigger) =>
            modalTrigger.removeEventListener("click", toggleModalButton),
        );
      });
    },
    focusTrap: null,
    toggleModalButton,
    toggle: toggleModal,
    show: showModal,
    hide: hideModal,
  },
);

module.exports = modal;
