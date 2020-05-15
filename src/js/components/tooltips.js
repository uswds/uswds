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

  const TOOLTIP_ID = "tooltip" + (Math.floor(Math.random()*90000) + 10000);
  const TOOLTIP_TEXT = tooltip.getAttribute("title");
  const WRAPPER = document.createElement('div');
  const TOOLTIP_EL = document.createElement('span');
  const TOOLTIP_HEIGHT = tooltip.offsetHeight;
  const TOOLTIP_WIDTH = tooltip.offsetWidth;

  tooltip.setAttribute("aria-describedby", TOOLTIP_ID);
  //tooltip.setAttribute("tabindex", "0");
  tooltip.setAttribute("title", "");
  tooltip.classList.add(TRIGGER_CLASS);

  console.log(TOOLTIP_ID +': height: ' + TOOLTIP_HEIGHT + '; width:' + TOOLTIP_WIDTH);

  // insert wrapper before el in the DOM tree
  tooltip.parentNode.insertBefore(WRAPPER, tooltip);

  // move el into wrapper
  WRAPPER.appendChild(tooltip);
  WRAPPER.classList.add(WRAPPER_CLASS);

  WRAPPER.appendChild(TOOLTIP_EL);

  TOOLTIP_EL.classList.add(TOOLTIP_CLASS);
  TOOLTIP_EL.setAttribute("id", TOOLTIP_ID);
  TOOLTIP_EL.setAttribute("role", "tooltip");
  TOOLTIP_EL.setAttribute("aria-hidden", "true");
  TOOLTIP_EL.setAttribute("tabindex", "0");
  TOOLTIP_EL.innerHTML = TOOLTIP_TEXT;

  const showToolTip = event => {
    TOOLTIP_EL.classList.add(SHOW_CLASS);
    setTimeout(function(){
      TOOLTIP_EL.classList.add(TRANSITION_CLASS);
    }, 20);
  };

  const hideToolTip = event => {
    TOOLTIP_EL.classList.remove(TRANSITION_CLASS);
    TOOLTIP_EL.classList.remove(SHOW_CLASS);
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
