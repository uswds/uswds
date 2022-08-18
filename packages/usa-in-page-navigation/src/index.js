const once = require("receptor/once");
const keymap = require("receptor/keymap");
const behavior = require("../../uswds-core/src/js/utils/behavior");
const { prefix: PREFIX } = require("../../uswds-core/src/js/config");
const { CLICK } = require("../../uswds-core/src/js/events");

const IN_PAGE_NAV_CLASS = `${PREFIX}-in-page-nav`;
const IN_PAGE_NAV_LIST_CLASS = `${IN_PAGE_NAV_CLASS}-list`;
const IN_PAGE_NAV_ITEM_CLASS = `${IN_PAGE_NAV_CLASS}__item`;
const IN_PAGE_NAV_LINK_CLASS = `${IN_PAGE_NAV_CLASS}__link`;
const IN_PAGE_NAV_ANCHOR_CLASS = "usa-anchor-tag";

const IN_PAGE_NAV_LINK = `.${IN_PAGE_NAV_LINK_CLASS}`;
const IN_PAGE_NAV_ANCHOR = `.${IN_PAGE_NAV_ANCHOR_CLASS}`;
const IN_PAGE_NAV_TITLE = "On this page";
const IN_PAGE_NAV = `.${PREFIX}-in-page-nav`;
const CURRENT_CLASS = `${PREFIX}-current`;
const MAIN_ELEMENT = "main";
const SITE_SUBHEADING = "site-subheading";
const SUB_ITEM = "sub-item";

// Set Intersection Observer options
const IO_ROOT = null;
const IO_ROOT_MARGIN = "0px 0px -95% 0px";
const IO_THRESHOLD = [0];

/**
 * Set the active link state for the currently observed section
 *
 * @param {HTMLElement} el An element within the in-page nav component
 */
const setActive = (el) => {
  const allLinks = document.querySelectorAll(IN_PAGE_NAV_LINK);
  el.map((i) => {
    if (i.isIntersecting === true && i.intersectionRatio >= 1) {
      allLinks.forEach((link) => link.classList.remove(CURRENT_CLASS));
      document
        .querySelector(`a[href="#${i.target.id}"]`)
        .classList.add(CURRENT_CLASS);
      return true;
    }
    return false;
  });
};

/**
 * Return a node list of section headings
 *
 * @return {HTMLElement[]} - An array of DOM nodes
 */
const getSectionHeadings = () => {
  const sectionHeadings = document.querySelectorAll(
    `${MAIN_ELEMENT} h2, ${MAIN_ELEMENT} h3`
  );
  return sectionHeadings;
};

/**
 * Return a node list of section anchor tags
 *
 * @return {HTMLElement[]} - An array of DOM nodes
 */
const getSectionAnchors = () => {
  const sectionAnchors = document.querySelectorAll(IN_PAGE_NAV_ANCHOR);
  return sectionAnchors;
};

/**
 * Return a section id/anchor hash without the number sign
 *
 * @return {String} - Id value with the number sign removed
 */
const getSectionId = (value) => {
  let id;

  // Check if value is an event or element and get the cleaned up id
  if (value && typeof value === "object" && value.nodeType === 1) {
    id = value.getAttribute("href").replace("#", "");
  } else {
    id = value.target.hash.replace("#", "");
  }

  return id;
};

/**
 * Scroll smoothly to a section based on the passed in element
 *
 * @param {HTMLElement} - Id value with the number sign removed
 */
const handleScrollToSection = (el) => {
  window.scroll({
    behavior: "smooth",
    top: el.offsetTop,
    block: "start",
  });
};

const createInPageNav = () => {
  const sectionHeadings = getSectionHeadings();
  const insertNode = document.querySelector(IN_PAGE_NAV);

  const inPageNav = document.createElement("nav");
  inPageNav.setAttribute("role", "navigation");
  inPageNav.setAttribute("aria-label", IN_PAGE_NAV_TITLE );

  const inPageNavTitle = document.createElement("p");
  inPageNavTitle.classList.add(SITE_SUBHEADING);
  inPageNavTitle.textContent = IN_PAGE_NAV_TITLE;
  inPageNav.appendChild(inPageNavTitle);

  const inPageNavList = document.createElement("ul");
  inPageNavList.classList.add(IN_PAGE_NAV_LIST_CLASS);
  inPageNav.appendChild(inPageNavList);

  sectionHeadings.forEach((el, i) => {
    const listItem = document.createElement("li");
    const navLinks = document.createElement("a");
    const anchorTag = document.createElement("a");
    const textContentOfLink = el.textContent;
    const tag = el.tagName.toLowerCase();

    listItem.classList.add(IN_PAGE_NAV_ITEM_CLASS);
    if (tag === "h3") {
      listItem.classList.add(SUB_ITEM);
    }

    navLinks.setAttribute("href", `#section_${i}`);
    navLinks.setAttribute("class", IN_PAGE_NAV_LINK_CLASS);
    navLinks.textContent = textContentOfLink;

    anchorTag.setAttribute("id", `section_${i}`);
    anchorTag.setAttribute("class", IN_PAGE_NAV_ANCHOR_CLASS);
    el.insertAdjacentElement("afterbegin", anchorTag);

    inPageNavList.appendChild(listItem);
    listItem.appendChild(navLinks);
  });

  insertNode.appendChild(inPageNav);

  const options = {
    root: IO_ROOT,
    rootMargin: IO_ROOT_MARGIN,
    threshold: IO_THRESHOLD,
  };

  const anchorTags = getSectionAnchors();
  const observeSections = new IntersectionObserver(setActive, options);

  anchorTags.forEach((tag) => {
    observeSections.observe(tag);
  });
};

/**
 * Handle click from link
 *
 * @param {HTMLElement} el An element within the in-page nav component
 */
const handleClickFromLink = (el) => {
  const id = getSectionId(el);
  const allAnchors = getSectionAnchors();
  const allAnchorsArr = Array.from(allAnchors);
  const target = allAnchorsArr.find(
    (anchor) => anchor.getAttribute("id") === id
  );

  handleScrollToSection(target);
};

/**
 * Handle the enter event from a link within the in-page nav component
 *
 * @param {KeyboardEvent} event An event within the in-page nav component
 */
const handleEnterFromLink = (event) => {
  const id = getSectionId(event);
  const targetAnchor = document.getElementById(id);
  const target = targetAnchor.parentElement;

  if (target) {
    target.setAttribute("tabindex", 0);
    target.focus();
    target.addEventListener(
      "blur",
      once(() => {
        target.setAttribute("tabindex", -1);
      })
    );
  } else {
    // throw an error?
  }
  handleScrollToSection(target);
};

const inPageNavigation = behavior(
  {
    [CLICK]: {
      [IN_PAGE_NAV_LINK](event) {
        event.preventDefault();
        if (this.disabled) return;
        handleClickFromLink(this);
      },
    },
    keydown: {
      [IN_PAGE_NAV_LINK]: keymap({
        Enter: handleEnterFromLink,
      }),
    },
  },
  {
    init() {
      createInPageNav();
    },
  }
);

module.exports = inPageNavigation;
