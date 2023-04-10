const once = require("receptor/once");
const keymap = require("receptor/keymap");
const selectOrMatches = require("../../uswds-core/src/js/utils/select-or-matches");
const behavior = require("../../uswds-core/src/js/utils/behavior");
const { prefix: PREFIX } = require("../../uswds-core/src/js/config");
const { CLICK } = require("../../uswds-core/src/js/events");
const Sanitizer = require("../../uswds-core/src/js/utils/sanitizer");

const CURRENT_CLASS = `${PREFIX}-current`;
const IN_PAGE_NAV_TITLE_TEXT = "On this page";
const IN_PAGE_NAV_TITLE_HEADING_LEVEL = "h4";
const IN_PAGE_NAV_SCROLL_OFFSET = 0;
const IN_PAGE_NAV_ROOT_MARGIN = "0px 0px 0px 0px";
const IN_PAGE_NAV_THRESHOLD = "1";
const IN_PAGE_NAV_CLASS = `${PREFIX}-in-page-nav`;
const IN_PAGE_NAV_ANCHOR_CLASS = `${PREFIX}-anchor`;
const IN_PAGE_NAV_NAV_CLASS = `${IN_PAGE_NAV_CLASS}__nav`;
const IN_PAGE_NAV_LIST_CLASS = `${IN_PAGE_NAV_CLASS}__list`;
const IN_PAGE_NAV_ITEM_CLASS = `${IN_PAGE_NAV_CLASS}__item`;
const IN_PAGE_NAV_LINK_CLASS = `${IN_PAGE_NAV_CLASS}__link`;
const IN_PAGE_NAV_TITLE_CLASS = `${IN_PAGE_NAV_CLASS}__heading`;
const SUB_ITEM_CLASS = `${IN_PAGE_NAV_ITEM_CLASS}--sub-item`;
const MAIN_ELEMENT = "main";

/**
 * Set the active link state for the currently observed section
 *
 * @param {HTMLElement} el An element within the in-page nav component
 */
const setActive = (el) => {
  const allLinks = document.querySelectorAll(`.${IN_PAGE_NAV_LINK_CLASS}`);
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
  const sectionAnchors = document.querySelectorAll(
    `.${IN_PAGE_NAV_ANCHOR_CLASS}`
  );
  return sectionAnchors;
};

/**
 * Generates a unique ID for the given heading element.
 *
 * @param {HTMLHeadingElement} heading
 *
 * @return {string} - Unique ID
 */
const getHeadingId = (heading) => {
  const baseId = heading.textContent
    .toLowerCase()
    // Replace non-alphanumeric characters with dashes
    .replace(/[^a-z\d]/g, "-")
    // Replace a sequence of two or more dashes with a single dash
    .replace(/-{2,}/g, "-")
    // Trim leading or trailing dash (there should only ever be one)
    .replace(/^-|-$/g, "");

  let id;
  let suffix = 0;
  do {
    id = baseId;

    // To avoid conflicts with existing IDs on the page, loop and append an
    // incremented suffix until a unique ID is found.
    suffix += 1;
    if (suffix > 1) {
      id += `-${suffix}`;
    }
  } while (document.getElementById(id));

  return id;
};

/**
 * Return a section id/anchor hash without the number sign
 *
 * @return {String} - Id value with the number sign removed
 */
const getSectionId = (value) => {
  let id;

  // Check if value is an event or element and get the cleaned up id
  if (value && value.nodeType === 1) {
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
  const inPageNavEl = document.querySelector(`.${IN_PAGE_NAV_CLASS}`);
  const inPageNavScrollOffset =
    inPageNavEl.dataset.scrollOffset || IN_PAGE_NAV_SCROLL_OFFSET;

  window.scroll({
    behavior: "smooth",
    top: el.offsetTop - inPageNavScrollOffset,
    block: "start",
  });

  if (window.location.hash.slice(1) !== el.id) {
    window.history.pushState(null, "", `#${el.id}`);
  }
};

/**
 * Scrolls the page to the section corresponding to the current hash fragment, if one exists.
 */
const scrollToCurrentSection = () => {
  const hashFragment = window.location.hash.slice(1);
  if (hashFragment) {
    const anchorTag = document.getElementById(hashFragment);
    if (anchorTag) {
      handleScrollToSection(anchorTag);
    }
  }
};

/**
 * Create the in-page navigation component
 *
 * @param {HTMLElement} inPageNavEl The in-page nav element
 */
const createInPageNav = (inPageNavEl) => {
  const inPageNavTitleText = Sanitizer.escapeHTML`${
    inPageNavEl.dataset.titleText || IN_PAGE_NAV_TITLE_TEXT
  }`;
  const inPageNavTitleHeadingLevel = Sanitizer.escapeHTML`${
    inPageNavEl.dataset.titleHeadingLevel || IN_PAGE_NAV_TITLE_HEADING_LEVEL
  }`;
  const inPageNavRootMargin = Sanitizer.escapeHTML`${
    inPageNavEl.dataset.rootMargin || IN_PAGE_NAV_ROOT_MARGIN
  }`;
  const inPageNavThreshold = Sanitizer.escapeHTML`${
    inPageNavEl.dataset.threshold || IN_PAGE_NAV_THRESHOLD
  }`;

  const options = {
    root: null,
    rootMargin: inPageNavRootMargin,
    threshold: [inPageNavThreshold],
  };

  const sectionHeadings = getSectionHeadings();
  const inPageNav = document.createElement("nav");
  inPageNav.setAttribute("aria-label", inPageNavTitleText);
  inPageNav.classList.add(IN_PAGE_NAV_NAV_CLASS);

  const inPageNavTitle = document.createElement(inPageNavTitleHeadingLevel);
  inPageNavTitle.classList.add(IN_PAGE_NAV_TITLE_CLASS);
  inPageNavTitle.setAttribute("tabindex", "0");
  inPageNavTitle.textContent = inPageNavTitleText;
  inPageNav.appendChild(inPageNavTitle);

  const inPageNavList = document.createElement("ul");
  inPageNavList.classList.add(IN_PAGE_NAV_LIST_CLASS);
  inPageNav.appendChild(inPageNavList);

  sectionHeadings.forEach((el) => {
    const listItem = document.createElement("li");
    const navLinks = document.createElement("a");
    const anchorTag = document.createElement("a");
    const textContentOfLink = el.textContent;
    const tag = el.tagName.toLowerCase();

    listItem.classList.add(IN_PAGE_NAV_ITEM_CLASS);
    if (tag === "h3") {
      listItem.classList.add(SUB_ITEM_CLASS);
    }

    const headingId = getHeadingId(el);

    navLinks.setAttribute("href", `#${headingId}`);
    navLinks.setAttribute("class", IN_PAGE_NAV_LINK_CLASS);
    navLinks.textContent = textContentOfLink;

    anchorTag.setAttribute("id", headingId);
    anchorTag.setAttribute("class", IN_PAGE_NAV_ANCHOR_CLASS);
    el.insertAdjacentElement("afterbegin", anchorTag);

    inPageNavList.appendChild(listItem);
    listItem.appendChild(navLinks);
  });

  inPageNavEl.appendChild(inPageNav);

  const anchorTags = getSectionAnchors();
  const observeSections = new window.IntersectionObserver(setActive, options);

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
  const elementToScrollTo = document.querySelector(el.hash);
  handleScrollToSection(elementToScrollTo);
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
  handleScrollToSection(targetAnchor);
};

const inPageNavigation = behavior(
  {
    [CLICK]: {
      [`.${IN_PAGE_NAV_LINK_CLASS}`](event) {
        event.preventDefault();
        if (this.disabled) return;
        handleClickFromLink(this);
      },
    },
    keydown: {
      [`.${IN_PAGE_NAV_LINK_CLASS}`]: keymap({
        Enter: handleEnterFromLink,
      }),
    },
  },
  {
    init(root) {
      selectOrMatches(`.${IN_PAGE_NAV_CLASS}`, root).forEach((inPageNavEl) => {
        createInPageNav(inPageNavEl);
        scrollToCurrentSection();
      });
    },
  }
);

module.exports = inPageNavigation;
