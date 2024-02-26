const behavior = require("../../uswds-core/src/js/utils/behavior");
const { CLICK } = require("../../uswds-core/src/js/events");
const { prefix: PREFIX } = require("../../uswds-core/src/js/config");

const SCOPE = `.${PREFIX}-footer--big`;
const NAV = `${SCOPE} nav`;
const BUTTON = `${NAV} .${PREFIX}-footer__primary-link`;
const HIDE_MAX_WIDTH = 480;

/**
 * Expands selected footer menu panel, while collapsing others
 */
function showPanel() {
  if (window.innerWidth < HIDE_MAX_WIDTH) {
    const isOpen = this.getAttribute("aria-expanded") === "true";
    const thisFooter = this.closest(SCOPE);

    // Close all other menus
    thisFooter.querySelectorAll(BUTTON).forEach((button) => {
      button.setAttribute("aria-expanded", false);
    });

    this.setAttribute("aria-expanded", !isOpen);
  }
}

/**
 * Swaps the <h4> element for a <button> element (and vice-versa) and sets id
 * of menu list
 *
 * @param {Boolean} isMobile - If the footer is in mobile configuration
 */
function toggleHtmlTag(isMobile) {
  const bigFooter = document.querySelector(SCOPE);

  if (!bigFooter) {
    return;
  }

  const primaryLinks = bigFooter.querySelectorAll(BUTTON);

  primaryLinks.forEach((currentElement) => {
    const currentElementClasses = currentElement.getAttribute("class");
    const preservedHtmlTag =
      currentElement.getAttribute("data-tag") || currentElement.tagName;

    const newElementType = isMobile ? "button" : preservedHtmlTag;

    // Create the new element
    const newElement = document.createElement(newElementType);
    newElement.setAttribute("class", currentElementClasses);
    newElement.classList.toggle(
      `${PREFIX}-footer__primary-link--button`,
      isMobile,
    );
    newElement.textContent = currentElement.textContent;

    if (isMobile) {
      newElement.setAttribute("data-tag", currentElement.tagName);
      const menuId = `${PREFIX}-footer-menu-list-${Math.floor(
        Math.random() * 100000,
      )}`;

      newElement.setAttribute("aria-controls", menuId);
      newElement.setAttribute("aria-expanded", "false");
      currentElement.nextElementSibling.setAttribute("id", menuId);
      newElement.setAttribute("type", "button");
    }

    // Insert the new element and delete the old
    currentElement.after(newElement);
    currentElement.remove();
  });
}

const resize = (event) => {
  toggleHtmlTag(event.matches);
};

module.exports = behavior(
  {
    [CLICK]: {
      [BUTTON]: showPanel,
    },
  },
  {
    // export for use elsewhere
    HIDE_MAX_WIDTH,

    init() {
      toggleHtmlTag(window.innerWidth < HIDE_MAX_WIDTH);
      this.mediaQueryList = window.matchMedia(
        `(max-width: ${HIDE_MAX_WIDTH - 0.1}px)`,
      );
      this.mediaQueryList.addListener(resize);
    },

    teardown() {
      this.mediaQueryList.removeListener(resize);
    },
  },
);
