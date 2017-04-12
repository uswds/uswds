'use strict';
const resolveIdRefs = require('resolve-id-refs');
const select = require('./select');
const toggleFieldMask = require('./toggle-field-mask');

const CONTROLS = 'aria-controls';
const PRESSED = 'aria-pressed';

const SHOW_ATTR = 'data-show-text';
const HIDE_ATTR = 'data-hide-text';

/**
 * Component that decorates an HTML element with the ability to toggle the
 * masked state of an input field (like a password) when clicked.
 * The ids of the fields to be masked will be pulled directly from the button's
 * `aria-controls` attribute.
 *
 * @param  {HTMLElement} el    Parent element containing the fields to be masked
 * @return {boolean}
 */
module.exports = el => {
  // this is the *target* state:
  // * if the element has the attr and it's !== "true", pressed is true
  // * otherwise, pressed is false
  const pressed = el.hasAttribute(PRESSED)
    && el.getAttribute(PRESSED) !== 'true';

  const fields = resolveIdRefs(el.getAttribute(CONTROLS));
  fields.forEach(field => toggleFieldMask(field, pressed));

  if (!el.hasAttribute(SHOW_ATTR)) {
    el.setAttribute(SHOW_ATTR, el.textContent);
  }

  el.textContent = el.getAttribute(pressed ? SHOW_ATTR : HIDE_ATTR);
  el.setAttribute(PRESSED, pressed);
  return pressed;
};
