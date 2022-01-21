const behavior = require("../utils/behavior");
const select = require("../utils/select");
const { CLICK } = require("../events");
const { prefix: PREFIX } = require("../config");

const HIDDEN = "hidden";
const SCOPE = `.${PREFIX}-footer--big`;
const NAV = `${SCOPE} nav`;
const BUTTON = `${NAV} .${PREFIX}-footer__primary-link`;
const COLLAPSIBLE = `.${PREFIX}-footer__primary-content--collapsible`;

const HIDE_MAX_WIDTH = 480;

function showPanel() {
  if (window.innerWidth < HIDE_MAX_WIDTH) {
    const collapseEl = this.closest(COLLAPSIBLE);
    const isOpen = !collapseEl.classList.contains(HIDDEN);
    collapseEl.classList.toggle(HIDDEN, isOpen);
    collapseEl.querySelector('.usa-footer__primary-link')?.setAttribute('aria-expanded', !isOpen);

    // NB: this *should* always succeed because the button
    // selector is scoped to ".{prefix}-footer-big nav"
    const collapsibleEls = select(COLLAPSIBLE, collapseEl.closest(NAV));

    collapsibleEls.forEach((el) => {
      if (el !== collapseEl) {
        el.classList.add(HIDDEN);
      }
    });
  }
}
/**
 * Swaps the <h4> element for a <button> element (and vice-versa)
 *
 * @param {Boolean} isMobile - If the footer is in mobile configuration
 */
function toggleHtmlTag(isMobile) {
  const footer = document.querySelector('.usa-footer');
  const primaryLinks = footer?.querySelectorAll('.usa-footer__primary-link');
  const newElementType = isMobile ? 'button' : 'h4';

  primaryLinks?.forEach(currentElement => {
    const currentElementClasses = currentElement.getAttribute('class');
    const newElement = document.createElement(newElementType);

    // Create the new element
    newElement.setAttribute('class', currentElementClasses);
    newElement.setAttribute('aria-expanded', 'false');
    newElement.classList.add('usa-footer__primary-link--button');
    newElement.textContent = currentElement.textContent;

    // Insert the new element and delete the old
    currentElement.after(newElement);
    currentElement.remove();
  });
}

const toggleHidden = (isHidden) =>
  select(COLLAPSIBLE).forEach((list) =>
    list.classList.toggle(HIDDEN, isHidden)
  );

const resize = (event) => {
  toggleHtmlTag(window.innerWidth < HIDE_MAX_WIDTH);
  toggleHidden(event.matches);
}

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
      toggleHidden(window.innerWidth < HIDE_MAX_WIDTH);
      this.mediaQueryList = window.matchMedia(
        `(max-width: ${HIDE_MAX_WIDTH}px)`
      );
      this.mediaQueryList.addListener(resize);
    },

    teardown() {
      this.mediaQueryList.removeListener(resize);
    },
  }
);
