// Tooltips
const select = require("../utils/select");
const behavior = require("../utils/behavior");
const { prefix: PREFIX } = require("../config");

const TOOLTIP = document.querySelectorAll('[data-toggle="tooltip"]');
const TRIGGER_CLASS = `${PREFIX}-tooltip-trigger`;
const WRAPPER_CLASS = 'usa-tooltip-wrapper';
const TOOLTIP_CLASS = 'usa-tooltip';
const TRANSITION_CLASS = 'transition';
const SHOW_CLASS = 'show';
const TRIANGLE_SIZE = 5;
const SPACER = 2;

/* Add one or more listeners to an element
** @param {DOMElement} element - DOM element to add listeners to
** @param {string} eventNames - space separated list of event names, e.g. 'click change'
** @param {Function} listener - function to attach for each event as a listener
*/
const addListenerMulti = (element, eventNames, listener) => {
  var events = eventNames.split(' ');
  for (var i=0, iLen=events.length; i<iLen; i++) {
    element.addEventListener(events[i], listener, false);
  }
}

const createToolTip = tooltip => {

  let tooltipID = "tooltip" + (Math.floor(Math.random()*90000) + 10000);
  let tooltipContent = tooltip.getAttribute("title");
  let wrapper = document.createElement('div');
  let tooltipBody = document.createElement('span');
  let position = tooltip.getAttribute("data-position") ? tooltip.getAttribute("data-position") : 'top';


  // Set attributes
  tooltip.setAttribute("aria-describedby", tooltipID);
  tooltip.setAttribute("tabindex", "0");
  tooltip.setAttribute("title", "");
  tooltip.classList.add(TRIGGER_CLASS);
  tooltip.classList.add(TOOLTIP_CLASS + '--' + position);

  // insert wrapper before el in the DOM tree
  tooltip.parentNode.insertBefore(wrapper, tooltip);

  // move el into wrapper
  wrapper.appendChild(tooltip);
  wrapper.classList.add(WRAPPER_CLASS);
  wrapper.appendChild(tooltipBody);

  // make accessible
  tooltipBody.classList.add(TOOLTIP_CLASS);
  tooltipBody.setAttribute("id", tooltipID);
  tooltipBody.setAttribute("role", "tooltip");
  tooltipBody.setAttribute("aria-hidden", "true");

  // Place the text in the tooltip
  tooltipBody.innerHTML = tooltipContent;

  const showToolTip = event => {
    tooltipBody.classList.add(SHOW_CLASS);

    // Adjust positioning in case there are margins.
    let tooltipWidth = tooltip.offsetWidth;
    let tooltipHeight = tooltip.offsetHeight;
    let offsetForRightMargin = parseInt(window.getComputedStyle(tooltip).getPropertyValue("margin-right"));
    let offsetForLeftMargin = parseInt(window.getComputedStyle(tooltip).getPropertyValue("margin-left"));
    let adjustHorizontalCenter = tooltipWidth / 2;
    let adjustToEdge = tooltipWidth + TRIANGLE_SIZE + SPACER;

    switch(position) {
      case "top":
        tooltipBody.setAttribute("style", "margin-left: " + adjustHorizontalCenter + "px");
        break;
      case "bottom":
        tooltipBody.setAttribute("style", "margin-left: " + adjustHorizontalCenter + "px");
        break;
      case "right":
        tooltipBody.setAttribute("style", "margin-left: " + (adjustToEdge + offsetForLeftMargin) + "px");
        break;
      case "left":
        tooltipBody.setAttribute("style", "margin-right: " + (adjustToEdge + offsetForRightMargin) + "px");
        break
    }

    // Actually show the tooltip
    setTimeout(function(){
      tooltipBody.classList.add(TRANSITION_CLASS);
    }, 20);
  };

  const hideToolTip = event => {
    tooltipBody.classList.remove(TRANSITION_CLASS);
    tooltipBody.classList.remove(SHOW_CLASS);
  };


  addListenerMulti(tooltip, 'mouseenter focus', function(){
    showToolTip(event);
    return false;
  });

  addListenerMulti(tooltip, 'mouseleave blur', function(){
    hideToolTip(event);
    return false;
  });

}


// Setup our function to run on various events
const tooltips = behavior(
  {
  },
  {
    init(root) {
      //createToolTip(TOOLTIP)

      TOOLTIP.forEach(tooltip =>
        createToolTip(tooltip)
      );
    },
    TOOLTIP
  }
);

module.exports = tooltips;
