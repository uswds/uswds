const sinon = require("sinon");

const EVENTS = {};

/**
 * send a click event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.click = (el) => {
  const evt = new MouseEvent("click", {
    view: el.ownerDocument.defaultView,
    bubbles: true,
    cancelable: true,
  });
  el.dispatchEvent(evt);
};

module.exports = EVENTS;
