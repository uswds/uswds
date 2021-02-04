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
const SPACER = 2;
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
const showToolTip = (tooltipBody, tooltipTrigger, position, wrapper) => {
  tooltipBody.setAttribute("aria-hidden", "false");

  // This sets up the tooltip body. The opacity is 0, but
  // we can begin running the calculations below.
  tooltipBody.classList.add(SET_CLASS);

  // Calculate sizing and adjustments for positioning
  const tooltipWidth = tooltipTrigger.offsetWidth;
  const tooltipHeight = tooltipTrigger.offsetHeight;

  const offsetForTopMargin = parseInt(
    window.getComputedStyle(tooltipTrigger).getPropertyValue("margin-top"),
    10
  );
  const offsetForBottomMargin = parseInt(
    window.getComputedStyle(tooltipTrigger).getPropertyValue("margin-bottom"),
    10
  );
  const offsetForRightMargin = parseInt(
    window.getComputedStyle(tooltipTrigger).getPropertyValue("margin-right"),
    10
  );
  const offsetForLeftMargin = parseInt(
    window.getComputedStyle(tooltipTrigger).getPropertyValue("margin-left"),
    10
  );
  const offsetForTopPadding = parseInt(
    window.getComputedStyle(wrapper).getPropertyValue("padding-top"),
    10
  );
  const offsetForBottomPadding = parseInt(
    window.getComputedStyle(wrapper).getPropertyValue("padding-bottom"),
    10
  );
  const offsetForRightPadding = parseInt(
    window.getComputedStyle(wrapper).getPropertyValue("padding-right"),
    10
  );
  const offsetForLeftPadding = parseInt(
    window.getComputedStyle(wrapper).getPropertyValue("padding-left"),
    10
  );
  const offsetForTooltipBodyHeight = parseInt(
    window.getComputedStyle(tooltipBody).getPropertyValue("height"),
    10
  );
  const offsetForTooltipBodyWidth = parseInt(
    window.getComputedStyle(tooltipBody).getPropertyValue("width"),
    10
  );
  // const offsetTotalHeight = tooltipTrigger.offsetHeight + offsetForTopMargin + offsetForBottomMargin + offsetForTopPadding + offsetForBottomPadding + offsetForTooltipBodyHeight

  // const offsetTotalWidth = tooltipTrigger.offsetWidth + offsetForRightMargin + offsetForLeftMargin + offsetForRightPadding + offsetForLeftPadding + offsetForTooltipBodyHeight

  // console.log(
  //   tooltipTrigger.offsetHeight,
  //   offsetForTopMargin,
  //   offsetForBottomMargin,
  //   offsetForTopPadding,
  //   offsetForBottomPadding,
  //   offsetForTooltipBodyHeight,
  // )
  // const leftOffset = tooltipTrigger.offsetLeft;
  // const toolTipBodyWidth = tooltipBody.offsetWidth;
  const adjustHorizontalCenter = tooltipWidth / 2;
  const adjustVerticalCenter = tooltipWidth / 2;
  const adjustToEdgeX = tooltipWidth + TRIANGLE_SIZE;
  const adjustToEdgeY = tooltipHeight + TRIANGLE_SIZE;

  // console.log({offsetTotalHeight})
  // console.log({offsetTotalWidth})
  // console.log({tooltipTrigger})
  // console.log({offsetTotalHeight})
  // console.log({adjustToEdgeY})

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
   * Positions tooltip at the top
   * @param {HTMLElement} e - this is the tooltip body
   */
  const positionTop = (e) => {
    setPositionClass("top");
    e.style.bottom = `auto`;
    e.style.right = `auto`;
    e.style.left = `50%`;
    e.style.top = `-${TRIANGLE_SIZE}px`;
    e.style.margin = `-${tooltipBody.offsetHeight}px 0 0 -${tooltipBody.offsetWidth / 2}px`;
    // e.style.top = `-${tooltipBody.offsetHeight + TRIANGLE_SIZE}px`;
    // e.style.left = `${(tooltipTrigger.offsetWidth - tooltipBody.offsetHeight) / 2}px`;
    // e.style.marginLeft = `${adjustHorizontalCenter}px`;
    // e.style.marginBottom = `${tooltipTrigger.offsetHeight + TRIANGLE_SIZE}px`;
    // e.style.marginLeft = `${adjustHorizontalCenter}px`;
    // e.style.marginBottom = `${
    //   adjustToEdgeY + offsetForBottomMargin + offsetForBottomPadding
    // }px`;
    // return false
  };

  /**
   * Positions tooltip at the bottom
   * @param {HTMLElement} e - this is the tooltip body
   */
  const positionBottom = (e) => {
    setPositionClass("bottom");
    e.style.bottom = `auto`;
    e.style.right = `auto`;
    e.style.top = `auto`;
    e.style.left = `50%`;
    e.style.margin = `${TRIANGLE_SIZE}px 0 0 -${tooltipBody.offsetWidth / 2}px`;
    // e.style.bottom = `-${TRIANGLE_SIZE}px`;
    // e.style.bottom = `-${tooltipBody.offsetHeight + TRIANGLE_SIZE}px`;
    // e.style.left = `${(tooltipTrigger.offsetWidth - tooltipBody.offsetWidth) / 2}px`;
    // e.style.marginLeft = `${adjustHorizontalCenter}px`;
    // e.style.marginBottom = `${tooltipTrigger.offsetHeight + TRIANGLE_SIZE}px`;
    // e.style.marginTop = `${
    //   adjustToEdgeY + offsetForTopMargin + offsetForTopPadding
    // }px`;
    // return false
  };

// console.log(tooltipBody.offsetWidth)
// console.log(offsetForRightMargin)
// console.log(TRIANGLE_SIZE)

  /**
   * Positions tooltip at the right
   * @param {HTMLElement} e - this is the tooltip body
   */
  const positionRight = (e) => {
    setPositionClass("right");
    e.style.bottom = `auto`;
    e.style.left = `auto`;
    e.style.top = `50%`;
    e.style.right = `-${TRIANGLE_SIZE}px`;
    e.style.margin = `-${tooltipBody.offsetHeight / 2}px -${(tooltipBody.offsetWidth - offsetForRightMargin)}px 0 0`;
    // e.style.top = `${(tooltipTrigger.offsetHeight - tooltipBody.offsetHeight) / 2}px`;
    // e.style.left = `${tooltipTrigger.offsetWidth + TRIANGLE_SIZE}px`;
    // e.style.marginLeft = `${tooltipTrigger.offsetWidth + TRIANGLE_SIZE}px`;
    // e.style.marginBottom = `${adjustVerticalCenter / 2}px`;
    // e.style.marginBottom = "0";
    // e.style.marginLeft = `${adjustToEdgeX + leftOffset}px`;
    // e.style.bottom = `${
    //   (tooltipHeight - offsetForTooltipBodyHeight) / 2 +
    //   offsetForBottomMargin +
    //   offsetForBottomPadding
    // }px`;
    // return false;
  };

  /**
   * Positions tooltip at the right
   * @param {HTMLElement} e - this is the tooltip body
   */
  const positionLeft = (e) => {
    setPositionClass("left");
    e.style.bottom = `auto`;
    e.style.right = `auto`;
    e.style.top = `50%`;
    e.style.left = `-${TRIANGLE_SIZE}px`;
    e.style.margin = `-${tooltipBody.offsetHeight / 2}px 0 0 -${tooltipBody.offsetWidth}px`;
    // e.style.top = `${(tooltipTrigger.offsetHeight - tooltipBody.offsetHeight) / 2}px`;
    // e.style.left = `-${tooltipBody.offsetWidth + TRIANGLE_SIZE}px`
    // e.style.right = `${tooltipTrigger.offsetWidth + tooltipBody.offsetWidth + TRIANGLE_SIZE + offsetForRightMargin}px`;
    // e.style.marginRight = `${adjustToEdgeX}px`;
    // e.style.marginBottom = `${adjustVerticalCenter}px`;
    // e.style.marginBottom = "0";
    // if (leftOffset > toolTipBodyWidth) {
    //   e.style.marginLeft = `${
    //     leftOffset - toolTipBodyWidth - (TRIANGLE_SIZE + SPACER)
    //   }px`;
    // } else {
    //   e.style.marginLeft = `-${
    //     toolTipBodyWidth - leftOffset + (TRIANGLE_SIZE + SPACER)
    //   }px`;
    // }
    // e.style.bottom = `${
    //   (tooltipHeight - offsetForTooltipBodyHeight) / 2 +
    //   offsetForBottomMargin +
    //   offsetForBottomPadding
    // }px`;
    // return false
  };

  /**
   * We try to set the position based on the
   * original intention, but make adjustments
   * if the element is clipped out of the viewport
   * we constrain the width only as a last resort
   */

  function findBestPosition(t) {
    // create array of optional positions
    const positions = [
      positionRight,
      positionLeft,
      positionBottom,
      positionTop,
    ]
    // we will push validations here to check later
    const validate = []
    // iterate through each of the position options
    const bestPosition = positions.forEach(pos => {
      // try and position then check if it is visible
      const tryPosition = new Promise((resolve) => {
        pos(t)
        resolve(isElementInViewport(t))
      });
      // when the promise resolves
      tryPosition.then(value => {
        // push the return value of viewport visibility
        validate.push(value)
        // we return early if it is not visible
        if (!value) {
         return null
        }
        // otherwise we just return the visible position
        return pos(t)
      });
      return null
    })
    // if no positions are avalible we force an adjustment to the width
    // if (validate.every( v => v === false )) {
    //   tooltipBody.classList.add(ADJUST_WIDTH_CLASS)
    // }
    console.log(bestPosition)

    return bestPosition === "undefined" ? 'top' : bestPosition
  }

  switch (position) {
    case "top":
      positionTop(tooltipBody);
      if (!isElementInViewport(tooltipBody)) {
        console.log('I can not see all the conent!!')
        findBestPosition(tooltipBody)
        if (!isElementInViewport(tooltipBody)) {
          tooltipBody.classList.add(ADJUST_WIDTH_CLASS)
          findBestPosition(tooltipBody)
        }
      }
      break;
    case "bottom":
      positionBottom(tooltipBody);
      if (!isElementInViewport(tooltipBody)) {
        console.log('I can not see all the conent!!')
        findBestPosition(tooltipBody)
      }
      break;
    case "right":
      positionRight(tooltipBody);
      if (!isElementInViewport(tooltipBody)) {
        console.log('I can not see all the conent!!')
        findBestPosition(tooltipBody)
      }
      break;
    case "left":
      positionLeft(tooltipBody);
      if (!isElementInViewport(tooltipBody)) {
        console.log('I can not see all the conent!!')
        findBestPosition(tooltipBody)
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
  setTimeout(function makeVisible() {
    tooltipBody.classList.add(VISIBLE_CLASS);
  }, 20);
};

/**
 * Removes all the properties to show and position the tooltip,
 * and resets the tooltip position to the original intention
 * in case the window is resized or the element is moved through
 * DOM maniulation.
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
  tooltipBody.innerHTML = tooltipContent;

  return { tooltipBody, position, tooltipContent, wrapper };
};

// Setup our function to run on various events
const tooltip = behavior(
  {},
  {
    init(root) {
      select(TOOLTIP, root).forEach((tooltipTrigger) => {
        const {
          tooltipBody,
          position,
          tooltipContent,
          wrapper,
        } = setUpAttributes(tooltipTrigger);

        if (tooltipContent) {
          // Listeners for showing and hiding the tooltip
          addListenerMulti(
            tooltipTrigger,
            "mouseenter focus",
            function handleShow() {
              showToolTip(tooltipBody, tooltipTrigger, position, wrapper);
              return false;
            }
          );

          // Keydown here prevents tooltips from being read twice by screen reader. also allows excape key to close it (along with any other.)
          addListenerMulti(
            tooltipTrigger,
            "mouseleave blur keydown",
            function handleHide() {
              hideToolTip(tooltipBody);
              return false;
            }
          );
        } else {
          // throw error or let other tooltips on page function?
        }
      });
    },
  }
);

module.exports = tooltip;
