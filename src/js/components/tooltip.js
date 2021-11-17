// Tooltips
const select = require("../utils/select");
const behavior = require("../utils/behavior");
const { prefix: PREFIX } = require("../config");
const isElementInViewport = require("../utils/is-in-viewport");

const TOOLTIP = `.${PREFIX}-tooltip`;
const TOOLTIP_TRIGGER_CLASS = `${PREFIX}-tooltip__trigger`;
const TOOLTIP_CLASS = `${PREFIX}-tooltip`;
const TOOLTIP_BODY_CLASS = `${PREFIX}-tooltip__body`;
const SET_CLASS = "is-set";
const VISIBLE_CLASS = "is-visible";
const TRIANGLE_SIZE = 5;
const ADJUST_WIDTH_CLASS = `${PREFIX}-tooltip__body--wrap`;

/**
 * Add one or more listeners to an element
 * @param {DOMElement} element - DOM element to add listeners to
 * @param {events} eventNames - space separated list of event names, e.g. 'click change'
 * @param {Function} listener - function to attach for each event as a listener
 */
const addListenerMulti = (element, eventNames, listener) => {
  const events = eventNames.split(" ");
  for (let i = 0, iLen = events.length; i < iLen; i += 1) {
    element.addEventListener(events[i], listener, false);
  }
};

/**
 * Shows the tooltip
 * @param {HTMLElement} tooltipTrigger - the element that initializes the tooltip
 */
const showToolTip = (tooltipBody, tooltipTrigger, position) => {
  tooltipBody.setAttribute("aria-hidden", "false");

  // This sets up the tooltip body. The opacity is 0, but
  // we can begin running the calculations below.
  tooltipBody.classList.add(SET_CLASS);

  /**
   * Position the tooltip body when the trigger is hovered
   * Removes old positioning classnames and reapplies. This allows
   * positioning to change in case the user resizes browser or DOM manipulation
   * causes tooltip to get clipped from viewport
   *
   * @param {string} setPos - can be "top", "bottom", "right", "left"
   */
  const setPositionClass = (setPos) => {
    tooltipBody.classList.remove(`${TOOLTIP_BODY_CLASS}--top`);
    tooltipBody.classList.remove(`${TOOLTIP_BODY_CLASS}--bottom`);
    tooltipBody.classList.remove(`${TOOLTIP_BODY_CLASS}--right`);
    tooltipBody.classList.remove(`${TOOLTIP_BODY_CLASS}--left`);
    tooltipBody.classList.add(`${TOOLTIP_BODY_CLASS}--${setPos}`);
  };

  /**
   * Removes old positioning styles. This allows
   * re-positioning to change without inheriting other
   * dynamic styles
   *
   * @param {HTMLElement} e - this is the tooltip body
   */
  const resetPositionStyles = (e) => {
    // we don't override anything in the stylesheet when finding alt positions
    e.style.top = null;
    e.style.bottom = null;
    e.style.right = null;
    e.style.left = null;
    e.style.margin = null;
  };

  /**
   * get margin offset calculations
   *
   * @param {HTMLElement} target - this is the tooltip body
   * @param {String} propertyValue - this is the tooltip body
   */

  const offsetMargin = (target, propertyValue) =>
    parseInt(
      window.getComputedStyle(target).getPropertyValue(propertyValue),
      10
    );

  // offsetLeft = the left position, and margin of the element, the left
  // padding, scrollbar and border of the offsetParent element
  // offsetWidth = The offsetWidth property returns the viewable width of an
  // element in pixels, including padding, border and scrollbar, but not
  // the margin.

  /**
   * Calculate margin offset
   * tooltip trigger margin(position) offset + tooltipBody offsetWidth
   * @param {String} marginPosition
   * @param {Number} tooltipBodyOffset
   * @param {HTMLElement} trigger
   */

  const calculateMarginOffset = (
    marginPosition,
    tooltipBodyOffset,
    trigger
  ) => {
    const offset =
      offsetMargin(trigger, `margin-${marginPosition}`) > 0
        ? tooltipBodyOffset - offsetMargin(trigger, `margin-${marginPosition}`)
        : tooltipBodyOffset;

    return offset;
  };

  /**
   * Positions tooltip at the top
   * @param {HTMLElement} e - this is the tooltip body
   */
  const positionTop = (e) => {
    resetPositionStyles(e); // ensures we start from the same point
    // get details on the elements object with

    const topMargin = calculateMarginOffset(
      "top",
      e.offsetHeight,
      tooltipTrigger
    );

    const leftMargin = calculateMarginOffset(
      "left",
      e.offsetWidth,
      tooltipTrigger
    );

    setPositionClass("top");
    e.style.left = `50%`; // center the element
    e.style.top = `-${TRIANGLE_SIZE}px`; // consider the pseudo element
    // apply our margins based on the offset
    e.style.margin = `-${topMargin}px 0 0 -${leftMargin / 2}px`;
  };

  /**
   * Positions tooltip at the bottom
   * @param {HTMLElement} e - this is the tooltip body
   */
  const positionBottom = (e) => {
    resetPositionStyles(e);

    const leftMargin = calculateMarginOffset(
      "left",
      e.offsetWidth,
      tooltipTrigger
    );

    setPositionClass("bottom");
    e.style.left = `50%`;
    e.style.margin = `${TRIANGLE_SIZE}px 0 0 -${leftMargin / 2}px`;
  };

  /**
   * Positions tooltip at the right
   * @param {HTMLElement} e - this is the tooltip body
   */
  const positionRight = (e) => {
    resetPositionStyles(e);

    const topMargin = calculateMarginOffset(
      "top",
      e.offsetHeight,
      tooltipTrigger
    );

    setPositionClass("right");
    e.style.top = `50%`;
    e.style.left = `${
      tooltipTrigger.offsetLeft + tooltipTrigger.offsetWidth + TRIANGLE_SIZE
    }px`;
    e.style.margin = `-${topMargin / 2}px 0 0 0`;
  };

  /**
   * Positions tooltip at the right
   * @param {HTMLElement} e - this is the tooltip body
   */
  const positionLeft = (e) => {
    resetPositionStyles(e);

    const topMargin = calculateMarginOffset(
      "top",
      e.offsetHeight,
      tooltipTrigger
    );

    // we have to check for some utility margins
    const leftMargin = calculateMarginOffset(
      "left",
      tooltipTrigger.offsetLeft > e.offsetWidth
        ? tooltipTrigger.offsetLeft - e.offsetWidth
        : e.offsetWidth,
      tooltipTrigger
    );

    setPositionClass("left");
    e.style.top = `50%`;
    e.style.left = `-${TRIANGLE_SIZE}px`;
    e.style.margin = `-${topMargin / 2}px 0 0 ${
      tooltipTrigger.offsetLeft > e.offsetWidth ? leftMargin : -leftMargin
    }px`; // adjust the margin
  };

  /**
   * We try to set the position based on the
   * original intention, but make adjustments
   * if the element is clipped out of the viewport
   * we constrain the width only as a last resort
   * @param {HTMLElement} element(alias tooltipBody)
   * @param {Number} attempt (--flag)
   */

  const maxAttempts = 2;

  function findBestPosition(element, attempt = 1) {
    // create array of optional positions
    const positions = [
      positionTop,
      positionBottom,
      positionRight,
      positionLeft,
    ];

    let hasVisiblePosition = false;

    // we take a recursive approach
    function tryPositions(i) {
      if (i < positions.length) {
        const pos = positions[i];
        pos(element);

        if (!isElementInViewport(element)) {
          // eslint-disable-next-line no-param-reassign
          tryPositions((i += 1));
        } else {
          hasVisiblePosition = true;
        }
      }
    }

    tryPositions(0);
    // if we can't find a position we compress it and try again
    if (!hasVisiblePosition) {
      element.classList.add(ADJUST_WIDTH_CLASS);
      if (attempt <= maxAttempts) {
        // eslint-disable-next-line no-param-reassign
        findBestPosition(element, (attempt += 1));
      }
    }
  }

  switch (position) {
    case "top":
      positionTop(tooltipBody);
      if (!isElementInViewport(tooltipBody)) {
        findBestPosition(tooltipBody);
      }
      break;
    case "bottom":
      positionBottom(tooltipBody);
      if (!isElementInViewport(tooltipBody)) {
        findBestPosition(tooltipBody);
      }
      break;
    case "right":
      positionRight(tooltipBody);
      if (!isElementInViewport(tooltipBody)) {
        findBestPosition(tooltipBody);
      }
      break;
    case "left":
      positionLeft(tooltipBody);
      if (!isElementInViewport(tooltipBody)) {
        findBestPosition(tooltipBody);
      }
      break;

    default:
      // skip default case
      break;
  }

  /**
   * Actually show the tooltip. The VISIBLE_CLASS
   * will change the opacity to 1
   */
  setTimeout(() => {
    tooltipBody.classList.add(VISIBLE_CLASS);
  }, 20);
};

/**
 * Removes all the properties to show and position the tooltip,
 * and resets the tooltip position to the original intention
 * in case the window is resized or the element is moved through
 * DOM manipulation.
 * @param {HTMLElement} tooltipBody - The body of the tooltip
 */
const hideToolTip = (tooltipBody) => {
  tooltipBody.classList.remove(VISIBLE_CLASS);
  tooltipBody.classList.remove(SET_CLASS);
  tooltipBody.classList.remove(ADJUST_WIDTH_CLASS);
  tooltipBody.setAttribute("aria-hidden", "true");
};

/**
 * Setup the tooltip component
 * @param {HTMLElement} tooltipTrigger The element that creates the tooltip
 */
const setUpAttributes = (tooltipTrigger) => {
  const tooltipID = `tooltip-${Math.floor(Math.random() * 900000) + 100000}`;
  const tooltipContent = tooltipTrigger.getAttribute("title");
  const wrapper = document.createElement("span");
  const tooltipBody = document.createElement("span");
  const position = tooltipTrigger.getAttribute("data-position")
    ? tooltipTrigger.getAttribute("data-position")
    : "top";
  const additionalClasses = tooltipTrigger.getAttribute("data-classes");

  // Set up tooltip attributes
  tooltipTrigger.setAttribute("aria-describedby", tooltipID);
  tooltipTrigger.setAttribute("tabindex", "0");
  tooltipTrigger.setAttribute("title", "");
  tooltipTrigger.classList.remove(TOOLTIP_CLASS);
  tooltipTrigger.classList.add(TOOLTIP_TRIGGER_CLASS);

  // insert wrapper before el in the DOM tree
  tooltipTrigger.parentNode.insertBefore(wrapper, tooltipTrigger);

  // set up the wrapper
  wrapper.appendChild(tooltipTrigger);
  wrapper.classList.add(TOOLTIP_CLASS);
  wrapper.appendChild(tooltipBody);

  // Apply additional class names to wrapper element
  if (additionalClasses) {
    const classesArray = additionalClasses.split(" ");
    classesArray.forEach((classname) => wrapper.classList.add(classname));
  }

  // set up the tooltip body
  tooltipBody.classList.add(TOOLTIP_BODY_CLASS);
  tooltipBody.setAttribute("id", tooltipID);
  tooltipBody.setAttribute("role", "tooltip");
  tooltipBody.setAttribute("aria-hidden", "true");

  // place the text in the tooltip
  tooltipBody.textContent = tooltipContent;

  return { tooltipBody, position, tooltipContent, wrapper };
};

// Setup our function to run on various events
const tooltip = behavior(
  {},
  {
    init(root) {
      select(TOOLTIP, root).forEach((tooltipTrigger) => {
        const { tooltipBody, position, tooltipContent, wrapper } =
          setUpAttributes(tooltipTrigger);

        if (tooltipContent) {
          // Listeners for showing and hiding the tooltip
          addListenerMulti(tooltipTrigger, "mouseenter focus", () => {
            showToolTip(tooltipBody, tooltipTrigger, position, wrapper);
            return false;
          });

          // Keydown here prevents tooltips from being read twice by
          // screen reader. Also allows escape key to close it
          // (along with any other.)
          addListenerMulti(tooltipTrigger, "mouseleave blur keydown", () => {
            hideToolTip(tooltipBody);
            return false;
          });
        } else {
          // throw error or let other tooltips on page function?
        }
      });
    },
  }
);

module.exports = tooltip;
